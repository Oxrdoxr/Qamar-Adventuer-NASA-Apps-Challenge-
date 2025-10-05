// src/components/StarsBackground.jsx
import React from 'react';
import '../styles/StarsBackground.css';

function StarsBackground({ count = 50 }) {
  const stars = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="star"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 3}px`,
        height: `${Math.random() * 3}px`,
        animationDelay: `${Math.random() * 5}s`
      }}
    />
  ));

  return <div className="stars-background">{stars}</div>;
}

export default StarsBackground;
