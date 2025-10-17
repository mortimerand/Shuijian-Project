import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkContent from "../../components/ContentRender/WorkContent";
import "./DailyTasks.css";

function TodayWork() {
  const navigate = useNavigate();
  // 分别存储 normal 和 unNormal 任务
  const [normalTasks, setNormalTasks] = useState([]);
  const [unNormalTasks, setunNormalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noTaskMessage, setNoTaskMessage] = useState("");
  // 添加date状态来存储日期字段
  const [date, setDate] = useState("");

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
          // 从新的数据结构中提取date字段
          if (data.data.date) {
            setDate(data.data.date);
          }
          
          // 从taskInfo对象中提取任务数据
          const taskInfo = data.data.taskInfo || {};
          // 确保 normal 和 unNormal 始终是数组格式
          const normals = taskInfo.normal || [];
          const unNormals = taskInfo.unNormal || [];

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
        {/* 添加日期显示容器 */}
        {date && (
          <div className="time-picker">
            <div className="date-display">
              <span className="date-label">日期：</span>
              <span className="date-value">{date}</span>
            </div>
          </div>
        )}
        
        <WorkContent
          normalTasks={normalTasks}
          unNormalTasks={unNormalTasks}
          noTaskMessage={noTaskMessage}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default TodayWork;