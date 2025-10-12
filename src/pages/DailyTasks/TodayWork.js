import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyTasks.css";
import "./TodayWork.css"

function TodayWork() {
  const navigate = useNavigate();
  // 分别存储 normal 和 unNormal 任务
  const [normalTasks, setNormalTasks] = useState([]);
  const [unNormalTasks, setunNormalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noTaskMessage, setNoTaskMessage] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoTaskMessage("");

        const response = await fetch("/api/daily_task/info");
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }

        const data = await response.json();
        // 检查返回的状态码
        if (data.code === "200" && data.data) {
          // 有任务时的数据处理
          // 确保 normal 和 unNormal 始终是数组格式
          const normals = data.data.normal || [];
          const unNormals = data.data.unNormal || [];
          
          // 处理单个对象的情况
          setNormalTasks(Array.isArray(normals) ? normals : [normals]);
          setunNormalTasks(Array.isArray(unNormals) ? unNormals : [unNormals]);
        } else if (data.code === "400" && data.message === "false") {
          // 无任务时的数据处理
          setNormalTasks([]);
          setunNormalTasks([]);
          setNoTaskMessage(
            typeof data.data === "string" ? data.data : "当日任务已完成"
          );
        } else {
          throw new Error(`数据格式不正确: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        setError(err.message);
        setNormalTasks([]);
        setunNormalTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  const handleBackToMain = () => {
    navigate("/");
  };

  return (
    <div className="page-todaywork">
      <div className="page-content">
        {loading ? (
          <div className="card card-loading">
            <div className="card-body text-center">
              <p className="loading-text">加载中...</p>
            </div>
          </div>
        ) : error ? (
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
        ) : (normalTasks.length > 0 || unNormalTasks.length > 0) ? (
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
                  <div key={index} className="card task-card-no-normal fade-in">
                    <div className="card-header">
                      <h2 className="task-name-no-normal">{task.name}</h2>
                    </div>
                    <div className="card-body">
                      <div className="subtasks-container">
                        {task.subTasks && task.subTasks.length > 0 ? (
                          task.subTasks
                            .sort((a, b) => a.order - b.order)
                            .map((subTask) => (
                              <div
                                key={subTask.order}
                                className="subtask-card-no-normal slide-in"
                              >
                                <div className="subtask-header">
                                  <h3>
                                    <span className="subtask-order-no-normal">
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
        ) : (
          <div className="card card-empty">
            <div className="card-body text-center">
              <div className="empty-icon">🎉</div>
              <p className="empty-text">
                {noTaskMessage || "暂无今日工作安排"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodayWork;