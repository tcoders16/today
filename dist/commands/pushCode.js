import { execSync } from "child_process";
import { log } from "../utils/logger.js";
// Change this to your new remote repository URL
const REMOTE_REPO = "https://github.com/tcoders16/today";
export async function pushCode({ branch, message }) {
    try {
        // Sanitize branch name
        const safeBranch = branch.replace(/\s+/g, "-");
        log.info(`Pushing code to branch: ${safeBranch}`);
        execSync("git add .", { stdio: "inherit" });
        // Check if there is anything to commit
        const status = execSync("git status --porcelain").toString().trim();
        if (!status) {
            log.error("No changes to commit. Working tree clean.");
            return;
        }
        // Create and checkout branch if it doesn't exist
        try {
            execSync(`git rev-parse --verify ${safeBranch}`, { stdio: "ignore" });
        }
        catch {
            execSync(`git checkout -b ${safeBranch}`, { stdio: "inherit" });
        }
        execSync(`git checkout ${safeBranch}`, { stdio: "inherit" });
        execSync(`git commit -m "${message}"`, { stdio: "inherit" });
        // Set the new remote before pushing
        execSync(`git remote set-url origin ${REMOTE_REPO}`, { stdio: "inherit" });
        execSync(`git push origin ${safeBranch}`, { stdio: "inherit" });
    }
    catch (error) {
        log.error("Failed to push code.");
        log.error(error.message);
    }
}
