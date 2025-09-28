import React, { useState } from 'react';

function ProgressSummary() {
  // 模拟项目进度数据
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: '1#住宅楼',
      totalProgress: 30,
      expectedCompletion: '2024-06-30',
      tasks: [
        { name: '地基工程', progress: 100, status: 'completed' },
        { name: '主体结构', progress: 20, status: 'in-progress' },
        { name: '墙体砌筑', progress: 0, status: 'pending' },
        { name: '水电安装', progress: 0, status: 'pending' },
        { name: '室内装修', progress: 0, status: 'pending' }
      ]
    },
    {
      id: 2,
      name: '2#住宅楼',
      totalProgress: 15,
      expectedCompletion: '2024-07-30',
      tasks: [
        { name: '地基工程', progress: 80, status: 'in-progress' },
        { name: '主体结构', progress: 0, status: 'pending' },
        { name: '墙体砌筑', progress: 0, status: 'pending' },
        { name: '水电安装', progress: 0, status: 'pending' },
        { name: '室内装修', progress: 0, status: 'pending' }
      ]
    },
    {
      id: 3,
      name: '小区配套设施',
      totalProgress: 10,
      expectedCompletion: '2024-08-30',
      tasks: [
        { name: '道路施工', progress: 20, status: 'in-progress' },
        { name: '绿化工程', progress: 0, status: 'pending' },
        { name: '景观工程', progress: 0, status: 'pending' },
        { name: '公共设施', progress: 0, status: 'pending' }
      ]
    }
  ]);
  
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  
  // 获取进度条颜色
  const getProgressColor = (progress) => {
    if (progress >= 80) return '#2ecc71';
    if (progress >= 50) return '#3498db';
    if (progress >= 20) return '#f39c12';
    return '#e74c3c';
  };
  
  return (
    <div className="progress-summary-container">
      <div className="summary-header">
        <h2>总进度</h2>
      </div>
      
      {/* 项目选择器 */}
      <div className="project-selector">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`project-button ${selectedProject.id === project.id ? 'active' : ''}`}
            onClick={() => setSelectedProject(project)}
          >
            {project.name}
          </button>
        ))}
      </div>
      
      {/* 总体进度 */}
      <div className="overall-progress">
        <h3>{selectedProject.name} - 总体进度</h3>
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{
              width: `${selectedProject.totalProgress}%`,
              backgroundColor: getProgressColor(selectedProject.totalProgress)
            }}
          />
        </div>
        <div className="progress-info">
          <span className="progress-percentage">
            {selectedProject.totalProgress}%
          </span>
          <span className="progress-completion">
            预计完成日期：{selectedProject.expectedCompletion}
          </span>
        </div>
      </div>
      
      {/* 分项工程进度 */}
      <div className="subtasks-progress">
        <h3>分项工程进度</h3>
        <div className="subtasks-list">
          {selectedProject.tasks.map((task, index) => (
            <div key={index} className="subtask-progress-item">
              <div className="subtask-info">
                <span className="subtask-name">{task.name}</span>
                <span className="subtask-percentage">{task.progress}%</span>
              </div>
              <div className="subtask-progress-bar-container">
                <div 
                  className="subtask-progress-bar"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: getProgressColor(task.progress)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 进度图表（简化版） */}
      <div className="progress-chart">
        <h3>项目进度对比</h3>
        <div className="chart-bars">
          {projects.map((project) => (
            <div key={project.id} className="chart-bar-item">
              <div className="chart-bar-label">{project.name}</div>
              <div className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{
                    height: `${project.totalProgress}%`,
                    backgroundColor: getProgressColor(project.totalProgress)
                  }}
                />
              </div>
              <div className="chart-bar-percentage">{project.totalProgress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressSummary;