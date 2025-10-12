import React, { useState } from 'react';

// 从响应头中解析文件名
export function getFilenameFromDisposition(disposition) {
  if (!disposition) return 'download.xls';
  const star = /filename\*\s*=\s*([^']*)''([^;]+)/i.exec(disposition);
  if (star && star[2]) {
    try { return decodeURIComponent(star[2]); } catch {}
  }
  const normal = /filename\s*=\s*('|")?([^;'"\s]+)\1/i.exec(disposition);
  if (normal && normal[2]) return normal[2];
  return 'download.xls';
}

export default function ExportButton({ logData, onExportStart, onExportEnd }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    // 调用开始导出回调
    if (onExportStart) {
      onExportStart();
    }
    
    setLoading(true);
    try {
      // 构造导出数据，使用传入的日志数据或默认值
      const payload = {
        projectName: logData?.projectName || 'XX水利工程',
        date: logData?.date || new Date().toISOString().split('T')[0],
        weather: logData ? `${logData.shiftMorning}/${logData.shiftAfternoon}` : '晴/晴',
        items: logData ? [{ 
          subtask: logData.workPart || '施工任务', 
          startTime: '08:00', 
          endTime: '18:00' 
        }] : [{ subtask: '施工任务', startTime: '08:00', endTime: '12:00' }]
      };

      const resp = await fetch('/api/daily_task/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`导出失败 ${resp.status}: ${text}`);
      }

      const disposition = resp.headers.get('Content-Disposition') || '';
      const filename = getFilenameFromDisposition(disposition);
      const ct = resp.headers.get('Content-Type') || 'application/vnd.ms-excel';

      const blob = await resp.blob();
      const file = new File([blob], filename, { type: ct });
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
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
      {loading ? '导出中…' : '导出施工日志'}
    </button>
  );
}
