import React from "react";
import { getStatusClass } from "./TaskUtils";

const TaskListRenderer = ({ tasks, onDeleteTask, onOpenImageUploadModal, onToggleAdditionalTemplates }) => {
  return (
    <div className="tasks-list">
      {tasks.length === 0 ? (
        <div className="empty-tasks">
          <p>请点击"添加任务"按钮创建今日任务</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${getStatusClass(task.status)}`}
          >
            {/* 任务头部 */}
            <div className="task-header">
              <div className="task-info">
                <h3 className={`task-title ${getStatusClass(task.status)}`}>
                  {task.title}
                </h3>
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="delete-task-btn"
                title="删除任务"
              >
                删除
              </button>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-footer">
              <span className={`task-status ${getStatusClass(task.status)}`}>
                {task.status === "completed" ? "已完成" : "未完成"}
              </span>
            </div>
            {/* 任务操作按钮区域 */}
            <div className="task-actions">
              {/* 日常任务按钮 - 只在有templateImages时显示 */}
              {task.templateImages && task.templateImages.length > 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={() => onOpenImageUploadModal(task.id)}
                >
                  点击进入日常任务
                </button>
              )}

              {/* 验收任务按钮 - 单独判断，只在有additionalTemplateImages时显示 */}
              {task.additionalTemplateImages &&
                task.additionalTemplateImages.length > 0 && (
                  <button
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      onToggleAdditionalTemplates(task.id);
                    }}
                    style={
                      task.templateImages && task.templateImages.length > 0
                        ? { marginLeft: "10px" }
                        : {}
                    }
                  >
                    点击进入验收任务
                  </button>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskListRenderer;