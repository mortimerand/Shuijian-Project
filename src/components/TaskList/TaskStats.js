import React from "react";

const TaskStats = ({ tasks }) => {
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="task-stats">
      <div className="stat-item">
        <span className="stat-number">{tasks.length}</span>
        <span className="stat-label">今日任务安排</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{completedTasks}</span>
        <span className="stat-label">已完成</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{pendingTasks}</span>
        <span className="stat-label">未完成</span>
      </div>
    </div>
  );
};

export default TaskStats;