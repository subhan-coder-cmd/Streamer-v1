import { BaseCommand } from "./base.js";
export default class HelpCommand extends BaseCommand {
    commandManager;
    name = "help";
    description = "Show available commands";
    usage = "help";
    constructor(commandManager) {
        super(commandManager);
        this.commandManager = commandManager;
    }
    async execute(context) {
        const commandList = this.commandManager.getCommandList();
        const helpText = [
            '📽 **Available Commands**',
            '',
            commandList,
        ].join('\n');
        try {
            await context.message.react('📋');
        }
        catch { }
        const { DiscordUtils } = await import('../utils/shared.js');
        await DiscordUtils.safeReply(context.message, helpText);
    }
}
//# sourceMappingURL=help.js.map