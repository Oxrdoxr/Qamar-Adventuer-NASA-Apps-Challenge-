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
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const gameContainerRef = useRef(null);

  // تحميل أعلى نقاط
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

  // إنشاء جسيمات
  const createParticle = () => {
    if (!gameStarted || gameOver) return;

    const types = ['normal', 'normal', 'dangerous'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newParticle = {
      id: Math.random(),
      left: Math.random() * 80 + 10,
      type: type,
      top: -10,
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
    setShowInfoPopup(false);
  };

  // إعادة البدء
  const restartGame = () => {
    startGame();
  };

  // النقر على الجسيمات
  const handleParticleClick = (particleId, particleType, e) => {
    e.stopPropagation();
    
    if (particleType === 'dangerous') {
      setScore(prev => prev + 10);
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
    
    setParticles(prev => prev.filter(p => p.id !== particleId));
  };

  // حركة الجسيمات وتأثيرها على الأرض
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setParticles(prev => {
        let healthDamage = 0;
        const particlesToRemove = [];
        
        const updatedParticles = prev.map(particle => ({
          ...particle,
          top: particle.top + particle.speed * 0.8
        }));

        // التحقق من الجسيمات التي وصلت إلى الأرض
        updatedParticles.forEach(particle => {
          if (particle.top > 75 && particle.type === 'dangerous') {
            healthDamage += 15;
            particlesToRemove.push(particle.id);
          }
          
          if (particle.top > 80 && particle.type === 'normal') {
            particlesToRemove.push(particle.id);
          }
        });

        // تطبيق الضرر على الأرض
        if (healthDamage > 0) {
          setEarthHealth(current => {
            const newHealth = Math.max(0, current - healthDamage);
            
            if (newHealth <= 0) {
              setGameOver(true);
            }
            return newHealth;
          });

          // تأثير اهتزاز
          const gameElement = document.querySelector('.solar-wind-game');
          gameElement.classList.add('damage-effect');
          setTimeout(() => {
            gameElement.classList.remove('damage-effect');
          }, 300);
        }

        // إزالة الجسيمات
        return updatedParticles.filter(particle => 
          particle.top < 90 && !particlesToRemove.includes(particle.id)
        );
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver]);

  // إنشاء الجسيمات تلقائياً
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const particleInterval = setInterval(createParticle, 1200);
    return () => clearInterval(particleInterval);
  }, [gameStarted, gameOver]);

  // تأثيرات الصحة المنخفضة
  useEffect(() => {
    const earthElement = document.querySelector('.earth');
    if (earthElement) {
      if (earthHealth < 30) {
        earthElement.classList.add('danger');
      } else {
        earthElement.classList.remove('danger');
      }
    }
  }, [earthHealth]);

  return (
    <div className="solar-wind-game" ref={gameContainerRef}>
      {/* زر فتح الـ Popup */}
      <button 
        className="info-toggle-btn"
        onClick={() => setShowInfoPopup(true)}
        title="معلومات عن اللعبة"
      >
        ℹ️ معلومات
      </button>

      {/* Popup Window للمعلومات */}
      {showInfoPopup && (
        <>
          <div 
            className="info-popup-overlay"
            onClick={() => setShowInfoPopup(false)}
          ></div>
          <div className="info-popup-container">
            <div className="info-popup">
              <button 
                className="popup-close-btn"
                onClick={() => setShowInfoPopup(false)}
              >
                ✕
              </button>
              
              <div className="popup-header">
                <h3>🌞 الرياح الشمسية</h3>
              </div>
              
              <div className="popup-content">
                <p>
                  الرياح الشمسية هي تدفق مستمر للجسيمات المشحونة من الشمس 
                  إلى الفضاء. هذه الجسيمات يمكن أن تؤثر على:
                </p>
                
                <ul>
                  <li>✅ الأقمار الصناعية والاتصالات</li>
                  <li>✅ شبكات الكهرباء والطاقة</li>
                  <li>✅ رواد الفضاء والمعدات الفضائية</li>
                  <li>✅ أنظمة الملاحة والGPS</li>
                </ul>

                <div className="popup-particle-info">
                  <div className="popup-info-item dangerous">
                    <span>⚡</span>
                    <div>
                      <strong>جسيمات خطرة</strong>
                      <br/>
                      <small>+10 نقاط عند النقر</small>
                      <br/>
                      <small>-15 صحة إذا وصلت الأرض</small>
                    </div>
                  </div>
                  <div className="popup-info-item safe">
                    <span>✨</span> 
                    <div>
                      <strong>جسيمات آمنة</strong>
                      <br/>
                      <small>-5 نقاط عند النقر</small>
                      <br/>
                      <small>لا ضرر إذا وصلت الأرض</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* الخلفية الكونية */}
      <div className="space-background">
        <div className="sun" title="الشمس - مصدر الرياح الشمسية">☀️</div>
        <div className={`earth ${earthHealth < 30 ? 'danger' : ''}`} title="الأرض - تحتاج لحمايتك!">🌍</div>
        
        {/* الجسيمات */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`particle ${particle.type}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`
            }}
            onClick={(e) => handleParticleClick(particle.id, particle.type, e)}
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
              <p>💥 <strong>إذا وصلت الجسيمات الحمراء للأرض:</strong> -15 صحة</p>
              <p>🏆 <strong>الهدف:</strong> تحقيق أعلى نقاط قبل تدمير الأرض!</p>
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
            {earthHealth < 50 && (
              <div style={{color: '#ff4444', marginTop: '0.5rem', fontWeight: 'bold'}}>
                ⚠️ تحذير: صحة الأرض منخفضة!
              </div>
            )}
          </div>
        )}

        {/* شاشة Game Over Popup */}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-container">
              <h2 className="game-over-title">💥 انتهت اللعبة!</h2>
              
              <div className="final-stats-compact">
                <p>النقاط النهائية: <strong>{score}</strong> ⭐</p>
                <p>أعلى نقاط: <strong>{highScore}</strong> 🏆</p>
                {score === highScore && score > 0 && (
                  <p className="new-record-compact">🎉 سجل جديد! أحسنت!</p>
                )}
              </div>
              
              <div className="game-over-buttons-compact">
                <button onClick={restartGame}>🔄 حاولي مرة أخرى</button>
                <button onClick={() => navigate('/')}>🏠 القائمة الرئيسية</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarWindGame;