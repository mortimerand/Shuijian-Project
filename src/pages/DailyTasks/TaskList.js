import React, { useState, useEffect, useCallback } from "react";
import { Modal } from 'antd';
import './DailyTasks.css';

function TaskList() {
  // 定义固定任务类型
  const fixedTasks = [
    { id: "pile-point-layout", title: "桩点放样", description: "确定桩基础的准确位置和标高，确保施工符合设计要求", deadline: "今天 10:00", templateImages: [{ url: "../../public/template/1.png", desc: "工程测量控制点交桩记录表" }, { url: "../../public/template/1.jpeg", desc: "桩点位放样数据" }] },
    { id: "steel-cage-storage-check", title: "钢筋笼钢筋存储环境检查", description: "检查钢筋存储环境是否符合要求，防止钢筋锈蚀和损坏", deadline: "今天 11:00", templateImages: [{ url: "../../public/template/3.png", desc: "存储环境要求" }] },
    { id: "steel-cage-material-arrival", title: "钢筋笼钢筋进场", description: "验收进场钢筋的质量、规格和数量，确保符合设计和规范要求", deadline: "今天 13:00", templateImages: [{ url: "../../public/template/4.png", desc: "钢筋规格型号" }, { url: "../../public/template/5.png", desc: "进场验收流程" }] },
    { id: "steel-cage-welding交底", title: "钢筋笼焊接技术交底", description: "向施工人员详细说明钢筋笼焊接的技术要求、质量标准和安全注意事项", deadline: "今天 14:00", templateImages: [{ url: "../../public/template/6.png", desc: "焊接参数要求" }, { url: "../../public/template/7.png", desc: "焊缝质量标准" }, { url: "../../public/template/8.png", desc: "焊接安全措施" }] },
    { id: "steel-cage-production", title: "钢筋笼生产", description: "按照设计图纸和技术要求制作钢筋笼，确保尺寸准确、焊接牢固", deadline: "今天 16:00", templateImages: [{ url: "../../public/template/9.png", desc: "钢筋笼结构示意图" }, { url: "../../public/template/10.png", desc: "生产工艺流程" }] },
    { id: "pile-formation交底", title: "成桩技术交底", description: "向施工人员详细说明成桩的技术要求、质量标准和安全注意事项", deadline: "今天 15:00", templateImages: [{ url: "../../public/template/11.png", desc: "成桩工艺参数" }] },
    { id: "pile-formation", title: "成桩", description: "按照设计要求和技术规范进行桩基础的施工，确保成桩质量", deadline: "今天 17:00", templateImages: [{ url: "../../public/template/12.png", desc: "成桩设备布置" }, { url: "../../public/template/13.png", desc: "成桩过程控制" }] },
    { id: "steel-cage-lifting", title: "钢筋笼吊装与混凝土灌注", description: "将制作好的钢筋笼吊装入孔，并进行混凝土灌注，确保施工质量", deadline: "今天 18:00", templateImages: [{ url: "../../public/template/14.png", desc: "钢筋笼吊装要求" }, { url: "../../public/template/15.png", desc: "混凝土灌注工艺" }, { url: "../../public/template/16.png", desc: "灌注质量控制" }] },
  ];

  // 模拟任务数据
  const [tasks, setTasks] = useState([
    { id: Date.now() - 10000, title: "桩点放样", description: "确定桩基础的准确位置和标高，确保施工符合设计要求", status: "pending", deadline: "今天 10:00", templateImages: [{ url: "../../public/template/1.png", desc: "工程测量控制点交桩记录表", uploadedFiles: [] }, { url: "../../public/template/2.png", desc: "桩点位放样数据", uploadedFiles: [] }] },
    { id: Date.now() - 20000, title: "钢筋笼钢筋存储环境检查", description: "检查钢筋存储环境是否符合要求，防止钢筋锈蚀和损坏", status: "pending", deadline: "今天 11:00", templateImages: [{ url: "../../public/template/3.png", desc: "存储环境要求", uploadedFiles: [] }] },
  ]);

  // 其他状态
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 添加触摸状态
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // 自动检查任务状态
  useEffect(() => {
    const updateTaskStatuses = () => {
      setTasks((prevTasks) => {
        const [updatedTasks, hasChanges] = prevTasks.reduce(
          ([tasksAcc, changes], task) => {
            const hasUploadedFiles = task.templateImages.some(
              (img) => img.uploadedFiles && img.uploadedFiles.length > 0
            );
            const newStatus = hasUploadedFiles ? "completed" : "pending";
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
    updateTaskStatuses();
  }, []);

  // 使用 useCallback 优化函数，避免不必要的重渲染
  const toggleTaskStatus = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return { ...task, status: task.status === "completed" ? "pending" : "completed" };
        }
        return task;
      })
    );
  }, []);

  const handleAddTask = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedTaskType) {
        const selectedTask = fixedTasks.find(
          (task) => task.id === selectedTaskType
        );
        if (selectedTask) {
          const task = {
            id: Date.now(),
            title: selectedTask.title,
            description: selectedTask.description,
            status: "pending",
            deadline: selectedTask.deadline,
            templateImages: selectedTask.templateImages.map((img) => ({ url: img.url, desc: img.desc, uploadedFiles: [] })),
          };
          setTasks((prevTasks) => [...prevTasks, task]);
          setSelectedTaskType("");
          setShowAddForm(false);
        }
      }
    },
    [selectedTaskType]
  );

  const handleFileUpload = useCallback((e, taskId, imageIndex) => {
    const files = Array.from(e.target.files);
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTemplateImages = [...task.templateImages];
          const newFiles = files.map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          }));
          updatedTemplateImages[imageIndex].uploadedFiles = [
            ...(updatedTemplateImages[imageIndex].uploadedFiles || []),
            ...newFiles,
          ];
          return { ...task, templateImages: updatedTemplateImages };
        }
        return task;
      })
    );
    e.target.value = "";
  }, []);

  const removeUploadedFile = useCallback((taskId, imageIndex, fileId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTemplateImages = [...task.templateImages];
          const fileToRemove = updatedTemplateImages[
            imageIndex
          ].uploadedFiles.find((file) => file.id === fileId);
          if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
            URL.revokeObjectURL(fileToRemove.url);
          }
          updatedTemplateImages[imageIndex].uploadedFiles = updatedTemplateImages[imageIndex].uploadedFiles.filter(
            (file) => file.id !== fileId
          );
          return { ...task, templateImages: updatedTemplateImages };
        }
        return task;
      })
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const showImagePreview = useCallback((images, taskId, index = 0) => {
    const imageUrls = images.map((img) => img.url);
    setGalleryImages(imageUrls);
    setCurrentImageIndex(index);
    setPreviewImage(imageUrls[index]);
    setShowImageGallery(true);
    setCurrentTaskId(taskId);
  }, []);

  const openImageUploadModal = useCallback((taskId) => {
    setCurrentTaskId(taskId);
    setShowImageUploadModal(true);
  }, []);

  const closeImageUploadModal = useCallback(() => {
    setShowImageUploadModal(false);
    setCurrentTaskId(null);
  }, []);

  // 更新图片预览的useEffect，确保previewImage与currentImageIndex同步
  useEffect(() => {
    if (galleryImages.length > 0) {
      setPreviewImage(galleryImages[currentImageIndex]);
    }
  }, [currentImageIndex, galleryImages]);

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
      });
    };
  }, [tasks]);

  // 简化图片导航函数
  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1);
  }, [galleryImages.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1);
  }, [galleryImages.length]);

  // 获取状态对应的样式类
  const getStatusClass = useCallback((status) => {
    return status === "completed" ? "task-completed" : "task-pending";
  }, []);

  // 获取当前任务，添加错误处理
  const getCurrentTask = useCallback(() => {
    if (!currentTaskId) return null;
    return tasks.find((task) => task.id === currentTaskId) || null;
  }, [tasks, currentTaskId]);

  // 处理触摸事件
  const handleTouchStart = useCallback((e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    setTouchEndX(e.changedTouches[0].screenX);
  }, []);

  // 处理滑动手势
  useEffect(() => {
    if (touchEndX === 0) return; // 防止初始状态触发

    const threshold = 50; // 滑动阈值
    if (touchEndX < touchStartX - threshold) {
      // 向左滑动，下一张图片
      goToNextImage();
    } else if (touchEndX > touchStartX + threshold) {
      // 向右滑动，上一张图片
      goToPrevImage();
    }

    // 重置触摸状态
    setTouchStartX(0);
    setTouchEndX(0);
  }, [touchStartX, touchEndX, goToNextImage, goToPrevImage]);

  // 图片上传模态框配置
  const imageUploadModalProps = {
    title: getCurrentTask() ? `${getCurrentTask().title} - 模板图片与数据上传` : '',
    open: showImageUploadModal,
    onCancel: closeImageUploadModal,
    footer: null,
    width: '90%',
    centered: true,
    modalRender: (node) => node, // 使用Portal确保定位正确
    style: {
      maxHeight: '90vh',
      overflowY: 'auto'
    }
  };

  // 图片预览模态框配置
  const imageGalleryModalProps = {
    open: showImageGallery,
    onCancel: () => setShowImageGallery(false),
    footer: null,
    width: '95%',
    centered: true,
    modalRender: (node) => node, // 使用Portal确保定位正确
    closable: true,
    maskClosable: true,
    className: 'image-gallery-modal'
  };

  return (
    <div className="card">
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
              {fixedTasks.map((task) => (
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
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${getStatusClass(task.status)}`}
          >
            {/* 任务头部 */}
            <div className="task-header">
              <label className={`task-checkbox ${getStatusClass(task.status)}`}>
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => toggleTaskStatus(task.id)}
                />
                <span className="checkbox-custom"></span>
              </label>
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
              <span className="task-deadline">截止时间：{task.deadline}</span>
              <span className={`task-status ${getStatusClass(task.status)}`}>
                {task.status === "completed" ? "已完成" : "未完成"}
              </span>
            </div>

            {/* 模板图片和上传数据按钮 */}
            {task.templateImages && task.templateImages.length > 0 && (
              <div className="task-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => openImageUploadModal(task.id)}
                >
                  查看模板与上传数据 ({task.templateImages.length}张模板)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">总任务数</span>
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

      {/* 模板图片与上传弹窗 - 使用Ant Design的Modal组件 */}
      <Modal {...imageUploadModalProps}>
        {getCurrentTask() && (
          <div className="modal-body">
            <div className="image-upload-pairs">
              {getCurrentTask().templateImages.map((image, imageIndex) => (
                <div key={imageIndex} className="image-upload-pair">
                  <div className="image-container">
                    <div className="image-header">
                      <span className="image-description">{image.desc}</span>
                    </div>
                    <div
                      className="image-thumbnail"
                      onClick={() => {
                        showImagePreview(
                          getCurrentTask().templateImages,
                          getCurrentTask().id,
                          imageIndex
                        );
                      }}
                    >
                      <img src={image.url} alt={`模板 ${imageIndex + 1}`} />
                    </div>
                  </div>

                  <div className="image-upload-area">
                    <label className="upload-button">
                      <input
                        type="file"
                        multiple
                        capture="environment"
                        onChange={(e) =>
                          handleFileUpload(e, getCurrentTask().id, imageIndex)
                        }
                      />
                      <span>+ 上传相关文件</span>
                    </label>

                    {image.uploadedFiles &&
                      image.uploadedFiles.length > 0 && (
                        <div className="image-uploaded-files">
                          {image.uploadedFiles.map((file) => (
                            <div key={file.id} className="uploaded-file-item">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">
                                {(file.size / 1024).toFixed(1)}KB
                              </span>
                              <button
                                className="delete-file-btn"
                                onClick={() =>
                                  removeUploadedFile(
                                    getCurrentTask().id,
                                    imageIndex,
                                    file.id
                                  )
                                }
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
            </div>
          </div>
        )}
      </Modal>

      {/* 图片预览弹窗 - 使用Ant Design的Modal组件 */}
      <Modal {...imageGalleryModalProps}>
        <div 
          className="image-gallery" 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="gallery-content">
            <img
              src={previewImage}
              alt="预览图片"
              className="gallery-image"
            />
            <div className="gallery-counter">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
            {getCurrentTask() &&
              getCurrentTask().templateImages[currentImageIndex] && (
                <div className="gallery-description">
                  {getCurrentTask().templateImages[currentImageIndex].desc}
                </div>
              )}
          </div>
          <button className="prev-image" onClick={goToPrevImage}>
            ‹
          </button>
          <button className="next-image" onClick={goToNextImage}>
            ›
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;
