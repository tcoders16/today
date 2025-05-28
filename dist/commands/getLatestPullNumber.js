import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export async function getLatestPullNumber(owner, repo) {
    try {
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
        const pullRequests = res.data;
        if (!pullRequests.length) {
            console.log("No open pull requests found.");
            return null;
        }
        // You can customize which PR to choose, here we take the first one
        return pullRequests[0].number;
    }
    catch (error) {
        console.error("Failed to fetch pull requests:", error.response?.data || error.message);
        return null;
    }
}
