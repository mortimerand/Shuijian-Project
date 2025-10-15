import React, { useState } from "react";

// 从响应头中解析文件名
export function getFilenameFromDisposition(disposition) {
  if (!disposition) return "download.xls";
  const star = /filename\*\s*=\s*([^']*)''([^;]+)/i.exec(disposition);
  if (star && star[2]) {
    try {
      return decodeURIComponent(star[2]);
    } catch {}
  }
  const normal = /filename\s*=\s*('|")?([^;'"\s]+)\1/i.exec(disposition);
  if (normal && normal[2]) return normal[2];
  return "download.xls";
}

export default function ExportButton({ logData, onExportStart, onExportEnd }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!logData) {
      //确保logData存在且有效
      console.warn("尝试在没有日志数据的情况下导出文件");
      alert("请先成功提交施工日志后再进行导出");
      return;
    }

    // 调用开始导出回调
    if (onExportStart) {
      onExportStart();
    }

    setLoading(true);
    try {
      // 构造导出数据，使用传入的日志数据或默认值
      const resp = await fetch("/api/daily_task/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`导出失败 ${resp.status}: ${text}`);
      }

      const disposition = resp.headers.get("Content-Disposition") || "";
      const filename = getFilenameFromDisposition(disposition);
      const ct = resp.headers.get("Content-Type") || "application/vnd.ms-excel";

      // 改进的下载逻辑
      const blob = await resp.blob();

      // 检查blob是否为空
      if (blob.size === 0) {
        throw new Error("下载的文件为空");
      }

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      // 确保在用户交互上下文中触发下载
      document.body.appendChild(a);

      // 使用setTimeout确保在下一个事件循环中执行，提高兼容性
      setTimeout(() => {
        a.click();
        // 延迟移除a标签和释放URL，确保下载过程完成
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      }, 0);
    } catch (e) {
      console.error("导出失败:", e);
      alert(e.message);
    } finally {
      setLoading(false);
      // 调用结束导出回调
      if (onExportEnd) {
        onExportEnd();
      }
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="btn btn-secondary"
    >
      {loading ? "导出中…" : "导出施工日志"}
    </button>
  );
}
