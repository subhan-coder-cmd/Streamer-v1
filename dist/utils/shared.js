import config from "../config.js";
import logger from "./logger.js";
import fs from 'fs';
export const DiscordUtils = {
    async safeReply(message, content) {
        try {
            await message.reply(content);
        }
        catch {
            await message.channel.send(content);
        }
    },
    status_idle() {
        return {
            name: config.prefix + "help",
            type: 'WATCHING'
        };
    },
    status_watch(name) {
        return {
            name: `${name}`,
            type: 'WATCHING'
        };
    },
    async sendError(message, error) {
        if (!message) {
            logger.error(`API Action Error: ${error}`);
            return;
        }
        try {
            await message.react('❌');
        }
        catch { }
        await DiscordUtils.safeReply(message, `❌ **Error**: ${error}`);
    },
    async sendSuccess(message, description) {
        if (!message) {
            logger.info(`API Action Success: ${description}`);
            return;
        }
        await message.react('✅');
        await message.channel.send(`✅ **Success**: ${description}`);
    },
    async sendInfo(message, title, description) {
        if (!message) {
            logger.info(`API Info (${title}): ${description}`);
            return;
        }
        await message.react('ℹ️');
        await message.channel.send(`ℹ️ **${title}**: ${description}`);
    },
    async sendPlaying(message, title) {
        if (!message) {
            logger.info(`API Playing: ${title}`);
            return;
        }
        const content = `📽 **Now Playing**: \`${title}\``;
        try {
            await message.react('▶️');
        }
        catch { }
        await DiscordUtils.safeReply(message, content);
    },
    async sendFinishMessage(message) {
        if (!message) {
            logger.info(`API Finished playing`);
            return;
        }
        const content = '⏹️ **Finished**: Finished playing video.';
        await message.channel.send(content);
    },
    async sendList(message, items, type) {
        if (!message) {
            return;
        }
        try {
            await message.react('📋');
        }
        catch { }
        if (type == "ytsearch") {
            await DiscordUtils.safeReply(message, `📋 **Search Results**:\n${items.join('\n')}`);
        }
        else if (type == "refresh") {
            await DiscordUtils.safeReply(message, `📋 **Video list refreshed**:\n${items.join('\n')}`);
        }
        else {
            await message.channel.send(`📋 **Local Videos List**:\n${items.join('\n')}`);
        }
    }
};
export const ErrorUtils = {
    async handleError(error, context, message) {
        logger.error(`Error in ${context}:`, error);
        if (message) {
            await DiscordUtils.sendError(message, `An error occurred: ${error.message || 'Unknown error'}`);
        }
    },
    async withErrorHandling(operation, context, message) {
        try {
            return await operation();
        }
        catch (error) {
            await this.handleError(error, context, message);
            return null;
        }
    }
};
export const GeneralUtils = {
    isYouTubeUrl(input) {
        return input.includes('youtube.com/') || input.includes('youtu.be/');
    },
    isValidUrl(input) {
        if (!input || typeof input !== 'string') {
            return false;
        }
        return GeneralUtils.isYouTubeUrl(input) ||
            input.includes('twitch.tv/') ||
            input.startsWith('http://') ||
            input.startsWith('https://');
    },
    isYtDlpSupportedUrl(input) {
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
            return false;
        }
        const hosts = [
            'youtube.com', 'youtu.be', 'twitch.tv', 'vimeo.com', 'dailymotion.com',
            'facebook.com', 'fb.watch', 'instagram.com', 'tiktok.com', 'twitter.com',
            'x.com', 'reddit.com', 'streamable.com', 'soundcloud.com', 'bilibili.com',
            'nicovideo.jp', 'rumble.com', 'odysee.com', 'kick.com',
        ];
        try {
            const host = new URL(input).hostname.replace(/^www\./, '');
            return hosts.some(h => host === h || host.endsWith('.' + h));
        }
        catch {
            return false;
        }
    },
    isLocalFile(filePath) {
        try {
            return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
        }
        catch (error) {
            return false;
        }
    }
};
//# sourceMappingURL=shared.js.map