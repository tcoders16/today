#!/usr/bin/env node
import { execSync } from "child_process";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Command } from 'commander';
import { handleNaturalCommand } from '../src/index.js';
import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';
import dayjs from 'dayjs';
import readline from 'readline';
// Path to temp file to track if the user has booted the CLI once
const bootFile = path.join(os.tmpdir(), ".om_gitcli_booted");
/**
 * Optional image preview using `catimg` for supported terminals
 */
export function showImage(width = 60, height = 30, grayscale = false) {
    const imagePath = path.resolve(process.cwd(), "assets/kl.png");
    try {
        // Construct catimg command dynamically
        let cmd = `catimg -w ${width} "${imagePath}"`;
        if (grayscale)
            cmd += " -g";
        execSync(cmd, { stdio: "inherit" });
    }
    catch (err) {
        console.error("⚠️ Image preview failed. Ensure 'catimg' is installed.");
    }
}
/**
 * Render main ASCII banner and author information
 */
function showBanner() {
    const asciiArt = figlet.textSync("Om's GitHub AiAgent", {
        horizontalLayout: 'fitted',
        verticalLayout: 'default',
    });
    const gradientTitle = chalk.blueBright(asciiArt);
    const boxedTitle = boxen(gradientTitle, {
        padding: 1,
        margin: 1,
        borderColor: 'magenta',
        borderStyle: 'round',
    });
    console.clear();
    console.log(boxedTitle);
    const subtitle = chalk.bold.cyan('Automate GitHub actions with natural language and AI');
    const tip = chalk.gray('Tip: Try something like: ') + chalk.greenBright('"create a private repo named my-project"');
    console.log(subtitle);
    console.log(tip);
    const authorInfo = `
Author:       ${chalk.bold.cyan("Omkumar Solanki")}
Roles:        Software Developer | AI Agent | MERN Stack | iOS Developer (Storyboard/Swift) | Web3
GitHub:       ${chalk.underline.cyan("https://github.com/tcoders16")}
LinkedIn:     ${chalk.underline.cyan("https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/")}
`.trim();
    console.log(boxen(authorInfo, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: 'black',
    }));
    //   const usageInfo = `
    // How It Works:
    // • You type natural commands like "create a private repo named xyz"
    // • OpenAI GPT-4o converts it to a JSON instruction
    // • The CLI then performs that GitHub action
    // Supported Commands:
    // • createRepo    → Creates a GitHub repository
    // • deleteRepo    → Deletes an existing repo you own
    // Example:
    // Om-Gitcli "create a private repo named test-bot"
    // `.trim();
    //   console.log(
    //     boxen(usageInfo, {
    //       padding: 1,
    //       margin: 1,
    //       borderStyle: 'round',
    //       borderColor: 'green',
    //       backgroundColor: 'black',
    //     })
    //   );
    console.log();
}
/**
 * Returns a formatted welcome message with current time/greeting
 */
function getIntroMessage() {
    const now = dayjs();
    const hour = now.hour();
    const greeting = hour < 12 ? "☀️ Good morning" :
        hour < 18 ? "🌤️ Good afternoon" : "🌙 Good evening";
    const header = [
        chalk.bgMagentaBright.white.bold(`  ${greeting}, Developer!  `),
        chalk.cyan(`🗓️  ${now.format("dddd, MMMM D")}    ⏰  ${now.format("hh:mm A")}`),
    ].join('\n');
    const welcome = `${chalk.magenta.bold("Welcome to Om's GitHub AiAgent")}\n${chalk.gray("A CLI tool that lets you manage GitHub using plain English commands powered by OpenAI.")}`;
    const howToUse = [
        chalk.greenBright("🚀 How to Start:"),
        `  1. Run: ${chalk.bold.yellow('Om-Gitcli')}`,
        `  2. Then run commands like: ${chalk.bold.green('Om-Gitcli "create a private repo named my-project"')}`,
        `  3. The AI will convert your message → JSON → GitHub API request.`
    ].join('\n');
    const capabilities = [
        chalk.cyanBright("💡 Capabilities:"),
        `  • Create, list, and push to repositories`,
        `  • Create new branches`,
        `  • Make and analyze pull requests`,
        `  • Read source code and summarize its logic`,
        `  • Explore Git history (last 3 commits)`,
        `  • List all files/folders in a repo or branch`,
        `  • Answer GitHub/DevOps/Coding questions like: ${chalk.italic('"how to create a pull request?"')}`
    ].join('\n');
    const simpleExamples = [
        chalk.yellowBright("🔧 Simple Prompts:"),
        `  Om-Gitcli ${chalk.green('"create a private repo named my-ai-cli"')}`,
        `  Om-Gitcli ${chalk.green('"list all repos for user tcoders16"')}`,
        `  Om-Gitcli ${chalk.green('"push code to dev with message login fix"')}`
    ].join('\n');
    const advancedExamples = [
        chalk.yellowBright("📊 Advanced Prompts:"),
        `  Om-Gitcli ${chalk.green('"read code from src/index.ts in repo today on branch 28-May"')}`,
        `  Om-Gitcli ${chalk.green('"analyze function fetchData in services/api.ts on branch main"')}`,
        `  Om-Gitcli ${chalk.green('"look over recent pull request in repo backend-service"')}`
    ].join('\n');
    const comingSoon = [
        chalk.magentaBright("🧠 Coming Soon:"),
        `  • Voice-to-command GitHub workflows`,
        `  • Deployment triggers via prompt`,
        `  • PR reviews with inline comments`,
        `  • CI/CD summary reports (Jenkins, GitHub Actions)`,
        `  • Contributor analytics and code health scan`
    ].join('\n');
    const author = `${chalk.bold("Developer:")} ${chalk.greenBright("Omkumar Solanki")}
${chalk.bold("Roles:")} AI Engineer | MERN Stack Dev | iOS Developer | Web3 Strategist
GitHub:   ${chalk.underline.cyan("https://github.com/tcoders16")}
LinkedIn: ${chalk.underline.cyan("https://linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/")}
`;
    const footer = `${chalk.gray("💻 Built with Node.js, TypeScript, OpenAI, GitHub REST API")}\n\n${chalk.yellowBright.bold("🚀 Full launch coming soon! Follow for updates.")}`;
    return boxen([
        header,
        "",
        welcome,
        "",
        howToUse,
        "",
        capabilities,
        "",
        simpleExamples,
        "",
        advancedExamples,
        "",
        comingSoon,
        "",
        author,
        "",
        footer
    ].join('\n'), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
        backgroundColor: "black"
    });
}
// === CLI ENTRYPOINT === //
const args = process.argv.slice(2);
// Show intro if first run
if (args.length === 0) {
    showImage();
    showBanner();
    console.log(getIntroMessage());
    fs.writeFileSync(bootFile, "booted");
    process.exit(0);
}
// Prevent command execution if intro hasn't run
if (!fs.existsSync(bootFile)) {
    console.log(boxen(chalk.redBright("CLI not initialized. Run `Om-Gitcli` first."), { padding: 1, borderColor: "red", borderStyle: "round" }));
    process.exit(1);
}
// Initialize CLI command parser
const program = new Command();
program
    .name('Om-Gitcli')
    .description('An AI-powered GitHub CLI by Omkumar')
    .version('1.0.0')
    .argument('<input>', 'Natural language GitHub command')
    .action(async (input) => {
    console.clear();
    showImage();
    showBanner();
    console.log(getIntroMessage());
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(chalk.yellow('\nDo you want to execute this command? (y/n): '), async (answer) => {
        rl.close();
        if (answer.toLowerCase() !== 'y') {
            console.log(chalk.red('Command aborted.'));
            return;
        }
        console.log(chalk.yellow("\nCLI received command:"), chalk.whiteBright(input));
        try {
            await handleNaturalCommand(input);
        }
        catch (error) {
            console.error(chalk.redBright('Error:'), error.message);
        }
    });
});
program.parse();
