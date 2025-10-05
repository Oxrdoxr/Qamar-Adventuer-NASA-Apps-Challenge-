// src/components/Popup.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Popup.css';

function Popup({ visible, onClose }) {
  const navigate = useNavigate();
  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2>Qamar's Adventures 🌙</h2>
        <div className="popup-body">
          <p>An exciting interactive journey to learn about space weather.</p>
          <div className="popup-features">
            <h3>Platform features:</h3>
            <ul>
              <li>A fun interactive experience 🎮</li>
              <li>Explore the secrets of space weather 🌌</li>
              <li>Learn how space weather affects our lives 🛰️</li>
              <li>Adventures with the solar wind 🚀</li>
            </ul>
          </div>
          <p className="popup-age">Suitable for children from 6-12 years</p>
        </div>
        <div className="popup-footer">
          <button 
            className="popup-start-btn"
            onClick={() => {
              onClose();
              navigate('/solar-wind');
            }}
          >
            Start the adventure now!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
