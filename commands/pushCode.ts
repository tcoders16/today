import { execSync } from "child_process";
import { log } from "../utils/logger.js";

type PushCodeParams = {
  branch: string;
  message: string;
};

export async function pushCode({ branch, message }: PushCodeParams) {
  try {
    log.info(`Pushing code to branch: ${branch}`);

    execSync("git add .", { stdio: "inherit" });
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
    execSync(`git push origin ${branch}`, { stdio: "inherit" });

    log.success(`Code successfully pushed to '${branch}' with message: "${message}"`);
  } catch (error: any) {
    log.error("Failed to push code.");
    console.error(error.message || error);
  }
}