import { createContext, useState, useContext, useCallback } from "react";
import api from "../api/axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Greetings. How may I sweeten your day?" }
  ]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message to UI
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post("/chat/", { message: text });
      setMessages((prev) => [...prev, { role: "model", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", text: "Our chocolatiers are briefly unavailable." }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      await api.post("/chat/clear/");
      setMessages([{ role: "model", text: "A fresh start! How can I help you?" }]);
    } catch (err) {
      console.error("Failed to clear chat");
    }
  };

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, messages, sendMessage, loading, startNewChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);