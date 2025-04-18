import React, { createContext, useContext, useRef, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const lastMsg = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi there! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [processing, setProcessing] = useState(false);

  const handleSubmission = async () => {
    if (!messageText.trim() || processing) return;

    const tempMessages = [
      ...messages,
      {
        from: "human",
        text: messageText,
      },
    ];

    setMessages(tempMessages);
    setMessageText("");

    setTimeout(() => {
      lastMsg.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      setProcessing(true);

      // Use the deployed backend URL from .env or fallback
      const apiUrl =
        process.env.REACT_APP_API_URL || "https://neurobot-api.vercel.app";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: tempMessages.slice(-8), // Last 8 messages for context
        }),
      });

      const data = await res.json();
      setProcessing(false);

      if (!data.success) {
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: data.message || "Something went wrong. Please try again.",
          },
        ]);
        return;
      }

      const ans =
        typeof data.data === "string"
          ? data.data.trim()
          : "Sorry, I couldn't understand that. Please try again.";

      setMessages((prev) => [...prev, { from: "ai", text: ans }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Network error. Please try again later." },
      ]);
    }

    setTimeout(() => {
      lastMsg.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <AppContext.Provider
      value={{
        lastMsg,
        messageText,
        setMessageText,
        processing,
        setProcessing,
        messages,
        setMessages,
        handleSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useGlobalContext = () => {
  return useContext(AppContext);
};
