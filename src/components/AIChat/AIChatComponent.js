import React, { useState, useEffect, useRef } from "react";
import "./AIChatComponent.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function AIChatComponent() {
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
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 发送消息到后端API
  const sendMessageToAPI = async (userMessage) => {
    try {
      const response = await fetch('api/chat/nostream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      // 检查响应是否成功
      if (data.code === '200' && data.message === 'success') {
        return data.data; // 返回AI回复的内容
      } else {
        throw new Error(`API请求失败: ${data.message || '未知错误'}`);
      }
    } catch (err) {
      setError(`发送消息失败: ${err.message}`);
      return null;
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (!input.trim()) return;

    // 重置错误状态
    setError(null);

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

    // 调用后端API获取AI回复
    try {
      const aiResponse = await sendMessageToAPI(input.trim());
      
      if (aiResponse) {
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse, // 假设data直接包含markdown内容
          sender: "ai",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    } catch (err) {
      setError(`获取AI回复失败: ${err.message}`);
    } finally {
      setIsTyping(false);
    }
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
      {error && <div className="error-message">{error}</div>}
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.sender === 'ai' ? (
                // 对于AI回复，使用ReactMarkdown渲染markdown内容
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              ) : (
                <p>{message.text}</p>
              )}
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

export default AIChatComponent;
