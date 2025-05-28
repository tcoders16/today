"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.log = {
    info: (msg) => console.log(chalk_1.default.blueBright(`ℹ  ${msg}`)),
    success: (msg) => console.log(chalk_1.default.green(`✔  ${msg}`)),
    error: (msg) => console.log(chalk_1.default.red(`✖  ${msg}`)),
    warn: (msg) => console.log(chalk_1.default.yellow(`⚠  ${msg}`)),
};
