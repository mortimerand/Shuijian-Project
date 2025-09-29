import React, { useState, useEffect } from 'react';

function TaskList() {
  // 模拟任务数据
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: '检查施工现场安全',
      description: '检查脚手架、防护设施等是否符合安全标准',
      status: 'pending', // pending, in-progress, completed
      priority: 'high', // high, medium, low
      deadline: '今天 10:00'
    },
    {
      id: 2,
      title: '召开每日例会',
      description: '总结昨天工作，安排今天任务',
      status: 'completed',
      priority: 'high',
      deadline: '今天 09:00'
    },
    {
      id: 3,
      title: '检查混凝土浇筑情况',
      description: '查看1#楼地基混凝土浇筑质量',
      status: 'in-progress',
      priority: 'medium',
      deadline: '今天 14:00'
    },
    {
      id: 4,
      title: '材料进场验收',
      description: '验收钢筋、水泥等材料质量',
      status: 'pending',
      priority: 'medium',
      deadline: '今天 16:00'
    },
    {
      id: 5,
      title: '编写施工日报',
      description: '记录今天的施工进度和问题',
      status: 'pending',
      priority: 'low',
      deadline: '今天 18:00'
    }
  ]);
  
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 切换任务状态
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let newStatus;
        if (task.status === 'completed') newStatus = 'pending';
        else if (task.status === 'pending') newStatus = 'in-progress';
        else newStatus = 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };
  
  // 添加新任务
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        status: 'pending',
        priority: 'medium',
        deadline: '今天'
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '' });
      setShowAddForm(false);
    }
  };
  
  // 获取状态对应的样式类
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'task-completed';
      case 'in-progress': return 'task-in-progress';
      default: return 'task-pending';
    }
  };
  
  // 获取优先级对应的样式类
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };
  
  return (
    <div className="card">
      <div className="list-header">
        <h2 className="section-title">任务清单</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? '取消' : '添加任务'}
        </button>
      </div>
      
      {/* 添加任务表单 */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="add-task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="任务标题"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="任务描述"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows="2"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            保存任务
          </button>
        </form>
      )}
      
      {/* 任务列表 */}
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-header">
              <label className={`task-checkbox ${getStatusClass(task.status)}`}>
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => toggleTaskStatus(task.id)}
                />
                <span className="checkbox-custom"></span>
              </label>
              <div className="task-info">
                <h3 className={`task-title ${getStatusClass(task.status)}`}>
                  {task.title}
                </h3>
                <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                  {task.priority === 'high' ? '高优先级' : 
                   task.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-footer">
              <span className="task-deadline">截止时间：{task.deadline}</span>
              <span className={`task-status ${getStatusClass(task.status)}`}>
                {task.status === 'completed' ? '已完成' : 
                 task.status === 'in-progress' ? '进行中' : '待处理'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 统计信息 */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">总任务数</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {tasks.filter(t => t.status === 'completed').length}
          </span>
          <span className="stat-label">已完成</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {tasks.filter(t => t.status === 'pending').length}
          </span>
          <span className="stat-label">待处理</span>
        </div>
      </div>
    </div>
  );
}

export default TaskList;