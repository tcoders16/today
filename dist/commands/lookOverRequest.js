import axios from "axios";
import dotenv from "dotenv";
import { log } from "../utils/logger.js";
dotenv.config();
export async function lookOverRequest({ owner, repo, pullNumber, comment }) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        const pr = response.data;
        log.info(`Pull Request #${pullNumber} (${pr.title})`);
        console.log(`Author: ${pr.user.login}`);
        console.log(`State: ${pr.state}`);
        console.log(`Created: ${pr.created_at}`);
        console.log(`Updated: ${pr.updated_at}`);
        console.log(`Base: ${pr.base.ref} ← Head: ${pr.head.ref}`);
        console.log(`Body:\n${pr.body || "No description provided."}`);
        if (comment) {
            console.log(`Note: ${comment}`);
        }
    }
    catch (error) {
        log.error("Failed to fetch pull request.");
        console.error(error.response?.data || error.message);
    }
}
