import { message } from "antd";

// 生成UUID函数
export function generateUUID() {
  // 添加时间戳前缀来降低冲突概率
  const timestamp = Date.now().toString(36);
  const random = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
  return `${timestamp}-${random}`;
}

// 检查任务是否所有必要的项都有文件上传
export function checkAllRequiredItemsUploaded(task) {
  // 检查主模板项 - 只有在有主模板时才要求上传
  const mainTemplatesAllUploaded =
    !task.templateImages ||
    task.templateImages.length === 0 ||
    task.templateImages.every(
      (img) =>
        img.uploadedFiles &&
        img.uploadedFiles.length > 0 &&
        img.uploadedFiles.some((f) => f.status === "uploaded")
    );

  // 检查额外模板项（如果有）- 确保每个额外模板都有至少一个上传成功的文件
  const additionalTemplatesAllUploaded =
    !task.additionalTemplateImages ||
    task.additionalTemplateImages.length === 0 ||
    task.additionalTemplateImages.every(
      (img) =>
        img.uploadedFiles &&
        img.uploadedFiles.length > 0 &&
        img.uploadedFiles.some((f) => f.status === "uploaded")
    );

  return mainTemplatesAllUploaded && additionalTemplatesAllUploaded;
}

// 下载模板文件
export function downloadTemplateFile(fileUrl) {
  try {
    // 创建一个临时的a标签用于下载
    const link = document.createElement("a");
    // 设置链接地址
    link.href = fileUrl;
    // 设置下载属性，文件名从导入的模块名或原始文件名中提取
    const fileName = fileUrl.toString().includes("/")
      ? fileUrl.split("/").pop()
      : "template_file";
    link.download = fileName;
    // 添加到DOM
    document.body.appendChild(link);
    // 触发点击事件
    link.click();
    // 移除a标签
    document.body.removeChild(link);
    message.success("文件下载已开始");
  } catch (error) {
    console.error("文件下载失败:", error);
    message.error("文件下载失败，请稍后重试");
  }
}

// 获取状态对应的样式类
export function getStatusClass(status) {
  return status === "completed" ? "task-completed" : "task-pending";
}

// 添加文件上传到后端的函数 - 统一参数格式
export async function uploadFileToServer(taskData) {
  try {
    const formData = new FormData();
    // 添加任务类型
    formData.append("taskType", taskData.taskType);

    // 添加任务ID
    if (taskData.taskId) {
      formData.append("taskId", taskData.taskId);
    }

    // 添加图片和对应的subtasks
    if (taskData.images && taskData.images.length > 0) {
      taskData.images.forEach((file, index) => {
        // 使用相同的键名，FormData会自动处理多个文件
        formData.append(`images`, file);
        // 添加额外的文件信息，帮助后端识别
        formData.append(`imagesName_${index}`, file.name);
        formData.append(`imagesType_${index}`, file.type);
        formData.append(`imagesSize_${index}`, file.size);
      });
    }

    if (taskData.imagesSubtasks && taskData.imagesSubtasks.length > 0) {
      formData.append(
        "imagesSubtasks",
        JSON.stringify(taskData.imagesSubtasks)
      );
    }

    // 添加文档和对应的subtasks - 统一处理方式
    if (taskData.docs && taskData.docs.length > 0) {
      taskData.docs.forEach((file, index) => {
        // 使用相同的键名，确保与图片上传处理方式一致
        formData.append(`docs`, file);
        // 添加额外的文件信息，帮助后端识别
        formData.append(`docsName_${index}`, file.name);
        formData.append(`docsType_${index}`, file.type);
        formData.append(`docsSize_${index}`, file.size);
      });
    }

    if (taskData.docsSubtasks && taskData.docsSubtasks.length > 0) {
      formData.append("docsSubtasks", JSON.stringify(taskData.docsSubtasks));
    }

    // 发送请求到后端
    const response = await fetch("/api/daily_task/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("上传失败");
    }

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error("文件上传失败:", error);
    return { success: false, error: error.message };
  }
}

// 格式化文件大小显示
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
