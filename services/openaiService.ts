const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

      export async function parseCommandFromInput(input: string): Promise<any> {
        const systemPrompt = `
      You are a backend AI parser that converts natural language GitHub-related commands into structured JSON instructions.

      You must respond ONLY with a **raw, valid JSON object** — no markdown, no extra text, no code blocks, no explanations.

      ---

      Supported GitHub Actions and JSON formats:

      1. Create a repository:
      {
        "action": "createRepo",
        "name": "repo-name",
        "private": true
      }

      2. Delete a repository:
      {
        "action": "deleteRepo",
        "owner": "username",
        "repo": "repo-name"
      }

      3. Create an issue:
      {
        "action": "createIssue",
        "owner": "username",
        "repo": "repo-name",
        "title": "Issue title",
        "body": "Optional issue body"
      }

      4. Create a pull request:
      {
        "action": "createPullRequest",
        "owner": "username",
        "repo": "repo-name",
        "title": "Pull request title",
        "head": "source-branch",
        "base": "target-branch",
        "body": "Optional pull request description"
      }

      5. Delete a pull request:
      {
        "action": "deletePullRequest",
        "owner": "username",
        "repo": "repo-name",
        "pull_number": 123
      }

      6. Push local code:
      {
        "action": "pushCode",
        "branch": "branch-name",
        "message": "commit message"
      }

      ---

      Formatting Rules:
      - The response MUST be a valid JSON object with the required keys.
      - Do NOT include markdown, quotes, comments, or descriptive text.
      - Leave optional fields empty if not specified, but include the key.

      ---

      Examples:

      Input: "create a private repo named my-ai-bot"
      Output:
      {
        "action": "createRepo",
        "name": "my-ai-bot",
        "private": true
      }

      Input: "delete repo called test-cli owned by omkumarsolanki"
      Output:
      {
        "action": "deleteRepo",
        "owner": "omkumarsolanki",
        "repo": "test-cli"
      }

      Input: "create a pull request from branch dev to main in ai-cli owned by omkumarsolanki with title Fix bugs and description Handles CLI error cases"
      Output:
      {
        "action": "createPullRequest",
        "owner": "omkumarsolanki",
        "repo": "ai-cli",
        "title": "Fix bugs",
        "head": "dev",
        "base": "main",
        "body": "Handles CLI error cases"
      }
        `.trim();





  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0
    });




    //If nothing recived as output
    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content received from OpenAI");

    return JSON.parse(content);


    //if error of type any

  } catch (error: any) {
    console.error("Failed to parse command:", error.message);
    return {};
  }
}