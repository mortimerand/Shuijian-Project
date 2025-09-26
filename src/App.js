import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.js';
import AIChatTest from './pages/AIChatTest/AIChatTest.js';
import FormTest from './pages/FormTest/FormTest.js';
import ListTest from './pages/ListTest/ListTest.js';
import LayoutTest from './pages/LayoutTest/LayoutTest.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/ai-chat" element={<AIChatTest />} />
          <Route path="/form-test" element={<FormTest />} />
          <Route path="/list-test" element={<ListTest />} />
          <Route path="/layout-test" element={<LayoutTest />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;