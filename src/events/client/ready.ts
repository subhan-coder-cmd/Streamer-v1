import { Client, ActivityOptions } from "discord.js-selfbot-v13";
import logger from "../../utils/logger.js";
import { DiscordUtils } from "../../utils/shared.js";

export async function handleReady(client: Client): Promise<void> {
	if (client.user) {
		const cyan = "\x1b[36m";
		const green = "\x1b[32m";
		const yellow = "\x1b[33m";
		const magenta = "\x1b[35m";
		const reset = "\x1b[0m";
		const bold = "\x1b[1m";

		console.log(cyan + bold + `
███████╗████████╗██████╗ ███████╗ █████╗ ███╗   ███╗██████╗  ██████╗ ████████╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔═══██╗╚══██╔══╝
███████╗   ██║   ██████╔╝█████╗  ███████║██╔████╔██║██████╔╝██║   ██║   ██║   
╚════██║   ██║   ██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║   ██║   
███████║   ██║   ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝   ██║   
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝    ╚═╝   
` + reset);

		console.log(magenta + bold + "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" + reset);
		console.log(yellow + bold + `  • Status:     ` + green + "Online & Ready" + reset);
		console.log(yellow + bold + `  • Bot:        ` + cyan + client.user.tag + reset);
		console.log(yellow + bold + `  • Developer:  ` + magenta + "SUBHAN" + reset);
		console.log(yellow + bold + `  • Dashboard:  ` + cyan + "http://localhost:5000" + reset);
		console.log(yellow + bold + `  • Discord:    ` + cyan + "https://discord.gg/saraikiplays" + reset);
		console.log(magenta + bold + "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" + reset);
		console.log("");

		logger.info(`Logged in as ${client.user.tag}`);
		client.user.setActivity(DiscordUtils.status_idle() as ActivityOptions);
	}
}