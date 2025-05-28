import { execSync } from "child_process";
import { log } from "../utils/logger.js";

type PushCodeParams = {
  branch: string;
  message: string;
};

export async function pushCode({ branch, message }: { branch: string; message: string }) {
  try {
    log.info(`Pushing code to branch: ${branch}`);

    execSync("git add .", { stdio: "inherit" });

    // Check if there is anything to commit
    const status = execSync("git status --porcelain").toString().trim();
    if (!status) {
      log.error("No changes to commit. Working tree clean.");
      return;
    }

    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
    execSync(`git push origin ${branch}`, { stdio: "inherit" });
  } catch (error: any) {
    log.error("Failed to push code.");
    log.error(error.message);
  }
}