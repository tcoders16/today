"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRepo = deleteRepo;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function deleteRepo({ owner, repo }) {
    try {
        const response = await axios_1.default.delete(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        console.log(`Repository deleted: ${owner}/${repo}`);
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
