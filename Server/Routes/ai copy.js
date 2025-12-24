// import express from "express";
// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post("/generate-story", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({
//         error: true,
//         message: "Prompt is required",
//       });
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a creative story writer." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.8,
//       max_tokens: 2048,
//     });

//     const aiText = completion.choices[0].message.content;

//     return res.json({
//       error: false,
//       message: aiText,
//     });

//   } catch (err) {
//     console.error("OpenAI generation failed:", err);

//     return res.status(500).json({
//       error: true,
//       message: "AI service is currently unavailable.",
//     });
//   }
// });

// export default router;
