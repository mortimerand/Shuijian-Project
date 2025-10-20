import React, { useState } from "react";
import { TASK_CONFIG } from "./TaskConfig";

const TaskHeader = ({ onAddTask }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTaskType) {
      const success = onAddTask(selectedTaskType);
      if (success) {
        setSelectedTaskType("");
        setShowAddForm(false);
      }
    }
  };

  return (
    <>
      {/* 头部和添加任务表单 */}
      <div className="list-header">
        <h2 className="section-title">任务清单</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? "取消" : "添加任务"}
        </button>
      </div>

      {/* 添加任务表单 */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-group">
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              required
              className="form-control"
            >
              <option value="">请选择任务类型</option>
              {TASK_CONFIG.fixedTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            添加任务
          </button>
        </form>
      )}
    </>
  );
};

export default TaskHeader;