import React from 'react';
import { Link } from 'react-router-dom';
import AIChat from '../../components/AIChat/AIChat.js';
import '../common.css';

function AIChatTest() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI问答测试</h1>
        <Link to="/" className="back-button">返回主页</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <AIChat />
        </div>
      </div>
    </div>
  );
}

export default AIChatTest;