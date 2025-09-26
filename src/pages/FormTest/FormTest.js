import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../TestPage.css';

function FormTest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('表单提交成功！\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="test-page">
      <div className="test-header">
        <h1>表单测试</h1>
        <Link to="/" className="back-button">返回主页</Link>
      </div>
      <div className="test-content">
        <form onSubmit={handleSubmit} className="mobile-form">
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="请输入您的姓名"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">留言</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="请输入您的留言"
              rows="4"
              required
            />
          </div>
          
          <button type="submit" className="submit-button">提交表单</button>
        </form>
      </div>
    </div>
  );
}

export default FormTest;