// Mediator Pattern: Centralized game state and coordination

import { GameEvents, GameEventMap } from './GameEvents';
import { DifficultyStrategy, getDifficultyStrategy } from './DifficultyStrategy';

export interface Mole {
  id: string;
  position: [number, number]; // [row, col]
  createdAt: number;
  hit: boolean;
}

export interface GameState {
  score: number;
  timeRemaining: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isRunning: boolean;
  isPaused: boolean;
  moles: Mole[];
  gridSize: number; // 3x3, 4x4, etc
}

export class GameMediator {
  private state: GameState;
  private events: GameEvents;
  private strategy: DifficultyStrategy;
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private gameTimer: NodeJS.Timeout | null = null;
  private spawnTimer: NodeJS.Timeout | null = null;

  constructor(gridSize: number = 4, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.events = new GameEvents();
    this.strategy = getDifficultyStrategy(difficulty);

    this.state = {
      score: 0,
      timeRemaining: 60,
      difficulty,
      isRunning: false,
      isPaused: false,
      moles: [],
      gridSize,
    };
  }

  // Public API
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  getEvents(): GameEvents {
    return this.events;
  }

  start(): void {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.events.emit('game-started', { difficulty: this.state.difficulty });

    // Start game timer (countdown)
    this.gameTimer = setInterval(() => {
      this.state.timeRemaining--;
      this.events.emit('time-tick', { timeRemaining: this.state.timeRemaining });

      if (this.state.timeRemaining <= 0) {
        this.end();
      }
    }, 1000);

    // Start mole spawner
    this.spawnMole();
    this.spawnTimer = setInterval(() => this.spawnMole(), this.strategy.spawnInterval);
  }

  pause(): void {
    if (!this.state.isRunning || this.state.isPaused) return;

    this.state.isPaused = true;
    if (this.gameTimer) clearInterval(this.gameTimer);
    if (this.spawnTimer) clearInterval(this.spawnTimer);

    this.events.emit('game-paused', { score: this.state.score });
  }

  resume(): void {
    if (!this.state.isRunning || !this.state.isPaused) return;

    this.state.isPaused = false;
    this.start(); // Restart timers
  }

  reset(): void {
    this.end();
    this.state.score = 0;
    this.state.timeRemaining = 60;
    this.state.moles = [];
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.state.difficulty = difficulty;
    this.strategy = getDifficultyStrategy(difficulty);
  }

  hitMole(moleId: string): void {
    const mole = this.state.moles.find((m) => m.id === moleId);
    if (!mole || mole.hit) return;

    mole.hit = true;
    this.state.score += this.strategy.pointsPerHit;

    // Clean up mole
    this.removeMole(moleId);

    this.events.emit('mole-hit', { moleId, points: this.strategy.pointsPerHit });
    this.events.emit('score-updated', { score: this.state.score });
  }

  // Private methods
  private spawnMole(): void {
    if (!this.state.isRunning || this.state.isPaused) return;
    if (this.state.moles.length >= this.strategy.moleCount) return;

    const moleId = `mole-${Date.now()}-${Math.random()}`;
    const position: [number, number] = [
      Math.floor(Math.random() * this.state.gridSize),
      Math.floor(Math.random() * this.state.gridSize),
    ];

    const mole: Mole = {
      id: moleId,
      position,
      createdAt: Date.now(),
      hit: false,
    };

    this.state.moles.push(mole);
    this.events.emit('mole-spawned', { moleId, position });

    // Auto-remove after lifetime
    const timeout = setTimeout(() => {
      if (!mole.hit) {
        this.removeMole(moleId);
        this.events.emit('mole-timeout', { moleId });
      }
    }, this.strategy.moleLifetime);

    this.timers.set(moleId, timeout);
  }

  private removeMole(moleId: string): void {
    this.state.moles = this.state.moles.filter((m) => m.id !== moleId);

    const timeout = this.timers.get(moleId);
    if (timeout) {
      clearTimeout(timeout);
      this.timers.delete(moleId);
    }
  }

  private end(): void {
    this.state.isRunning = false;

    if (this.gameTimer) clearInterval(this.gameTimer);
    if (this.spawnTimer) clearInterval(this.spawnTimer);

    this.timers.forEach((timeout) => clearTimeout(timeout));
    this.timers.clear();

    this.events.emit('game-over', {
      finalScore: this.state.score,
      difficulty: this.state.difficulty,
    });
  }
}
