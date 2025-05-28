import axios from "axios";
import dotenv from "dotenv";
import chalk from "chalk";
import boxen from "boxen";
dotenv.config();
export async function readCodeFileFromRepo({ owner, repo, path, branch = "main" }) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        const decoded = Buffer.from(response.data.content, "base64").toString("utf-8");
        console.log(boxen(chalk.cyanBright(`Code from ${path} on branch ${branch}:\n\n`) +
            chalk.white(decoded), {
            padding: 1,
            borderColor: "blue",
            borderStyle: "round",
        }));
    }
    catch (error) {
        console.error("Error reading code file:", error.response?.data?.message || error.message);
    }
}
