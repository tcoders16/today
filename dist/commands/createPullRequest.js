"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPullRequest = createPullRequest;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = require("../utils/logger.js");
dotenv_1.default.config();
async function createPullRequest({ owner, repo, title, head, base, body = "", }) {
    try {
        const response = await axios_1.default.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
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
        logger_js_1.log.success(`Pull request created: ${response.data.html_url}`);
    }
    catch (error) {
        logger_js_1.log.error("Failed to create pull request.");
        console.error(error.response?.data || error.message);
    }
}
