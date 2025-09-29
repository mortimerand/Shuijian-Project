import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 静态账户信息
  const staticUser = {
    username: 'admin',
    password: 'password123'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证用户名和密码
    if (username === staticUser.username && password === staticUser.password) {
      // 保存登录状态到localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      
      // 登录成功后跳转到主页
      navigate('/');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>用户登录</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn btn-primary login-button">登录</button>
        </form>
        
        <div className="login-info">
          <p>账户：admin</p>
          <p>密码：password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;