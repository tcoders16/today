import { parseCommandFromInput } from "../services/openaiService.js";
import { createRepo } from "../commands/createRepo.js";
import { deleteRepo } from "../commands/deleteRepo.js";
import { createPullRequest } from "../commands/createPullRequest.js";
import { pushCode } from "../commands/pushCode.js";
import { listRepos } from "../commands/listRepos.js";
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
        "deleteRepo",
        "createPullRequest",
        "pushCode",
        "listRepos"
    ];
    if (!supportedActions.includes(parsed.action)) {
        console.error("Unsupported action:", parsed.action);
        console.log("Supported actions: createRepo, deleteRepo, createPullRequest, pushCode, listRepos.");
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
        case "deleteRepo":
            if (!parsed.owner || !parsed.repo) {
                console.error("Missing 'owner' or 'repo' field.");
                return;
            }
            await deleteRepo({
                owner: parsed.owner,
                repo: parsed.repo,
            });
            break;
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
        default:
            console.error("Unrecognized action:", parsed.action);
            break;
    }
}
