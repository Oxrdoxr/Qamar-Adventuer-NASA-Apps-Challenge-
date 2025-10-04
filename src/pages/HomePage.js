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
        {/* بطاقات سريعة قابلة للنقر */}
<div className="quick-info">
  <button
    type="button"
    className="info-card"
    onClick={() => navigate('/solar-wind')}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate('/solar-wind'); } }}
    tabIndex={0}
    aria-label="تعلمي عن الرياح الشمسية"
  >
    <span>🌌</span>
    <p>تعلمي عن الرياح الشمسية</p>
    <div className="card-hint">انقري للعب</div>
  </button>
  
  <button
    type="button"
    className="info-card"
    onClick={() => navigate('/satellite-protection')}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate('/satellite-protection'); } }}
    tabIndex={0}
    aria-label="احمي الأقمار الصناعية"
  >
    <span>🛰️</span>
    <p>احمي الأقمار الصناعية</p>
    <div className="card-hint">انقري للاستكشاف</div>
  </button>
  
  <button
    type="button"
    className="info-card"
    onClick={() => navigate('/aurora')}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate('/aurora'); } }}
    tabIndex={0}
    aria-label="اكتشفي الشفق القطبي"
  >
    <span>💫</span>
    <p>اكتشفي الشفق القطبي</p>
    <div className="card-hint">انقري للمعرفة</div>
  </button>
</div>
      </div>
    </div>
  );
}

export default HomePage;