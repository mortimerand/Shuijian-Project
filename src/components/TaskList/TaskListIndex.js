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
  // 从localStorage加载任务数据，如果没有则使用空数组
  const loadTasksFromStorage = () => {
    try {
      const savedTasks = localStorage.getItem("construction-tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // 检查是否是有效的数组并且包含任务数据
        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.error("从localStorage加载任务数据失败:", error);
    }
    return [];
  };

  const [tasks, setTasks] = useState(loadTasksFromStorage);

  // 其他状态
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasStagedFiles, setHasStagedFiles] = useState(false);
  const [showAdditionalTemplates, setShowAdditionalTemplates] = useState(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [currentTemplateFile, setCurrentTemplateFile] = useState(null);
  //const [selectedTaskSuffix, setSelectedTaskSuffix] = useState(""); //后缀选择

  // 获取当前任务
  const getCurrentTask = useCallback(() => {
    if (!currentTaskId) return null;
    return tasks.find((task) => task.id === currentTaskId) || null;
  }, [tasks, currentTaskId]);

  // 默认添加施工日志任务
  useEffect(() => {
    // 只有在没有从localStorage加载到任务时才添加默认任务
    if (tasks.length === 0) {
      // 查找'施工日志'任务配置
      const constructionLogTask = TASK_CONFIG.fixedTasks.find(
        (task) => task.id === "construction-log"
      );

      if (constructionLogTask) {
        // 创建默认任务对象
        const defaultTask = {
          id: generateUUID(),
          title: constructionLogTask.title,
          description: constructionLogTask.description,
          status: "pending",
          // 添加对templateImages的空值检查
          templateImages: constructionLogTask.templateImages
            ? constructionLogTask.templateImages.map((img) => ({
                url: img.url,
                desc: img.desc,
                type: img.type,
                uploadedFiles: [],
              }))
            : [],
          // 确保新任务包含额外模板信息
          additionalTemplateImages: constructionLogTask.additionalTemplates
            ? constructionLogTask.additionalTemplates.map((img) => ({
                url: img.url,
                desc: img.desc,
                type: img.type,
                uploadedFiles: [],
              }))
            : [],
        };

        setTasks([defaultTask]);
      }
    }
  }, []);

  // 自动保存任务数据到localStorage
  useEffect(() => {
    try {
      // 保存任务数据时，需要处理文件对象的问题
      // 我们只保存必要的元数据，不保存实际的File对象
      const tasksToSave = tasks.map((task) => {
        // 处理templateImages中的uploadedFiles
        const processedTemplateImages = task.templateImages?.map((img) => ({
          ...img,
          uploadedFiles: img.uploadedFiles?.map((file) => ({
            ...file,
            // 移除fileData，因为它包含不可序列化的File对象
            fileData: undefined,
          })),
        }));

        // 处理additionalTemplateImages中的uploadedFiles
        const processedAdditionalTemplateImages =
          task.additionalTemplateImages?.map((img) => ({
            ...img,
            uploadedFiles: img.uploadedFiles?.map((file) => ({
              ...file,
              // 移除fileData
              fileData: undefined,
            })),
          }));

        return {
          ...task,
          templateImages: processedTemplateImages,
          additionalTemplateImages: processedAdditionalTemplateImages,
        };
      });

      localStorage.setItem("construction-tasks", JSON.stringify(tasksToSave));
    } catch (error) {
      console.error("保存任务数据到localStorage失败:", error);
    }
  }, [tasks]);

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
        if (task.templateImages) {
          task.templateImages.forEach((img) => {
            if (img.uploadedFiles) {
              img.uploadedFiles.forEach((file) => {
                if (file.url && file.url.startsWith("blob:")) {
                  URL.revokeObjectURL(file.url);
                }
              });
            }
          });
        }

        if (task.additionalTemplateImages) {
          task.additionalTemplateImages.forEach((img) => {
            if (img.uploadedFiles) {
              img.uploadedFiles.forEach((file) => {
                if (file.url && file.url.startsWith("blob:")) {
                  URL.revokeObjectURL(file.url);
                }
              });
            }
          });
        }
      });
    };
  }, [tasks]);

  /// 处理添加任务
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
  const submitTaskFiles = useCallback(async (taskId) => {
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
      if (
        taskType &&
        taskType.title === task.title.replace(/-(135|246)$/, "")
      ) {
        // 检查任务标题是否包含特定标识，用于判断是否需要添加后缀
        if (task.title.includes("-135")) {
          taskTypeCode = `${value}_135`;
        } else if (task.title.includes("-246")) {
          taskTypeCode = `${value}_246`;
        } else {
          taskTypeCode = value;
        }
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

    // 辅助函数：获取最匹配的taskNeedDataCode
    const getBestMatchingTaskCode = (desc, taskTypeCode) => {
      const mapping = TASK_CONFIG.taskDataMapping[taskTypeCode];
      if (!mapping) {
        console.warn(`No mapping found for taskTypeCode: ${taskTypeCode}`);
        return "";
      }

      // 尝试直接匹配
      if (mapping[desc]) return mapping[desc];

      // 去除描述中的特殊字符和空格尝试匹配
      const cleanDesc = desc.replace(/[《》""'']/g, "").trim();
      if (mapping[cleanDesc]) return mapping[cleanDesc];

      // 搜索包含关键词的匹配
      for (const [key, value] of Object.entries(mapping)) {
        if (key.includes(cleanDesc) || cleanDesc.includes(key)) {
          return value;
        }
      }

      // 如果是带后缀的任务类型，尝试使用基础任务类型的映射
      if (taskTypeCode.includes("_")) {
        const baseTaskTypeCode = taskTypeCode.split("_")[0];
        const baseCode = getBestMatchingTaskCode(desc, baseTaskTypeCode);
        if (baseCode) {
          return baseCode;
        }
      }

      console.warn(
        `No matching code found for description: ${desc}, taskTypeCode: ${taskTypeCode}`
      );
      return "";
    };

    // 处理主模板文件
    if (task.templateImages) {
      task.templateImages.forEach((img, imageIndex) => {
        if (img.uploadedFiles) {
          img.uploadedFiles.forEach((file) => {
            if (file.status === "staged") {
              const taskNeedDataCode = getBestMatchingTaskCode(
                img.desc,
                taskTypeCode
              );

              // 即使没有找到完全匹配的code，也应该上传文件
              // 根据文件类型区分images和docs
              if (file.type.startsWith("image/")) {
                taskData.images.push(file.fileData);
                taskData.imagesSubtasks.push(
                  taskNeedDataCode || `${taskTypeCode}_IMAGE_${imageIndex}`
                );
              } else {
                taskData.docs.push(file.fileData);
                taskData.docsSubtasks.push(
                  taskNeedDataCode || `${taskTypeCode}_DOC_${imageIndex}`
                );
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
              const taskNeedDataCode = getBestMatchingTaskCode(
                img.desc,
                taskTypeCode
              );

              // 即使没有找到完全匹配的code，也应该上传文件
              // 根据文件类型区分images和docs
              if (file.type.startsWith("image/")) {
                taskData.images.push(file.fileData);
                taskData.imagesSubtasks.push(
                  taskNeedDataCode ||
                    `${taskTypeCode}_ADDITIONAL_IMAGE_${imageIndex}`
                );
              } else {
                taskData.docs.push(file.fileData);
                taskData.docsSubtasks.push(
                  taskNeedDataCode ||
                    `${taskTypeCode}_ADDITIONAL_DOC_${imageIndex}`
                );
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
          });
        }
      });
    }
  });

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
