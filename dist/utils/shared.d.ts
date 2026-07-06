import { Message, ActivityOptions } from "discord.js-selfbot-v13";
export declare const DiscordUtils: {
    safeReply(message: Message, content: string): Promise<void>;
    status_idle(): ActivityOptions;
    status_watch(name: string): ActivityOptions;
    sendError(message: Message | undefined, error: string): Promise<void>;
    sendSuccess(message: Message | undefined, description: string): Promise<void>;
    sendInfo(message: Message | undefined, title: string, description: string): Promise<void>;
    sendPlaying(message: Message | undefined, title: string): Promise<void>;
    sendFinishMessage(message: Message | undefined): Promise<void>;
    sendList(message: Message | undefined, items: string[], type?: string): Promise<void>;
};
export declare const ErrorUtils: {
    handleError(error: any, context: string, message?: Message): Promise<void>;
    withErrorHandling<T>(operation: () => Promise<T>, context: string, message?: Message): Promise<T | null>;
};
export declare const GeneralUtils: {
    isYouTubeUrl(input: string): boolean;
    isValidUrl(input: string): boolean;
    isYtDlpSupportedUrl(input: string): boolean;
    isLocalFile(filePath: string): boolean;
};
