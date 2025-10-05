// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarsBackground from '../components/StarsBackground';
import Popup from '../components/Popup';
import QuickInfo from '../components/QuickInfo';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="home-page">
      <StarsBackground count={50} />

      <div className="home-container">
        <header className="main-header">
          <h1 className="title">Qamar's Adventures 🌙</h1>
          <p className="subtitle">An enjoyable journey to discover the secrets of space weather</p>
        </header>

        <div className="character">
          <div className="qamar-character">👩🚀</div>
        </div>

        <div className="controls">
          <button 
            className="start-btn" 
            onClick={() => navigate('/solar-wind')}
          >
            Start the journey 🚀
          </button>
          
          <button 
            className="about-btn" 
            onClick={() => setShowPopup(true)}
          >
            About the game ℹ️
          </button>
        </div>

        <QuickInfo />
      </div>

      <Popup visible={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

export default HomePage;
