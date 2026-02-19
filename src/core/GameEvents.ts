// Observer Pattern: Event emitter for decoupled game event propagation

export type GameEventListener<T> = (data: T) => void;

export interface GameEventMap {
  'mole-spawned': { moleId: string; position: [number, number] };
  'mole-hit': { moleId: string; points: number };
  'mole-timeout': { moleId: string };
  'score-updated': { score: number };
  'game-started': { difficulty: string };
  'game-paused': { score: number };
  'game-over': { finalScore: number; difficulty: string };
  'time-tick': { timeRemaining: number };
}

export class GameEvents {
  private listeners: Map<keyof GameEventMap, Set<Function>> = new Map();

  on<K extends keyof GameEventMap>(
    event: K,
    listener: GameEventListener<GameEventMap[K]>
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off<K extends keyof GameEventMap>(
    event: K,
    listener: GameEventListener<GameEventMap[K]>
  ): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  emit<K extends keyof GameEventMap>(event: K, data: GameEventMap[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
