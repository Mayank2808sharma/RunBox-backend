import express, { Request, Response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Route to receive code from frontend and execute it
app.post("/execute", async (req: Request, res: Response) => {
  try {
    // Extract code and language from request body
    const { code, languageCode, input } = req.body;
    console.log(input);
    // Make a POST request to the Judge0 API to execute the code
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions/",
      {
        source_code: code,
        language_id: languageCode, // Language ID for the code (e.g., 71 for Python)
        stdin: input, // Optional: provide input to the code if needed
        expected_output: "", // Optional: provide expected output for testing
        useQueryString: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.JUDGE_API_KEY, // Replace with your RapidAPI key
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    // Extract the submission IDs from the response
    const submissionId = response.data.token;

    // Wait for a few seconds for the submissions to be processed
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Make a GET request to the Judge0 API to get the results of the code execution
    const resultResponse = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
      {
        headers: {
          "x-rapidapi-key": process.env.JUDGE_API_KEY, // Replace with your RapidAPI key
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          useQueryString: true,
        },
      }
    );

    // Extract the results from the response
    const results = resultResponse.data.stdout;
    console.log(resultResponse.data);
    // Send the results back to the frontend
    res.json({ results });
  } catch (error) {
    console.error("An error occurred while executing the code:", error);
    res
      .status(500)
      .json({ error: "An error occurred while executing the code." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
