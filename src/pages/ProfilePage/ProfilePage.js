import React from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  // 定义文件统计数据
  const fileStats = [
    { name: '施工图片总张数', count: 125 },
    { name: '竣工图片总张数', count: 86 },
    { name: '施工日志总条数', count: 32 },
    { name: '技术文件总条数', count: 18 },
    { name: '竣工文件总条数', count: 24 }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>个人信息</h1>
        <Link to="/" className="back-button" aria-label="返回主页">返回主页</Link>
      </div>
      <div className="page-content">
        <div className="profile-container">
          {/* 头像部分 */}
          <div className="avatar-section">
            <div className="avatar">
              <img src="https://via.placeholder.com/150" alt="用户头像" loading="lazy" />
            </div>
          </div>
          
          {/* 基本信息表格 */}
          <div className="profile-info">
            <h2>基本信息</h2>
            <div className="info-table">
              <div className="info-row">
                <div className="info-label">姓名</div>
                <div className="info-value">张三</div>
              </div>
              <div className="info-row">
                <div className="info-label">岗位</div>
                <div className="info-value">前端开发工程师</div>
              </div>
              <div className="info-row">
                <div className="info-label">联系方式</div>
                <div className="info-value">138****1234</div>
              </div>
            </div>
          </div>
          
          {/* 工作量统计 */}
          <div className="work-stats">
            <h2>工作量统计</h2>
            <div className="stats-table">
              {fileStats.map((item, index) => (
                <div key={index} className="stats-row">
                  <div className="stats-cell">{item.name}</div>
                  <div className="stats-cell stats-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;