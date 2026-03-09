import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 70; // ms per frame

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Keep ref updated to avoid stale closures in event listener
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };

  const startGame = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsPaused(false);
      setHasStarted(true);
    }
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, hasStarted]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPaused(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Score Header */}
      <div className="w-full flex justify-between items-center mb-6 px-4 font-digital">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-[#00ffff] uppercase tracking-widest glitch-effect" data-text="DATA_HARVESTED">DATA_HARVESTED</span>
          <span className="text-7xl font-digital neon-text-pink glitch-effect" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold text-[#ff00ff] uppercase tracking-widest flex items-center gap-2 glitch-effect" data-text="PEAK_RESONANCE">
            <Trophy size={20} /> PEAK_RESONANCE
          </span>
          <span className="text-7xl font-digital neon-text-cyan glitch-effect" data-text={highScore.toString().padStart(4, '0')}>{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameContainerRef}
        tabIndex={0}
        className="relative outline-none border-4 border-[#00ffff] neon-border-cyan bg-black p-2 shadow-2xl"
        style={{ width: 'min(90vw, 500px)', height: 'min(90vw, 500px)' }}
      >
        {/* Grid Background */}
        <div 
          className="w-full h-full grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '5% 5%'
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            const progress = index / snake.length;
            const opacity = Math.max(0.3, 1 - progress);
            const scale = isHead ? 1.1 : Math.max(0.5, 0.9 - progress * 0.4);
            const glow = Math.max(0, 1 - progress * 1.5);

            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`rounded-sm ${isHead ? 'bg-[#ff00ff] neon-bg-pink z-10' : 'bg-[#ff00ff]'}`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  transform: `scale(${scale})`,
                  opacity: isHead ? 1 : opacity,
                  boxShadow: isHead ? undefined : `0 0 ${15 * glow}px rgba(255,0,255,${glow})`,
                }}
              />
            );
          })}

          {/* Food */}
          <div
            className="bg-[#00ffff] neon-bg-cyan rounded-none animate-pulse"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              transform: 'scale(0.8)',
            }}
          />
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 font-digital border-4 border-[#ff00ff] m-2">
            {gameOver ? (
              <>
                <h2 className="text-6xl font-black mb-2 neon-text-pink uppercase tracking-widest glitch-effect" data-text="SYSTEM_CORRUPTION">SYSTEM_CORRUPTION</h2>
                <p className="text-3xl text-[#00ffff] mb-8">DATA_LOST: {score}</p>
                <button 
                  onClick={resetGame}
                  className="w-24 h-24 flex items-center justify-center border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all neon-border-cyan shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:shadow-[0_0_40px_rgba(0,255,255,1)]"
                  title="REBOOT_SYSTEM"
                >
                  <RotateCcw size={48} />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-6xl font-black mb-8 neon-text-cyan uppercase tracking-widest text-center glitch-effect" data-text="AWAITING_NEURAL_SYNC">AWAITING_NEURAL_SYNC</h2>
                <button 
                  onClick={startGame}
                  className="w-24 h-24 flex items-center justify-center border-4 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all neon-border-pink shadow-[0_0_20px_rgba(255,0,255,0.6)] hover:shadow-[0_0_40px_rgba(255,0,255,1)]"
                  title="EXECUTE"
                >
                  <Play size={48} className="fill-current ml-2" />
                </button>
                <div className="mt-8 text-[#00ffff] text-xl text-center animate-pulse">
                  <p>&gt; AWAITING_INPUT</p>
                </div>
              </>
            )}
          </div>
        )}
        
        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 font-digital border-4 border-[#00ffff] m-2">
            <h2 className="text-6xl font-black mb-8 text-[#ff00ff] tracking-widest uppercase glitch-effect" data-text="TEMPORAL_STASIS">TEMPORAL_STASIS</h2>
            <button 
              onClick={() => setIsPaused(false)}
              className="w-24 h-24 flex items-center justify-center border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all neon-border-cyan shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:shadow-[0_0_40px_rgba(0,255,255,1)]"
              title="RESUME_EXEC"
            >
              <Play size={48} className="fill-current ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
