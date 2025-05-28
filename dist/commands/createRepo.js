"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepo = createRepo;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createRepo({ name, private: isPrivate }) {
    try {
        const response = await axios_1.default.post("https://api.github.com/user/repos", {
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
