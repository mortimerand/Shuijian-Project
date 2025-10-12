import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AIChatComponent from '../../components/AIChat/AIChatComponent.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../components/AIChat/AIChatComponent.css';

function AIChat() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI问答测试</h1>
        <Link to="/" className="back-button">返回主页</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <AIChatComponent />
        </div>
        
      </div>
    </div>
  );
}

export default AIChat;