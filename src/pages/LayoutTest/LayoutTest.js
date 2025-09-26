import React from 'react';
import { Link } from 'react-router-dom';
import '../TestPage.css';

function LayoutTest() {
  return (
    <div className="test-page">
      <div className="test-header">
        <h1>布局测试</h1>
        <Link to="/" className="back-button">返回主页</Link>
      </div>
      <div className="test-content">
        <div className="layout-demo">
          <h2>栅格布局</h2>
          <div className="grid-layout">
            <div className="grid-item">1/3</div>
            <div className="grid-item">1/3</div>
            <div className="grid-item">1/3</div>
            <div className="grid-item">1/2</div>
            <div className="grid-item">1/2</div>
          </div>
          
          <h2>卡片布局</h2>
          <div className="card-layout">
            <div className="demo-card">
              <h3>卡片1</h3>
              <p>这是一个示例卡片</p>
            </div>
            <div className="demo-card">
              <h3>卡片2</h3>
              <p>这是另一个示例卡片</p>
            </div>
          </div>
          
          <h2>Flex布局</h2>
          <div className="flex-layout">
            <div className="flex-item">左侧</div>
            <div className="flex-item">中间</div>
            <div className="flex-item">右侧</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutTest;