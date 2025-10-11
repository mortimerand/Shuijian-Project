import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyTasks.css";

function TodayWork() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState([]); // 修改为数组类型，以支持多个任务
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noTaskMessage, setNoTaskMessage] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoTaskMessage("");
        
        const response = await fetch("api/daily_task/info");
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 检查返回的状态码
        if (data.code === "200" && data.message === "true" && typeof data.data === 'object') {
          // 有任务时的数据处理
          // 如果data.data是数组，直接使用；如果是对象，转换为单元素数组
          const tasks = Array.isArray(data.data) ? data.data : [data.data];
          setTaskData(tasks);
        } else if (data.code === "400" && data.message === "false") {
          // 无任务时的数据处理
          setTaskData([]);
          setNoTaskMessage(typeof data.data === 'string' ? data.data : "当日任务已完成");
        } else {
          throw new Error(`数据格式不正确: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        setError(err.message);
        setTaskData([]);
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
    <div className="page-container">
      <div className="page-header">
        <h1>今日工作详情</h1>
        <button onClick={handleBackToMain} className="btn btn-secondary">返回主页</button>
      </div>
      
      <div className="page-content">
        {loading ? (
          <div className="card">
            <div className="card-body text-center">
              <p>加载中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card">
            <div className="card-body text-danger text-center">
              <p>获取数据失败: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                重试
              </button>
            </div>
          </div>
        ) : taskData.length > 0 ? (
          // 遍历显示多个任务
          <div className="tasks-container">
            {taskData.map((task, index) => (
              <div key={index} className="card task-card">
                <div className="card-header">
                  <h2>{task.name}</h2>
                </div>
                <div className="card-body">
                  <h3>工作步骤</h3>
                  <div className="subtasks-container">
                    {task.subTasks && task.subTasks.length > 0 ? (
                      task.subTasks
                        .sort((a, b) => a.order - b.order)
                        .map((subTask) => (
                          <div key={subTask.order} className="subtask-card">
                            <div className="subtask-header">
                              <span className="subtask-order">任务{subTask.order}</span>
                              <h4>{subTask.title}</h4>
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
        ) : (
          <div className="card">
            <div className="card-body text-center">
              <p>{noTaskMessage || "暂无今日工作安排"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodayWork;