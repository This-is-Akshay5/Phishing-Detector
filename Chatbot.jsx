import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaUser, FaSpinner } from "react-icons/fa";
import { checkURL, checkEmail } from "./PhishingDetector"; // Import detection functions

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Paste a URL or email to check for phishing.", type: "info" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input, type: "user" };
    setMessages([...messages, userMessage]);
    
    setLoading(true);
    const botMessage = input.includes("@") ? await checkEmail(input) : await checkURL(input);
    setLoading(false);

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  const renderMessage = (msg, index) => {
    const colors = {
      safe: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      danger: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      user: "bg-gray-700 text-white",
    };

    return (
      <motion.div
        key={index}
        className={`flex items-center my-2 ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {msg.sender === "bot" && <FaRobot className="text-blue-500 mr-2" />}
        <div className={`px-3 py-2 rounded-lg ${colors[msg.type]}`}>
          {msg.text}
        </div>
        {msg.sender === "user" && <FaUser className="text-gray-700 ml-2" />}
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl shadow-lg bg-gray-100">
      <h2 className="text-xl font-bold text-center mb-2">🔍 Phishing Detector Bot</h2>
      <div className="h-64 overflow-y-auto p-2 bg-white rounded-lg">
        {messages.map(renderMessage)}
        {loading && (
          <motion.div className="flex items-center my-2 justify-start">
            <FaRobot className="text-blue-500 mr-2" />
            <div className="px-3 py-2 rounded-lg bg-gray-300">
              <FaSpinner className="animate-spin inline mr-2" /> Checking...
            </div>
          </motion.div>
        )}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Paste a URL or email..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
