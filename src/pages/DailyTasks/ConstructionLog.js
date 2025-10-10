import React, { useState } from "react";

function ConstructionLog() {
  // 根据后端参数模板定义日志字段
  const [newLog, setNewLog] = useState({
    projectName: "", // 工程项目
    sectionOrPileNo: "", // 施工部位/桩号
    logNo: "", // 编号
    date: new Date().toISOString().split("T")[0], // 日期
    temperature: "", // 温度（例：18~25℃）
    shiftMorning: "晴", // 上午天气
    shiftAfternoon: "晴", // 下午天气
    workPart: "", // 施工部位
    attendance: "", // 出勤人数
    operation: "", // 操作负责人
    workContent: "", // 当日施工内容
    progress: "", // 变更及技术核定
    content: "", // 技术交底
    content0: "", // 材料进场检验情况
    content1: "", // 隐蔽工程验收
    content2: "", // 材料检验及混凝土砂浆试块制作
    content3: "", // 质量情况
    content4: "", // 安全情况
    content5: "", // 其他
    content6: "", // 施工员
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [logs, setLogs] = useState([]); // 存储从后端获取的日志
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOfflineSigning, setShowOfflineSigning] = useState(false); // 显示线下签字提示
  const [submittedLog, setSubmittedLog] = useState(null); // 存储已提交的日志数据

  // 从响应头中解析文件名
  const getFilenameFromDisposition = (disposition) => {
    if (!disposition) return "download.txt";
    const star = /filename\*\s*=\s*([^']*)''([^;]+)/i.exec(disposition);
    if (star && star[2]) {
      try {
        return decodeURIComponent(star[2]);
      } catch {}
    }
    const normal = /filename\s*=\s*("?)([^";]+)\1/i.exec(disposition);
    if (normal && normal[2]) return normal[2];
    return "download.txt";
  };

  // 提交日志到后端
  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 根据项目中其他API调用的模式，使用相应的接口地址
      const response = await fetch("api/daily_task/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLog),
      });

      if (!response.ok) {
        throw new Error("提交失败，请重试");
      }

      const result = await response.json();
      if (result.success) {
        // 保存已提交的日志数据
        setSubmittedLog({ ...newLog });
        alert("施工日志提交成功！");
        // 显示线下签字提示
        setShowOfflineSigning(true);
      } else {
        throw new Error(result.message || "提交失败");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 下载日志文件
  const downloadLogFile = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/construction_log/download", {
        method: "GET",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`下载失败 ${response.status}: ${text}`);
      }

      // 从响应头获取文件名和内容类型
      const disposition = response.headers.get("Content-Disposition") || "";
      const filename = getFilenameFromDisposition(disposition);
      const contentType = response.headers.get("Content-Type") || "text/plain";

      // 处理文件下载
      const blob = await response.blob();
      const file = new File([blob], filename, { type: contentType });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`下载失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setNewLog({
      projectName: "",
      sectionOrPileNo: "",
      logNo: "",
      date: new Date().toISOString().split("T")[0],
      temperature: "",
      shiftMorning: "晴",
      shiftAfternoon: "晴",
      workPart: "",
      attendance: "",
      operation: "",
      workContent: "",
      progress: "",
      content: "",
      content0: "",
      content1: "",
      content2: "",
      content3: "",
      content4: "",
      content5: "",
      content6: "",
    });
    setShowOfflineSigning(false);
    setSubmittedLog(null);
    setShowAddForm(false);
  };

  return (
    <div className="card">
      <div className="log-header">
        <h2 className="section-title">施工日志</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? "取消" : "添加日志"}
          </button>
          <button
            onClick={downloadLogFile}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? "下载中..." : "下载日志文件"}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "red", padding: "10px" }}>{error}</div>}

      {/* 添加日志表单 */}
      {showAddForm && (
        <form onSubmit={handleSubmitLog} className="add-log-form">
          {/* 基本信息 */}
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ marginBottom: "15px", marginTop: 0 }}>基本信息</h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div className="form-group">
                <label>工程项目 *</label>
                <input
                  type="text"
                  value={newLog.projectName}
                  onChange={(e) =>
                    setNewLog({ ...newLog, projectName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>施工部位/桩号 *</label>
                <input
                  type="text"
                  value={newLog.sectionOrPileNo}
                  onChange={(e) =>
                    setNewLog({ ...newLog, sectionOrPileNo: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div className="form-group">
                <label>编号 *</label>
                <input
                  type="text"
                  value={newLog.logNo}
                  onChange={(e) =>
                    setNewLog({ ...newLog, logNo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>日期 *</label>
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) =>
                    setNewLog({ ...newLog, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>温度（例：18~25℃）</label>
                <input
                  type="text"
                  value={newLog.temperature}
                  onChange={(e) =>
                    setNewLog({ ...newLog, temperature: e.target.value })
                  }
                  placeholder="18~25℃"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div className="form-group">
                <label>上午天气</label>
                <select
                  value={newLog.shiftMorning}
                  onChange={(e) =>
                    setNewLog({ ...newLog, shiftMorning: e.target.value })
                  }
                >
                  <option value="晴">晴</option>
                  <option value="多云">多云</option>
                  <option value="阴">阴</option>
                  <option value="小雨">小雨</option>
                  <option value="大雨">大雨</option>
                </select>
              </div>
              <div className="form-group">
                <label>下午天气</label>
                <select
                  value={newLog.shiftAfternoon}
                  onChange={(e) =>
                    setNewLog({ ...newLog, shiftAfternoon: e.target.value })
                  }
                >
                  <option value="晴">晴</option>
                  <option value="多云">多云</option>
                  <option value="阴">阴</option>
                  <option value="小雨">小雨</option>
                  <option value="大雨">大雨</option>
                </select>
              </div>
            </div>
          </div>

          {/* 施工信息 */}
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ marginBottom: "15px", marginTop: 0 }}>施工信息</h4>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>施工部位</label>
                <input
                  type="text"
                  value={newLog.workPart}
                  onChange={(e) =>
                    setNewLog({ ...newLog, workPart: e.target.value })
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div className="form-group">
                <label>出勤人数</label>
                <input
                  type="text"
                  value={newLog.attendance}
                  onChange={(e) =>
                    setNewLog({ ...newLog, attendance: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>操作负责人</label>
                <input
                  type="text"
                  value={newLog.operation}
                  onChange={(e) =>
                    setNewLog({ ...newLog, operation: e.target.value })
                  }
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>当日施工内容 *</label>
                <textarea
                  value={newLog.workContent}
                  onChange={(e) =>
                    setNewLog({ ...newLog, workContent: e.target.value })
                  }
                  rows="3"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>变更及技术核定</label>
                <textarea
                  value={newLog.progress}
                  onChange={(e) =>
                    setNewLog({ ...newLog, progress: e.target.value })
                  }
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* 验收与检验信息 */}
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ marginBottom: "15px", marginTop: 0 }}>
              验收与检验信息
            </h4>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>技术交底</label>
                <textarea
                  value={newLog.content}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content: e.target.value })
                  }
                  rows="2"
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>材料进场检验情况</label>
                <textarea
                  value={newLog.content0}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content0: e.target.value })
                  }
                  rows="2"
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>隐蔽工程验收</label>
                <textarea
                  value={newLog.content1}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content1: e.target.value })
                  }
                  rows="2"
                  placeholder="是否进行隐蔽工程验收"
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>材料检验及混凝土砂浆试块制作</label>
                <textarea
                  value={newLog.content2}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content2: e.target.value })
                  }
                  rows="2"
                  placeholder="请填写材料送检情况"
                />
              </div>
            </div>
          </div>

          {/* 质量与安全信息 */}
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ marginBottom: "15px", marginTop: 0 }}>
              质量与安全信息
            </h4>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>质量情况</label>
                <textarea
                  value={newLog.content3}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content3: e.target.value })
                  }
                  rows="2"
                  placeholder="请填写今日质量检查情况"
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>安全情况</label>
                <textarea
                  value={newLog.content4}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content4: e.target.value })
                  }
                  rows="2"
                  placeholder="请填写今日安全检查情况"
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>其他</label>
                <textarea
                  value={newLog.content5}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content5: e.target.value })
                  }
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* 负责人信息 */}
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <div className="form-group">
                <label>施工员 *</label>
                <input
                  type="text"
                  value={newLog.content6}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content6: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "提交中..." : "提交日志"}
          </button>
        </form>
      )}

      {/* 线下签字提示 - 仅在提交日志后显示 */}
      {showOfflineSigning && !showAddForm && (
        <div
          style={{
            marginBottom: "15px",
            padding: "15px",
            border: "1px solid #eee",
            borderRadius: "4px",
            backgroundColor: "#f0f8ff",
          }}
        >
          <h4>线下签字提示</h4>
          <p style={{ margin: '10px 0' }}>
            施工日志已提交成功！请按照以下流程完成线下签字：
          </p>
          <ol style={{ margin: '10px 0 0 20px' }}>
            <li style={{ marginBottom: '5px' }}>下载生成的日志文件</li>
            <li style={{ marginBottom: '5px' }}>打印日志文件并进行线下签字</li>
            <li style={{ marginBottom: '5px' }}>签字完成后请妥善保管纸质文档</li>
          </ol>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={resetForm}
              className="btn btn-primary"
            >
              完成
            </button>
          </div>
        </div>
      )}

      {/* 日志列表 - 可以从后端获取数据并显示 */}
      <div className="logs-list">
        {logs.length === 0 && !showAddForm && !showOfflineSigning && (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            暂无施工日志记录
          </div>
        )}
        {/* 这里可以根据需要添加从后端获取的日志列表的渲染 */}
      </div>
    </div>
  );
}

export default ConstructionLog;
