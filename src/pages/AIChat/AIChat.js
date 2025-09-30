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
  
  useEffect(() => {
    // 使用正确的路径访问 public 目录下的文件
    const markdownPath = '/resource/返回结果.md';
    
    setLoading(true);
    
    // 创建一个新的 XMLHttpRequest 来避免 React Router 拦截
    const xhr = new XMLHttpRequest();
    xhr.open('GET', markdownPath, true);
    xhr.responseType = 'text';
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        setMarkdownContent(xhr.responseText);
        setError(null);
      } else {
        setError(`无法加载文档内容，错误码: ${xhr.status}`);
        setMarkdownContent('');
      }
      setLoading(false);
    };
    
    xhr.onerror = function() {
      setError('网络错误，无法加载文档内容');
      setMarkdownContent('');
      setLoading(false);
    };
    
    xhr.send();
  }, []);

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
        
        {/* 添加新的容器渲染markdown文件 */}
        {/* <div className="card mt-4">
          <div className="card-header">
            <h3>地基沉降处理指南</h3>
          </div>
          <div className="card-body">
            {loading && <div>加载中...</div>}
            {error && <div className="text-danger">{error}</div>}
            {!loading && !error && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default AIChat;