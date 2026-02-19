// Strategy Pattern: Encapsulate difficulty-level algorithms

export interface DifficultyStrategy {
  name: string;
  spawnInterval: number; // milliseconds
  moleLifetime: number; // milliseconds
  pointsPerHit: number;
  moleCount: number; // concurrent moles on board
}

export class EasyStrategy implements DifficultyStrategy {
  name = 'Easy';
  spawnInterval = 1200; // slow spawn
  moleLifetime = 1500; // moles stay longer
  pointsPerHit = 1;
  moleCount = 1; // one mole at a time
}

export class MediumStrategy implements DifficultyStrategy {
  name = 'Medium';
  spawnInterval = 800;
  moleLifetime = 1000;
  pointsPerHit = 2;
  moleCount = 2;
}

export class HardStrategy implements DifficultyStrategy {
  name = 'Hard';
  spawnInterval = 400; // rapid spawn
  moleLifetime = 800;
  pointsPerHit = 3;
  moleCount = 3; // multiple moles
}

export function getDifficultyStrategy(level: 'easy' | 'medium' | 'hard'): DifficultyStrategy {
  switch (level) {
    case 'easy':
      return new EasyStrategy();
    case 'medium':
      return new MediumStrategy();
    case 'hard':
      return new HardStrategy();
  }
}
