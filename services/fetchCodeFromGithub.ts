import axios from "axios";
import dotenv from "dotenv";
import chalk from "chalk";
import boxen from "boxen";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ReadCodeParams = {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
  question: string;
};

// Step 1: Fetch file content from GitHub
async function fetchCodeFromGitHub({ owner, repo, path, branch = "main" }: Omit<ReadCodeParams, "question">): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  return Buffer.from(response.data.content, "base64").toString("utf-8");
}

// Step 2: Use OpenAI to answer a question about the code
async function analyzeCodeWithAI(code: string, question: string): Promise<string> {
  const systemPrompt = `
You are a code analysis assistant. You will receive a file's source code and a question about that code.
Your job is to answer only based on the content of the file. Do not assume anything that isn't present.
Respond clearly and concisely.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Code:\n${code}` },
      { role: "user", content: `Question:\n${question}` },
    ],
  });

  return response.choices[0].message.content || "No response.";
}

// Step 3: Combine both for full flow
export async function handleCodeAnalysis({ owner, repo, path, branch = "main", question }: ReadCodeParams) {
  try {
    const code = await fetchCodeFromGitHub({ owner, repo, path, branch });
    const answer = await analyzeCodeWithAI(code, question);

    console.log(
      boxen(
        chalk.green(`File: ${path} on branch ${branch}`) +
          "\n\n" +
          chalk.white(answer),
        {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
        }
      )
    );
  } catch (err: any) {
    console.error("Failed to fetch or analyze code:", err.message);
  }
}