"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBranch = createBranch;
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
/**
 * Create a new branch in a GitHub repository based on a source branch.
 *
 * @param owner - GitHub username or organization
 * @param repo - Repository name
 * @param newBranch - Name of the new branch to create
 * @param sourceBranch - The branch to base the new branch on (default: 'main')
 */
function createBranch(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var headers, sourceRef, sha, response, error_1, message;
        var _c, _d;
        var owner = _b.owner, repo = _b.repo, newBranch = _b.newBranch, _e = _b.sourceBranch, sourceBranch = _e === void 0 ? "main" : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!GITHUB_TOKEN) {
                        console.error("Missing GITHUB_TOKEN environment variable.");
                        return [2 /*return*/];
                    }
                    headers = {
                        Authorization: "Bearer ".concat(GITHUB_TOKEN),
                        Accept: "application/vnd.github+json",
                    };
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get("https://api.github.com/repos/".concat(owner, "/").concat(repo, "/git/ref/heads/").concat(sourceBranch), { headers: headers })];
                case 2:
                    sourceRef = _f.sent();
                    sha = sourceRef.data.object.sha;
                    return [4 /*yield*/, axios_1.default.post("https://api.github.com/repos/".concat(owner, "/").concat(repo, "/git/refs"), {
                            ref: "refs/heads/".concat(newBranch),
                            sha: sha,
                        }, { headers: headers })];
                case 3:
                    response = _f.sent();
                    console.log("Branch '".concat(newBranch, "' created successfully in '").concat(owner, "/").concat(repo, "'."));
                    return [2 /*return*/, response.data];
                case 4:
                    error_1 = _f.sent();
                    message = ((_d = (_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || error_1.message || "Unknown error occurred.";
                    console.error("Failed to create branch: ".concat(message));
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
