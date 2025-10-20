import React from "react";
import { Modal } from "antd";
import { generateUUID, formatFileSize } from "./TaskUtils";
import { TASK_CONFIG } from "./TaskConfig";

const TaskImageUploadModal = ({
  visible,
  task,
  onClose,
  onFileUpload,
  onSubmit,
}) => {
  // 处理文件上传
  const handleFileUpload = (e, imageIndex) => {
    const files = Array.from(e.target.files);
    onFileUpload(task.id, imageIndex, files);
  };

  // 处理文件删除
  const handleFileDelete = (imageIndex, fileId) => {
    onFileUpload(task.id, imageIndex, [], false, fileId);
  };

  // 处理提交
  const handleSubmit = () => {
    onSubmit(task.id);
  };

  // 增强版预览模板功能
  const previewTemplate = async (template) => {
    if (!template) return;

    if (template.type === "image") {
      try {
        // 先尝试主URL
        let urlToUse = template.url;

        // 对本地URL进行特殊处理
        if (urlToUse.startsWith("/")) {
          urlToUse = new URL(urlToUse, window.location.origin).toString();
        }

        // 验证URL是否有效
        const response = await fetch(urlToUse, { method: "HEAD" });
        if (response.ok) {
          window.open(urlToUse, "_blank");
          return;
        }

        // 所有URL都无效时显示错误信息
        alert("无法预览图片：URL无效或资源不存在");
      } catch (error) {
        console.error("预览图片时出错:", error);
        alert("预览图片时发生错误，请稍后重试");
      }
    } else {
      alert("请前往资料管理页面下载对应模板");
    }
  };

  // 检查是否有暂存文件
  const hasStagedFiles =
    task?.templateImages?.some((img) =>
      img.uploadedFiles?.some((file) => file.status === "staged")
    ) || false;

  return (
    <Modal
      title="日常任务资料"
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
      {task && (
        <div className="modal-body">
          <div className="image-upload-pairs">
            {task.templateImages.map((image, imageIndex) => (
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
                      <img src={image.url} alt={`模板 ${imageIndex + 1}`} />
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

                  {/* 显示已上传的文件 */}
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
                            <span className="file-status uploading">
                              上传中...
                            </span>
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
        </div>
      )}
    </Modal>
  );
};

export default TaskImageUploadModal;
