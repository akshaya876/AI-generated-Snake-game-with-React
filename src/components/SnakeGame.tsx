import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'Escape') {
      setIsPaused(p => !p);
      return;
    }

    if (isPaused) return;
    if (!hasStarted) setHasStarted(true);

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
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 1;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 5) * 10);
    const gameLoop = setInterval(moveSnake, speed);

    return () => clearInterval(gameLoop);
  }, [food, gameOver, isPaused, score, highScore, hasStarted]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#050505] border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF00FF] animate-pulse" />
      
      <div className="flex justify-between w-full max-w-md mb-4 px-2 border-b-2 border-[#00FFFF] pb-2">
        <div className="flex flex-col">
          <span className="text-[#FF00FF] text-lg uppercase tracking-widest">FRAGMENTS</span>
          <span className="text-4xl font-bold text-[#00FFFF]">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#FF00FF] text-lg uppercase tracking-widest">MAX_OVERRIDE</span>
          <span className="text-4xl font-bold text-[#00FFFF]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative">
        <div 
          className="grid bg-[#020202] border-2 border-[#FF00FF]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border-[1px] border-[#00FFFF]/10
                  ${isHead ? 'bg-[#00FFFF] shadow-[0_0_10px_#00FFFF] z-10' : ''}
                  ${isSnake && !isHead ? 'bg-[#00FFFF]/70' : ''}
                  ${isFood ? 'bg-[#FF00FF] shadow-[0_0_15px_#FF00FF] animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-[#050505]/80 flex flex-col items-center justify-center z-20 border-4 border-[#FF00FF] tear-effect">
            {!hasStarted && !gameOver && (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#00FFFF] mb-4 glitch-text" data-text="INITIALIZE">INITIALIZE</h2>
                <p className="text-[#FF00FF] text-xl animate-pulse">INPUT [DIRECTION] TO EXECUTE</p>
              </div>
            )}
            
            {isPaused && !gameOver && hasStarted && (
              <div className="text-center bg-[#00FFFF] text-[#050505] p-4 border-4 border-[#FF00FF]">
                <h2 className="text-4xl font-bold mb-2">HALTED</h2>
                <p className="text-xl">INPUT [SPACE] TO RESUME</p>
              </div>
            )}

            {gameOver && (
              <div className="text-center flex flex-col items-center bg-[#FF00FF] text-[#050505] p-6 border-4 border-[#00FFFF]">
                <h2 className="text-5xl font-bold mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-2xl mb-6 font-bold">FRAGMENTS_LOST: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-[#050505] text-[#00FFFF] border-2 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#050505] transition-colors text-2xl font-bold uppercase"
                >
                  REBOOT_SYSTEM
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-6 text-xl text-[#00FFFF]">
        <span>[WASD/ARROWS]: NAVIGATE</span>
        <span>[SPACE]: INTERRUPT</span>
      </div>
    </div>
  );
}
