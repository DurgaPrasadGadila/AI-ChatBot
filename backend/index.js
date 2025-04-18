const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const groqApiKey = process.env.GROQ_API_KEY; // Set this in .env

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello, world! chatbot running on Groq API!",
  });
});

app.post("/", async (req, res) => {
  const { messages } = req.body;

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
    model: "llama3-8b-8192", // Groq Llama3 model
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
    console.error("Groq API Error:", err.response?.data || err.message || err);
    return res.status(500).json({
      success: false,
      message: "Error processing request. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Groq AI Server running on port ${PORT}`));
