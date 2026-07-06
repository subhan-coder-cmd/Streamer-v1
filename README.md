# 🚀 StreamBot v2.0 - Premium Streaming Solution

StreamBot is a high-performance Discord self-bot designed to stream high-quality videos/movies directly to voice channels. It comes with a modern, glassmorphism-style Python dashboard for easy management.

---

## ✨ Features

- **High-Quality Streaming**: Support for 720p/1080p streaming with custom bitrate and FPS.
- **Modern Dashboard**: A beautiful Python Flask web interface with real-time stats and bot logs.
- **Multi-Source Support**: Stream from YouTube, Twitch, direct URLs, or local files (TikTok, Vimeo, Instagram, etc. via yt-dlp).
- **VPS-Ready YouTube**: Auto `cookies.txt`, Node.js runtime for yt-dlp, and clearer errors on hosting.
- **Video Queue**: Advanced queue management system (Play, Skip, Stop, Loop).
- **Auto-Update**: Built-in `yt-dlp` downloader and updater for zero-hassle maintenance.
- **Hardware Acceleration**: Support for GPU-based encoding to reduce CPU load.
- **Conditional Launch**: Toggle the dashboard on or off directly from your `.env` file.

---

## 📋 Requirements

### 🟢 Node.js (Bot Engine)
- **Node.js v20+** (Recommended: v24.x)
- **FFmpeg** installed on your system PATH.

### 🟡 Python (Web Dashboard)
- **Python 3.10+**
- **pip** (Python package manager)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone and Install Node Dependencies
```powershell
cd StreamBot-main
npm install
```

### 2️⃣ Install Python Dependencies
```powershell
pip install -r dashboard/requirements.txt
pip install psutil
```

### 3️⃣ Configure Environment
Rename or edit the `.env` file in the root directory:
```env
TOKEN = "YOUR_DISCORD_TOKEN"
GUILD_ID = "YOUR_SERVER_ID"
VIDEO_CHANNEL_ID = "YOUR_VOICE_CHANNEL_ID"
COMMAND_CHANNEL_ID = "YOUR_TEXT_CHANNEL_ID"

# Dashboard Toggle
DASHBOARD_ENABLED = "true"

# YouTube on VPS (required when hosting on Pterodactyl/VPS)
YTDLP_COOKIES_PATH = ""
YTDLP_JS_RUNTIMES = "node"
YTDLP_REMOTE_COMPONENTS = "ejs:github"
```

### 3️⃣b YouTube cookies (VPS / hosting)
When the bot runs on a VPS, YouTube often returns **"Sign in to confirm you're not a bot"**. Fix:

1. On your PC, log in to [YouTube](https://www.youtube.com) in Chrome or Firefox.
2. Use extension **Get cookies.txt LOCALLY** and export cookies for `youtube.com`.
3. Save as **`cookies.txt`** in the bot root (same folder as `package.json`), or upload to your server.
4. Restart the bot. On startup you should see: `yt-dlp cookies loaded: .../cookies.txt`

Copy `cookies.txt.example` for a template. **Never commit real `cookies.txt`** (it is in `.gitignore`).

### 4️⃣ Build the Project
Compile the TypeScript code to JavaScript:
```powershell
npm run build
```

---

## 🎮 Usage

To start both the bot and the dashboard together:
```powershell
npm start
```

### Available Scripts:
- `npm start`: Launches the bot (and dashboard if enabled).
- `npm run build`: Compiles TypeScript files to the `dist` folder.
- `npm run dev`: Runs the bot directly using Bun (for developers).
- `npm run dashboard`: Runs only the Python dashboard.

---

## ⌨️ Bot Commands (Discord)

| Command | Description |
| :--- | :--- |
| `$play <url/name>` | Plays a video from URL or local video name. |
| `$skip` | Skips the current video and plays the next one. |
| `$stop` | Stops the stream and clears the queue. |
| `$loop` | Toggles loop mode for the current video. |
| `$queue` | Shows the current video queue. |
| `$status` | Displays the bot's current streaming status. |
| `$help` | Shows a list of all available commands. |

---

## 🖥️ Web Dashboard

Access your dashboard at: **`http://localhost:5000`**

**Dashboard Features:**
- **Overview**: Real-time CPU/RAM usage and bot status.
- **Local Videos**: Upload, search, play, or delete local video files.
- **Quick Play**: Paste any URL to start streaming instantly.
- **Live Logs**: View bot console logs directly in the browser.

---

## 📂 Project Structure

- `src/`: Core Bot Engine (TypeScript)
- `dashboard/`: Web Interface (Python/Flask)
- `videos/`: Storage for your local movies/videos.
- `dist/`: Compiled code (don't edit manually).
- `launcher.js`: Smart entry point for the whole system.

---

## 🛡️ Credits & Disclaimer
Developed with ❤️ by **SUBHAN**.
*Note: This is a self-bot. Use it responsibly and according to Discord's Terms of Service.*
