"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRepos = listRepos;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = require("../utils/logger.js");
dotenv_1.default.config();
async function listRepos({ owner }) {
    try {
        const response = await axios_1.default.get(`https://api.github.com/users/${owner}/repos`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        const repos = response.data.map((repo) => `- ${repo.name}`).join("\n");
        logger_js_1.log.info(`Repositories owned by ${owner}:\n${repos}`);
    }
    catch (error) {
        logger_js_1.log.error("Failed to list repositories.");
        console.error(error.response?.data || error.message);
    }
}
