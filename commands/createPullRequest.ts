import axios from "axios";
import dotenv from "dotenv";
import { log } from "../utils/logger.js"; // Optional logger utility

dotenv.config();

export type CreatePullRequestParams = {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  head: string; // The name of the branch where your changes are implemented (feature branch)
  base: string; // The branch you want the changes pulled into (e.g. "main")
};

export async function createPullRequest({
  owner,
  repo,
  title,
  body = "",
  head,
  base,
}: CreatePullRequestParams): Promise<void> {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        title,
        body,
        head,
        base,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const pr = response.data;
    log.info(`Pull request created: ${pr.html_url}`);
    console.log(`Pull request created successfully: ${pr.title}`);
    console.log(`URL: ${pr.html_url}`);
  } catch (error: any) {
    console.error("Failed to create pull request.");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}