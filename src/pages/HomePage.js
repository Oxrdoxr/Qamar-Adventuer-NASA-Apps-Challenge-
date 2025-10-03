// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // تأكدي من استيراد CSS

function HomePage() {
  const navigate = useNavigate();

  // إنشاء النجوم ديناميكياً
  const stars = Array.from({ length: 50 }, (_, i) => (
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

  return (
    <div className="home-page">
      {/* الخلفية المتحركة */}
      <div className="stars-background">
        {stars}
      </div>

      {/* المحتوى الرئيسي */}
      <div className="home-container">
        
        {/* العنوان الرئيسي */}
        <header className="main-header">
          <h1 className="title">🌙 مغامرات قمر</h1>
          <p className="subtitle">رحلة ممتعة لاكتشاف أسرار طقس الفضاء</p>
        </header>

        {/* الشخصية الرئيسية */}
        <div className="character">
          <div className="qamar-character">👩🚀</div>
        </div>

        {/* أزرار التحكم */}
        <div className="controls">
          <button 
            className="start-btn" 
            onClick={() => navigate('/solar-wind')}
          >
            🚀 ابدأ الرحلة
          </button>
          
          <button 
            className="about-btn" 
            onClick={() => alert('🌙 مغامرات قمر\nرحلة تفاعلية لتعلم طقس الفضاء\nمناسبة للأطفال من 8-12 سنة')}
          >
            ℹ️ عن اللعبة
          </button>
        </div>

        {/* معلومات سريعة */}
        <div className="quick-info">
          <div className="info-card">
            <span>🌌</span>
            <p>تعلمي عن الرياح الشمسية</p>
          </div>
          <div className="info-card">
            <span>⚡</span>
            <p>اكتشفي العواصف المغناطيسية</p>
          </div>
          <div className="info-card">
            <span>🛰️</span>
            <p>احمي الأقمار الصناعية</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;