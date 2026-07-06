import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const dashboardEnabled = process.env.DASHBOARD_ENABLED === 'true';

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting StreamBot Engine...');

// Start the Node.js Bot
const bot = spawn('node', ['dist/index.js'], { 
    stdio: 'inherit', 
    shell: true,
    env: { ...process.env, FORCE_COLOR: 'true' }
});

bot.on('error', (err) => {
    console.error('\x1b[31m%s\x1b[0m', `Failed to start bot: ${err.message}`);
});

// Start the Python Dashboard if enabled
if (dashboardEnabled) {
    console.log('\x1b[35m%s\x1b[0m', '🖥️ Starting Dashboard...');
    
    // Use 'python3' on Linux/Railway and 'python' on Windows
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    const dashboard = spawn(pythonCmd, ['dashboard/app.py'], { 
        stdio: 'inherit', 
        shell: true 
    });

    dashboard.on('error', (err) => {
        console.error('\x1b[31m%s\x1b[0m', `Failed to start dashboard: ${err.message}`);
        console.log('\x1b[33m%s\x1b[0m', 'Make sure Python is installed and dashboard/app.py exists.');
    });
} else {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ️ Dashboard is disabled in .env (DASHBOARD_ENABLED=false)');
}
