import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '用户';
  
  // 定义4个测试页面的路由信息
  const Pages = [
    {
      id: 1,
      title: 'AI智能助手',
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
      title: '资料管理',
      description: '查看移动端列表展示效果',
      route: '/document-manage',
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
    // 为移动端添加确认提示
    if (window.confirm('确定要退出登录吗？')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>测试应用</h1>
          <p>欢迎，{username}！</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="btn btn-danger logout-button"
          // 添加触摸反馈相关属性
          aria-label="退出登录"
          tabIndex="0"
        >
          退出登录
        </button>
      </div>
      
      <div className="page-content">
        <div className="page-grid">
          {Pages.map((page) => (
            <Link 
              key={page.id} 
              to={page.route} 
              className="card page-card"
              // 添加无障碍属性
              aria-label={`进入${page.title}页面`}
            >
              <div className="card-icon">{page.icon}</div>
              <h2>{page.title}</h2>
              <p>{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;