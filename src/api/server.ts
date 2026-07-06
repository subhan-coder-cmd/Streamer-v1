import http from 'http';
import url from 'url';
import config from '../config.js';
import logger from '../utils/logger.js';
import { StreamingService } from '../services/streaming.js';
import { StreamStatus } from '../types/index.js';

export function startApiServer(streamingService: StreamingService, streamStatus: StreamStatus) {
    const server = http.createServer(async (req, res) => {
        // Only allow localhost connections
        if (req.socket.remoteAddress !== '127.0.0.1' && req.socket.remoteAddress !== '::1') {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        // Set CORS headers just in case
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const parsedUrl = url.parse(req.url || '', true);
        const path = parsedUrl.pathname;

        if (req.method === 'GET' && path === '/status') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                playing: streamStatus.playing,
                joined: streamStatus.joined,
                loop: streamStatus.loop,
                queue: streamingService.getQueueService().getQueue(),
                current: streamingService.getQueueService().getCurrent()
            }));
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const data = body ? JSON.parse(body) : {};

                    if (path === '/play') {
                        if (!data.url) {
                            res.writeHead(400);
                            res.end(JSON.stringify({ error: 'URL is required' }));
                            return;
                        }
                        
                        // Add to queue
                        const success = await streamingService.addToQueue(undefined, data.url, data.title);
                        if (success && !streamStatus.playing) {
                            await streamingService.playFromQueue(undefined);
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Added to queue' }));
                        return;
                    }

                    if (path === '/skip') {
                        await streamingService.skipCurrent(undefined);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Skipped' }));
                        return;
                    }

                    if (path === '/stop') {
                        await streamingService.stopAndClearQueue();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Stopped' }));
                        return;
                    }

                    if (path === '/loop') {
                        const loopState = streamingService.toggleLoop();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, loop: loopState }));
                        return;
                    }

                    res.writeHead(404);
                    res.end(JSON.stringify({ error: 'Not found' }));
                } catch (error) {
                    logger.error('API Error:', error);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                }
            });
            return;
        }

        res.writeHead(404);
        res.end();
    });

    server.listen(config.server_port, '127.0.0.1', () => {
        logger.info(`Local API Server is running on http://127.0.0.1:${config.server_port}`);
    });
}
