// src/pages/SolarWindGame.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SolarWindGame.css';

const SolarWindGame = () => {
  const navigate = useNavigate();
  const [earthHealth, setEarthHealth] = useState(100);
  const [particles, setParticles] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameContainerRef = useRef(null);

  // تحميل أعلى نقاط من localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('solarWindHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // حفظ أعلى نقاط
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('solarWindHighScore', score.toString());
    }
  }, [score, highScore]);

  // إنشاء جسيمات رياح شمسية
  const createParticle = () => {
    if (!gameStarted || gameOver) return;

    const types = ['normal', 'normal', 'dangerous'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newParticle = {
      id: Math.random(),
      left: Math.random() * 80 + 10,
      type: type,
      top: 0,
      speed: Math.random() * 2 + 1,
    };
    
    setParticles(prev => [...prev, newParticle]);
  };

  // بدء اللعبة
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setEarthHealth(100);
    setScore(0);
    setParticles([]);
  };

  // إعادة البدء
  const restartGame = () => {
    startGame();
  };

  // تأثير اختفاء ديناميكي للجسيم
  const animateParticleRemoval = (particleId, particleType) => {
    // إضافة تأثير قبل الإزالة
    const particleElement = document.querySelector(`[data-particle-id="${particleId}"]`);
    if (particleElement) {
      if (particleType === 'dangerous') {
        particleElement.style.animation = 'successPop 0.5s forwards';
        createFloatingText('+10', particleElement, '#4CAF50');
      } else {
        particleElement.style.animation = 'errorShrink 0.5s forwards';
        createFloatingText('-5', particleElement, '#ff4444');
      }
      
      // إزالة الجسيم بعد الانتهاء من التأثير
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particleId));
      }, 400);
    }
  };

  // إنشاء نص عائم للتأثير
  const createFloatingText = (text, element, color) => {
    const rect = element.getBoundingClientRect();
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left + rect.width / 2}px;
      color: ${color};
      font-size: 1.5rem;
      font-weight: bold;
      pointer-events: none;
      z-index: 1000;
      animation: floatUp 1s forwards;
    `;
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
      floatingText.remove();
    }, 1000);
  };

  // النقر على الجسيمات
  const handleParticleClick = (particleId, particleType, e) => {
    e.stopPropagation();
    
    if (particleType === 'dangerous') {
      // نقر صحيح على جسيم خطير
      setScore(prev => prev + 10);
      animateParticleRemoval(particleId, particleType);
    } else {
      // نقر خاطئ على جسيم آمن
      setScore(prev => Math.max(0, prev - 5));
      animateParticleRemoval(particleId, particleType);
    }
  };

  // تحديث حركة الجسيمات
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          top: particle.top + particle.speed
        })).filter(particle => {
          // إذا وصل أي جسيم إلى الأرض - إزالته بدون تأثير
          if (particle.top > 85) {
            return false;
          }
          return true;
        })
      );
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver]);

  // إنشاء الجسيمات تلقائياً
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const particleInterval = setInterval(createParticle, 800);
    return () => clearInterval(particleInterval);
  }, [gameStarted, gameOver]);

  return (
    <div className="solar-wind-game" ref={gameContainerRef}>
      {/* الخلفية الكونية */}
      <div className="space-background">
        <div className="sun" title="الشمس - مصدر الرياح الشمسية">☀️</div>
        <div className="earth" title="الأرض - تحتاج لحمايتك!">🌍</div>
        
        {/* الجسيمات */}
        {particles.map(particle => (
          <div
            key={particle.id}
            data-particle-id={particle.id}
            className={`particle ${particle.type}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`
            }}
            onClick={(e) => handleParticleClick(particle.id, particle.type, e)}
            title={particle.type === 'dangerous' ? 
              '⚡ جسيم خطير - انقري عليه لتحصلي على +10 نقاط!' : 
              '✨ جسيم آمن - لا تنقري عليه أو ستخسرين -5 نقاط!'}
          >
            {particle.type === 'dangerous' ? '⚡' : '✨'}
          </div>
        ))}
      </div>

      {/* واجهة التحكم */}
      <div className="game-ui">
        <div className="stats">
          <div className="health-bar">
            <span className="health-label">صحة الأرض: {earthHealth}%</span>
            <div className="health-track">
              <div 
                className="health-fill"
                style={{ 
                  width: `${earthHealth}%`,
                  background: earthHealth > 70 ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' :
                             earthHealth > 30 ? 'linear-gradient(90deg, #FF9800, #FFC107)' :
                             'linear-gradient(90deg, #F44336, #FF5722)'
                }}
              ></div>
            </div>
          </div>
          
          <div className="score-display">
            <div className="current-score">النقاط: {score} ⭐</div>
            <div className="high-score">أعلى نقاط: {highScore} 🏆</div>
          </div>
        </div>

        {!gameStarted ? (
          <div className="start-screen">
            <h2>🌞 مهمة الرياح الشمسية</h2>
            <p>احمي الأرض من الجسيمات الشمسية الخطرة!</p>
            <div className="game-rules">
              <p>🎯 <strong>قواعد اللعبة:</strong></p>
              <p>⚡ <strong>الجسيمات الحمراء:</strong> انقري عليها لتحصلي على +10 نقاط</p>
              <p>✨ <strong>الجسيمات الصفراء:</strong> لا تنقري عليها أو ستخسرين -5 نقاط</p>
              <p>🏆 <strong>الهدف:</strong> تحقيق أعلى نقاط ممكنة!</p>
            </div>
            <button className="start-button" onClick={startGame}>
              🚀 ابدأ المهمة
            </button>
          </div>
        ) : (
          <div className="instructions">
            ⚡ انقري على الجسيمات <span style={{color: '#ff4444'}}>الحمراء</span> فقط!
            <br/>
            ✨ ابتعدي عن الجسيمات <span style={{color: '#ffd700'}}>الصفراء</span>
          </div>
        )}

        {gameOver && (
          <div className="game-over">
            <h2>🎮 انتهت اللعبة!</h2>
            <div className="final-stats">
              <p>النقاط النهائية: <strong>{score}</strong> ⭐</p>
              <p>أعلى نقاط: <strong>{highScore}</strong> 🏆</p>
              {score === highScore && score > 0 && (
                <p className="new-record">🎉 سجل جديد! أحسنت!</p>
              )}
            </div>
            <div className="game-over-buttons">
              <button onClick={restartGame}>🔄 حاولي مرة أخرى</button>
              <button onClick={() => navigate('/')}>🏠 العودة للقائمة</button>
            </div>
          </div>
        )}
      </div>

      {/* معلومات تعليمية */}
      <div className="educational-info">
        <h3>🌞 الرياح الشمسية</h3>
        <div className="info-content">
          <p>
            الرياح الشمسية هي تدفق للجسيمات المشحونة من الشمس. 
          </p>
        </div>
        <div className="particle-info">
          <div className="info-item dangerous">
            <span>⚡</span>
            <div>
              <strong>جسيمات خطرة</strong>
              <br/>
              <small>+10 نقاط</small>
            </div>
          </div>
          <div className="info-item safe">
            <span>✨</span> 
            <div>
              <strong>جسيمات آمنة</strong>
              <br/>
              <small>-5 نقاط</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarWindGame;