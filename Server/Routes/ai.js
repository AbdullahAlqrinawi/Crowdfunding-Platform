import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const AVAILABLE_MODELS = [
  "gemini-2.0-flash-001",
  "gemini-2.0-flash", 
  "gemini-pro-latest"
];

router.post("/generate-story", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: true, message: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: true, message: "AI service configuration error" });
    }

    let lastError = null;

    for (const model of AVAILABLE_MODELS) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 1024,
            }
          },
          {
            headers: { "Content-Type": "application/json" },
            params: { key: process.env.GEMINI_API_KEY },
            timeout: 30000
          }
        );

        const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({ 
          error: false, 
          message: aiText || "No AI response received."
        });

      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;

  } catch (err) {
    console.error("AI generation failed:", err.response?.data || err.message);
    
    res.status(500).json({ 
      error: true, 
      message: "AI service is currently unavailable. Please try again later."
    });
  }
});

export default router;