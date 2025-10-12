import React from "react";

// 模板文件数据
const templateFiles = [
  {
    id: 1,
    name: "项目计划书模板.docx",
    description: "用于创建标准化项目计划书的模板文件",
    downloadUrl: "/templates/project-plan-template.docx",
  },
  {
    id: 2,
    name: "会议记录模板.xlsx",
    description: "用于记录和跟踪会议内容的Excel模板",
    downloadUrl: "/templates/meeting-minutes-template.xlsx",
  },
  {
    id: 3,
    name: "工作报告模板.pptx",
    description: "用于制作工作报告的PowerPoint模板",
    downloadUrl: "/templates/report-template.pptx",
  },
  {
    id: 4,
    name: "需求分析模板.docx",
    description: "用于进行项目需求分析的文档模板",
    downloadUrl: "/templates/requirement-analysis-template.docx",
  },
];

export default function DManageComponent() {
  // 处理文件下载
  const handleDownload = (url) => {
    // 在实际项目中，这里会是真实的文件下载逻辑    
    // 这里我们模拟下载行为
    console.log(`Downloading file from: ${url}`); 
    // 创建一个临时的a标签来触发下载
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="card">
        <h2 className="section-title">可下载模板</h2>
        <div className="template-list">
          {templateFiles.map((file) => (
            <div
              key={file.id}
              className="template-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderBottom: "1px solid var(--border-light)",
                marginBottom: "8px",
              }}
            >
              <div className="template-info">
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    color: "var(--text-primary)",
                  }}
                >
                  {file.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  {file.description}
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleDownload(file.downloadUrl)}
              >
                下载
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">使用说明</h2>
        <ul
          style={{
            paddingLeft: "20px",
            margin: "0",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          <li style={{ marginBottom: "8px" }}>
            点击"下载"按钮获取所需模板文件
          </li>
          <li style={{ marginBottom: "8px" }}>
            下载后可根据实际需求修改模板内容
          </li>
          <li style={{ marginBottom: "8px" }}>
            如有特殊模板需求，请联系管理员
          </li>
        </ul>
      </div>
    </>
  );
}