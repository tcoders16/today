"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNaturalCommand = handleNaturalCommand;
const openaiService_1 = require("../services/openaiService");
const createRepo_1 = require("../commands/createRepo");
const deleteRepo_1 = require("../commands/deleteRepo");
const createPullRequest_1 = require("../commands/createPullRequest");
const pushCode_1 = require("../commands/pushCode");
const listRepos_1 = require("../commands/listRepos");
/**
 * Handles natural language GitHub commands.
 * - Parses user input via OpenAI
 * - Determines if it's an action or a query, question
 * - Executes GitHub-related commands if it's an actionable input
 */
async function handleNaturalCommand(input) {
    console.log("Processing command:", input);
    // Step 1: Parse the user's input via OpenAI classification
    const parsed = await (0, openaiService_1.parseCommandFromInput)(input);
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
            await (0, createRepo_1.createRepo)({
                name: parsed.name,
                private: parsed.private ?? false,
            });
            break;
        case "deleteRepo":
            if (!parsed.owner || !parsed.repo) {
                console.error("Missing 'owner' or 'repo' field.");
                return;
            }
            await (0, deleteRepo_1.deleteRepo)({
                owner: parsed.owner,
                repo: parsed.repo,
            });
            break;
        case "createPullRequest":
            if (!parsed.owner || !parsed.repo || !parsed.head || !parsed.base || !parsed.title) {
                console.error("Missing required fields: owner, repo, head, base, or title.");
                return;
            }
            await (0, createPullRequest_1.createPullRequest)({
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
            await (0, pushCode_1.pushCode)({
                branch: parsed.branch,
                message: parsed.message,
            });
            break;
        case "listRepos":
            if (!parsed.owner) {
                console.error("Missing 'owner' field.");
                return;
            }
            await (0, listRepos_1.listRepos)({
                owner: parsed.owner,
            });
            break;
        default:
            console.error("Unrecognized action:", parsed.action);
            break;
    }
}
