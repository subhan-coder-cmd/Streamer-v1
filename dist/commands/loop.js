import { BaseCommand } from "./base.js";
export default class LoopCommand extends BaseCommand {
    name = "loop";
    description = "Toggle looping for the current video";
    usage = "loop";
    async execute(context) {
        const loopState = context.streamingService.toggleLoop();
        await this.sendInfo(context.message, 'Looping', `Looping is now **${loopState ? 'Enabled' : 'Disabled'}** for the current video.`);
    }
}
//# sourceMappingURL=loop.js.map