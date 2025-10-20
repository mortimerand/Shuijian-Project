import React, { useState } from "react";
import TaskImageUploadModal from "./TaskImageUploadModal";
import TaskFilePreviewModal from "./TaskFilePreviewModal";
import TaskAdditionalTemplatesModal from "./TaskAdditionalTemplatesModal";
import TaskHeader from "./TaskHeader";
import TaskListRenderer from "./TaskListRenderer";
import TaskStats from "./TaskStats";
import { useTaskManager } from "./TaskManager";
import { useFileUploadManager } from "./FileUploadManager";
import "./TaskList.css";

const TaskListIndex = () => {
  // 使用自定义Hook管理任务
  const { 
    tasks, 
    getCurrentTask, 
    handleAddTask, 
    deleteTask, 
    updateTaskFiles 
  } = useTaskManager();

  // 使用自定义Hook管理文件上传
  const { hasStagedFiles, handleFileUpload, submitTaskFiles } = 
    useFileUploadManager(tasks, updateTaskFiles);

  // 其他UI相关状态
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [showAdditionalTemplates, setShowAdditionalTemplates] = useState(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [currentTemplateFile, setCurrentTemplateFile] = useState(null);

  const openImageUploadModal = (taskId) => {
    setCurrentTaskId(taskId);
    setShowImageUploadModal(true);
  };

  const closeImageUploadModal = () => {
    setShowImageUploadModal(false);
    setCurrentTaskId(null);
  };

  const toggleAdditionalTemplates = (taskId) => {
    setShowAdditionalTemplates((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <div className="task-list-container">
      {/* 任务头部和添加表单 */}
      <TaskHeader onAddTask={handleAddTask} />

      {/* 任务列表 */}
      <TaskListRenderer 
        tasks={tasks} 
        onDeleteTask={deleteTask} 
        onOpenImageUploadModal={openImageUploadModal} 
        onToggleAdditionalTemplates={toggleAdditionalTemplates}
      />

      {/* 统计信息 */}
      <TaskStats tasks={tasks} />

      {/* 模板图片与上传弹窗 */}
      <TaskImageUploadModal
        visible={showImageUploadModal}
        task={getCurrentTask(currentTaskId)}
        onClose={closeImageUploadModal}
        onFileUpload={handleFileUpload}
        onSubmit={submitTaskFiles}
      />

      {/* 额外模板弹窗 */}
      <TaskAdditionalTemplatesModal
        visible={!!showAdditionalTemplates}
        task={tasks.find((t) => t.id === showAdditionalTemplates)}
        onClose={() => setShowAdditionalTemplates(null)}
        onFileUpload={handleFileUpload}
        onSubmit={submitTaskFiles}
      />

      {/* 文件预览弹窗 */}
      <TaskFilePreviewModal
        visible={showFilePreviewModal}
        template={currentTemplateFile}
        onClose={() => {
          setShowFilePreviewModal(false);
          setCurrentTemplateFile(null);
        }}
      />
    </div>
  );
};

export default TaskListIndex;