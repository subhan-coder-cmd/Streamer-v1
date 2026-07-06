import { BaseCommand } from "./base.js";
import { CommandContext } from "../types/index.js";

export default class LoopCommand extends BaseCommand {
	name = "loop";
	description = "Toggle looping for the current video";
	usage = "loop";

	async execute(context: CommandContext): Promise<void> {
		const loopState = context.streamingService.toggleLoop();
		await this.sendInfo(context.message, 'Looping', 
			`Looping is now **${loopState ? 'Enabled' : 'Disabled'}** for the current video.`);
	}
}
