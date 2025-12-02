'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

const difficultySettings: Record<Difficulty, { shuffles: number; speed: number }> = {
  easy: { shuffles: 3, speed: 800 },
  medium: { shuffles: 5, speed: 500 },
  hard: { shuffles: 8, speed: 300 },
};

export default function Game() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cups, setCups] = useState<number[]>([0, 1, 2]); // indices of cups
  const [ballIndex, setBallIndex] = useState<number>(Math.floor(Math.random() * 3));
  const [shuffling, setShuffling] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const shuffleCups = async () => {
    const { shuffles, speed } = difficultySettings[difficulty];
    setShuffling(true);
    let current = [...cups];
    for (let i = 0; i < shuffles; i++) {
      // simple swap with random cup
      const a = Math.floor(Math.random() * 3);
      const b = Math.floor(Math.random() * 3);
      const temp = current[a];
      current[a] = current[b];
      current[b] = temp;
      setCups([...current]);
      await new Promise((r) => setTimeout(r, speed));
    }
    // after shuffling, set new ball index
    setBallIndex(Math.floor(Math.random() * 3));
    setShuffling(false);
  };

  useEffect(() => {
    shuffleCups();
  }, [difficulty]);

  const handleCupClick = (index: number) => {
    if (shuffling || selected !== null) return;
    setSelected(index);
    const isCorrect = index === ballIndex;
    setResult(isCorrect ? 'Correct!' : 'Wrong!');
    if (isCorrect) setScore((s) => s + 1);
  };

  const playAgain = () => {
    setSelected(null);
    setResult(null);
    shuffleCups();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center space-x-4 mb-4">
        {['easy', 'medium', 'hard'].map((level) => (
          <Button
            key={level}
            variant={level === difficulty ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty(level as Difficulty)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        {cups.map((cup, idx) => (
          <div
            key={idx}
            className={cn(
              'w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center cursor-pointer transition-transform',
              shuffling && 'animate-spin',
              selected !== null && idx === selected && 'border-4 border-green-500',
              selected !== null && idx !== selected && 'border-4 border-red-500'
            )}
            onClick={() => handleCupClick(idx)}
          >
            {selected !== null && idx === ballIndex && (
              <span className="text-2xl">⚽</span>
            )}
          </div>
        ))}
      </div>

      {result && (
        <div className="text-center mb-4">
          <p className="text-xl font-semibold">{result}</p>
          <p className="text-muted-foreground">Score: {score}</p>
        </div>
      )}

      {selected !== null && (
        <div className="flex justify-center">
          <Button onClick={playAgain}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
