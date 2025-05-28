import axios from "axios";
import dotenv from "dotenv";
import { log } from "../utils/logger.js";
dotenv.config();
export async function createPullRequest({ owner, repo, title, head, base, body = "", }) {
    try {
        const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            title,
            head, // branch you're merging from
            base, // branch you're merging into
            body,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        log.success(`Pull request created: ${response.data.html_url}`);
    }
    catch (error) {
        log.error("Failed to create pull request.");
        console.error(error.response?.data || error.message);
    }
}
