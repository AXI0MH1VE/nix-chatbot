import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function App() {
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

  // Create new conversation on mount
  useEffect(() => {
    const createConversation = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/conversations`);
        setConversationId(res.data.conversationId);
      } catch (error) {
        console.error("Failed to create conversation:", error);
      }
    };
    createConversation();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !conversationId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        conversationId,
        message: input,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.message,
        timestamp: res.data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error: Failed to get response. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>NIX Chatbot</h1>
        <p>ChatGPT/Grok feature parity with NIX persona</p>
      </header>

      <main className="chat-area">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>Welcome to NIX Chatbot</h2>
              <p>Start a conversation. Confident, witty, assertive responses. No ego.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`message message-${msg.role}`}>
              <div className="message-content">
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message message-assistant">
              <div className="message-content">
                <span className="loading-indicator">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="input-area">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
