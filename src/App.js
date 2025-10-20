import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.js';
import AIChat from './pages/AIChat/AIChat.js';
import DocumentManage from './pages/DocumentManage/DocumentManage.js';
import ProfilePage from './pages/ProfilePage/ProfilePage.js';
import DailyTasks from './pages/DailyTasks/DailyTasks.js';
import Login from './pages/Login/Login.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />
          <Route path="/ai-chat" element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          } />
          <Route path="/daily-tasks/*" element={
            <ProtectedRoute>
              <DailyTasks />
            </ProtectedRoute>
          } />
          <Route path="/document-manage" element={
            <ProtectedRoute>
              <DocumentManage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;