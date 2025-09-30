import React from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
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
          
          {/* 工作量统计表格 */}
          <div className="work-stats">
            <h2>工作量统计</h2>
            <div className="stats-table">
              <div className="stats-header">
                <div className="stats-cell">项目名称</div>
                <div className="stats-cell">完成任务</div>
                <div className="stats-cell">完成率</div>
              </div>
              <div className="stats-row">
                <div className="stats-cell">项目A</div>
                <div className="stats-cell">15/20</div>
                <div className="stats-cell">75%</div>
              </div>
              <div className="stats-row">
                <div className="stats-cell">项目B</div>
                <div className="stats-cell">8/10</div>
                <div className="stats-cell">80%</div>
              </div>
              <div className="stats-row">
                <div className="stats-cell">项目C</div>
                <div className="stats-cell">12/12</div>
                <div className="stats-cell">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;