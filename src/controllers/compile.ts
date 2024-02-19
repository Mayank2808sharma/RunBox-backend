import axios from "axios";
import { Request, Response } from "express";
require("dotenv").config();

async function compileCode(req: Request, res: Response) {
  try {
    let { code, language_id, input } = req.body;
    if (!code || !language_id) {
      res.status(400); // Bad request;
      return res.json({ status: "error", message: "Missing parameters" });
    }
    if (!input) {
      input = "";
    }
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions/",
      {
        source_code: code,
        language_id: language_id, // Language ID for the code (e.g., 71 for Python)
        stdin: input,
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
    const submissionId = response.data.token;
    res.json({ token: submissionId });
  } catch (error) {
    console.error("Error submitting code for compilation", error);
    res.status(500).json({ error: "Failed to submit code for compilation." });
  }
}

async function getResult(req: Request, res: Response) {
  try {
    const { token } = req.query;
    console.log(req.query);
    if (!token) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing Token" });
    }
    const statusResponse = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      {
        headers: {
          "x-rapidapi-key": process.env.JUDGE_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    // Respond with the current status or result
    res.json({
      status: statusResponse.data.status,
      result: statusResponse.data,
    });
  } catch (error) {
    console.error("Error fetching submission status:", error);
    res.status(500).json({ error: "Failed to fetch submission status." });
  }
}

export{compileCode, getResult};
