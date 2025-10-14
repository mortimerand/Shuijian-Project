import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  // 使用state管理统计数据
  const [fileStats, setFileStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 获取统计数据的函数
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        // 调用API接口
        const response = await fetch('/api/daily_task/statistics');
        const data = await response.json();
        
        // 检查响应状态
        if (data.code === '200') {
          // 映射后端数据到前端需要的格式
          const statsData = [
            { name: '施工图片总张数', count: data.data.dailyTaskImages },
            { name: '竣工图片总张数', count: data.data.checkTaskImages },
            { name: '施工日志总条数', count: data.data.dailyTaskLog },
            { name: '技术文件总条数', count: data.data.dailyTaskDocs },
            { name: '竣工文件总条数', count: data.data.checkTaskDocs }
          ];
          setFileStats(statsData);
        } else {
          throw new Error(data.message || '获取数据失败');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 调用函数
    fetchStatistics();
  }, []);

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
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="用户头像" loading="lazy" />
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
                <div className="info-value">项目管理人员</div>
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
              {loading && <div className="loading">加载中...</div>}
              {error && <div className="error">{error}</div>}
              {!loading && !error && fileStats.map((item, index) => (
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