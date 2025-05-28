import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Create a new branch in a GitHub repository based on a source branch.
 *
 * @param owner - GitHub username or organization
 * @param repo - Repository name
 * @param newBranch - Name of the new branch to create
 * @param sourceBranch - The branch to base the new branch on (default: 'main')
 */
export async function createBranch({
  owner,
  repo,
  newBranch,
  sourceBranch = "main",
}: {
  owner: string;
  repo: string;
  newBranch: string;
  sourceBranch?: string;
}) {
  if (!GITHUB_TOKEN) {
    console.error("Missing GITHUB_TOKEN environment variable.");
    return;
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  try {
    // Step 1: Fetch the SHA of the source branch
    const sourceRef = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${sourceBranch}`,
      { headers }
    );
    const sha = sourceRef.data.object.sha;

    // Step 2: Create the new branch with that SHA
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        ref: `refs/heads/${newBranch}`,
        sha: sha,
      },
      { headers }
    );

    console.log(`Branch '${newBranch}' created successfully in '${owner}/${repo}'.`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Unknown error occurred.";
    console.error(`Failed to create branch: ${message}`);
    throw error;
  }
}