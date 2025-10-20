import React from "react";
import "./TodayWorkContent.css";

function WorkContent({ normalTasks, unNormalTasks, noTaskMessage, loading, error }) {
  if (loading) {
    return (
      <div className="card card-loading">
        <div className="card-body text-center">
          <p className="loading-text">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card card-error">
        <div className="card-body text-danger text-center">
          <p>获取今日任务失败: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (normalTasks.length === 0 && unNormalTasks.length === 0) {
    return (
      <div className="card card-empty">
        <div className="card-body text-center">
          <div className="empty-icon">🎉</div>
          <p className="empty-text">
            {noTaskMessage || "暂无今日工作安排"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 渲染 normal 任务 */}
      {normalTasks.length > 0 && (
        <div className="tasks-container">
          {normalTasks.map((task, index) => (
            <div key={index} className="card task-card fade-in">
              <div className="card-header">
                <h2 className="task-name">{task.name}</h2>
              </div>
              <div className="card-body">
                <div className="subtasks-container">
                  {task.subTasks && task.subTasks.length > 0 ? (
                    task.subTasks
                      .sort((a, b) => a.order - b.order)
                      .map((subTask) => (
                        <div
                          key={subTask.order}
                          className="subtask-card slide-in"
                        >
                          <div className="subtask-header">
                            <h3>
                              <span className="subtask-order">
                                任务{subTask.order}
                              </span>
                              {subTask.title}
                            </h3>
                          </div>
                          <p className="subtask-description">
                            {subTask.description}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="no-subtasks">暂无工作步骤</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 渲染 unNormal 任务 - 使用不同的样式 */}
      {unNormalTasks.length > 0 && (
        <div className="tasks-container">
          {unNormalTasks.map((task, index) => (
            <div key={index} className="card task-card-un-normal fade-in">
              <div className="card-header">
                <h2 className="task-name-un-normal">
                  {task.name}
                  <span className="task-warning-tag">重要</span>
                </h2>
              </div>
              <div className="card-body">
                <div className="subtasks-container">
                  {task.subTasks && task.subTasks.length > 0 ? (
                    task.subTasks
                      .sort((a, b) => a.order - b.order)
                      .map((subTask) => (
                        <div
                          key={subTask.order}
                          className="subtask-card-un-normal slide-in"
                        >
                          <div className="subtask-header">
                            <h3>
                              <span className="subtask-order-un-normal">
                                任务{subTask.order}
                              </span>
                              {subTask.title}
                            </h3>
                          </div>
                          <p className="subtask-description">
                            {subTask.description}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="no-subtasks">暂无工作步骤</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default WorkContent;