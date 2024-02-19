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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(body_parser_1.default.json());
// Route to receive code from frontend and execute it
app.post("/execute", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract code and language from request body
        const { code, languageCode, input } = req.body;
        console.log(input);
        // Make a POST request to the Judge0 API to execute the code
        const response = yield axios_1.default.post("https://judge0-ce.p.rapidapi.com/submissions/", {
            source_code: code,
            language_id: languageCode, // Language ID for the code (e.g., 71 for Python)
            stdin: input, // Optional: provide input to the code if needed
            expected_output: "", // Optional: provide expected output for testing
            useQueryString: true,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-key": process.env.JUDGE_API_KEY, // Replace with your RapidAPI key
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
        });
        // Extract the submission IDs from the response
        const submissionId = response.data.token;
        // Wait for a few seconds for the submissions to be processed
        yield new Promise((resolve) => setTimeout(resolve, 5000));
        // Make a GET request to the Judge0 API to get the results of the code execution
        const resultResponse = yield axios_1.default.get(`https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`, {
            headers: {
                "x-rapidapi-key": process.env.JUDGE_API_KEY, // Replace with your RapidAPI key
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                useQueryString: true,
            },
        });
        // Extract the results from the response
        const results = resultResponse.data.stdout;
        console.log(resultResponse.data);
        // Send the results back to the frontend
        res.json({ results });
    }
    catch (error) {
        console.error("An error occurred while executing the code:", error);
        res
            .status(500)
            .json({ error: "An error occurred while executing the code." });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
