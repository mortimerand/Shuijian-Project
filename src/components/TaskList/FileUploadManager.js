import { useState, useCallback } from "react";
import { message } from "antd";
import { generateUUID, uploadFileToServer } from "./TaskUtils";
import { TASK_CONFIG } from "./TaskConfig";

export const useFileUploadManager = (tasks, updateTaskFiles) => {
  const [hasStagedFiles, setHasStagedFiles] = useState(false);

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
        const updatedTasks = tasks.map((task) => {
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
        });

        updateTaskFiles(updatedTasks);

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
    [tasks, updateTaskFiles]
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
        return `${taskTypeCode}_GENERIC`; // 提供默认值，避免空字符串
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
              }
            });
          }
        });
      }

      try {
        // 更新文件状态为上传中
        const updatedTasksWithUploadingStatus = tasks.map((t) => {
          if (t.id === taskId) {
            let updatedTask = { ...t };

            // 更新templateImages中的文件状态
            if (updatedTask.templateImages) {
              updatedTask.templateImages = updatedTask.templateImages.map(
                (img) => {
                  if (img.uploadedFiles) {
                    return {
                      ...img,
                      uploadedFiles: img.uploadedFiles.map((file) =>
                        file.status === "staged"
                          ? { ...file, status: "uploading" }
                          : file
                      ),
                    };
                  }
                  return img;
                }
              );
            }

            // 更新additionalTemplateImages中的文件状态
            if (updatedTask.additionalTemplateImages) {
              updatedTask.additionalTemplateImages =
                updatedTask.additionalTemplateImages.map((img) => {
                  if (img.uploadedFiles) {
                    return {
                      ...img,
                      uploadedFiles: img.uploadedFiles.map((file) =>
                        file.status === "staged"
                          ? { ...file, status: "uploading" }
                          : file
                      ),
                    };
                  }
                  return img;
                });
            }

            return updatedTask;
          }
          return t;
        });

        updateTaskFiles(updatedTasksWithUploadingStatus);
        message.loading(`正在上传 ${task.title} 的文件...`);

        // 调用uploadFileToServer上传文件，传入统一格式的taskData
        const uploadResult = await uploadFileToServer(taskData);

        if (uploadResult.success) {
          // 上传成功，更新文件状态为已上传
          const updatedTasksAfterUpload = tasks.map((t) => {
            if (t.id === taskId) {
              let updatedTask = { ...t };

              // 更新templateImages中的文件状态
              if (updatedTask.templateImages) {
                updatedTask.templateImages = updatedTask.templateImages.map(
                  (img) => {
                    if (img.uploadedFiles) {
                      return {
                        ...img,
                        uploadedFiles: img.uploadedFiles.map((file) =>
                          file.status === "uploading"
                            ? { ...file, status: "uploaded" }
                            : file
                        ),
                      };
                    }
                    return img;
                  }
                );
              }

              // 更新additionalTemplateImages中的文件状态
              if (updatedTask.additionalTemplateImages) {
                updatedTask.additionalTemplateImages =
                  updatedTask.additionalTemplateImages.map((img) => {
                    if (img.uploadedFiles) {
                      return {
                        ...img,
                        uploadedFiles: img.uploadedFiles.map((file) =>
                          file.status === "uploading"
                            ? { ...file, status: "uploaded" }
                            : file
                        ),
                      };
                    }
                    return img;
                  });
              }

              return updatedTask;
            }
            return t;
          });

          updateTaskFiles(updatedTasksAfterUpload);
          setHasStagedFiles(false);
          message.success(`${task.title} 的文件上传成功`);
        } else {
          throw new Error(uploadResult.error || "未知错误");
        }
      } catch (error) {
        console.error("文件上传失败:", error);
        message.error(`${task.title} 的文件上传失败: ${error.message}`);

        // 出错时恢复文件状态为暂存
        const updatedTasksWithErrorStatus = tasks.map((t) => {
          if (t.id === taskId) {
            let updatedTask = { ...t };

            // 恢复templateImages中的文件状态
            if (updatedTask.templateImages) {
              updatedTask.templateImages = updatedTask.templateImages.map(
                (img) => {
                  if (img.uploadedFiles) {
                    return {
                      ...img,
                      uploadedFiles: img.uploadedFiles.map((file) =>
                        file.status === "uploading"
                          ? { ...file, status: "staged" }
                          : file
                      ),
                    };
                  }
                  return img;
                }
              );
            }

            // 恢复additionalTemplateImages中的文件状态
            if (updatedTask.additionalTemplateImages) {
              updatedTask.additionalTemplateImages =
                updatedTask.additionalTemplateImages.map((img) => {
                  if (img.uploadedFiles) {
                    return {
                      ...img,
                      uploadedFiles: img.uploadedFiles.map((file) =>
                        file.status === "uploading"
                          ? { ...file, status: "staged" }
                          : file
                      ),
                    };
                  }
                  return img;
                });
            }

            return updatedTask;
          }
          return t;
        });

        updateTaskFiles(updatedTasksWithErrorStatus);
      }
    },
    [tasks, updateTaskFiles]
  );

  return {
    hasStagedFiles,
    handleFileUpload,
    submitTaskFiles,
  };
};
