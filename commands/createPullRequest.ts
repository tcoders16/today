import axios from "axios";
import dotenv from "dotenv";
import { log } from "../utils/logger.js";

dotenv.config();

type CreatePullRequestParams = {
  owner: string;
  repo: string;
  title: string;
  head: string; // source branch
  base: string; // target branch
  body?: string;
};

export async function createPullRequest({
  owner,
  repo,
  title,
  head,
  base,
  body = "",
}: CreatePullRequestParams) {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        title,
        head, // branch you're merging from
        base, // branch you're merging into
        body,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    log.success(`Pull request created: ${response.data.html_url}`);
  } catch (error: any) {
    log.error("Failed to create pull request.");
    console.error(error.response?.data || error.message);
  }
}