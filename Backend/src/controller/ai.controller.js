const ai = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await ai(code);
        // ensure we always send a string or JSON
        if (typeof response === "string") return res.send({ review: response });
        return res.send(response);
    } catch (err) {
        console.error("ai.controller.getReview error:", err && err.message ? err.message : err);
        // attempt to forward upstream status (e.g., 429 from provider)
        const status = (err && (err.status || err.code || (err.response && err.response.status))) || 500;
        const message = (err && err.message) || "Failed to generate review";
        const details = err && err.response && err.response.data ? err.response.data : undefined;
        return res.status(status).json({ error: message, details });
    }
};