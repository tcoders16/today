import axios from "axios";
import dotenv from "dotenv";
import { log } from "../utils/logger.js";

dotenv.config();

type ListReposParams = {
  owner: string;
};

export async function listRepos({ owner }: ListReposParams) {
  try {
    const response = await axios.get(`https://api.github.com/users/${owner}/repos`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    const repos = response.data.map((repo: any) => `- ${repo.name}`).join("\n");
    log.info(`Repositories owned by ${owner}:\n${repos}`);
  } catch (error: any) {
    log.error("Failed to list repositories.");
    console.error(error.response?.data || error.message);
  }
}