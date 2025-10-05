// src/components/QuickInfo.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuickInfo.css';

function QuickInfo() {
  const navigate = useNavigate();

  const cards = [
    { icon: '🌌', label: 'Learn about solar winds', path: '/solar-wind' },
    { icon: '🛰️', label: 'Satellites', path: '/satellite-protection' },
    { icon: '💫', label: 'Discover the aurora', path: '/aurora' }
  ];

  return (
    <div className="quick-info">
      {cards.map((card, i) => (
        <button
          key={i}
          type="button"
          className="info-card"
          onClick={() => navigate(card.path)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate(card.path); } }}
          tabIndex={0}
          aria-label={card.label}
        >
          <span>{card.icon}</span>
          <p>{card.label}</p>
          <div className="card-hint">Click to explore</div>
        </button>
      ))}
    </div>
  );
}

export default QuickInfo;
