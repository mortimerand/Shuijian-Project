import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '用户';
  
  // 定义4个测试页面的路由信息
  const testPages = [
    {
      id: 1,
      title: 'AI问答测试',
      description: '与AI助手进行对话交互',
      route: '/ai-chat',
      icon: '💬'
    },
    {
      id: 2,
      title: '每日待办',
      description: '管理任务清单、施工日志和总进度',
      route: '/daily-tasks',
      icon: '📝'
    },
    {
      id: 3,
      title: '列表测试',
      description: '查看移动端列表展示效果',
      route: '/list-test',
      icon: '📋'
    },
    {
      id: 4,
      title: '个人信息',
      description: '查看和编辑个人信息',
      route: '/profile',
      icon: '👤'
    }
  ];

  // 登出功能
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="main-page">
      <div className="header">
        <div>
          <h1>测试应用</h1>
          <p>欢迎，{username}！选择以下测试页面开始</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          退出登录
        </button>
      </div>
      
      <div className="page-grid">
        {testPages.map((page) => (
          <Link key={page.id} to={page.route} className="page-card">
            <div className="card-icon">{page.icon}</div>
            <h2>{page.title}</h2>
            <p>{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPage;