import React, { useState, useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import "./DailyTasks.css";

function ProgressSummary() {
  // 状态管理
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从后端获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // API调用
      const response = await fetch("/api/daily_task/progress", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`请求失败，状态码: ${response.status}`);
      }

      // 解析JSON数据
      const result = await response.json();

      // 根据summary.txt中的数据格式，检查返回的数据结构
      // 修改 message 字段的检查条件，使其接受 "success"
      if (
        result.code === "200" &&
        (result.message === "成功" || result.message === "success") &&
        Array.isArray(result.data)
      ) {
        setData(result.data);
      } else {
        throw new Error("获取数据失败: " + (result.message || "未知错误"));
      }
    } catch (err) {
      // 捕获并设置错误信息
      setError(err.message);
      // 在控制台记录详细错误
      console.error("获取任务进度数据失败:", err);

      // 提供模拟数据作为备用，避免白屏
      setData([
        {
          taskType: "GANGJINLONG_SHENGCHAN_246",
          taskName: "钢筋笼生产_246",
          taskStatus: "进行中",
          taskPlanStart: "2024-01-15",
          taskPlanComplete: "2024-01-25",
        },
        {
          taskType: "GANGJINLONG_SHENGCHAN_247",
          taskName: "钢筋笼生产_247",
          taskStatus: "已完成",
          taskPlanStart: "2024-01-10",
          taskPlanComplete: "2024-01-14",
        },
      ]);
    } finally {
      // 无论成功失败，都要结束加载状态
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  // 定义表格列配置
  const columns = [
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
    },
    {
      title: "任务状态",
      dataIndex: "taskStatus",
      key: "taskStatus",
      // 根据任务状态设置不同的样式
      // 扩展任务状态的渲染逻辑，添加对 "进度落后" 和 "未开始" 的支持
      render: (status) => {
        let color = "";
        if (status === "进行中") {
          color = "#1890ff";
        } else if (status === "已完成") {
          color = "#52c41a";
        } else if (status === "已逾期" || status === "进度落后") {
          color = "#f5222d";
        } else if (status === "未开始") {
          color = "#d9d9d9";
        }
        return <span style={{ color }}>{status}</span>;
      },
      filters: [
        { text: "进行中", value: "进行中" },
        { text: "已完成", value: "已完成" },
        { text: "已逾期", value: "已逾期" },
        { text: "进度落后", value: "进度落后" },
        { text: "未开始", value: "未开始" },
      ],
      onFilter: (value, record) => record.taskStatus === value,
    },
    {
      title: "计划开始时间",
      dataIndex: "taskPlanStart",
      key: "taskPlanStart",
      sorter: (a, b) => new Date(a.taskPlanStart) - new Date(b.taskPlanStart),
    },
    {
      title: "计划完成时间",
      dataIndex: "taskPlanComplete",
      key: "taskPlanComplete",
      sorter: (a, b) =>
        new Date(a.taskPlanComplete) - new Date(b.taskPlanComplete),
    },
  ];

  return (
    <div className="progress-summary-container">
      <h2>任务进度汇总</h2>
      <button
        className="btn btn-primary refresh-button"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? "刷新中..." : "刷新数据"}
      </button>

      {error && (
        <Alert
          message="获取数据失败"
          description={error}
          type="error"
          showIcon
          className="error-alert"
        />
      )}

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="taskType"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: "暂无任务数据",
          }}
        />
      )}
    </div>
  );
}

export default ProgressSummary;
