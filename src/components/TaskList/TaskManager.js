import { useState, useEffect, useCallback } from "react";
import { generateUUID, checkAllRequiredItemsUploaded } from "./TaskUtils";
import { TASK_CONFIG } from "./TaskConfig";

export const useTaskManager = () => {
  // 从localStorage加载任务数据，如果没有则使用空数组
  const loadTasksFromStorage = useCallback(() => {
    try {
      const savedTasks = localStorage.getItem("construction-tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // 检查是否是有效的数组并且包含任务数据
        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.error("从localStorage加载任务数据失败:", error);
    }
    return [];
  }, []);

  const [tasks, setTasks] = useState(loadTasksFromStorage);

  // 获取当前任务
  const getCurrentTask = useCallback(
    (taskId) => {
      if (!taskId) return null;
      return tasks.find((task) => task.id === taskId) || null;
    },
    [tasks]
  );

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

  // 处理添加任务
  const handleAddTask = useCallback((selectedTaskType) => {
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
        return true;
      }
    }
    return false;
  }, []);

  // 删除任务
  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  // 更新任务文件（用于文件上传后更新任务状态）
  const updateTaskFiles = useCallback((updatedTasks) => {
    setTasks(updatedTasks);
  }, []);

  return {
    tasks,
    getCurrentTask,
    handleAddTask,
    deleteTask,
    updateTaskFiles,
  };
};
