import { Message, ActivityOptions } from "discord.js-selfbot-v13";
import config from "../config.js";
import logger from "./logger.js";
import fs from 'fs';

/**
 * Shared utility functions for Discord bot operations
 */
export const DiscordUtils = {
	/**
	 * Reply when possible; fall back to channel.send (VPS/selfbot may lack message history).
	 */
	async safeReply(message: Message, content: string): Promise<void> {
		try {
			await message.reply(content);
		} catch {
			try {
				await message.channel.send(content);
			} catch (err) {
				logger.error(`Failed to send message to Discord: ${err}`);
			}
		}
	},

	/**
	 * Create idle status for Discord bot
	 */
	status_idle(): ActivityOptions {
		return {
			name: config.prefix + "help",
			type: 'WATCHING'
		};
	},

	/**
	 * Create watching status for Discord bot
	 */
	status_watch(name: string): ActivityOptions {
		return {
			name: `${name}`,
			type: 'WATCHING'
		};
	},

	/**
	 * Send error message with reaction
	 */
	async sendError(message: Message | undefined, error: string): Promise<void> {
		if (!message) { logger.error(`API Action Error: ${error}`); return; }
		try { await message.react('❌'); } catch { /* ignore */ }
		await DiscordUtils.safeReply(message, `❌ **Error**: ${error}`);
	},

	/**
	 * Send success message with reaction
	 */
	async sendSuccess(message: Message | undefined, description: string): Promise<void> {
		if (!message) { logger.info(`API Action Success: ${description}`); return; }
		try { await message.react('✅'); } catch { /* ignore */ }
		await DiscordUtils.safeReply(message, `✅ **Success**: ${description}`);
	},

	/**
	 * Send info message with reaction
	 */
	async sendInfo(message: Message | undefined, title: string, description: string): Promise<void> {
		if (!message) { logger.info(`API Info (${title}): ${description}`); return; }
		try { await message.react('ℹ️'); } catch { /* ignore */ }
		await DiscordUtils.safeReply(message, `ℹ️ **${title}**: ${description}`);
	},

	/**
	 * Send playing message with reaction
	 */
	async sendPlaying(message: Message | undefined, title: string): Promise<void> {
		if (!message) { logger.info(`API Playing: ${title}`); return; }
		const content = `📽 **Now Playing**: \`${title}\``;
		try { await message.react('▶️'); } catch { /* ignore */ }
		await DiscordUtils.safeReply(message, content);
	},

	/**
	 * Send finish message
	 */
	async sendFinishMessage(message: Message | undefined): Promise<void> {
		if (!message) { logger.info(`API Finished playing`); return; }
		const content = '⏹️ **Finished**: Finished playing video.';
		await DiscordUtils.safeReply(message, content);
	},

	/**
	 * Send list message with reaction
	 */
	async sendList(message: Message | undefined, items: string[], type?: string): Promise<void> {
		if (!message) { return; }
		try { await message.react('📋'); } catch { /* ignore */ }
		if (type == "ytsearch") {
			await DiscordUtils.safeReply(message, `📋 **Search Results**:\n${items.join('\n')}`);
		} else if (type == "refresh") {
			await DiscordUtils.safeReply(message, `📋 **Video list refreshed**:\n${items.join('\n')}`);
		} else {
			await DiscordUtils.safeReply(message, `📋 **Local Videos List**:\n${items.join('\n')}`);
		}
	}
};

/**
 * Error handling utilities
 */
export const ErrorUtils = {
	/**
	 * Handle and log errors consistently
	 */
	async handleError(error: any, context: string, message?: Message): Promise<void> {
		logger.error(`Error in ${context}:`, error);

		if (message) {
			await DiscordUtils.sendError(message, `An error occurred: ${error.message || 'Unknown error'}`);
		}
	},

	/**
	 * Handle async operation errors
	 */
	async withErrorHandling<T>(
		operation: () => Promise<T>,
		context: string,
		message?: Message
	): Promise<T | null> {
		try {
			return await operation();
		} catch (error) {
			await this.handleError(error, context, message);
			return null;
		}
	}
};

/**
 * General utility functions
 */
export const GeneralUtils = {
	/**
	 * Check if input is a valid streaming URL
	 */
	isYouTubeUrl(input: string): boolean {
		return input.includes('youtube.com/') || input.includes('youtu.be/');
	},

	isValidUrl(input: string): boolean {
		if (!input || typeof input !== 'string') {
			return false;
		}

		// Check for common streaming platforms
		return GeneralUtils.isYouTubeUrl(input) ||
			   input.includes('twitch.tv/') ||
			   input.startsWith('http://') ||
			   input.startsWith('https://');
	},

	/** URLs yt-dlp can usually extract (social, video hosts, etc.). */
	isYtDlpSupportedUrl(input: string): boolean {
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
		} catch {
			return false;
		}
	},

	/**
	 * Check if a path is a local file
	 */
	isLocalFile(filePath: string): boolean {
		try {
			return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
		} catch (error) {
			return false;
		}
	}
};