import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

type ListFilesParams = {
  owner: string;
  repo: string;
  branch?: string;
  path?: string; // defaults to root
};

export async function listFilesInRepo({
  owner,
  repo,
  branch = "main",
  path = "",
}: ListFilesParams) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const items = response.data;

    console.log(`Files/folders in ${repo} at ${path || "root"} on branch ${branch}:`);
    for (const item of items) {
      console.log(`- ${item.type.toUpperCase()}: ${item.name}`);
    }
  } catch (error: any) {
    console.error("Failed to fetch repository contents.");
    console.error(error.response?.data || error.message);
  }
}