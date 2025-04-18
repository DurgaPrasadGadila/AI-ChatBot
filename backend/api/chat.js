import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      message: "Hello, world! chatbot running on Groq API!",
    });
  }

  if (req.method === "POST") {
    const { messages } = req.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Messages are required." });
    }

    const chatMessages = messages.map((item) => ({
      role: item.from === "ai" ? "assistant" : "user",
      content: item.text,
    }));

    const systemMessage = {
      role: "system",
      content:
        "You are a professional AI assistant. Always provide accurate, helpful, and friendly responses.",
    };

    const reqBody = {
      model: "llama3-8b-8192",
      messages: [systemMessage, ...chatMessages],
      max_tokens: 1000,
      temperature: 0.6,
    };

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
        }
      );

      const data = response.data;
      const answer =
        data.choices?.[0]?.message?.content?.trim() ||
        "I'm not sure how to respond to that.";

      return res.status(200).json({ success: true, data: answer });
    } catch (err) {
      console.error(
        "Groq API Error:",
        err.response?.data || err.message || err
      );
      return res.status(500).json({
        success: false,
        message: "Error processing request. Please try again later.",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
