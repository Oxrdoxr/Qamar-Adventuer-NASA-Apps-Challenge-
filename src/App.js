// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SolarWindGame from './pages/SolarWindGame';
import AuroraGame from './pages/AuroraGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solar-wind" element={<SolarWindGame />} />
          <Route path="/aurora" element={<AuroraGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;