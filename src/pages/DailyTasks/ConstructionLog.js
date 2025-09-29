import React, { useState } from 'react';

function ConstructionLog() {
  // 模拟施工日志数据
  const [logs, setLogs] = useState([
    {
      id: 1,
      date: '2023-11-15',
      content: '1#楼地基混凝土浇筑完成，质量符合要求。现场安全检查无异常。',
      weather: '晴',
      temperature: '15-22°C',
      workerCount: 35,
      materialsUsed: '混凝土 200m³, 钢筋 5吨'
    },
    {
      id: 2,
      date: '2023-11-14',
      content: '完成1#楼地基钢筋绑扎工作，开始模板安装。材料进场验收合格。',
      weather: '多云',
      temperature: '12-18°C',
      workerCount: 40,
      materialsUsed: '钢筋 15吨, 模板 500㎡'
    },
    {
      id: 3,
      date: '2023-11-13',
      content: '完成现场场地平整，开始1#楼地基开挖。',
      weather: '小雨',
      temperature: '10-16°C',
      workerCount: 25,
      materialsUsed: '挖掘机 2台, 运输车辆 5辆'
    }
  ]);
  
  const [newLog, setNewLog] = useState({
    content: '',
    weather: '晴',
    temperature: '',
    workerCount: '',
    materialsUsed: ''
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 添加新日志
  const handleAddLog = (e) => {
    e.preventDefault();
    if (newLog.content.trim()) {
      const log = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...newLog
      };
      setLogs([log, ...logs]);
      setNewLog({ content: '', weather: '晴', temperature: '', workerCount: '', materialsUsed: '' });
      setShowAddForm(false);
    }
  };
  
  return (
    <div className="card">
      <div className="log-header">
        <h2 className="section-title">施工日志</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? '取消' : '添加日志'}
        </button>
      </div>
      
      {/* 添加日志表单 */}
      {showAddForm && (
        <form onSubmit={handleAddLog} className="add-log-form">
          <div className="form-group">
            <textarea
              placeholder="今日施工情况..."
              value={newLog.content}
              onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
              rows="4"
              required
            />
          </div>
          
          <div className="log-form-row">
            <div className="form-group log-form-group">
              <label>天气</label>
              <select
                value={newLog.weather}
                onChange={(e) => setNewLog({ ...newLog, weather: e.target.value })}
              >
                <option value="晴">晴</option>
                <option value="多云">多云</option>
                <option value="阴">阴</option>
                <option value="小雨">小雨</option>
                <option value="大雨">大雨</option>
              </select>
            </div>
            
            <div className="form-group log-form-group">
              <label>温度</label>
              <input
                type="text"
                placeholder="如：15-22°C"
                value={newLog.temperature}
                onChange={(e) => setNewLog({ ...newLog, temperature: e.target.value })}
              />
            </div>
          </div>
          
          <div className="log-form-row">
            <div className="form-group log-form-group">
              <label>施工人数</label>
              <input
                type="number"
                placeholder="人数"
                value={newLog.workerCount}
                onChange={(e) => setNewLog({ ...newLog, workerCount: e.target.value })}
                min="0"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>材料使用</label>
            <input
              type="text"
              placeholder="如：混凝土 200m³, 钢筋 5吨"
              value={newLog.materialsUsed}
              onChange={(e) => setNewLog({ ...newLog, materialsUsed: e.target.value })}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            保存日志
          </button>
        </form>
      )}
      
      {/* 日志列表 */}
      <div className="logs-list">
        {logs.map((log) => (
          <div key={log.id} className="log-item">
            <div className="log-date">
              {log.date}
              <div className="log-weather-info">
                <span className="weather">{log.weather}</span>
                <span className="temperature">{log.temperature}</span>
              </div>
            </div>
            
            <div className="log-content">
              {log.content}
            </div>
            
            <div className="log-details">
              <div className="log-detail-item">
                <span className="detail-label">施工人数：</span>
                <span className="detail-value">{log.workerCount}人</span>
              </div>
              <div className="log-detail-item">
                <span className="detail-label">材料使用：</span>
                <span className="detail-value">{log.materialsUsed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConstructionLog;