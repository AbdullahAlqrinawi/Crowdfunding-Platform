import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const COHERE_MODELS = [
  "command-a-03-2025",
  "command-r-plus-08-2024",
  "command-r-08-2024",
];

const COHERE_TIMEOUT_MS = 12000; 

function extractCohereText(data) {
  return data?.message?.content?.[0]?.text?.trim();
}

function safeAxiosInfo(err) {
  return { status: err?.response?.status, data: err?.response?.data, message: err?.message };
}

/** مهم: خليه يرجّع نص فقط مش JSON */
function buildStoryPrompt(userPrompt) {
  return (
    `Write an inspiring, engaging crowdfunding project story in English.\n` +
    `Return PLAIN TEXT ONLY (no JSON, no markdown).\n` +
    `Keep it 300-500 words.\n` +
    `Include: Background, Mission, Why it matters, Impact, Vision, Call to action.\n\n` +
    `${String(userPrompt).trim()}`
  );
}

async function callCohereStory({ prompt, apiKey }) {
  const url = "https://api.cohere.com/v2/chat";
  let lastErr = null;

  for (const model of COHERE_MODELS) {
    try {
      const resp = await axios.post(
        url,
        {
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 700, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: COHERE_TIMEOUT_MS,
        }
      );

      const text = extractCohereText(resp.data);
      if (text) return { text, model };
      lastErr = new Error("Empty Cohere response");
    } catch (e) {
      lastErr = e;
      const info = safeAxiosInfo(e);
      console.error(`[Cohere FAIL] model=${model} status=${info.status}`, info.data || info.message);

      // إذا مفتاح/صلاحيات غلط: لا تكمل
      if ([401, 403].includes(info.status)) break;

      // إذا موديل غير متاح 404: جرّب اللي بعده
      continue;
    }
  }

  throw lastErr || new Error("Cohere failed");
}

router.post("/generate-story", async (req, res) => {
  const rawPrompt = req.body?.prompt;
  if (!rawPrompt?.trim()) {
    return res.status(400).json({ error: true, message: "Prompt is required" });
  }

  const cohereKey = process.env.COHERE_API_KEY;
  if (!cohereKey) {
    return res.status(500).json({
      error: true,
      message: "Missing COHERE_API_KEY in .env",
    });
  }

  try {
    const prompt = buildStoryPrompt(rawPrompt);
    const out = await callCohereStory({ prompt, apiKey: cohereKey });

    return res.json({
      error: false,
      message: out.text,
      providerUsed: "cohere",
      modelUsed: out.model,
    });
  } catch (e) {
    const info = safeAxiosInfo(e);
    return res.status(502).json({
      error: true,
      message: "Cohere failed to generate story right now.",
      details: info.data || info.message,
    });
  }
});

export default router;
