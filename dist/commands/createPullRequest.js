import axios from "axios";
import dotenv from "dotenv";
import { log } from "../utils/logger.js"; // Optional logger utility
dotenv.config();
export async function createPullRequest({ owner, repo, title, body = "", head, base, }) {
    try {
        const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            title,
            body,
            head,
            base,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        const pr = response.data;
        log.info(`Pull request created: ${pr.html_url}`);
        console.log(`Pull request created successfully: ${pr.title}`);
        console.log(`URL: ${pr.html_url}`);
    }
    catch (error) {
        console.error("Failed to create pull request.");
        if (error.response) {
            console.error(error.response.data);
        }
        else {
            console.error(error.message);
        }
    }
}
