import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import TaskImageUploadModal from "./TaskImageUploadModal";
import TaskFilePreviewModal from "./TaskFilePreviewModal";
import TaskAdditionalTemplatesModal from "./TaskAdditionalTemplatesModal";
import {
  generateUUID,
  checkAllRequiredItemsUploaded,
  uploadFileToServer,
  getStatusClass,
} from "./TaskUtils";
import { TASK_CONFIG } from "./TaskConfig";
import "./TaskList.css";

const TaskListIndex = () => {
  // 模拟任务数据
  const [tasks, setTasks] = useState([]);

  // 其他状态
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasStagedFiles, setHasStagedFiles] = useState(false);
  const [showAdditionalTemplates, setShowAdditionalTemplates] = useState(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [currentTemplateFile, setCurrentTemplateFile] = useState(null);

  // 获取当前任务
  const getCurrentTask = useCallback(() => {
    if (!currentTaskId) return null;
    return tasks.find((task) => task.id === currentTaskId) || null;
  }, [tasks, currentTaskId]);

  // 自动检查任务状态
  useEffect(() => {
    const updateTaskStatuses = () => {
      setTasks((prevTasks) => {
        const [updatedTasks, hasChanges] = prevTasks.reduce(
          ([tasksAcc, changes], task) => {
            const allItemsUploaded = checkAllRequiredItemsUploaded(task);
            const newStatus = allItemsUploaded ? "completed" : "pending";
            if (task.status !== newStatus) {
              return [[...tasksAcc, { ...task, status: newStatus }], true];
            }
            return [[...tasksAcc, task], changes];
          },
          [[], false]
        );
        return hasChanges ? updatedTasks : prevTasks;
      });
    };

    // 只进行初始检查
    updateTaskStatuses();
  }, [checkAllRequiredItemsUploaded]);

  // 清理函数，防止内存泄漏
  useEffect(() => {
    return () => {
      // 清理所有blob URL
      tasks.forEach((task) => {
        task.templateImages.forEach((img) => {
          img.uploadedFiles.forEach((file) => {
            if (file.url && file.url.startsWith("blob:")) {
              URL.revokeObjectURL(file.url);
            }
          });
        });

        if (task.additionalTemplateImages) {
          task.additionalTemplateImages.forEach((img) => {
            img.uploadedFiles.forEach((file) => {
              if (file.url && file.url.startsWith("blob:")) {
                URL.revokeObjectURL(file.url);
              }
            });
          });
        }
      });
    };
  }, [tasks]);

  // 处理添加任务
  const handleAddTask = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedTaskType) {
        const selectedTask = TASK_CONFIG.fixedTasks.find(
          (task) => task.id === selectedTaskType
        );
        if (selectedTask) {
          const task = {
            id: generateUUID(),
            title: selectedTask.title,
            description: selectedTask.description,
            status: "pending",
            // 添加对templateImages的空值检查，如果不存在则提供默认空数组
            templateImages: selectedTask.templateImages
              ? selectedTask.templateImages.map((img) => ({
                  url: img.url,
                  desc: img.desc,
                  type: img.type,
                  uploadedFiles: [],
                }))
              : [],
            // 确保新任务包含额外模板信息
            additionalTemplateImages: selectedTask.additionalTemplates
              ? selectedTask.additionalTemplates.map((img) => ({
                  url: img.url,
                  desc: img.desc,
                  type: img.type,
                  uploadedFiles: [],
                }))
              : [],
          };
          setTasks((prevTasks) => [...prevTasks, task]);
          setSelectedTaskType("");
          setShowAddForm(false);
        }
      }
    },
    [selectedTaskType]
  );

  // 处理文件上传
  const handleFileUpload = useCallback(
    (
      taskId,
      imageIndex,
      files,
      isAdditional = false,
      fileIdToRemove = null
    ) => {
      try {
        // 找到当前任务
        const currentTask = tasks.find((task) => task.id === taskId);
        if (!currentTask) return;

        // 获取对应的模板图片
        const targetImages = isAdditional
          ? currentTask.additionalTemplateImages
          : currentTask.templateImages;

        if (!targetImages || !targetImages[imageIndex]) return;

        // 更新前端状态
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              let updatedTask;

              if (isAdditional) {
                const updatedAdditionalTemplates = [
                  ...task.additionalTemplateImages,
                ];

                if (fileIdToRemove) {
                  // 删除文件
                  const fileToRemove = updatedAdditionalTemplates[
                    imageIndex
                  ].uploadedFiles.find((file) => file.id === fileIdToRemove);
                  if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
                    URL.revokeObjectURL(fileToRemove.url);
                  }
                  updatedAdditionalTemplates[imageIndex].uploadedFiles =
                    updatedAdditionalTemplates[imageIndex].uploadedFiles.filter(
                      (file) => file.id !== fileIdToRemove
                    );
                } else if (files.length > 0) {
                  // 添加新文件
                  const newFiles = files.map((file) => ({
                    id: generateUUID(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    status: "staged", // 标记为暂存状态
                    fileData: file, // 保存文件对象用于后续提交
                  }));
                  updatedAdditionalTemplates[imageIndex].uploadedFiles = [
                    ...(updatedAdditionalTemplates[imageIndex].uploadedFiles ||
                      []),
                    ...newFiles,
                  ];
                }

                updatedTask = {
                  ...task,
                  additionalTemplateImages: updatedAdditionalTemplates,
                };
              } else {
                const updatedTemplateImages = [...task.templateImages];

                if (fileIdToRemove) {
                  // 删除文件
                  const fileToRemove = updatedTemplateImages[
                    imageIndex
                  ].uploadedFiles.find((file) => file.id === fileIdToRemove);
                  if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
                    URL.revokeObjectURL(fileToRemove.url);
                  }
                  updatedTemplateImages[imageIndex].uploadedFiles =
                    updatedTemplateImages[imageIndex].uploadedFiles.filter(
                      (file) => file.id !== fileIdToRemove
                    );
                } else if (files.length > 0) {
                  // 添加新文件
                  const newFiles = files.map((file) => ({
                    id: generateUUID(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    status: "staged", // 标记为暂存状态
                    fileData: file, // 保存文件对象用于后续提交
                  }));
                  updatedTemplateImages[imageIndex].uploadedFiles = [
                    ...(updatedTemplateImages[imageIndex].uploadedFiles || []),
                    ...newFiles,
                  ];
                }

                updatedTask = {
                  ...task,
                  templateImages: updatedTemplateImages,
                };
              }

              return updatedTask;
            }
            return task;
          })
        );

        // 设置有暂存文件的标记
        setHasStagedFiles(true);
        if (files.length > 0) {
          message.success('文件已暂存，点击"提交所有文件"按钮上传到服务器');
        }
      } catch (error) {
        console.error("处理文件上传时出错:", error);
        message.error("文件暂存失败");
      }
    },
    [tasks]
  );

  // 实现单任务提交功能
  const submitTaskFiles = useCallback(
    async (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // 收集该任务的所有暂存文件
      const taskData = {
        taskId: task.id,
        taskType: "",
        images: [],
        imagesSubtasks: [],
        docs: [],
        docsSubtasks: [],
        fileMap: new Map(),
      };

      // 获取任务类型编码
      let taskTypeCode = "";
      for (const [key, value] of Object.entries(TASK_CONFIG.taskTypeMapping)) {
        const taskType = TASK_CONFIG.fixedTasks.find((t) => t.id === key);
        if (taskType && taskType.title === task.title) {
          taskTypeCode = value;
          break;
        }
      }

      if (!taskTypeCode) {
        message.error("无法获取任务类型编码");
        return;
      }

      taskData.taskType = taskTypeCode;

      // 检查是否有暂存文件
      const hasStagedFiles =
        task.templateImages?.some((img) =>
          img.uploadedFiles?.some((f) => f.status === "staged")
        ) ||
        task.additionalTemplateImages?.some((img) =>
          img.uploadedFiles?.some((f) => f.status === "staged")
        );

      if (!hasStagedFiles) {
        message.info("该任务没有暂存的文件需要提交");
        return;
      }

      // 处理主模板文件
      if (task.templateImages) {
        task.templateImages.forEach((img, imageIndex) => {
          if (img.uploadedFiles) {
            img.uploadedFiles.forEach((file) => {
              if (file.status === "staged") {
                const taskNeedDataCode =
                  TASK_CONFIG.taskDataMapping[taskTypeCode]?.[img.desc] || "";

                if (taskNeedDataCode) {
                  // 根据文件类型区分images和docs
                  if (file.type.startsWith("image/")) {
                    taskData.images.push(file.fileData);
                    taskData.imagesSubtasks.push(taskNeedDataCode);
                  } else {
                    taskData.docs.push(file.fileData);
                    taskData.docsSubtasks.push(taskNeedDataCode);
                  }

                  // 存储文件信息用于状态更新
                  taskData.fileMap.set(file.id, {
                    file,
                    imageIndex,
                    isAdditional: false,
                    taskTitle: task.title,
                    imageDesc: img.desc,
                  });
                }
              }
            });
          }
        });
      }

      // 处理额外模板文件
      if (task.additionalTemplateImages) {
        task.additionalTemplateImages.forEach((img, imageIndex) => {
          if (img.uploadedFiles) {
            img.uploadedFiles.forEach((file) => {
              if (file.status === "staged") {
                const taskNeedDataCode =
                  TASK_CONFIG.taskDataMapping[taskTypeCode]?.[img.desc] || "";

                if (taskNeedDataCode) {
                  // 根据文件类型区分images和docs
                  if (file.type.startsWith("image/")) {
                    taskData.images.push(file.fileData);
                    taskData.imagesSubtasks.push(taskNeedDataCode);
                  } else {
                    taskData.docs.push(file.fileData);
                    taskData.docsSubtasks.push(taskNeedDataCode);
                  }

                  // 存储文件信息用于状态更新
                  taskData.fileMap.set(file.id, {
                    file,
                    imageIndex,
                    isAdditional: true,
                    taskTitle: task.title,
                    imageDesc: img.desc,
                  });
                }
              }
            });
          }
        });
      }

      // 更新所有文件状态为上传中
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const taskIndex = newTasks.findIndex((t) => t.id === taskId);

        if (taskIndex !== -1) {
          const updatedTask = { ...newTasks[taskIndex] };

          // 更新主模板文件状态
          if (updatedTask.templateImages) {
            updatedTask.templateImages.forEach((img) => {
              if (img.uploadedFiles) {
                img.uploadedFiles.forEach((file) => {
                  if (taskData.fileMap.has(file.id)) {
                    file.status = "uploading";
                  }
                });
              }
            });
          }

          // 更新额外模板文件状态
          if (updatedTask.additionalTemplateImages) {
            updatedTask.additionalTemplateImages.forEach((img) => {
              if (img.uploadedFiles) {
                img.uploadedFiles.forEach((file) => {
                  if (taskData.fileMap.has(file.id)) {
                    file.status = "uploading";
                  }
                });
              }
            });
          }

          newTasks[taskIndex] = updatedTask;
        }

        return newTasks;
      });

      // 移除不需要提交的字段
      const { taskId: id, fileMap, ...submitData } = taskData;
      const result = await uploadFileToServer(submitData);

      // 更新文件状态
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const taskIndex = newTasks.findIndex((t) => t.id === taskId);

        if (taskIndex !== -1) {
          const task = newTasks[taskIndex];

          // 更新每个文件的状态
          fileMap.forEach(({ file, imageIndex, isAdditional }) => {
            let targetImages;

            if (isAdditional && task.additionalTemplateImages) {
              targetImages = task.additionalTemplateImages;
            } else {
              targetImages = task.templateImages;
            }

            if (
              targetImages &&
              targetImages[imageIndex] &&
              targetImages[imageIndex].uploadedFiles
            ) {
              const fileInTask = targetImages[imageIndex].uploadedFiles.find(
                (f) => f.id === file.id
              );
              if (fileInTask) {
                fileInTask.status = result.success ? "done" : "error";
              }
            }
          });

          // 只有在文件上传成功时才检查并更新任务状态
          if (result.success) {
            const allRequiredItemsUploaded =
              checkAllRequiredItemsUploaded(task);
            newTasks[taskIndex].status = allRequiredItemsUploaded
              ? "completed"
              : "pending";
          }
        }

        return newTasks;
      });

      // 重置暂存标记
      setHasStagedFiles(false);

      // 显示上传结果
      if (result.success) {
        message.success(`${task.title} 的文件上传成功`);
      } else {
        message.error(`${task.title} 的文件上传失败: ${result.error}`);
      }
    },
    [tasks]
  );

  // 实现通用的额外模板处理函数
  const toggleAdditionalTemplates = useCallback((taskId) => {
    setShowAdditionalTemplates((prev) => (prev === taskId ? null : taskId));
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const openImageUploadModal = useCallback((taskId) => {
    setCurrentTaskId(taskId);
    setShowImageUploadModal(true);
  }, []);

  const closeImageUploadModal = useCallback(() => {
    setShowImageUploadModal(false);
    setCurrentTaskId(null);
  }, []);

  return (
    <div className="task-list-container">
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
        <form onSubmit={handleAddTask} className="add-task-form">
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

      {/* 任务列表 */}
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
                  onClick={() => deleteTask(task.id)}
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
                    onClick={() => openImageUploadModal(task.id)}
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
                        toggleAdditionalTemplates(task.id);
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

      {/* 统计信息 */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">今日任务安排</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {tasks.filter((t) => t.status === "completed").length}
          </span>
          <span className="stat-label">已完成</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {tasks.filter((t) => t.status === "pending").length}
          </span>
          <span className="stat-label">未完成</span>
        </div>
      </div>

      {/* 模板图片与上传弹窗 */}
      <TaskImageUploadModal
        visible={showImageUploadModal}
        task={getCurrentTask()}
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
