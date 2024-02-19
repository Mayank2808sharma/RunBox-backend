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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResult = exports.compileCode = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
function compileCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { code, language_id, input } = req.body;
            if (!code || !language_id) {
                res.status(400); // Bad request;
                return res.json({ status: "error", message: "Missing parameters" });
            }
            if (!input) {
                input = "";
            }
            const response = yield axios_1.default.post("https://judge0-ce.p.rapidapi.com/submissions/", {
                source_code: code,
                language_id: language_id, // Language ID for the code (e.g., 71 for Python)
                stdin: input,
                useQueryString: true,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-key": process.env.JUDGE_API_KEY, // Replace with your RapidAPI key
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                },
            });
            const submissionId = response.data.token;
            res.json({ token: submissionId });
        }
        catch (error) {
            console.error("Error submitting code for compilation", error);
            res.status(500).json({ error: "Failed to submit code for compilation." });
        }
    });
}
exports.compileCode = compileCode;
function getResult(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.query;
            console.log(req.params);
            if (!token) {
                return res
                    .status(400)
                    .json({ status: "error", message: "Missing Token" });
            }
            const statusResponse = yield axios_1.default.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                headers: {
                    "x-rapidapi-key": process.env.JUDGE_API_KEY,
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                },
            });
            // Respond with the current status or result
            res.json({
                status: statusResponse.data.status,
                result: statusResponse.data,
            });
        }
        catch (error) {
            console.error("Error fetching submission status:", error);
            res.status(500).json({ error: "Failed to fetch submission status." });
        }
    });
}
exports.getResult = getResult;
