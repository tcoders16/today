"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushCode = pushCode;
const child_process_1 = require("child_process");
const logger_js_1 = require("../utils/logger.js");
async function pushCode({ branch, message }) {
    try {
        // Sanitize branch name
        const safeBranch = branch.replace(/\s+/g, "-");
        logger_js_1.log.info(`Pushing code to branch: ${safeBranch}`);
        (0, child_process_1.execSync)("git add .", { stdio: "inherit" });
        // Check if there is anything to commit
        const status = (0, child_process_1.execSync)("git status --porcelain").toString().trim();
        if (!status) {
            logger_js_1.log.error("No changes to commit. Working tree clean.");
            return;
        }
        // Create and checkout branch if it doesn't exist
        try {
            (0, child_process_1.execSync)(`git rev-parse --verify ${safeBranch}`, { stdio: "ignore" });
        }
        catch {
            (0, child_process_1.execSync)(`git checkout -b ${safeBranch}`, { stdio: "inherit" });
        }
        (0, child_process_1.execSync)(`git checkout ${safeBranch}`, { stdio: "inherit" });
        (0, child_process_1.execSync)(`git commit -m "${message}"`, { stdio: "inherit" });
        (0, child_process_1.execSync)(`git push origin ${safeBranch}`, { stdio: "inherit" });
    }
    catch (error) {
        logger_js_1.log.error("Failed to push code.");
        logger_js_1.log.error(error.message);
    }
}
