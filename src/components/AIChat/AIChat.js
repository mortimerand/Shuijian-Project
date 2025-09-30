import React, { useState, useEffect, useRef } from "react";
import "./AIChat.css";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "你好！我是AI助手。有什么我可以帮助你的吗？",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 模拟AI回复
  const generateAIResponse = (userMessage) => {
    // 简单的回复模板
    const responses = [
      `我理解了，你提到了"${userMessage}"。这是一个很有趣的话题。`,
      `关于"${userMessage}"，我可以为你提供更多信息。`,
      `感谢你的提问。"${userMessage}"确实值得探讨。`,
      `很高兴收到你的消息。对于"${userMessage}"，我的看法是...`,
      `你说得很有道理。"${userMessage}"是一个值得深入研究的问题。`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // 发送消息
  const handleSend = () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    // 模拟AI思考和回复
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: generateAIResponse(input.trim()),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-chat-container">

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message ai typing">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="请输入您的问题..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <button
          className="btn btn-primary send-button"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          发送
        </button>
      </div>
    </div>
  );
}

export default AIChat;
