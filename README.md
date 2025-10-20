


          
# 📊 智能工作管理平台

<div align="center">
  <img src="https://via.placeholder.com/200" alt="项目Logo" />
  <p align="center">
    <strong>集成AI助手、任务管理、资料管理的一站式工作平台</strong>
  </p>
</div>

## 📑 目录

- [项目简介](#-项目简介)
- [主要功能](#-主要功能)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
  - [前提条件](#前提条件)
  - [安装依赖](#安装依赖)
  - [运行开发服务器](#运行开发服务器)
  - [构建生产版本](#构建生产版本)
- [项目结构](#-项目结构)
- [路由说明](#-路由说明)
- [开发指南](#-开发指南)
  - [登录账户](#登录账户)
  - [组件开发规范](#组件开发规范)
  - [样式规范](#样式规范)
- [部署说明](#-部署说明)
  - [静态部署](#静态部署)
  - [Nginx配置示例](#nginx配置示例)
  - [特别说明](#特别说明)
- [注意事项](#⚠️-注意事项)
- [License](#-license)
- [Contact](#-contact)

## 🌟 项目简介

这是一个基于React开发的智能工作管理平台，集成了AI助手、任务管理、资料管理等功能模块，旨在提供高效便捷的工作流程管理解决方案。

## 🚀 主要功能

<div class="feature-list">
  <div class="feature-item">
    <h3>🤖 AI智能助手</h3>
    <p>提供智能问答和对话交互功能，帮助用户快速获取所需信息</p>
  </div>
  <div class="feature-item">
    <h3>📝 每日待办</h3>
    <p>管理今日任务、待办事项和进度跟踪，提高工作效率</p>
  </div>
  <div class="feature-item">
    <h3>📋 资料管理</h3>
    <p>便捷的文档和资料浏览功能，方便用户查找和管理工作资料</p>
  </div>
  <div class="feature-item">
    <h3>🔒 用户认证</h3>
    <p>简单的登录系统和权限控制，确保数据安全</p>
  </div>
  <div class="feature-item">
    <h3>👤 个人中心</h3>
    <p>用户个人信息管理，提供个性化设置</p>
  </div>
</div>

## 🛠️ 技术栈

| 技术类别 | 技术名称 | 版本 | 用途 |
|---------|---------|------|------|
| 前端框架 | React | 18.2.0 | 构建用户界面 |
| 路由管理 | React Router DOM | 7.9.1 | 页面路由管理 |
| UI组件库 | Ant Design | 5.27.4 | 快速构建美观界面 |
| HTTP请求 | Axios | 1.12.2 | 与后端API通信 |
| 图表展示 | echarts-for-react | 3.0.2 | 数据可视化展示 |
| Markdown渲染 | react-markdown | 10.1.0 | 渲染Markdown内容 |
| 构建工具 | Create React App | - | 项目脚手架和构建 |

## 💡 快速开始

### 前提条件

- Node.js (推荐 v16 或更高版本)
- npm 或 yarn 包管理器

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
npm install -g yarn  # 如未安装yarn
```

### 运行开发服务器

```bash
npm start
```

打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看应用。

开发模式下，页面会在代码修改后自动刷新，便于开发调试。

### 构建生产版本

```bash
npm run build
```

此命令将应用构建到 `build` 文件夹中，优化了生产环境的构建，包括代码压缩和哈希文件名生成，使应用更加轻量、加载更快。

## 📁 项目结构

```
src/
├── App.js                 # 应用入口和路由配置
├── components/            # 通用组件
│   ├── AIChat/            # AI聊天相关组件
│   ├── ConstructionLog/   # 施工日志组件
│   ├── ContentRender/     # 内容渲染组件
│   ├── DocumentManage/    # 文档管理组件
│   ├── ProtectedRoute/    # 路由保护组件
│   └── TaskList/          # 任务列表相关组件
├── pages/                 # 页面组件
│   ├── AIChat/            # AI聊天页面
│   ├── DailyTasks/        # 每日任务页面
│   ├── DocumentManage/    # 文档管理页面
│   ├── Login/             # 登录页面
│   ├── MainPage/          # 主页
│   └── ProfilePage/       # 个人中心页面
└── index.js               # React 渲染入口
```

## 🗺️ 路由说明

项目使用HashRouter进行路由管理，避免在服务器部署时出现刷新页面404的问题。主要路由包括：

| 路由路径 | 页面名称 | 描述 | 权限要求 |
|---------|---------|------|---------|
| `/login` | 登录页面 | 用户登录入口 | 无 |
| `/` | 主页 | 应用首页，包含功能导航 | 需登录 |
| `/ai-chat` | AI智能助手 | 与AI进行对话交互 | 需登录 |
| `/daily-tasks/*` | 每日待办 | 任务管理和进度跟踪 | 需登录 |
| `/document-manage` | 资料管理 | 文档和资料浏览 | 需登录 |
| `/profile` | 个人中心 | 用户信息管理 | 需登录 |

## 👨‍💻 开发指南

### 登录账户

系统使用静态账户信息进行登录验证：
- **用户名**：admin
- **密码**：password123

### 组件开发规范

1. 组件命名采用大驼峰命名法
2. 组件文件应包含相应的样式文件
3. 业务组件应放在 `pages` 目录下
4. 通用组件应放在 `components` 目录下

### 样式规范

- 使用CSS类选择器进行样式定义
- 页面级样式应与页面组件放在同一目录下
- 组件级样式应与组件放在同一目录下

## 🚢 部署说明

### 静态部署

由于项目使用了HashRouter，您可以直接将构建后的静态文件部署到任何Web服务器上，包括：

- ✅ Nginx
- ✅ Apache
- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/build/folder;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 特别说明

项目已配置了`_redirects`文件，确保在各种静态托管服务上能够正确处理路由。

## ⚠️ 注意事项

1. 本项目使用localStorage存储登录状态，请确保浏览器支持此功能
2. 在开发环境中，页面会在代码修改后自动刷新
3. 如需要禁用ESLint检查，可以通过.env文件中的配置实现
4. 项目支持响应式设计，可在不同设备上正常显示

## 📜 License

MIT

## 📧 Contact

如有问题或建议，请联系项目负责人。

---
        