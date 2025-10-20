import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, List, Button, message, Empty, Collapse } from "antd";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";
import axios from "axios";
import DocumentData from "./DocumentData.json";

const { Panel } = Collapse;

export default function DManageComponent({ resourceUrl }) {
  // 状态管理
  const [templateData, setTemplateData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 使用本地数据初始化
  useEffect(() => {
    const initializeData = () => {
      try {
        setLoading(true);
        // 确保数据格式正确
        if (Array.isArray(DocumentData)) {
          // 验证数据结构
          const validData = DocumentData.filter(
            (item) =>
              item &&
              typeof item.taskNeedDateType === "string" &&
              Array.isArray(item.taskNeedDate)
          );
          setTemplateData(validData);
        } else {
          console.error("DocumentData不是数组格式", DocumentData);
          message.error("数据格式错误");
          setTemplateData([]);
        }
      } catch (error) {
        message.error("初始化数据失败");
        console.error("Failed to initialize data:", error);
        setTemplateData([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // 处理文件下载 - 通过API实现
  const handleDownload = async (file) => {
    try {
      message.loading(`正在准备下载: ${file.fileName}`);

      // 向后端发送请求获取文件，传入必要参数
      const response = await axios.get("/api/daily_task/download", {
        params: {
          resourceUrl: file.resourceUrl,
        },
        responseType: "blob",
      });

      // 创建Blob对象和下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.destroy();
      message.success(`开始下载: ${file.fileName}`);
    } catch (error) {
      message.destroy();
      message.error(`下载失败: ${file.fileName}`);
      console.error("Failed to download file:", error);
    }
  };

  const getFileType = (resourceUrl) => {
    if (!resourceUrl) return "";
    const lastDotIndex = resourceUrl.lastIndexOf(".");
    if (lastDotIndex === -1) return "";
    return resourceUrl.substring(lastDotIndex + 1).toUpperCase();
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
          // 确保templateData是数组后再进行map操作
          (Array.isArray(templateData) && templateData.length > 0 ? (
            <Collapse defaultActiveKey={[]}>
              {templateData.map((category, index) =>
                // 确保category和category.taskNeedDate存在且有效
                category &&
                category.taskNeedDate &&
                Array.isArray(category.taskNeedDate) ? (
                  <Panel
                    key={index}
                    header={`${category.taskNeedDateType || "未分类"} (共 ${
                      category.taskNeedDate.length
                    } 个文件)`}
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
                            avatar={
                              <FileOutlined style={{ fontSize: "24px" }} />
                            }
                            title={file.fileName || "未知文件名"}
                            description={`文件类型: ${getFileType(
                              file.resourceUrl
                            )}`}
                          />
                        </List.Item>
                      )}
                    />
                  </Panel>
                ) : (
                  <div key={index} style={{ padding: "16px", color: "#999" }}>
                    无效的分类数据
                  </div>
                )
              )}
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
