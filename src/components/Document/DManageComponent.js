import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, List, Button, message, Empty, Collapse } from "antd";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";
import axios from "axios";

const { Panel } = Collapse;

export default function DManageComponent() {
  // 状态管理
  const [templateData, setTemplateData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从API获取数据
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setLoading(true);
        // 调用后端API
        const response = await axios.get("/api/daily_task/templateResource");
        setTemplateData(response.data);
      } catch (error) {
        message.error("获取模板数据失败，请稍后重试");
        console.error("Failed to fetch template data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, []);

  // 处理文件下载
  const handleDownload = (file) => {
    try {
      // 创建一个临时的a标签来触发下载
      const link = document.createElement("a");
      link.href = file.resourceUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(`开始下载: ${file.fileName}`);
    } catch (error) {
      message.error(`下载失败: ${file.fileName}`);
      console.error("Failed to download file:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[{ title: "模板文件", key: "root" }]}
        style={{ marginBottom: "20px" }}
      />

      {/* 内容区域 - 使用折叠面板实现 */}
      <Card loading={loading} title="模板文件">
        {!loading &&
          (templateData.length > 0 ? (
            <Collapse defaultActiveKey={[]}>
              {templateData.map((category, index) => (
                <Panel
                  header={`${category.taskNeedDateType} (共 ${category.taskNeedDate.length} 个文件)`}
                  key={index}
                  style={{ marginBottom: "8px" }}
                >
                  <List
                    dataSource={category.taskNeedDate}
                    renderItem={(file) => (
                      <List.Item
                        actions={[
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(file)}
                          >
                            下载
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<FileOutlined style={{ fontSize: "24px" }} />}
                          title={file.fileName}
                          description={`文件路径: ${file.resourceUrl}`}
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Empty description="暂无模板数据" />
          ))}
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: "20px" }}>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={{ marginBottom: "8px" }}>
            点击折叠面板查看该分类下的所有模板文件
          </li>
          <li style={{ marginBottom: "8px" }}>
            点击"下载"按钮获取所需模板文件
          </li>
          <li style={{ marginBottom: "8px" }}>
            如有其他模板需求，请联系管理员
          </li>
        </ul>
      </Card>
    </div>
  );
}
