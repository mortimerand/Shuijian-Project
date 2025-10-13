import React from 'react';
import { Modal, Button } from 'antd';
import { downloadTemplateFile } from './TaskUtils';

const TaskFilePreviewModal = ({ visible, template, onClose }) => {
  // 处理下载操作
  const handleDownload = () => {
    if (template && template.url) {
      downloadTemplateFile(template.url);
    }
  };

  return (
    <Modal
      title={template ? template.desc : "文件预览"}
      open={visible}
      onCancel={onClose}
      footer={[
        template && template.url && (
          <Button key="download" type="primary" onClick={handleDownload}>
            下载文件
          </Button>
        ),
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ].filter(Boolean)}
      width="60%"
      centered
    >
      {template ? (
        <div className="file-preview-content">
          <div className="file-info">
            <div className="file-info-item">
              <strong>文件名称：</strong>
              {template.url.split('/').pop()}
            </div>
            <div className="file-info-item">
              <strong>文件类型：</strong>
              {template.url.split('.').pop()?.toUpperCase() || '未知'}
            </div>
            <div className="file-info-item">
              <strong>文件描述：</strong>
              {template.desc}
            </div>
            <div className="file-preview-tips">
              <p>点击"下载文件"按钮可获取该模板文件</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="file-preview-content">
          <p>暂无文件信息</p>
        </div>
      )}
    </Modal>
  );
};

export default TaskFilePreviewModal;