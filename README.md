智能工作管理平台
项目简介
这是一个基于 React 开发的智能工作管理平台，集成了 AI 助手、任务管理、资料管理等功能模块，旨在提供高效便捷的工作流程管理解决方案。

主要功能
AI 智能助手：提供智能问答和对话交互功能
每日待办：管理今日任务、待办事项和进度跟踪
资料管理：便捷的文档和资料浏览功能
用户认证：简单的登录系统和权限控制
个人中心：用户个人信息管理
技术栈
前端框架：React 18.2.0
路由管理：React Router DOM 7.9.1
UI 组件库：Ant Design 5.27.4
HTTP 请求：Axios 1.12.2
图表展示：echarts-for-react 3.0.2
Markdown 渲染：react-markdown 10.1.0
构建工具：Create React App
快速开始
前提条件
Node.js (推荐 v16 或更高版本)
npm 或 yarn 包管理器
安装依赖

bash

# 使用 npm

npm install

# 或使用 yarn

npm install -g yarn
运行开发服务器

bash
npm start
打开 http://localhost:3000 在浏览器中查看应用。

构建生产版本

bash
npm run build
此命令将应用构建到 build 文件夹中，优化了生产环境的构建，包括代码压缩和哈希文件名生成。

项目结构

plainText
src/
├── App.js # 应用入口和路由配置
├── components/ # 通用组件
│ ├── AIChat/ # AI 聊天相关组件
│ ├── ConstructionLog/ # 施工日志组件
│ ├── ContentRender/ # 内容渲染组件
│ ├── DocumentManage/ # 文档管理组件
│ ├── ProtectedRoute/ # 路由保护组件
│ └── TaskList/ # 任务列表相关组件
├── pages/ # 页面组件
│ ├── AIChat/ # AI 聊天页面
│ ├── DailyTasks/ # 每日任务页面
│ ├── DocumentManage/ # 文档管理页面
│ ├── Login/ # 登录页面
│ ├── MainPage/ # 主页
│ └── ProfilePage/ # 个人中心页面
└── index.js # React 渲染入口
路由说明
项目使用 HashRouter 进行路由管理，避免在服务器部署时出现刷新页面 404 的问题。主要路由包括：

/login - 登录页面
/ - 主页（需要登录）
/ai-chat - AI 智能助手页面（需要登录）
/daily-tasks/\* - 每日待办页面（需要登录）
/document-manage - 资料管理页面（需要登录）
/profile - 个人中心页面（需要登录）
开发指南
登录账户
系统使用静态账户信息进行登录验证：

用户名：admin
密码：password123
组件开发规范
组件命名采用大驼峰命名法
组件文件应包含相应的样式文件
业务组件应放在 pages 目录下
通用组件应放在 components 目录下
样式规范
使用 CSS 类选择器进行样式定义
页面级样式应与页面组件放在同一目录下
组件级样式应与组件放在同一目录下
部署说明
静态部署
由于项目使用了 HashRouter，您可以直接将构建后的静态文件部署到任何 Web 服务器上，包括：

Nginx
Apache
GitHub Pages
Netlify
Vercel
Nginx 配置示例

nginx
Apply
server {
listen 80;
server_name your-domain.com;
root /path/to/your/build/folder;
index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

}
特别说明
项目已配置了\_redirects 文件，确保在各种静态托管服务上能够正确处理路由。

注意事项
本项目使用 localStorage 存储登录状态，请确保浏览器支持此功能
在开发环境中，页面会在代码修改后自动刷新
如需要禁用 ESLint 检查，可以通过.env 文件中的配置实现

License
MIT

Contact
如有问题或建议，请联系项目负责人。
