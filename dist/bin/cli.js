#!/usr/bin/env node
import { Command } from 'commander';
import { handleNaturalCommand } from '../src/index.js';
import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';
import dayjs from 'dayjs';
import { execSync } from "child_process";
function showImage() {
    try {
        execSync(`catimg ../assets/kl.png`, { stdio: 'inherit' }); // Put your image here
    }
    catch (err) {
        console.error("Could not load image preview (fallback ASCII).");
    }
}
showImage();
function showBanner() {
    const asciiArt = figlet.textSync("Om's GitHub AiAgent", {
        horizontalLayout: 'fitted', // changed from 'full' to 'fitted' for better wrapping
        verticalLayout: 'default',
    });
    // ...existing code...
    const gradientTitle = chalk.blueBright(asciiArt);
    // ...existing code...
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
Author:       ${chalk.bold.green("Omkumar Solanki")}
Roles:        Software Developer | AI Agent | MERN Stack | iOS | Web3
GitHub:       ${chalk.underline.blue("https://github.com/tcoders16")}
LinkedIn:     ${chalk.underline.blue("https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/")}
`.trim();
    console.log(boxen(authorInfo, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: 'black',
    }));
    const usageInfo = `
How It Works:
• You type natural commands like "create a private repo named xyz"
• OpenAI GPT-4o converts it to a JSON instruction
• The CLI then performs that GitHub action

Supported Commands:
• createRepo    → Creates a GitHub repository
• deleteRepo    → Deletes an existing repo you own

Example:
Om-Gitcli "create a private repo named test-bot"
`.trim();
    console.log(boxen(usageInfo, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        backgroundColor: 'black',
    }));
    console.log(); // Spacer
}
const program = new Command();
showBanner();
program
    .name('Om-Gitcli')
    .description('An AI-powered GitHub CLI by Omkumar')
    .version('1.0.0')
    .argument('<input>', 'Natural language GitHub command')
    .action(async (input) => {
    console.log(chalk.yellow("\n🛠 CLI received command:"), chalk.whiteBright(input));
    try {
        await handleNaturalCommand(input);
    }
    catch (error) {
        console.error(chalk.redBright('Error:'), error.message);
    }
});
program.parse();
function getIntroMessage() {
    const now = dayjs();
    const hour = now.hour();
    const greeting = hour < 12 ? "Good morning" :
        hour < 18 ? "Good afternoon" : "Good evening";
    const header = `${chalk.bgBlueBright.black.bold(`  ${greeting}, Developer!  `)}\n${chalk.gray(`It's ${now.format("dddd, MMMM D")} • ${now.format("hh:mm A")}`)}`;
    const welcome = `${chalk.magenta.bold("🎉 Welcome to Om's GitHub AiAgent")}\n${chalk.gray("Your natural language-powered GitHub workflow engine.")}`;
    const why = [
        `${chalk.cyan("❓ Why use this agent?")}`,
        `  ${chalk.yellow("→")} Ever wondered ${chalk.italic('"Did I push that hotfix function?"')}`,
        `  ${chalk.yellow("→")} Need to know ${chalk.italic("when the last update was made?")}`,
        `  ${chalk.yellow("→")} Want to manage GitHub like a boss using just natural language?`
    ].join('\n');
    const bridge = [
        chalk.greenBright("🚀 How it works:"),
        `  • You say:  ${chalk.greenBright('"create a private repo named startup-ai"')}`,
        `  • It sends to OpenAI GPT-4o`,
        `  • Parses → ${chalk.yellow('{ action: "createRepo", name: "startup-ai", private: true }')}`,
        `  • Then executes the GitHub API securely`
    ].join('\n');
    const example = [
        chalk.cyan("📈 Example:"),
        `  ${chalk.cyan('Om-Gitcli "delete repo named ai-bot from user omkumarsolanki"')}`
    ].join('\n');
    const soon = [
        chalk.magentaBright("🧠 Soon you'll:"),
        `  • Track PRs by prompt`,
        `  • Review code by voice`,
        `  • Trigger deploys like: ${chalk.green('"deploy production frontend"')}`,
        `  • Know when your AI workflows were last triggered`
    ].join('\n');
    const footer = `${chalk.yellowBright.bold("💡 Full app launching soon...")}\n\n${chalk.green.bold("Keep building,")}\n${chalk.green.bold("Omkumar Solanki")} – AI Engineer | MERN & iOS Dev | Web3 Strategist`;
    const message = [
        header,
        "",
        welcome,
        "",
        why,
        "",
        bridge,
        "",
        example,
        "",
        soon,
        "",
        footer
    ].join('\n');
    return boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "magenta",
        backgroundColor: "black"
    });
}
console.log(getIntroMessage());
