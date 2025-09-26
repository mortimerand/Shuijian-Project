import React from 'react';
import { Link } from 'react-router-dom';
import AIChat from '../../components/AIChat/AIChat.js';
import '../TestPage.css';

function AIChatTest() {
  return (
    <div className="test-page">
      <div className="test-header">
        <h1>AI问答测试</h1>
        <Link to="/" className="back-button">返回主页</Link>
      </div>
      <div className="test-content">
        <AIChat />
      </div>
    </div>
  );
}

export default AIChatTest;