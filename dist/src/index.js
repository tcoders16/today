import { parseCommandFromInput } from "../services/openaiService.js";
import { createRepo } from "../commands/createRepo.js";
// import { deleteRepo } from "../commands/deleteRepo";
import { createPullRequest } from "../commands/createPullRequest.js";
import { pushCode } from "../commands/pushCode.js";
import { listRepos } from "../commands/listRepos.js";
import { createBranch } from "../commands/branchRequest.js";
import { lookOverRequest } from "../commands/lookOverRequest.js";
import { getLatestPullNumber } from "../commands/getLatestPullNumber.js";
import { listFilesInRepo } from "../commands/listFilesInRepo.js";
import { readCodeFileFromRepo } from "../commands/readCodeFileFromRepo.js";
import { handleCodeAnalysis } from "../services/fetchCodeFromGithub.js";
import { analyzeFile } from "../commands/analyzeFile.js";
import { answerGeneralQuestion } from "../services/answerGeneralQuestion.js";
// import { parseCommandFromInput } from "../services/openaiService.js";
// import { createRepo } from "../commands/createRepo.js";
// import { deleteRepo } from "../commands/deleteRepo.js";
// import { createPullRequest } from "../commands/createPullRequest.js";
// import { pushCode } from "../commands/pushCode.js";
// import { listRepos } from "../commands/listRepos.js";
// import { createBranch } from "../commands/branchRequest.js";
/**
 * Handles natural language GitHub commands.
 * - Parses user input via OpenAI
 * - Determines if it's an action or a query, question
 * - Executes GitHub-related commands if it's an actionable input
 */
export async function handleNaturalCommand(input) {
    console.log("Processing command:", input);
    // Step 1: Parse the user's input via OpenAI classification
    const parsed = await parseCommandFromInput(input);
    // Step 2: If it's a natural language query, return early (OpenAI will already display the response)
    if (parsed?.type === "query")
        return;
    // Step 3: Ensure that the input is an actionable GitHub command
    if (!parsed || !parsed.action) {
        console.error("Could not understand your command. Please try again.");
        return;
    }
    // Step 4: Validate that the action is supported
    const supportedActions = [
        "createRepo",
        // "deleteRepo",
        "createPullRequest",
        "pushCode",
        "listRepos",
        "createBranch",
        "lookOverRequest",
        "listFilesInRepo",
        "readCodeFileFromRepo",
        "analyzeFile"
    ];
    if (!supportedActions.includes(parsed.action)) {
        console.error("Unsupported action:", parsed.action);
        console.log("Supported actions: createRepo, deleteRepo, createPullRequest, pushCode, listRepos, createBranch, lookOverRequest, analyzeFile");
        return;
    }
    // Step 5: Execute the corresponding command based on parsed.action
    switch (parsed.action) {
        case "createRepo":
            if (!parsed.name) {
                console.error("Missing repository name.");
                return;
            }
            await createRepo({
                name: parsed.name,
                private: parsed.private ?? false,
            });
            break;
        // case "deleteRepo":
        //   if (!parsed.owner || !parsed.repo) {
        //     console.error("Missing 'owner' or 'repo' field.");
        //     return;
        //   }
        //   await deleteRepo({
        //     owner: parsed.owner,
        //     repo: parsed.repo,
        //   });
        //   break;
        case "createPullRequest":
            if (!parsed.owner || !parsed.repo || !parsed.head || !parsed.base || !parsed.title) {
                console.error("Missing required fields: owner, repo, head, base, or title.");
                return;
            }
            await createPullRequest({
                owner: parsed.owner,
                repo: parsed.repo,
                title: parsed.title,
                head: parsed.head,
                base: parsed.base,
                body: parsed.body || "",
            });
            break;
        case "pushCode":
            if (!parsed.branch || !parsed.message) {
                console.error("Missing 'branch' or 'message'.");
                return;
            }
            await pushCode({
                branch: parsed.branch,
                message: parsed.message,
            });
            break;
        case "listRepos":
            if (!parsed.owner) {
                console.error("Missing 'owner' field.");
                return;
            }
            await listRepos({
                owner: parsed.owner,
            });
            break;
        case "createBranch":
            if (!parsed.owner || !parsed.repo || !parsed.newBranch) {
                console.error("Missing required fields: 'owner', 'repo', or 'newBranch'.");
                return;
            }
            await createBranch({
                owner: parsed.owner,
                repo: parsed.repo,
                newBranch: parsed.newBranch,
                sourceBranch: parsed.sourceBranch || "main", // optional fallback
            });
            break;
        case "lookOverRequest":
            if (!parsed.owner || !parsed.repo) {
                console.error("Missing 'owner' or 'repo' field.");
                return;
            }
            const pullNumber = parsed.pullNumber ||
                (await getLatestPullNumber(parsed.owner, parsed.repo));
            if (!pullNumber) {
                console.error("Could not determine pull request number.");
                return;
            }
            await lookOverRequest({
                owner: parsed.owner,
                repo: parsed.repo,
                pullNumber,
                comment: parsed.comment || "",
            });
            break;
        case "listFilesInRepo":
            if (!parsed.owner || !parsed.repo) {
                console.error("Missing 'owner' or 'repo' field.");
                return;
            }
            await listFilesInRepo({
                owner: parsed.owner,
                repo: parsed.repo,
                branch: parsed.branch || "main",
                path: parsed.path || "", // Optional: root path by default
            });
            break;
        case "readCodeFileFromRepo":
            if (!parsed.owner || !parsed.repo || !parsed.path) {
                console.error("Missing owner, repo, or file path.");
                return;
            }
            await readCodeFileFromRepo({
                owner: parsed.owner,
                repo: parsed.repo,
                path: parsed.path,
                branch: parsed.branch || "main",
            });
            break;
        case "handleCodeAnalysis":
            if (!parsed.owner || !parsed.repo || !parsed.path) {
                console.error("Missing required fields: owner, repo, or path.");
                return;
            }
            await handleCodeAnalysis({
                owner: parsed.owner,
                repo: parsed.repo,
                path: parsed.path,
                branch: parsed.branch || "main",
                question: parsed.question || "Please analyze this code."
            });
            break;
        // Inside the switch (parsed.action):
        case "analyzeFile":
            if (!parsed.owner || !parsed.repo || !parsed.path || !parsed.mode) {
                console.error("Missing required fields: owner, repo, path, or mode.");
                return;
            }
            await analyzeFile({
                owner: parsed.owner,
                repo: parsed.repo,
                path: parsed.path,
                branch: parsed.branch ?? "main",
                mode: parsed.mode,
                functionName: parsed.functionName // only used if mode === "function"
            });
            break;
        default:
            console.warn("Unrecognized action or general query. Passing to AI Assistant...\n");
            await answerGeneralQuestion(input);
            return;
    }
}
