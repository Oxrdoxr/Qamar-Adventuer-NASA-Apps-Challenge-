// src/pages/SolarWindGame.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SolarWindGame.css';

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
        title="Game Information"
      >
        ℹ️ Information
      </button>

      {/* Popup Window الجديد */}
      {showInfoPopup && (
        <div className="info-popup-backdrop" onClick={() => setShowInfoPopup(false)}>
          <div className="info-popup-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="popup-close-btn"
              onClick={() => setShowInfoPopup(false)}
              aria-label="Close information"
            >
              ✕
            </button>
            
            <div className="popup-header">
              <h3>Solar Wind Mission</h3>
            </div>
            
            <div className="popup-body">
              <p>
                The solar wind is a continuous flow of charged particles from the Sun into space. 
                These particles can affect various systems on Earth:
              </p>
              
              <div className="popup-features-list">
                <ul>
                  <li>Satellites and communications systems</li>
                  <li>Power grids and energy infrastructure</li>
                  <li>Astronauts and space equipment</li>
                  <li>Navigation and GPS systems</li>
                </ul>
              </div>

              <div className="particle-types-grid">
                <div className="particle-type-card dangerous">
                  <div className="particle-icon">⚡</div>
                  <div className="particle-info">
                    <strong>Dangerous Particles</strong>
                    <small>+10 points when clicked • -15 health if they reach Earth</small>
                  </div>
                </div>
                
                <div className="particle-type-card safe">
                  <div className="particle-icon">✨</div>
                  <div className="particle-info">
                    <strong>Safe Particles</strong>
                    <small>-5 points when clicked • No damage to Earth</small>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                textAlign: 'center'
              }}>
                <strong style={{color: '#FFD700'}}>🎯 Mission Objective:</strong>
                <p style={{color: '#e0e0e0', margin: '0.5rem 0 0 0', fontSize: '0.95rem'}}>
                  Protect Earth by clicking dangerous particles while avoiding safe ones!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الخلفية الكونية */}
      <div className="space-background">
        <div className="sun" title="The Sun - source of solar wind">☀️</div>
        <div className={`earth ${earthHealth < 30 ? 'danger' : ''}`} title="Earth - needs your protection!">🌍</div>
        
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
            <span className="health-label">Earth's Health: {earthHealth}%</span>
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
            <div className="current-score">Score: {score} ⭐</div>
            <div className="high-score">High Score: {highScore} 🏆</div>
          </div>
        </div>

        {!gameStarted ? (
          <div className="start-screen">
            <h2>🌞 Solar Wind Mission</h2>
            <p>Protect Earth from dangerous solar particles!</p>
            <div className="game-rules">
              <p>🎯 <strong>Game Rules:</strong></p>
              <p>⚡ <strong>Red Particles:</strong> Click to get +10 points</p>
              <p>✨ <strong>Yellow Particles:</strong> Avoid clicking (-5 points)</p>
              <p>💥 <strong>Dangerous particles hit Earth:</strong> -15 health</p>
              <p>🏆 <strong>Goal:</strong> Highest score before Earth is destroyed!</p>
            </div>
            <button className="start-button" onClick={startGame}>
              🚀 Start Mission
            </button>
          </div>
        ) : (
          <div className="instructions">
            ⚡ Click red particles only!
            <br/>
            ✨ Avoid yellow particles
            {earthHealth < 50 && (
              <div style={{color: '#ff4444', marginTop: '0.5rem', fontWeight: 'bold'}}>
                ⚠️ Warning: Earth's health is low!
              </div>
            )}
          </div>
        )}

        {/* شاشة Game Over */}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-container">
              <h2 className="game-over-title">💥 Mission Failed!</h2>
              
              <div className="final-stats-compact">
                <p>Final Score: <strong>{score}</strong> ⭐</p>
                <p>High Score: <strong>{highScore}</strong> 🏆</p>
                {score === highScore && score > 0 && (
                  <p className="new-record-compact">🎉 New Record! Excellent!</p>
                )}
              </div>
              
              <div className="game-over-buttons-compact">
                <button onClick={restartGame}>🔄 Try Again</button>
                <button onClick={() => navigate('/')}>🏠 Main Menu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarWindGame;