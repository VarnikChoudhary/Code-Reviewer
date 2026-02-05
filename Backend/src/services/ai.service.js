const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_KEY,
});

async function generateContent(prompt) {
    if (!process.env.GOOGLE_GEMINI_KEY) {
        throw new Error("Missing GOOGLE_GEMINI_KEY environment variable");
    }

    try {
        const result = await genAI.models.generateContent({
            model: "My Code Reviewer",
            systemInstruction: `
           You are a Senior Code Reviewer (7+ years experience).

           Your response MUST follow this format ONLY:

           🔍 Issues:
            - List only concrete problems

           ✅ Suggested Fix:
            - Provide concise fixes or code snippets if needed

           💡 Improvements:
            - Optional optimizations or best practices

           📌 Key Takeaway:
            - 2–3 short bullet points summarizing the review

           Rules:
           - Do NOT add explanations outside these sections
           - Do NOT include introductions or conclusions
           - Be concise, technical, and to the point
           - No emojis outside section headers
           - Assume the developer is competent
          `,
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        });

        // attempt to extract text in several possible result shapes
        if (result && result.response) {
            const respText = result.response.text;
            if (typeof respText === "function") {
                return await respText();
            }
            if (typeof respText === "string") {
                return respText;
            }
        }

        // fallbacks for other shapes
        if (result && result.output && Array.isArray(result.output) && result.output.length) {
            const first = result.output[0];
            if (first.content && Array.isArray(first.content) && first.content[0] && first.content[0].text) {
                return first.content[0].text;
            }
        }

        // last resort, return JSON string
        return JSON.stringify(result);
    } catch (err) {
        console.error("ai.service.generateContent error:", err && err.message ? err.message : err);
        throw err;
    }
}

module.exports = generateContent;
