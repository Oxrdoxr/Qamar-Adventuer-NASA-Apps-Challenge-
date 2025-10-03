// src/pages/AuroraGame.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuroraGame.css'; // إذا كان لديك ملف CSS منفصل

function AuroraGame() {
  const navigate = useNavigate();

  return (
    <div className="aurora-game">
      {/* النجوم */}
      <div className="stars-background">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      {/* الشفق القطبي */}
      <div className="northern-lights">
        <div className="light-wave green"></div>
        <div className="light-wave pink"></div>
        <div className="light-wave blue"></div>
      </div>
      
      {/* المناظر الطبيعية */}
      <div className="ice-landscape">
        <div className="snow-mountains"></div>
        <div className="frost-trees"></div>
      </div>
      
      {/* النص التعليمي */}
      <div className="educational-text">
        <h3>💫 الشفق القطبي</h3>
        <p>
          يحدث عندما تتفاعل الجسيمات الشمسية<br/>
          مع المجال المغناطيسي للأرض<br/>
          هذه الأضواء الجميلة هي درعنا الطبيعي ضد الإشعاع!
        </p>
      </div>

      {/* زر العودة */}
      <button className="back-button" onClick={() => navigate('/')}>
        🏠 العودة إلى القائمة
      </button>
    </div>
  );
}

export default AuroraGame;