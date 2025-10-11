import React from "react";
import { useNavigate } from "react-router-dom";
import "./DailyTasks.css";

function TodayTask() {
  const navigate = useNavigate();

  // 导航到施工日志页面
  const navigateToConstructionLog = () => {
    navigate("/daily-tasks/construction-log");
  };

  return (
        <div className="card" >
          <div className="today-tasks-content">
            <h2 className="section-title">今日工作安排</h2>

            {/* 待办事项摘要信息 */}
            <div className="today-summary">
              <div className="summary-card">
                <h3>📋 今日任务</h3>
                <p>查看和管理今日需要完成的工作任务</p>
                <button
                  onClick={() => navigate("/daily-tasks/task-list")}
                  className="btn btn-primary"
                >
                  查看任务清单
                </button>
              </div>

              <div className="summary-card">
                <h3>📝 施工日志</h3>
                <p>记录和查看今日的施工进展和情况</p>
                <button
                  onClick={navigateToConstructionLog}
                  className="btn btn-primary"
                >
                  进入施工日志
                </button>
              </div>

              <div className="summary-card">
                <h3>📊 项目进度</h3>
                <p>查看各项目的总体进度情况</p>
                <button
                  onClick={() => navigate("/daily-tasks/progress-summary")}
                  className="btn btn-secondary"
                >
                  查看总进度
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}

export default TodayTask;
