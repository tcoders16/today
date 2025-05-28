import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";
import boxen from "boxen";
import chalk from "chalk";
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
/**
 * Analyzes a GitHub file: either summarizes entire file or a specific function.
 */
export async function analyzeFile({ owner, repo, path, functionName, branch = "main", mode }) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
        const decoded = Buffer.from(res.data.content, "base64").toString("utf-8");
        let codeToSend = decoded;
        if (mode === "function" && functionName) {
            const regex = new RegExp(`(function\\s+${functionName}\\s*\$begin:math:text$[^)]*\\$end:math:text$\\s*{[\\s\\S]*?})|(const\\s+${functionName}\\s*=\\s*\$begin:math:text$[^)]*\\$end:math:text$\\s*=>\\s*{[\\s\\S]*?})`);
            const match = decoded.match(regex);
            if (!match) {
                console.log(chalk.redBright(`Function '${functionName}' not found in ${path}`));
                return;
            }
            codeToSend = match[0];
        }
        const prompt = mode === "summary"
            ? `Summarize what this entire file does and how it's structured:\n\n${codeToSend}`
            : `Explain clearly what the following function does:\n\n${codeToSend}`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a senior software engineer helping analyze code." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3
        });
        const output = completion.choices[0].message?.content || "No explanation returned.";
        console.log(boxen(chalk.white(output), {
            padding: 1,
            borderColor: "green",
            borderStyle: "round"
        }));
    }
    catch (err) {
        console.error(chalk.red("Error analyzing file:"), err.response?.data?.message || err.message);
    }
}
