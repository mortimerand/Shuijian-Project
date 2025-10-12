import React from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import TaskList from "./TaskList.js";
import ConstructionLog from "./ConstructionLog.js";
import ProgressSummary from "./ProgressSummary.js";
import TodayTask from "./TodayTask.js";
import TodayWork from "./TodayWork.js";
import "./DailyTasks.css";

function DailyTasks() {
  const navigate = useNavigate();
  const location = useLocation();

  // 子页面路由配置
  const subpages = [
    { id: 1, title: "今日任务", route: "today-work", icon: "📋" },
    { id: 2, title: "今日待办", route: "today-tasks", icon: "📝" },
    { id: 3, title: "总进度", route: "progress-summary", icon: "📊" },
  ];

  // 使用 useNavigate 进行导航，确保路径正确
  const handleSubpageNavigation = (route) => {
    navigate(`/daily-tasks/${route}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>每日待办</h1>
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          返回主页
        </button>
      </div>

      <div className="page-content">
        {/* 子页面导航 */}
        <div className="card">
          <div className="subpages-nav">
            {subpages.map((subpage) => (
              <button
                key={subpage.id}
                onClick={() => handleSubpageNavigation(subpage.route)}
                className={`btn btn-secondary ${
                  location.pathname.includes(subpage.route) ? "active" : ""
                }`}
              >
                <span className="nav-icon">{subpage.icon}</span>
                <span className="nav-text">{subpage.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 子页面内容 */}
        <div className="subpages-content">
          <Routes>
            {/* 默认路由到任务清单页面 */}
            <Route path="" element={<TodayTask />} />
            <Route path="task-list" element={<TaskList />} />
            <Route path="today-tasks" element={<TodayTask />} />
            <Route path="today-work" element={<TodayWork />} />
            <Route path="construction-log" element={<ConstructionLog />} />
            <Route path="progress-summary" element={<ProgressSummary />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DailyTasks;
