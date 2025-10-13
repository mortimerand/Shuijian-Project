import React from 'react';
import { Modal } from 'antd';
import { TASK_CONFIG } from './TaskConfig';

const TaskAdditionalTemplatesModal = ({ visible, task, onClose, onFileUpload, onSubmit }) => {
  // 获取任务配置
  const taskConfig = TASK_CONFIG.fixedTasks.find(config => 
    config.id === task?.type || config.title === task?.title
  );

  // 处理文件上传
  const handleFileUpload = (e, imageIndex) => {
    const files = Array.from(e.target.files);
    onFileUpload(task.id, imageIndex, files, true); // true 表示是额外模板
  };

  // 预览模板
  const previewTemplate = (template) => {
    if (template.type === 'image' && template.url) {
      window.open(template.url, '_blank');
    } else {
      alert('请前往资料管理页面下载对应模板');
    }
  };

  // 如果没有任务或额外模板，不显示内容
  if (!task || !task.additionalTemplateImages || task.additionalTemplateImages.length === 0) {
    return null;
  }

  return (
    <Modal
      title={`${task.title} - 验收阶段`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      maxHeight="80vh"
      styles={{
        body: {
          overflowY: 'auto',
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
                {image.type === 'image' ? (
                  <img src={image.url} alt={image.desc} />
                ) : (
                  <div className="file-placeholder">
                    <span className="file-icon">📄</span>
                    <span className="file-type">
                      {image.url.split('.').pop()?.toUpperCase() || '文件'}
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

              {task.additionalTemplateImages[imageIndex]?.uploadedFiles && 
               task.additionalTemplateImages[imageIndex].uploadedFiles.length > 0 && (
                <div className="image-uploaded-files">
                  {task.additionalTemplateImages[imageIndex].uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`uploaded-file-item file-${file.status || 'uploaded'}`}
                    >
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024).toFixed(1)}KB
                      </span>
                      {file.status === 'staged' && (
                        <span className="file-status staged">已暂存</span>
                      )}
                      {file.status === 'uploading' && (
                        <span className="file-status uploading">
                          上传中...
                        </span>
                      )}
                      {file.status === 'success' && (
                        <span className="file-status success">
                          上传成功
                        </span>
                      )}
                      {file.status === 'error' && (
                        <span className="file-status error">
                          上传失败
                        </span>
                      )}
                      <button
                        className="delete-file-btn"
                        onClick={() => onFileUpload(task.id, imageIndex, [], file.id, true)}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 添加任务级提交按钮 */}
        <div className="task-submit-container">
          <button
            className="btn btn-primary"
            onClick={() => onSubmit(task.id)}
          >
            提交该任务的所有文件
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskAdditionalTemplatesModal;