import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, message } from "antd";
import "./DailyTasks.css";

// 生成UUID
function generateUUID() {
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

function TaskList() {
  // 使用 useMemo 包装固定任务类型数组
  const fixedTasks = useMemo(
    () => [
      {
        id: "pile-point-layout",
        title: "桩点放样",
        description: "确定桩基础的准确位置和标高，确保施工符合设计要求",
        templateImages: [
          {
            url: "/template/1.2桩点放样/施2020-61 工程测量控制点交桩记录表.xls",
            desc: "桩点放样工程测量控制点交桩记录表",
            type: "file",
          },
          {
            url: "/template/1.2桩点放样/施工放样测量记录表.xlsx",
            desc: "桩点位放样数据",
            type: "file",
          },
        ],
      },
      {
        id: "steel-cage-storage-check",
        title: "钢筋笼钢筋存储环境检查",
        description: "检查钢筋存储环境是否符合要求，防止钢筋锈蚀和损坏",
        templateImages: [
          {
            url: "/template/4.2钢筋笼钢筋存储/存储场地照片.jpg",
            desc: "钢筋笼钢筋存储原材料存储照片",
            type: "image",
          },
        ],
      },
      {
        id: "steel-cage-material-arrival",
        title: "钢筋笼钢筋进场",
        description: "验收进场钢筋的质量、规格和数量，确保符合设计和规范要求",
        templateImages: [
          {
            url: "/template/5.1钢筋笼钢筋进场（日常）/质量证明书.png",
            desc: "《出场质量证明书》",
            type: "image",
          },
          {
            url: "/template/5.1钢筋笼钢筋进场（日常）/试验报告单.png",
            desc: "《试验报告单》",
            type: "image",
          },
          {
            url: "/template/5.1钢筋笼钢筋进场（日常）/施2020-24a 原材料、试块、试件见证取样送检委托书.xls",
            desc: "《原材料、试块、试件见证取样送检委托书》",
            type: "file",
          },
        ],
        additionalTemplates: [
          {
            url: "/template/5.2钢筋笼钢筋进场（验收）/现场验收照片.png",
            desc: "钢筋笼进场现场验收照片",
            type: "image",
          },
          {
            url: "/template/5.2钢筋笼钢筋进场（验收）/施2020-23 建筑、安装原材料、设备及配件产品进场验收记录.xls",
            desc: "《建筑、安装原材料、设备及配件产品进场验收记录》",
            type: "file",
          },
        ],
      },
      {
        id: "steel-cage-welding",
        title: "钢筋笼焊接技术交底",
        description:
          "向施工人员详细说明钢筋笼焊接的技术要求、质量标准和安全注意事项",
        templateImages: [
          {
            url: "/template/6.2钢筋笼焊接技术交底 （验收）/现场技术交底照片.png",
            desc: "钢筋笼焊接技术交底照片",
            type: "image",
          },
        ],
      },
      {
        id: "steel-cage-production",
        title: "钢筋笼生产",
        description: "按照设计图纸和技术要求制作钢筋笼，确保尺寸准确、焊接牢固",
        templateImages: [
          {
            url: "/template/7.1钢筋笼生产（日常）/检查照片.png",
            desc: "钢筋笼生产作业照片",
            type: "image",
          },
          {
            url: "/template/7.1钢筋笼生产（日常）/施2020-24b 钢筋焊接连接接头工艺检验见证取样送检委托书.xls",
            desc: "《钢筋笼生产钢筋焊接连接接头工艺检验见证取样送检委托书》",
            type: "file",
          },
        ],
        additionalTemplates: [
          {
            url: "/template/7.2钢筋笼生产（验收）/现场验收照片.jpg",
            desc: "钢筋笼生产监理验收照片",
            type: "image",
          },
        ],
      },
      {
        id: "pile-formation-tech",
        title: "成桩技术交底",
        description: "向施工人员详细说明成桩的技术要求、质量标准和安全注意事项",
        templateImages: [
          {
            url: "/template/2.2成桩技术交底/交底图片.png",
            desc: "成桩技术交底照片",
            type: "image",
          },
          {
            url: "/template/2.2成桩技术交底/人工挖孔桩技术交底.docx",
            desc: "《安全技术交底书》",
            type: "file",
          },
        ],
      },
      {
        id: "pile-formation",
        title: "成桩",
        description: "按照设计要求和技术规范进行桩基础的施工，确保成桩质量",
        templateImages: [
          {
            url: "/template/3.1成桩（日常）/现场作业照片.png",
            desc: "成桩作业照片",
            type: "image",
          },
          {
            url: "/template/3.1成桩（日常）/施2020-76 现拌混凝土施工记录.xls",
            desc: "现拌混凝土施工记录",
            type: "file",
          },
        ],
        additionalTemplates: [
          {
            url: "/template/3.2成桩（验收）/现场验收照片.jpg",
            desc: "成桩监理验收照片",
            type: "image",
          },
          {
            url: "/template/3.2成桩（验收）/成桩桩长统计表.xlsx",
            desc: "成桩桩长统计表",
            type: "file",
          },
        ],
      },
      {
        id: "steel-cage-lifting",
        title: "钢筋笼吊装与混凝土灌注",
        description: "将制作好的钢筋笼吊装入孔，并进行混凝土灌注，确保施工质量",
        templateImages: [
          {
            url: "/template/8.1钢筋笼吊装、混凝土灌注（日常）/钢筋笼吊装照片.png",
            desc: "钢筋笼吊装作业照片",
            type: "image",
          },
          {
            url: "/template/8.1钢筋笼吊装、混凝土灌注（日常）/混凝土灌注照片.png",
            desc: "钢筋笼吊装混凝土灌注照片",
            type: "image",
          },
          {
            url: "/template/8.1钢筋笼吊装、混凝土灌注（日常）/施2020-78 混凝土开盘鉴定.xls",
            desc: "钢筋笼吊装混凝土开盘鉴定",
            type: "file",
          },
          {
            url: "/template/8.1钢筋笼吊装、混凝土灌注（日常）/施2020-75 预拌混凝土施工记录.xls",
            desc: "钢筋笼吊装施工记录",
            type: "file",
          },
        ],
        additionalTemplates: [
          {
            url: "/template/8.2钢筋笼吊装、混凝土灌注（验收）/浇筑完成后照片.png",
            desc: "钢筋笼吊装灌注完成照片",
            type: "image",
          },
          {
            url: "/template/8.2钢筋笼吊装、混凝土灌注（验收）/施2020-77 混凝土浇灌令.xls",
            desc: "《混凝土浇灌令》",
            type: "file",
          },
          {
            url: "/template/8.2钢筋笼吊装、混凝土灌注（验收）/施2020-111 人工挖孔灌注桩单桩施工记录.xls",
            desc: "《人工挖孔灌注桩单桩施工记录》",
            type: "file",
          },
        ],
      },
    ],
    []
  );

  // 使用 useMemo 包装任务类型与后端编码的映射关系
  const taskTypeMapping = useMemo(
    () => ({
      "pile-point-layout": "ZHUANGDIAN_FANGYANG",
      "steel-cage-storage-check": "GANGJINLONG_GANGJIN_CUNCHU",
      "steel-cage-material-arrival": "GANGJINLONG_GANGJIN_JINCHANG",
      "steel-cage-welding": "GANGJINGLONG_HANJIE_JISHU",
      "steel-cage-production": "GANGJINLONG_SHENGCHAN",
      "pile-formation-tech": "CHENGZHUANG_JISHU",
      "pile-formation": "CHENGZHUANG",
      "steel-cage-lifting": "GANGJINLONG_DIAOZHUANG",
    }),
    []
  );

  // 使用 useMemo 包装任务数据编码映射关系
  const taskDataMapping = useMemo(
    () => ({
      ZHUANGDIAN_FANGYANG: {
        工程测量控制点交桩记录表: "ZHUANGDIAN_FANGYANG_JILUBIAO",
        桩点位放样数据: "ZHUANGDIAN_FANGYANG_FANGYANGSHUJU",
      },
      GANGJINLONG_GANGJIN_CUNCHU: {
        钢筋笼钢筋存储原材料存储照片:
          "GANGJINLONG_GANGJIN_CUNCHU_YUANCAILIAO_CUNCHU_ZHAOPIAN",
        钢筋笼钢筋存储存储场地照片:
          "GANGJINLONG_GANGJIN_CUNCHU_CUNCHU_CHANGDI_ZHAOPIAN",
      },
      GANGJINLONG_GANGJIN_JINCHANG: {
        钢筋笼进场出场质量说明书:
          "GANGJINLONG_GANGJIN_JINCHANG_CHUCHANG_ZHILIANG_SHUOMINGSHU",
        钢筋笼钢筋进场试验报告单:
          "GANGJINLONG_GANGJIN_JINCHANG_CESHI_BAOGAODAN",
        "钢筋笼进场原材料、试块、试件见证取样送检委托书":
          "GANGJINLONG_GANGJIN_JINCHANG_WEITUOSHU",
        钢筋笼进场现场验收照片:
          "GANGJINLONG_GANGJIN_JINCHANG_XIANCHANG_YANSHOU_ZHAOPIAN",
        "钢筋笼进场现场建筑、安装原材料、设备及配件产品进场验收记录":
          "GANGJINLONG_GANGJIN_JINCHANG_YANSHOU_JILU",
      },
      GANGJINGLONG_HANJIE_JISHU: {
        钢筋笼焊接技术交底照片: "GANGJINGLONG_HANJIE_JISHU_JIAODI_ZHAOPIAN",
        钢筋笼焊接安全技术交底书:
          "GANGJINGLONG_HANJIE_JISHU_HANJIE_ANQUAN_JISHU_JIAODISHU",
      },
      GANGJINLONG_SHENGCHAN: {
        钢筋笼生产作业照片: "GANGJINLONG_SHENGCHAN_ZUOYE_ZHAOPIAN",
        钢筋笼生产检查照片: "GANGJINLONG_SHENGCHAN_JIANCHA_ZHAOPIAN",
        钢筋笼生产钢筋焊接连接接头工艺检验见证取样送检委托书:
          "GANGJINLONG_SHENGCHAN_SONGJIAN_WEITUOSHU",
        钢筋笼生产监理验收照片: "GANGJINLONG_SHENGCHAN_JIANLI_YANSHOU_ZHAOPIAN",
      },
      CHENGZHUANG_JISHU: {
        成桩技术接点照片: "CHENGZHUANG_JISHU_JIAODI_ZHAOPIAN",
        成桩技术安全交底书: "CHENGZHUANG_JISHU_ANQUAN_JISHU_JIAODISHU",
      },
      CHENGZHUANG: {
        成桩作业照片: "CHENGZHUANG_ZUOYE_ZHAOPIAN",
        成桩现拌混凝土施工记录: "CHENGZHUANG_SHIGONG_JILU",
        成桩监理验收照片: "CHENGZHUANG_JIANLI_YANSHOU_ZHAOPIAN",
        成桩桩长统计表: "CHENGZHUANG_JIANLI_ZHUANGCHANG_TONGJIBIAO",
      },
      GANGJINLONG_DIAOZHUANG: {
        钢筋笼吊装作业照片: "GANGJINLONG_DIAOZHUANG_ZUOYE_ZHAOPIAN",
        钢筋笼吊装混凝土灌注照片: "GANGJINLONG_DIAOZHUANG_GUANZHU_ZHAOPIAN",
        钢筋笼吊装混凝土开盘鉴定: "GANGJINLONG_DIAOZHUANG_KAIPAN_JIANDING",
        钢筋笼吊装施工记录: "GANGJINLONG_DIAOZHUANG_SHIGONG_JILU",
        钢筋笼吊装灌注完成照片:
          "GANGJINLONG_DIAOZHUANG_GUANZHU_WANCHENG_ZHAOPIAN",
        钢筋笼吊装混凝土浇灌令: "GANGJINLONG_DIAOZHUANG_JIAOGUANLING",
        钢筋笼吊装人工挖孔灌注桩单桩施工记录:
          "GANGJINLONG_DIAOZHUANG_GUANZHU_CHENGZHUANG_JILU",
      },
    }),
    []
  );
  // 验收阶段标题映射
  const additionalTemplateTitles = useMemo(
    () => ({
      "steel-cage-material-arrival": "进场验收附加资料:",
      "steel-cage-production": "验收记录:",
      "pile-formation": "成桩验收资料:",
      "steel-cage-lifting": "成桩完成后:",
    }),
    []
  );

  // 模拟任务数据
  const [tasks, setTasks] = useState([
    {
      id: generateUUID(),
      title: "桩点放样",
      description: "确定桩基础的准确位置和标高，确保施工符合设计要求",
      status: "pending",
      templateImages: [
        {
          url: "/template/1.2桩点放样/施2020-61 工程测量控制点交桩记录表.xls",
          desc: "工程测量控制点交桩记录表",
          type: "file",
          uploadedFiles: [],
        },
        {
          url: "/template/1.2桩点放样/施工放样测量记录表.xlsx",
          desc: "桩点位放样数据",
          type: "file",
          uploadedFiles: [],
        },
      ],
    },
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
  const [hasStagedFiles, setHasStagedFiles] = useState(false); // 标记是否有暂存文件
  const [showAdditionalTemplates, setShowAdditionalTemplates] = useState(null); //修改为存储当前打开的任务ID
  const [currentTemplateType, setCurrentTemplateType] = useState(null); // 当前预览的模板类型
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false); // 文件预览模态框
  const [currentTemplateFile, setCurrentTemplateFile] = useState(null); // 当前预览的文件

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

  const handleAddTask = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedTaskType) {
        const selectedTask = fixedTasks.find(
          (task) => task.id === selectedTaskType
        );
        if (selectedTask) {
          const task = {
            id: generateUUID(),
            title: selectedTask.title,
            description: selectedTask.description,
            status: "pending",
            templateImages: selectedTask.templateImages.map((img) => ({
              url: img.url,
              desc: img.desc,
              type: img.type,
              uploadedFiles: [],
            })),
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

  const handleFileUpload = useCallback(
    (e, taskId, imageIndex) => {
      const files = Array.from(e.target.files);

      try {
        // 找到当前任务
        const currentTask = tasks.find((task) => task.id === taskId);
        if (!currentTask) return;

        // 获取对应的模板图片
        const templateImage = currentTask.templateImages[imageIndex];
        if (!templateImage) return;

        // 先更新前端状态，将文件标记为暂存
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              const updatedTemplateImages = [...task.templateImages];
              const newFiles = files.map((file) => ({
                id: generateUUID(),
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                status: "staged", // 标记为暂存状态
                fileData: file, // 保存文件对象用于后续提交
                taskTypeCode: null, // 后续提交时填充
                taskNeedDataCode: null, // 后续提交时填充
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

        // 设置有暂存文件的标记
        setHasStagedFiles(true);
        message.success('文件已暂存，点击"提交所有文件"按钮上传到服务器');
      } catch (error) {
        console.error("处理文件上传时出错:", error);
        message.error("文件暂存失败");
      }

      e.target.value = "";
    },
    [tasks]
  );

  // 检查任务是否所有必要的项都有文件上传
  const checkAllRequiredItemsUploaded = useCallback((task) => {
    // 检查主模板项 - 确保每个主模板都有至少一个上传成功的文件
    const mainTemplatesAllUploaded = task.templateImages.every(
      (img) =>
        img.uploadedFiles &&
        img.uploadedFiles.length > 0 &&
        img.uploadedFiles.some((f) => f.status === "done")
    );

    // 检查额外模板项（如果有）- 确保每个额外模板都有至少一个上传成功的文件
    const additionalTemplatesAllUploaded =
      !task.additionalTemplateImages ||
      task.additionalTemplateImages.every(
        (img) =>
          img.uploadedFiles &&
          img.uploadedFiles.length > 0 &&
          img.uploadedFiles.some((f) => f.status === "done")
      );

    return mainTemplatesAllUploaded && additionalTemplatesAllUploaded;
  }, []);

  // 添加文件上传到后端的函数
  const uploadFileToServer = useCallback(async (taskData) => {
    try {
      const formData = new FormData();

      // 添加任务类型
      formData.append("taskType", taskData.taskType);

      // 添加图片和对应的subtasks
      if (taskData.images && taskData.images.length > 0) {
        taskData.images.forEach((file, index) => {
          formData.append(`images`, file);
        });
      }

      if (taskData.imagesSubtasks && taskData.imagesSubtasks.length > 0) {
        formData.append(
          "imagesSubtasks",
          JSON.stringify(taskData.imagesSubtasks)
        );
      }

      // 添加文档和对应的subtasks
      if (taskData.docs && taskData.docs.length > 0) {
        taskData.docs.forEach((file) => {
          formData.append(`docs`, file);
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
  }, []);

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
      for (const [key, value] of Object.entries(taskTypeMapping)) {
        const taskType = fixedTasks.find((t) => t.id === key);
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
                  taskDataMapping[taskTypeCode]?.[img.desc] || "";

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
                  taskDataMapping[taskTypeCode]?.[img.desc] || "";

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
    [tasks, taskTypeMapping, taskDataMapping, fixedTasks, uploadFileToServer]
  );

  // 修改自动检查任务状态的useEffect，确保任务状态只由文件上传情况决定
  useEffect(() => {
    // 移除定期检查，只保留初始检查
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

    // 只进行初始检查，不设置定期检查
    updateTaskStatuses();

    // 清理函数
    return () => {};
  }, [checkAllRequiredItemsUploaded]);

  // 实现通用的额外模板处理函数
  const toggleAdditionalTemplates = useCallback((taskId) => {
    setShowAdditionalTemplates((prev) => (prev === taskId ? null : taskId));
  }, []);

  // 修改删除上传文件的函数
  const removeUploadedFile = useCallback(
    (taskId, imageIndex, fileId, isAdditional = false) => {
      try {
        // 更新前端状态
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              // 判断是主模板还是额外模板
              if (isAdditional) {
                const updatedAdditionalTemplates = [
                  ...task.additionalTemplateImages,
                ];
                const fileToRemove = updatedAdditionalTemplates[
                  imageIndex
                ].uploadedFiles.find((file) => file.id === fileId);
                if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
                  URL.revokeObjectURL(fileToRemove.url);
                }
                updatedAdditionalTemplates[imageIndex].uploadedFiles =
                  updatedAdditionalTemplates[imageIndex].uploadedFiles.filter(
                    (file) => file.id !== fileId
                  );
                return {
                  ...task,
                  additionalTemplateImages: updatedAdditionalTemplates,
                };
              } else {
                const updatedTemplateImages = [...task.templateImages];
                const fileToRemove = updatedTemplateImages[
                  imageIndex
                ].uploadedFiles.find((file) => file.id === fileId);
                if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
                  URL.revokeObjectURL(fileToRemove.url);
                }
                updatedTemplateImages[imageIndex].uploadedFiles =
                  updatedTemplateImages[imageIndex].uploadedFiles.filter(
                    (file) => file.id !== fileId
                  );
                return { ...task, templateImages: updatedTemplateImages };
              }
            }
            return task;
          })
        );
      } catch (error) {
        console.error("删除文件失败:", error);
        // 即使出现错误，仍然更新前端状态
      }
    },
    [tasks]
  );

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  // 下载模板文件
  const downloadTemplateFile = useCallback((fileUrl) => {
    try {
      // 创建一个临时的a标签用于下载
      const link = document.createElement("a");
      // 设置链接地址
      link.href = fileUrl;
      // 设置下载属性，文件名从URL中提取
      const fileName = fileUrl.split("/").pop();
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
  }, []);

  // 预览模板（根据类型显示图片预览或文件下载）
  const previewTemplate = useCallback((template, taskId, index = 0) => {
    if (template.type === "image") {
      // 对于图片类型，显示图片预览
      const imageUrls = [template.url];
      setGalleryImages(imageUrls);
      setCurrentImageIndex(0);
      setPreviewImage(imageUrls[index]);
      setCurrentTaskId(taskId);
      setShowImageGallery(true);
    } else {
      // 对于文件类型，提供下载选项并显示文件信息
      setCurrentTemplateFile(template);
      setCurrentTaskId(taskId);
      setShowFilePreviewModal(true);
    }
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
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  }, [galleryImages.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
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
    title: "日常任务资料",
    open: showImageUploadModal,
    onCancel: () => setShowImageUploadModal(false),
    footer: null,
    width: 800,
    centered: true,
    maxHeight: "80vh",
    styles: {
      body: {
        overflowY: "auto",
      },
    },
  };

  // 添加额外模板模态框的配置
  const additionalTemplatesModalProps = {
    title: "验收阶段资料",
    open: !!showAdditionalTemplates,
    onCancel: () => setShowAdditionalTemplates(null),
    footer: null,
    width: 800,
    centered: true,
    maxHeight: "80vh",
    styles: {
      body: {
        overflowY: "auto",
      },
    },
  };

  // 图片预览模态框配置
  const imageGalleryModalProps = {
    open: showImageGallery,
    onCancel: () => setShowImageGallery(false),
    footer: null,
    width: "95%",
    centered: true,
    modalRender: (node) => node, // 使用Portal确保定位正确
    closable: true,
    maskClosable: true,
    className: "image-gallery-modal",
  };

  // 文件预览模态框配置
  const filePreviewModalProps = {
    title: currentTemplateFile ? currentTemplateFile.desc : "文件预览",
    open: showFilePreviewModal,
    onCancel: () => setShowFilePreviewModal(false),
    footer: (
      <>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (currentTemplateFile) {
              downloadTemplateFile(currentTemplateFile.url);
            }
            setShowFilePreviewModal(false);
          }}
        >
          下载文件
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilePreviewModal(false)}
        >
          关闭
        </button>
      </>
    ),
    width: "60%",
    centered: true,
  };

  const getAdditionalTemplateTitle = useCallback(() => {
    const currentTask = getCurrentTask();
    if (!currentTask) return "";

    // 通过任务标题查找对应的任务ID
    const taskType = fixedTasks.find((t) => t.title === currentTask.title);
    if (taskType && additionalTemplateTitles[taskType.id]) {
      return additionalTemplateTitles[taskType.id];
    }

    return ""; // 默认返回空标题
  }, [getCurrentTask, fixedTasks, additionalTemplateTitles]);

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

            {/* 模板图片和上传数据按钮 */}
            {/* 模板图片和上传数据按钮 */}
            {task.templateImages && task.templateImages.length > 0 && (
              <div className="task-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => openImageUploadModal(task.id)}
                >
                  点击进入日常任务
                </button>
                {/* 通用的额外模板按钮，所有有额外模板的任务都显示 */}
                {task.additionalTemplateImages &&
                  task.additionalTemplateImages.length > 0 && (
                    <button
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        toggleAdditionalTemplates(task.id);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      {showAdditionalTemplates === task.id}
                      点击进入验收任务
                    </button>
                  )}
              </div>
            )}
          </div>
        ))}
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
                        previewTemplate(image, getCurrentTask().id, imageIndex);
                      }}
                    >
                      {image.type === "image" ? (
                        <img src={image.url} alt={`模板 ${imageIndex + 1}`} />
                      ) : (
                        <div className="file-placeholder">
                          <span className="file-icon">📄</span>
                          <span className="file-type">
                            {image.url.split(".").pop().toUpperCase()}
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
                        capture="environment"
                        onChange={(e) =>
                          handleFileUpload(e, getCurrentTask().id, imageIndex)
                        }
                      />
                      <span>+ 暂存相关文件</span>
                    </label>

                    {image.uploadedFiles && image.uploadedFiles.length > 0 && (
                      <div className="image-uploaded-files">
                        {image.uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`uploaded-file-item file-${
                              file.status || "uploaded"
                            }`}
                          >
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">
                              {(file.size / 1024).toFixed(1)}KB
                            </span>
                            {file.status === "staged" && (
                              <span className="file-status staged">已暂存</span>
                            )}
                            {file.status === "uploading" && (
                              <span className="file-status uploading">
                                上传中...
                              </span>
                            )}
                            {file.status === "success" && (
                              <span className="file-status success">
                                上传成功
                              </span>
                            )}
                            {file.status === "error" && (
                              <span className="file-status error">
                                上传失败
                              </span>
                            )}
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

            {/* 添加任务级提交按钮 */}
            <div
              className="task-submit-container"
              style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
                textAlign: "center",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => submitTaskFiles(getCurrentTask().id)}
                style={{
                  padding: "10px 24px",
                  fontSize: "16px",
                }}
              >
                提交该任务的所有文件
              </button>
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
            <img src={previewImage} alt="预览图片" className="gallery-image" />
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

      {/* 文件预览弹窗 - 使用Ant Design的Modal组件 */}
      <Modal {...filePreviewModalProps}>
        {currentTemplateFile && (
          <div className="file-preview-content">
            <div className="file-info">
              <div className="file-info-item">
                <strong>文件名称：</strong>
                {currentTemplateFile.url.split("/").pop()}
              </div>
              <div className="file-info-item">
                <strong>文件类型：</strong>
                {currentTemplateFile.url.split(".").pop().toUpperCase()}
              </div>
              <div className="file-info-item">
                <strong>文件描述：</strong>
                {currentTemplateFile.desc}
              </div>
              <div className="file-preview-tips">
                <p>点击"下载文件"按钮可获取该模板文件</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 新增：额外模板模态框 */}
      <Modal {...additionalTemplatesModalProps}>
        {showAdditionalTemplates && (
          <div className="additional-templates-modal">
            {tasks.map((task) => {
              if (task.id === showAdditionalTemplates) {
                return (
                  <div key={task.id}>
                    <h3 style={{ marginBottom: "16px" }}>
                      {task.title} - 验收阶段
                    </h3>
                    {task.additionalTemplateImages &&
                      task.additionalTemplateImages.map((image, imageIndex) => (
                        <div key={imageIndex} className="image-upload-pair">
                          <div className="image-container">
                            <div className="image-header">
                              <span className="image-description">
                                {image.desc}
                              </span>
                            </div>
                            <div
                              className="image-thumbnail"
                              onClick={() => {
                                if (image.type === "image") {
                                  previewTemplate(image, task.id);
                                } else {
                                  downloadTemplateFile(image.url);
                                }
                              }}
                            >
                              {image.type === "image" ? (
                                <img src={image.url} alt={image.desc} />
                              ) : (
                                <div className="file-placeholder">
                                  <span className="file-icon">📄</span>
                                  <span className="file-type">
                                    {image.url.split("#").pop().toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="image-upload-area">
                            {/* 保留原有的上传区域代码 */}
                            <label className="upload-button">
                              <input
                                type="file"
                                multiple
                                capture="environment"
                                onChange={(e) => {
                                  // 使用专门的处理函数处理额外模板的文件上传
                                  const currentTask = task;
                                  if (currentTask) {
                                    // 创建新的文件对象并添加到额外模板中
                                    const files = Array.from(e.target.files);
                                    const newFiles = files.map((file) => ({
                                      id: generateUUID(),
                                      name: file.name,
                                      size: file.size,
                                      type: file.type,
                                      url: URL.createObjectURL(file),
                                      status: "staged", // 标记为暂存状态
                                      fileData: file, // 保存文件对象用于后续提交
                                      taskTypeCode: null, // 后续提交时填充
                                      taskNeedDataCode: null, // 后续提交时填充
                                    }));

                                    // 更新状态
                                    setTasks((prevTasks) =>
                                      prevTasks.map((t) => {
                                        if (t.id === currentTask.id) {
                                          const updatedAdditionalTemplates = [
                                            ...t.additionalTemplateImages,
                                          ];
                                          if (
                                            !updatedAdditionalTemplates[
                                              imageIndex
                                            ].uploadedFiles
                                          ) {
                                            updatedAdditionalTemplates[
                                              imageIndex
                                            ].uploadedFiles = [];
                                          }
                                          updatedAdditionalTemplates[
                                            imageIndex
                                          ].uploadedFiles = [
                                            ...updatedAdditionalTemplates[
                                              imageIndex
                                            ].uploadedFiles,
                                            ...newFiles,
                                          ];
                                          return {
                                            ...t,
                                            additionalTemplateImages:
                                              updatedAdditionalTemplates,
                                          };
                                        }
                                        return t;
                                      })
                                    );

                                    // 设置有暂存文件的标记
                                    setHasStagedFiles(true);
                                    message.success(
                                      '文件已暂存，点击"提交所有文件"按钮上传到服务器'
                                    );
                                  }
                                }}
                              />
                              <span>+ 暂存相关文件</span>
                            </label>

                            {/* 显示已上传的额外模板文件 */}
                            {task.additionalTemplateImages[imageIndex] &&
                              task.additionalTemplateImages[imageIndex]
                                .uploadedFiles &&
                              task.additionalTemplateImages[imageIndex]
                                .uploadedFiles.length > 0 && (
                                <div className="image-uploaded-files">
                                  {task.additionalTemplateImages[
                                    imageIndex
                                  ].uploadedFiles.map((file) => (
                                    <div
                                      key={file.id}
                                      className={`uploaded-file-item file-${
                                        file.status || "uploaded"
                                      }`}
                                    >
                                      <span className="file-name">
                                        {file.name}
                                      </span>
                                      <span className="file-size">
                                        {(file.size / 1024).toFixed(1)}KB
                                      </span>
                                      {file.status === "staged" && (
                                        <span className="file-status staged">
                                          已暂存
                                        </span>
                                      )}
                                      {file.status === "uploading" && (
                                        <span className="file-status uploading">
                                          上传中...
                                        </span>
                                      )}
                                      {file.status === "success" && (
                                        <span className="file-status success">
                                          上传成功
                                        </span>
                                      )}
                                      {file.status === "error" && (
                                        <span className="file-status error">
                                          上传失败
                                        </span>
                                      )}
                                      <button
                                        className="delete-file-btn"
                                        onClick={() =>
                                          removeUploadedFile(
                                            task.id,
                                            imageIndex,
                                            file.id,
                                            true // 标记为额外模板
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

                    {/* 添加任务级提交按钮 */}
                    <div
                      className="task-submit-container"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #eee",
                        textAlign: "center",
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => submitTaskFiles(task.id)}
                        style={{
                          padding: "10px 24px",
                          fontSize: "16px",
                        }}
                      >
                        提交该任务的所有文件
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TaskList;
