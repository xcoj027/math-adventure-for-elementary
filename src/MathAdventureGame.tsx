import React, { useState, useRef, useEffect } from 'react';

// --- Types ---
interface Question {
  num1: number;
  num2: number;
  operation: string;
  correctAnswer: number;
  answers: number[];
}

interface CompletedLevel {
  level: number;
  success: boolean;
}

// --- Constants & Assets ---
const SVG_BACKGROUND = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='skyGrad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23E0F6FF;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23skyGrad)' width='800' height='600'/%3E%3Crect fill='%23F5DEB3' y='400' width='800' height='200'/%3E%3Crect fill='%238B4513' x='0' y='350' width='800' height='50'/%3E%3Crect fill='%23654321' x='50' y='150' width='300' height='250'/%3E%3Crect fill='%23333' x='80' y='180' width='80' height='100'/%3E%3Crect fill='%2387CEEB' x='85' y='185' width='70' height='90'/%3E%3Crect fill='%23333' x='85' y='230' width='70' height='2'/%3E%3Crect fill='%23333' x='120' y='185' width='2' height='90'/%3E%3Crect fill='%23333' x='200' y='180' width='80' height='100'/%3E%3Crect fill='%2387CEEB' x='205' y='185' width='70' height='90'/%3E%3Crect fill='%23333' x='205' y='230' width='70' height='2'/%3E%3Crect fill='%23333' x='240' y='185' width='2' height='90'/%3E%3Crect fill='%238B4513' x='140' y='300' width='80' height='100'/%3E%3Crect fill='%23654321' x='145' y='305' width='70' height='90'/%3E%3Ccircle fill='%23FFD700' cx='155' cy='340' r='8'/%3E%3Cpolygon fill='%23654321' points='200,150 320,200 80,200'/%3E%3Crect fill='%23006400' x='500' y='320' width='60' height='80'/%3E%3Ccircle fill='%2332CD32' cx='530' cy='280' r='50'/%3E%3Ccircle fill='%2332CD32' cx='510' cy='300' r='40'/%3E%3Ccircle fill='%2332CD32' cx='550' cy='300' r='40'/%3E%3Crect fill='%23333' x='600' y='200' width='150' height='200'/%3E%3Crect fill='%23228B22' x='610' y='210' width='130' height='150'/%3E%3Ctext x='675' y='240' font-size='24' fill='white' text-anchor='middle' font-family='Arial' font-weight='bold'%3EABC%3C/text%3E%3Ctext x='675' y='270' font-size='20' fill='white' text-anchor='middle' font-family='Arial'%3E1+1=2%3C/text%3E%3Ctext x='675' y='300' font-size='20' fill='white' text-anchor='middle' font-family='Arial'%3E2×3=6%3C/text%3E%3Crect fill='%238B4513' x='665' y='320' width='20' height='80'/%3E%3Ccircle fill='%23FFD700' cx='100' cy='80' r='40'/%3E%3Cpath fill='white' d='M100,40 Q80,50 85,70 Q90,60 100,65 Q110,60 115,70 Q120,50 100,40'/%3E%3C/svg%3E")`;

const ANIMATIONS = `
  @keyframes moveCar {
    0% { transform: translateX(calc(100vw + 100px)); }
    100% { transform: translateX(-100px); }
  }
  @keyframes borderLineMove {
    0% { background-position: 0% 0%, 100% 0%, 100% 100%, 0% 100%; }
    100% { background-position: 100% 0%, 100% 100%, 0% 100%, 0% 0%; }
  }
  @keyframes floatUpPop {
    0% { transform: translateY(20px) scale(0.5); opacity: 0; }
    50% { transform: translateY(-40px) scale(1.2); opacity: 1; }
    100% { transform: translateY(-60px) scale(1); opacity: 0; }
  }
  @keyframes firework {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    30% { transform: scale(1.2); box-shadow: 0 0 40px 20px rgba(34, 197, 94, 0.4); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }
  @keyframes confetti-fall {
    0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
    100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
  }
  @keyframes rainbow-border {
    0% { border-color: #ff0000; }
    20% { border-color: #ff00ff; }
    40% { border-color: #0000ff; }
    60% { border-color: #00ffff; }
    80% { border-color: #00ff00; }
    100% { border-color: #ffff00; }
  }
  .moving-car {
    position: fixed;
    bottom: 80px;
    left: 0;
    animation: moveCar 6s linear infinite;
    z-index: 5;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  }
  .celebration-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 100;
    animation: floatUpPop 1s ease-out forwards;
    font-size: 3.5rem;
    font-weight: 900;
    text-shadow: 2px 2px 0px white, -2px -2px 0px white;
  }
  .victory-card {
    border: 8px solid;
    animation: rainbow-border 2s linear infinite;
  }
  .confetti {
    position: absolute;
    width: 12px;
    height: 12px;
    animation: confetti-fall 2s linear forwards;
    z-index: 50;
  }
`;

const SocialFooter = ({ small = false }) => (
  <footer className={`${small ? 'mt-6' : 'mt-8'} text-center relative z-[100]`}>
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mx-auto ${small ? 'p-3 max-w-2xl' : 'p-4 max-w-md'}`}>
      <div className={`flex justify-center gap-6 ${small ? 'mb-2' : 'mb-3'}`}>
        <a href="https://github.com/xcoj027" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600 transition-colors">
          <svg className={small ? "w-6 h-6" : "w-8 h-8"} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
        <a href="https://www.youtube.com/@tnqui" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-red-600 transition-colors">
          <svg className={small ? "w-6 h-6" : "w-8 h-8"} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@xcoj027" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-colors">
          <svg className={small ? "w-6 h-6" : "w-8 h-8"} fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
        </a>
      </div>
      <p className={`${small ? 'text-xs' : 'text-sm'} text-gray-600 leading-relaxed`}>
        This game is made by <span className="font-semibold text-purple-600">AI</span> and a present for <span className="font-semibold text-pink-600">elementary school students! 💝</span>
      </p>
    </div>
  </footer>
);

const BackgroundWrapper = ({ children, carDelays, carPositions }: any) => (
  <div className="min-h-screen flex flex-col p-4 relative bg-[#E0F6FF] overflow-hidden">
    <div 
      className="absolute inset-0 z-0 opacity-85" 
      style={{
        backgroundImage: SVG_BACKGROUND,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(4px)',
        transform: 'scale(1.02)'
      }}
    />
    
    <style>{ANIMATIONS}</style>
    
    <div className="relative z-10 flex-1 flex flex-col">
      <div className="moving-car" style={{animationDelay: `${carDelays[0]}s`, fontSize: '48px', bottom: `${carPositions[0]}px`}}>🚗</div>
      <div className="moving-car" style={{animationDelay: `${carDelays[1]}s`, fontSize: '52px', bottom: `${carPositions[1]}px`}}>🚕</div>
      <div className="moving-car" style={{animationDelay: `${carDelays[2]}s`, fontSize: '45px', bottom: `${carPositions[2]}px`}}>🚙</div>
      {children}
    </div>
  </div>
);

export default function MathAdventureGame() {
  const [screen, setScreen] = useState<string>('welcome');
  const [playerName, setPlayerName] = useState<string>('Student');
  const [grade, setGrade] = useState<number | string | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [failureCount, setFailureCount] = useState<number>(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [completedLevels, setCompletedLevels] = useState<CompletedLevel[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [congratsText, setCongratsText] = useState<string>('');
  
  const [carDelays] = useState<number[]>([-Math.random() * 4, -2 - Math.random() * 2, -4 - Math.random() * 2]);
  const [carPositions] = useState<number[]>([20 + Math.random() * 40, 20 + Math.random() * 40, 20 + Math.random() * 40]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const generateQuestion = () => {
    let operation: string, num1: number, num2: number, correctAnswer: number;
    
    if (grade === 'multiplicationTable') {
      operation = '×';
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      correctAnswer = num1 * num2;
    } else {
      const operations = ['+', '-', '×', '÷'];
      const range = { min: 1, max: 20 };
      operation = operations[Math.floor(Math.random() * operations.length)];
      
      if (operation === '+') {
        num1 = Math.floor(Math.random() * range.max) + range.min;
        num2 = Math.floor(Math.random() * range.max) + range.min;
        correctAnswer = num1 + num2;
      } else if (operation === '-') {
        num1 = Math.floor(Math.random() * range.max) + range.min;
        num2 = Math.floor(Math.random() * num1) + 1;
        correctAnswer = num1 - num2;
      } else if (operation === '×') {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 10) + 2;
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * correctAnswer;
      }
    }
    
    const wrongAnswers: number[] = [];
    while (wrongAnswers.length < 3) {
      const w = correctAnswer + Math.floor(Math.random() * 10) - 5;
      if (w !== correctAnswer && w > 0 && !wrongAnswers.includes(w)) wrongAnswers.push(w);
    }
    
    setQuestion({ num1, num2, operation, correctAnswer, answers: [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5) });
    setTimeLeft(20);
    setIsTimeout(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    let t = 0;
    timerRef.current = setInterval(() => {
      t += 0.1;
      const r = Math.max(0, 20 - t);
      setTimeLeft(r);
      if (r <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleTimeout();
      }
    }, 100);
  };

  const handleTimeout = () => {
    if (showFeedback || isTimeout) return;
    setIsTimeout(true);
    setShowFeedback(true);
    setScore(Math.max(0, score - 10));
    setFailureCount(failureCount + 1);
    setCompletedLevels([...completedLevels, { level, success: false }]);
    nextStep();
  };

  const handleAnswer = (answer: number) => {
    if (showFeedback || isTimeout) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === question!.correctAnswer;
    if (isCorrect) {
      const texts = ["AMAZING!", "BRAVO!", "MATH WIZARD!", "FANTASTIC!", "GENIUS!", "SUPER!"];
      setCongratsText(texts[Math.floor(Math.random() * texts.length)]);
      setShowConfetti(true);
      setScore(score + 10);
    } else {
      setScore(Math.max(0, score - 10));
      setFailureCount(failureCount + 1);
    }
    setCompletedLevels([...completedLevels, { level, success: isCorrect }]);
    nextStep();
  };

  const nextStep = () => {
    setTimeout(() => {
      setShowConfetti(false);
      setCongratsText('');
      if (level < 12) {
        setLevel(level + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setIsTimeout(false);
        generateQuestion();
      } else setScreen('victory');
    }, 1500);
  };

  const resetGameStates = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLevel(1);
    setScore(0);
    setFailureCount(0);
    setQuestion(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(20);
    setIsTimeout(false);
    setCompletedLevels([]);
    setShowConfetti(false);
    setCongratsText('');
  };

  const startGame = () => {
    resetGameStates();
    setScreen('game');
    generateQuestion();
  };

  if (screen === 'welcome') {
    return (
      <BackgroundWrapper carDelays={carDelays} carPositions={carPositions}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">🚀</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Math Adventure!</h1>
              <p className="text-gray-600">Let's have fun with numbers! 🎉</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-bold text-gray-700 text-sm mb-2">Your Name:</label>
                <input 
                  type="text" value={playerName} onChange={(e)=>setPlayerName(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-400 text-lg outline-none focus:border-purple-600" placeholder="Student"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 text-sm mb-2">Grade Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6].map(g=>
                    <button key={g} onClick={()=>setGrade(g)} className={`px-3 py-3 rounded-xl font-bold transition-all ${grade===g?'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110 shadow-lg':'bg-gray-200 text-gray-700 hover:scale-105'}`}>
                      Grade {g}
                    </button>
                  )}
                </div>
                <button onClick={()=>setGrade('multiplicationTable')} className={`w-full px-3 py-3 rounded-xl font-bold mt-2 transition-all ${grade==='multiplicationTable'?'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg':'bg-gray-200 text-gray-700 hover:scale-105'}`}>
                  ✖️ Multiplication Table (1-9)
                </button>
              </div>
              <button onClick={startGame} disabled={!grade} className={`w-full px-4 py-4 mt-4 rounded-xl font-bold text-xl border-none bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg transition-all ${!grade?'opacity-50 cursor-not-allowed':'hover:scale-105 cursor-pointer'}`}>
                Start Adventure! 🚀
              </button>
            </div>
          </div>
          <SocialFooter small />
        </div>
      </BackgroundWrapper>
    );
  }

  if (screen === 'game' && question) {
    return (
      <BackgroundWrapper carDelays={carDelays} carPositions={carPositions}>
        <div className="bg-white rounded-xl shadow-lg flex justify-between items-center p-4 max-w-[896px] mx-auto w-full mb-8">
          <button onClick={() => setScreen('welcome')} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 transition-all text-gray-700">← Back</button>
          <div className="flex items-center gap-2"><span className="text-2xl">👑</span><span className="font-bold text-lg">{playerName}</span></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><span className="text-xl">🏆</span><span className="font-bold">{score}</span></div>
            <div className="px-3 py-1 rounded-full bg-red-100 border-2 border-red-200"><span className="font-bold text-red-600">❌ {failureCount}</span></div>
          </div>
        </div>

        <div className="mb-6 bg-white/40 rounded-xl shadow-lg p-4 max-w-[896px] mx-auto w-full">
          <div className="flex justify-between items-center">
            {[...Array(12)].map((_,i)=>{
              const ln=i+1;
              const ls=completedLevels.find(cl=>cl.level===ln);
              const ic=ls!==undefined;
              return (
                <React.Fragment key={i}>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-all ${ic && ls.success ? 'bg-green-500 text-white shadow-lg' : ic ? 'bg-red-400 text-white shadow-lg' : ln===level ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-125 shadow-xl animate-pulse' : 'bg-white/50 text-gray-600'}`}>
                    {ic ? (ls.success ? '✓' : '✗') : ln}
                  </div>
                  {i < 11 && <div className={`w-6 h-1 ${completedLevels[i]?.success ? 'bg-green-500' : completedLevels[i] ? 'bg-red-400' : 'bg-white/50'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="max-w-[896px] mx-auto w-full px-4 relative">
          {congratsText && <div className="celebration-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{congratsText}</div>}
          
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(150)].map((_, i) => (
                <div key={i} className="confetti" style={{ 
                  left: `${Math.random() * 100}%`, top: '-5%', 
                  backgroundColor: ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa', '#ec4899'][Math.floor(Math.random()*6)], 
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  animationDelay: `${Math.random() * 0.4}s` 
                }} />
              ))}
            </div>
          )}

          <div className="relative rounded-3xl mb-6 overflow-hidden p-1 shadow-xl" style={{
            background: `linear-gradient(135deg, ${timeLeft > 5 ? '#a78bfa, #ec4899, #60a5fa' : '#f87171, #ef4444, #fca5a5'})`,
            backgroundSize: '400% 100%', animation: `borderLineMove ${timeLeft > 5 ? '1s' : '0.5s'} linear infinite`
          }}>
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-[calc(1.5rem-4px)] p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                <span className="absolute top-4 left-8 text-5xl">🎨</span><span className="absolute top-8 right-12 text-4xl">📚</span><span className="absolute bottom-6 left-16 text-6xl">✏️</span>
              </div>
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-lg z-20 ${timeLeft > 5 ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300 animate-pulse scale-110'}`}>
                ⏱️ {Math.ceil(timeLeft)}s
              </div>
              <div className="text-center relative z-10">
                <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full font-bold text-purple-800">🎯 Question {level}</div>
                <div className="text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">{question.num1} {question.operation} {question.num2} = ?</div>
                <div className="text-2xl text-gray-600 font-semibold">What's the answer? 🤔</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {question.answers.map((a, i) => {
              const themes = [
                {emoji:'🔥',bg:'from-yellow-200 to-yellow-300',border:'yellow-400'},
                {emoji:'📚',bg:'from-purple-200 to-purple-300',border:'purple-400'},
                {emoji:'🎈',bg:'from-blue-200 to-blue-300',border:'blue-400'},
                {emoji:'✏️',bg:'from-red-200 to-red-300',border:'red-400'}
              ];
              const isCorrect = a === question.correctAnswer;
              const isSelected = selectedAnswer === a;
              return (
                <button key={i} onClick={() => handleAnswer(a)} disabled={showFeedback} className={`relative p-8 rounded-3xl font-black text-5xl border-4 transition-all overflow-hidden shadow-md text-white ${
                  showFeedback && isCorrect ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-green-600' :
                  showFeedback && isSelected ? 'bg-gradient-to-br from-red-300 to-red-400 border-red-500' :
                  `bg-gradient-to-br ${themes[i].bg} border-${themes[i].border} hover:scale-105 active:scale-95`
                }`} style={showFeedback && isCorrect ? {animation: 'firework 0.5s ease-out infinite'} : {}}>
                  <div className="absolute top-2 right-2 text-2xl opacity-30 rotate-12">{themes[i].emoji}</div>
                  {showFeedback && isCorrect && <div className="absolute top-2 left-2 text-4xl animate-bounce">⭐</div>}
                  {showFeedback && isSelected && !isCorrect && <div className="absolute top-2 left-2 text-4xl">❌</div>}
                  <div className="relative z-10">{a}</div>
                </button>
              );
            })}
          </div>

          <div className="min-h-[80px]">
            {showFeedback && (
              <div className={`p-6 rounded-xl text-center font-bold text-xl shadow-inner ${isTimeout ? 'bg-orange-200 text-orange-900' : selectedAnswer === question.correctAnswer ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                {isTimeout ? "⏰ Time's up! Keep going!" : selectedAnswer === question.correctAnswer ? '🎉 Awesome! Correct!' : '💪 Try again! Keep going!'}
              </div>
            )}
          </div>
        </div>
        <SocialFooter small />
      </BackgroundWrapper>
    );
  }

  if (screen === 'victory') {
    const sc = completedLevels.filter(d => d.success).length;
    const fc = completedLevels.filter(d => !d.success).length;
    return (
      <BackgroundWrapper carDelays={carDelays} carPositions={carPositions}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center victory-card">
            <div className="relative inline-block mb-4">
               <div className="text-9xl animate-bounce">🏆</div>
               <span className="absolute -top-4 -right-4 text-4xl animate-pulse">✨</span>
               <span className="absolute -bottom-2 -left-4 text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>🌟</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4">🎉 ULTIMATE VICTORY! 🎉</h1>
            <p className="text-2xl font-bold text-gray-700 mb-2">{playerName}, you are a Math Star! 🌟</p>
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
              <p className="text-xl font-bold text-green-600 mb-2">✅ Correct answers: {sc}</p>
              <p className="text-xl font-bold text-red-600 mb-2">❌ Wrong answers: {fc}</p>
              <div className="h-px bg-gray-200 my-2" />
              <p className="text-3xl font-black text-purple-700 mt-2">Score: {score}</p>
            </div>
            <button onClick={() => setScreen('welcome')} className="w-full px-4 py-5 rounded-2xl font-black text-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-[0_8px_0_rgb(147,51,234)] hover:shadow-[0_4px_0_rgb(147,51,234)] active:shadow-none hover:translate-y-[4px] active:translate-y-[8px] transition-all">PLAY AGAIN! 🚀</button>
          </div>
          <SocialFooter small />
        </div>
      </BackgroundWrapper>
    );
  }

  return null;
}