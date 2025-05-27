import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export async function createRepo({ name, private: isPrivate }) {
    try {
        const response = await axios.post("https://api.github.com/user/repos", {
            name,
            private: isPrivate,
            auto_init: true, // optional: creates README
        }, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        console.log(`Repository created: ${response.data.html_url}`);
    }
    catch (error) {
        if (error.response) {
            console.error("GitHub API Error:", error.response.data);
        }
        else {
            console.error("Request Error:", error.message);
        }
    }
}
