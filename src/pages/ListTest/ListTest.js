import React from 'react';
import { Link } from 'react-router-dom';
import '../TestPage.css';

function ListTest() {
  // 模拟列表数据
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `列表项 ${i + 1}`,
    description: `这是列表项 ${i + 1} 的详细描述信息`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString()
  }));

  return (
    <div className="test-page">
      <div className="test-header">
        <h1>列表测试</h1>
        <Link to="/" className="back-button">返回主页</Link>
      </div>
      <div className="test-content">
        <div className="item-list">
          {items.map((item) => (
            <div key={item.id} className="list-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="item-date">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListTest;