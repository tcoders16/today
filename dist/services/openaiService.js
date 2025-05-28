import dotenv from "dotenv";
import OpenAI from "openai";
import chalk from "chalk";
import boxen from "boxen";
dotenv.config();
// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function parseCommandFromInput(input) {
    const systemPrompt = `
You are a backend AI assistant designed to translate natural language GitHub commands into precise, machine-readable JSON instructions.

Your only job is to detect whether the user input is a GitHub ACTION or a general QUERY, and respond with one of two formats:

---

When it is an ACTION:
- Respond ONLY with a valid JSON object describing the action.
- Do NOT include any extra text, markdown, explanations, or code blocks.
- Do NOT wrap the output in quotes or backticks.
- All keys and structure must exactly match the examples below.
- Optional fields must be present but can be empty.

When it is a QUERY (asking what you support, how you work, etc.):
- Respond with this format:
  {
    "type": "query",
    "response": "<natural language explanation of what actions are supported>"
  }

---

SUPPORTED GITHUB ACTIONS:

1. Create a repository:
{
  "action": "createRepo",
  "name": "repo-name",
  "private": true
}

2. Create an issue:
{
  "action": "createIssue",
  "owner": "username",
  "repo": "repo-name",
  "title": "Issue title",
  "body": "Optional issue body"
}

3. Create a pull request:
{
  "action": "createPullRequest",
  "owner": "username",
  "repo": "repo-name",
  "title": "Pull request title",
  "head": "source-branch",
  "base": "target-branch",
  "body": "Optional pull request description"
}

4. Push code:
{
  "action": "pushCode",
  "branch": "branch-name",
  "message": "commit message"
}

5. List repositories:
{
  "action": "listRepos",
  "owner": "username"
}

6. Create a new branch:
{
  "action": "createBranch",
  "owner": "username",
  "repo": "repo-name",
  "newBranch": "new-branch-name",
  "sourceBranch": "main"
}
7. Look over a pull request:
{
  "action": "lookOverRequest",
  "owner": "username",
  "repo": "repo-name",
  "branch": "branch-name",
  "pullNumber": 1,
  "comment": "Optional comment on the pull request"
}
8. List files in a repository:
{
  "action": "listFilesInRepo",
  "owner": "any/owner",
  "repo": "any-repo",
  "branch": "28-May",
  "path": "" // optional
}
9. Read Code from a file in a repository:
{
  "action": "readCodeFileFromRepo",
  "owner": "any/owner",
  "repo": "any/name",
  "path": "path/to/file.js",
  "branch": "28-May"
}
10. Read Code from a file in a repository:
{
  "action": "readCodeFileFromRepo",
  "owner": "any/owner",
  "repo": "any/name",
  "path": "path/to/file.js",
  "branch": "28-May"
}

10. Analyze and summarise the code in a file:
{
  "action": "analyzeFile",
  "owner": "username",
  "repo": "repo-name",
  "path": "file-path.ts",
  "branch": "branch-name",
  "mode": "summary"
}
---

QUERY RESPONSES:

If the user says:
- "who is the delveloper of this ai?"-----> Omkumar Solanki Linkedin: - https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/   |   Github - https://github.com/
- "what can you do?"
- "how do I use you?"
- "list all supported commands"
- "can you create pull requests?"

Respond with:
{
  "type": "query",
  "response": "I support GitHub automation for creating repositories, branches, issues, pull requests, pushing commits, and listing repositories."
}

OR
Reply with this detailed information:

Developed by: Omkumar Solanki
Roles: Software Developer | AI Agent Builder | MERN Stack | iOS | DevOps | Web3
GitHub: https://github.com/tcoders16
LinkedIn: https://linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2
Project Details:
Om-GitCLI is a natural language GitHub automation assistant built for developers who want to manage their repositories, branches, issues, and pull requests using conversational commands instead of traditional terminal syntax.

The CLI uses OpenAI's GPT-4o to intelligently parse human-like input into structured GitHub API actions. You can describe your task in plain English — like "create a private repo named ai-tools" or "push my latest code to branch dev with commit message fix auth bug" — and the CLI will understand, convert, and execute it.

Technologies Used:
- Node.js + TypeScript
- OpenAI GPT-4o (for prompt-to-action translation)
- GitHub REST API (v3)
- Axios (for HTTP requests)
- Commander.js (for CLI argument handling)
- Chalk + Boxen (for styled terminal output)

Key Features:
-  Create and manage repositories with natural commands
-  Push code and create branches conversationally
-  Create and list pull requests and issues
- Analyze, summarize, or read code from public GitHub files
-  Answer general questions about GitHub and CI/CD
-  Fully extensible with modular action handlers
-  Styled, beginner-friendly CLI interface

Use Case:
Om-GitCLI is designed for:
- Developers looking to reduce context-switching from docs to terminal
- Teams automating repetitive GitHub workflows
- Educators teaching GitHub concepts through language
- DevOps engineers building AI-driven scripting pipelines
- Hackathon/MVP tools needing quick GitHub scaffolding


---

ERROR HANDLING:

If the user input is ambiguous or invalid:
{
  "type": "query",
  "response": "Sorry, I couldn't understand that. Please try a GitHub command like 'create a private repo called my-ai-cli' or 'push code to dev branch'."
}

---

EXAMPLES:

Input: "create a repo called testing-bot"
Output:
{
  "action": "createRepo",
  "name": "testing-bot",
  "private": true
}

Input: "push code to branch dev with message added login"
Output:
{
  "action": "pushCode",
  "branch": "dev",
  "message": "added login"
}

Input: "make a pull request from branch dev to main in ai-cli with title Fix bug"
Output:
{
  "action": "createPullRequest",
  "owner": "your-username",
  "repo": "ai-cli",
  "title": "Fix bug",
  "head": "dev",
  "base": "main",
  "body": ""
}

Input: "what can you do?"
Output:
{
  "type": "query",
  "response": "I can automate GitHub workflows like creating repositories, opening issues, making pull requests, pushing code, and creating branches."
}

Input: "list all repos for omkumarsolanki"
Output:
{
  "action": "listRepos",
  "owner": "omkumarsolanki"
}

Input: "create branch new-feature from dev in repo github-cli"
Output:
{
  "action": "createBranch",
  "owner": "omkumarsolanki",
  "repo": "github-cli",
  "newBranch": "new-feature",
  "sourceBranch": "dev"
}
`.trim();
    // Call OpenAI API and parse structured GitHub command
    try {
        // Step 1: Send prompt to OpenAI (structured response enforced)
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: input }
            ],
            temperature: 0,
            // If you want structured JSON, uncomment below:
            // response_format: { type: "json_object" }
        });
        // Step 2: Get content from OpenAI response
        const content = response.choices[0].message.content;
        if (!content)
            throw new Error("No content received from OpenAI");
        // Step 3: Parse content
        const parsed = JSON.parse(content);
        // Step 4: Display based on type
        if (parsed.type === "query") {
            // Human-friendly query response
            console.log(boxen(chalk.cyan(parsed.response), {
                padding: 1,
                margin: 1,
                borderStyle: "round",
                borderColor: "cyan"
            }));
        }
        else {
            // JSON-style command response (no stringify)
            let output = '';
            for (const key in parsed) {
                output += `${chalk.yellow(key)}: ${chalk.white(parsed[key])}\n`;
            }
            console.log(boxen(`${chalk.bold.greenBright("✔ GitHub Instruction Parsed")}\n\n${output.trim()}`, {
                padding: 1,
                margin: 1,
                borderStyle: "round",
                borderColor: "green"
            }));
        }
        return parsed;
    }
    catch (error) {
        // Step 5: Error fallback
        const fallback = {
            type: "query",
            response: "Sorry, I couldn't process that request. Please try something like: 'create repo named test-cli'."
        };
        console.error(boxen(`${chalk.bold.red("✖ Failed to parse OpenAI response.")}\n\n${chalk.white(error.message)}`, {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "red"
        }));
        return fallback;
    }
}
