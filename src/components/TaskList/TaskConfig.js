// 任务配置常量
const TASK_CONFIG = {
  // 固定任务类型数组
  fixedTasks: [
    {
      id: "pile-point-layout-135",
      title: "桩点放样",
      description: "确定桩基础的准确位置和标高，确保施工符合设计要求",
      additionalTemplates: [
        {
          url: "",
          desc: "桩点放样工程测量控制点交桩记录表",
          type: "file",
        },
        {
          url: "",
          desc: "桩点位放样数据",
          type: "file",
        },
      ],
    },
    {
      id: "steel-cage-material-arrival",
      title: "钢筋笼钢筋进场",
      description: "验收进场钢筋的质量、规格和数量，确保符合设计和规范要求",
      templateImages: [
        {
          //hello图床 url: "https://www.helloimg.com/i/2025/10/13/68ecbcd8ad822.png",
          url:"/templates/钢筋笼钢筋进场日常/质量证明书.png",
          desc: "《出场质量证明书》",
          type: "image",
        },
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbc920aeb.png",
          desc: "《试验报告单》",
          type: "image",
        },
        {
          url: "",
          desc: "《原材料、试块、试件见证取样送检委托书》",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbcd5b8f7c.png",
          desc: "钢筋笼进场现场验收照片",
          type: "image",
        },
        {
          url: "",
          desc: "《建筑、安装原材料、设备及配件产品进场验收记录》",
          type: "file",
        },
      ],
    },
    {
      id: "steel-cage-storage-check",
      title: "钢筋笼钢筋存储环境检查",
      description: "检查钢筋存储环境是否符合要求，防止钢筋锈蚀和损坏",
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbcb17464.jpg",
          desc: "钢筋笼钢筋存储原材料存储照片",
          type: "image",
        },
      ],
    },
    {
      id: "steel-cage-welding",
      title: "钢筋笼焊接技术交底",
      description:
        "向施工人员详细说明钢筋笼焊接的技术要求、质量标准和安全注意事项",
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbdc95708.png",
          desc: "钢筋笼焊接技术交底照片",
          type: "image",
        },
        {
          url: "",
          desc: "《钢筋笼焊接安全技术交底书》",
          type: "file",
        },
      ],
    },
    {
      id: "pile-formation-tech",
      title: "成桩技术交底",
      description: "向施工人员详细说明成桩的技术要求、质量标准和安全注意事项",
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbd8945d6.png",
          desc: "成桩技术交底照片",
          type: "image",
        },
        {
          url: "",
          desc: "《安全技术交底书》",
          type: "file",
        },
      ],
    },
    {
      id: "steel-cage-production-135",
      title: "钢筋笼生产-135",
      description: "按照设计图纸和技术要求制作钢筋笼，确保尺寸准确、焊接牢固",
      templateImages: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbcb64867.png",
          desc: "钢筋笼生产作业照片",
          type: "image",
        },
        {
          url: "",
          desc: "《钢筋笼生产钢筋焊接连接接头工艺检验见证取样送检委托书》",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbd5dd191.jpg",
          desc: "钢筋笼生产监理验收照片",
          type: "image",
        },
      ],
    },
    {
      id: "steel-cage-production-246",
      title: "钢筋笼生产-246",
      description: "按照设计图纸和技术要求制作钢筋笼，确保尺寸准确、焊接牢固",
      templateImages: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbcb64867.png",
          desc: "钢筋笼生产作业照片",
          type: "image",
        },
        {
          url: "",
          desc: "《钢筋笼生产钢筋焊接连接接头工艺检验见证取样送检委托书》",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbd5dd191.jpg",
          desc: "钢筋笼生产监理验收照片",
          type: "image",
        },
      ],
    },

    {
      id: "pile-formation-135",
      title: "成桩-135",
      description: "按照设计要求和技术规范进行桩基础的施工，确保成桩质量",
      templateImages: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbcd6b71d1.png",
          desc: "成桩作业照片",
          type: "image",
        },
        {
          url: "",
          desc: "现拌混凝土施工记录",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbd3e8965.jpg",
          desc: "成桩监理验收照片",
          type: "image",
        },
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbcdcd7dc6.png",
          desc: "成桩桩长统计表",
          type: "image",
        },
      ],
    },
    {
      id: "pile-formation-246",
      title: "成桩-246",
      description: "按照设计要求和技术规范进行桩基础的施工，确保成桩质量",
      templateImages: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbcd6b71d1.png",
          desc: "成桩作业照片",
          type: "image",
        },
        {
          url: "",
          desc: "现拌混凝土施工记录",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbd3e8965.jpg",
          desc: "成桩监理验收照片",
          type: "image",
        },
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbcdcd7dc6.png",
          desc: "成桩桩长统计表",
          type: "image",
        },
      ],
    },
    {
      id: "steel-cage-lifting-135",
      title: "钢筋笼吊装与混凝土灌注-135",
      description: "将制作好的钢筋笼吊装入孔，并进行混凝土灌注，确保施工质量",
      templateImages: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbcf7ba69.png",
          desc: "钢筋笼吊装作业照片",
          type: "image",
        },
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbe4938e4.png",
          desc: "钢筋笼吊装混凝土灌注照片",
          type: "image",
        },
        {
          url: "",
          desc: "钢筋笼吊装混凝土开盘鉴定",
          type: "file",
        },
        {
          url: "",
          desc: "钢筋笼吊装施工记录",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbdd8a35b.png",
          desc: "钢筋笼吊装灌注完成照片",
          type: "image",
        },
        {
          url: "",
          desc: "《混凝土浇灌令》",
          type: "file",
        },
        {
          url: "",
          desc: "《人工挖孔灌注桩单桩施工记录》",
          type: "file",
        },
      ],
    },
    {
      id: "steel-cage-lifting-246",
      title: "钢筋笼吊装与混凝土灌注-246",
      description: "将制作好的钢筋笼吊装入孔，并进行混凝土灌注，确保施工质量",
      templateImages: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbcf7ba69.png",
          desc: "钢筋笼吊装作业照片",
          type: "image",
        },
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbe4938e4.png",
          desc: "钢筋笼吊装混凝土灌注照片",
          type: "image",
        },
        {
          url: "",
          desc: "钢筋笼吊装混凝土开盘鉴定",
          type: "file",
        },
        {
          url: "",
          desc: "钢筋笼吊装施工记录",
          type: "file",
        },
      ],
      additionalTemplates: [
        {
          url: "https://www.helloimg.com/i/2025/10/13/68ecbbdd8a35b.png",
          desc: "钢筋笼吊装灌注完成照片",
          type: "image",
        },
        {
          url: "",
          desc: "《混凝土浇灌令》",
          type: "file",
        },
        {
          url: "",
          desc: "《人工挖孔灌注桩单桩施工记录》",
          type: "file",
        },
      ],
    },
    {
      id: "construction-log",
      title: "施工日志",
      description: "填写施工日志，上传打印签字后的施工日志照片",
      templateImages: [
        {
          url: "",
          desc: "施工日志",
          type: "image",
        },
      ],
    },
  ],

  // 任务类型与后端编码的映射关系
  taskTypeMapping: {
    "pile-point-layout": "ZHUANGDIAN_FANGYANG",
    "steel-cage-storage-check": "GANGJINLONG_GANGJIN_CUNCHU",
    "steel-cage-material-arrival": "GANGJINLONG_GANGJIN_JINCHANG",
    "steel-cage-welding": "GANGJINGLONG_HANJIE_JISHU",
    "steel-cage-production": "GANGJINLONG_SHENGCHAN",
    "steel-cage-production-135": "GANGJINLONG_SHENGCHAN_135",
    "steel-cage-production-246": "GANGJINLONG_SHENGCHAN_246",
    "pile-formation-tech": "CHENGZHUANG_JISHU",
    "pile-formation": "CHENGZHUANG",
    "pile-formation-135": "CHENGZHUANG_135",
    "pile-formation-246": "CHENGZHUANG_246",
    "steel-cage-lifting": "GANGJINLONG_DIAOZHUANG",
    "steel-cage-lifting-135": "GANGJINLONG_DIAOZHUANG_135",
    "steel-cage-lifting-246": "GANGJINLONG_DIAOZHUANG_246",
    "construction-log": "SHIGONGRIZHI",
  },

  // 任务数据编码映射关系
  taskDataMapping: {
    ZHUANGDIAN_FANGYANG: {
      桩点放样工程测量控制点交桩记录表: "ZHUANGDIAN_FANGYANG_JILUBIAO",
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
      钢筋笼钢筋进场试验报告单: "GANGJINLONG_GANGJIN_JINCHANG_CESHI_BAOGAODAN",
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
    SHIGONGRIZHI: {
      施工日志: "SHIGONGRIZHI",
    },
    // 添加带后缀的任务类型映射，复用基础映射
    GANGJINLONG_SHENGCHAN_135: {
      钢筋笼生产作业照片: "GANGJINLONG_SHENGCHAN_ZUOYE_ZHAOPIAN_135",
      钢筋笼生产检查照片: "GANGJINLONG_SHENGCHAN_JIANCHA_ZHAOPIAN_135",
      钢筋笼生产钢筋焊接连接接头工艺检验见证取样送检委托书:
        "GANGJINLONG_SHENGCHAN_SONGJIAN_WEITUOSHU_135",
      钢筋笼生产监理验收照片:
        "GANGJINLONG_SHENGCHAN_JIANLI_YANSHOU_ZHAOPIAN_135",
    },
    GANGJINLONG_SHENGCHAN_246: {
      钢筋笼生产作业照片: "GANGJINLONG_SHENGCHAN_ZUOYE_ZHAOPIAN_246",
      钢筋笼生产检查照片: "GANGJINLONG_SHENGCHAN_JIANCHA_ZHAOPIAN_246",
      钢筋笼生产钢筋焊接连接接头工艺检验见证取样送检委托书:
        "GANGJINLONG_SHENGCHAN_SONGJIAN_WEITUOSHU_246",
      钢筋笼生产监理验收照片:
        "GANGJINLONG_SHENGCHAN_JIANLI_YANSHOU_ZHAOPIAN_246",
    },
    CHENGZHUANG_135: {
      成桩作业照片: "CHENGZHUANG_ZUOYE_ZHAOPIAN_135",
      成桩现拌混凝土施工记录: "CHENGZHUANG_SHIGONG_JILU_135",
      成桩监理验收照片: "CHENGZHUANG_JIANLI_YANSHOU_ZHAOPIAN_135",
      成桩桩长统计表: "CHENGZHUANG_JIANLI_ZHUANGCHANG_TONGJIBIAO_135",
    },
    CHENGZHUANG_246: {
      成桩作业照片: "CHENGZHUANG_ZUOYE_ZHAOPIAN_246",
      成桩现拌混凝土施工记录: "CHENGZHUANG_SHIGONG_JILU_246",
      成桩监理验收照片: "CHENGZHUANG_JIANLI_YANSHOU_ZHAOPIAN_246",
      成桩桩长统计表: "CHENGZHUANG_JIANLI_ZHUANGCHANG_TONGJIBIAO_246",
    },
    GANGJINLONG_DIAOZHUANG_135: {
      钢筋笼吊装作业照片: "GANGJINLONG_DIAOZHUANG_ZUOYE_ZHAOPIAN_135",
      钢筋笼吊装混凝土灌注照片: "GANGJINLONG_DIAOZHUANG_GUANZHU_ZHAOPIAN_135",
      钢筋笼吊装混凝土开盘鉴定: "GANGJINLONG_DIAOZHUANG_KAIPAN_JIANDING_135",
      钢筋笼吊装施工记录: "GANGJINLONG_DIAOZHUANG_SHIGONG_JILU_135",
      钢筋笼吊装灌注完成照片:
        "GANGJINLONG_DIAOZHUANG_GUANZHU_WANCHENG_ZHAOPIAN_135",
      钢筋笼吊装混凝土浇灌令: "GANGJINLONG_DIAOZHUANG_JIAOGUANLING_135",
      钢筋笼吊装人工挖孔灌注桩单桩施工记录:
        "GANGJINLONG_DIAOZHUANG_GUANZHU_CHENGZHUANG_JILU_135",
    },
    GANGJINLONG_DIAOZHUANG_246: {
      钢筋笼吊装作业照片: "GANGJINLONG_DIAOZHUANG_ZUOYE_ZHAOPIAN_246",
      钢筋笼吊装混凝土灌注照片: "GANGJINLONG_DIAOZHUANG_GUANZHU_ZHAOPIAN_246",
      钢筋笼吊装混凝土开盘鉴定: "GANGJINLONG_DIAOZHUANG_KAIPAN_JIANDING_246",
      钢筋笼吊装施工记录: "GANGJINLONG_DIAOZHUANG_SHIGONG_JILU_246",
      钢筋笼吊装灌注完成照片:
        "GANGJINLONG_DIAOZHUANG_GUANZHU_WANCHENG_ZHAOPIAN_246",
      钢筋笼吊装混凝土浇灌令: "GANGJINLONG_DIAOZHUANG_JIAOGUANLING_246",
      钢筋笼吊装人工挖孔灌注桩单桩施工记录:
        "GANGJINLONG_DIAOZHUANG_GUANZHU_CHENGZHUANG_JILU_246",
    },
  },

  // 验收阶段标题映射
  additionalTemplateTitles: {
    "steel-cage-material-arrival": "进场验收附加资料:",
    "steel-cage-production": "验收记录:",
    "pile-formation": "成桩验收资料:",
    "steel-cage-lifting": "成桩完成后:",
  },
};

export { TASK_CONFIG };
