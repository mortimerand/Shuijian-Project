import React from "react";
import { Modal } from "antd";
import { formatFileSize } from "./TaskUtils";
import { TASK_CONFIG } from "./TaskConfig";

const TaskAdditionalTemplatesModal = ({
  visible,
  task,
  onClose,
  onFileUpload,
  onSubmit,
}) => {
  // 获取任务配置
  const taskConfig = TASK_CONFIG.fixedTasks.find(
    (config) => config.id === task?.type || config.title === task?.title
  );

  // 处理文件上传
  const handleFileUpload = (e, imageIndex) => {
    const files = Array.from(e.target.files);
    onFileUpload(task.id, imageIndex, files, true); // true 表示是额外模板
  };

  // 处理文件删除
  const handleFileDelete = (imageIndex, fileId) => {
    onFileUpload(task.id, imageIndex, [], true, fileId);
  };

  // 处理提交
  const handleSubmit = () => {
    onSubmit(task.id);
  };

  // 预览模板
  const previewTemplate = (template) => {
    if (template.type === "image" && template.url) {
      window.open(template.url, "_blank");
    } else {
      alert("请前往资料管理页面下载对应模板");
    }
  };

  // 检查是否有暂存文件
  const hasStagedFiles =
    task?.additionalTemplateImages?.some((img) =>
      img.uploadedFiles?.some((file) => file.status === "staged")
    ) || false;

  // 如果没有任务或额外模板，不显示内容
  if (
    !task ||
    !task.additionalTemplateImages ||
    task.additionalTemplateImages.length === 0
  ) {
    return null;
  }

  return (
    <Modal
      title={`${task.title} - 验收阶段`}
      open={visible}
      onCancel={onClose}
      footer={[
        <button
          key="submit"
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!hasStagedFiles}
        >
          提交所有文件
        </button>,
        <button
          key="cancel"
          type="button"
          className="btn btn-default"
          onClick={onClose}
        >
          取消
        </button>,
      ]}
      width={800}
      centered
      maxHeight="80vh"
      styles={{
        body: {
          overflowY: "auto",
        },
      }}
    >
      <div className="additional-templates-modal">
        {task.additionalTemplateImages.map((image, imageIndex) => (
          <div key={imageIndex} className="image-upload-pair">
            <div className="image-container">
              <div className="image-header">
                <span className="image-description">{image.desc}</span>
              </div>
              <div
                className="image-thumbnail"
                onClick={() => previewTemplate(image)}
              >
                {image.type === "image" ? (
                  <img src={image.url} alt={image.desc} />
                ) : (
                  <div className="file-placeholder">
                    <span className="file-icon">📄</span>
                    <span className="file-type">
                      {image.url.split(".").pop()?.toUpperCase() || "文件"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="image-upload-area">
              <label className="upload-button">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, imageIndex)}
                />
                <span>+ 暂存相关文件</span>
              </label>

              {image.uploadedFiles && image.uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  {image.uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`uploaded-file-item file-${file.status}`}
                    >
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {formatFileSize(file.size)}
                      </span>
                      {file.status === "staged" && (
                        <>
                          <span className="file-status staged">已暂存</span>
                          <button
                            className="file-delete-btn"
                            onClick={() =>
                              handleFileDelete(imageIndex, file.id)
                            }
                            title="删除文件"
                          >
                            ×
                          </button>
                        </>
                      )}
                      {file.status === "uploading" && (
                        <span className="file-status uploading">上传中...</span>
                      )}
                      {file.status === "uploaded" && (
                        <span className="file-status uploaded">已上传</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default TaskAdditionalTemplatesModal;
