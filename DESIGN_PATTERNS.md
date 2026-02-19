# Design Patterns Documentation

## Overview

Whack-a-Mole Pro demonstrates three Gang of Four design patterns working together to create a flexible, maintainable, and extensible game architecture.

---

## 1. Mediator Pattern (Behavioral)

### Location: `src/core/GameMediator.ts`

### Problem Solved
Multiple components (game logic, UI, GitHub automation) need to interact without tight coupling. Without a mediator, each component would directly reference every other, creating a tangled dependency graph.

### Solution
A `GameMediator` class centralizes all game state and coordination. Other components don't communicate directly—they interact through the mediator.

### Structure

```
GameMediator (The Mediator)
├── Maintains State: score, timer, moles[], difficulty
├── Manages Behavior: start(), pause(), hitMole(), etc.
└── Owns Resources: timers, spawn intervals

Observers (Loose Coupling)
├── UI listens to GameEvents
├── GitHub integration listens to GameEvents  
└── Future features (sound, analytics) can listen independently
```

### Key Benefits
1. **Centralized State**: Single source of truth for game data
2. **Loose Coupling**: UI and GitHub automation don't know about each other
3. **Easy Testing**: Inject fake observers to test game logic
4. **Extensibility**: Add new features without modifying existing code

### Code Example
```typescript
// GameMediator coordinates all interactions
const mediator = new GameMediator(4, 'medium');

// Components interact through mediator, not directly
mediator.start();           // Mediator starts timers
mediator.hitMole(id);       // Mediator updates score
mediator.getState();        // Read-only access to state

// Events propagate through mediator
events.on('game-over', (data) => {
  // GitHub integration listens here
  // UI listens here
  // Sound system could listen here
  // All independent
});
```

### Why This Matters
Without Mediator, you'd have:
```
// BAD: Direct coupling
GameUI.start() → GameLogic.start() → ScoreTracker.reset() → LeaderboardService.prepare()
                                  ↓
                            GitHub.notifyStart()

// Each component knows about others = hard to change
```

With Mediator, you have:
```
// GOOD: Decoupled via events
GameUI.start() → GameMediator.start() → emits 'game-started'
                                          ↓
                           [GitHub, Leaderboard, Sound all listen independently]

// Change one listener without affecting others
```

---

## 2. Observer Pattern (Behavioral)

### Location: `src/core/GameEvents.ts`

### Problem Solved
Game events (mole spawn, score update, game over) need to notify multiple observers without creating dependencies. The event emitter shouldn't care who listens—it just broadcasts.

### Solution
A `GameEvents` class implements the pub/sub pattern. Components register listeners for events they care about, and the emitter notifies them when events occur.

### Structure

```
GameEvents (The Publisher)
├── Maintains Listeners: Map<eventName, Set<listeners>>
├── Emits Events: emit('mole-hit', data)
└── Manages Subscriptions: on(), off()

Subscribers (Independent)
├── UI: listens to 'mole-spawned', 'score-updated', 'game-over'
├── GitHub: listens to 'game-over', 'score-updated'
├── Sound: listens to 'mole-hit', 'mole-timeout', 'game-over'
└── Analytics: listens to all events
```

### Key Benefits
1. **One-to-Many**: One event notifies many listeners
2. **Loose Coupling**: Emitter and listeners are independent
3. **Runtime Flexibility**: Add/remove listeners dynamically
4. **Clear Intent**: Events are explicit contracts

### Code Example
```typescript
// Define event types
interface GameEventMap {
  'mole-spawned': { moleId: string; position: [number, number] };
  'mole-hit': { moleId: string; points: number };
  'game-over': { finalScore: number; difficulty: string };
}

// Subscribe to events
events.on('game-over', (data) => {
  console.log(`Game over! Final score: ${data.finalScore}`);
});

events.on('mole-hit', (data) => {
  playSound('hit'); // Independent feature
  recordMetric('mole-hit'); // Independent feature
});

// Emit event (mediator does this)
mediator.hitMole(moleId);
// → GameEvents.emit('mole-hit', { moleId, points })
// → All subscribers notified automatically
```

### Why This Matters
Without Observer, you'd need to manually call each component:
```
// BAD: Hard-coded dependencies
mediator.hitMole(id);
ui.updateScore(newScore);
github.recordHit(id);
sound.playHitSound();
analytics.logEvent('hit');

// Each new feature requires changing hitMole()
```

With Observer, new features just listen:
```
// GOOD: Features register themselves
mediator.hitMole(id); // Only mediator knows about this
// GameEvents.emit('mole-hit', ...)
//   → sound.onMoleHit() [sound registered itself]
//   → analytics.onMoleHit() [analytics registered itself]
//   → github.onMoleHit() [github registered itself]
// Add new feature without changing hitMole()
```

---

## 3. Strategy Pattern (Behavioral)

### Location: `src/core/DifficultyStrategy.ts`

### Problem Solved
Game mechanics vary by difficulty (spawn rate, lifetime, points). Hard-coding these variations creates complex conditional logic and makes adding new difficulties awkward.

### Solution
Define a `DifficultyStrategy` interface and create concrete implementations (Easy, Medium, Hard). The mediator delegates difficulty-specific logic to the appropriate strategy.

### Structure

```
DifficultyStrategy (The Interface)
├── spawnInterval: number
├── moleLifetime: number
├── pointsPerHit: number
└── moleCount: number

Concrete Strategies (Independent)
├── EasyStrategy: slow spawn, long lifetime, 1 point, 1 mole
├── MediumStrategy: medium everything, 2 mole, 2 points
└── HardStrategy: fast spawn, short lifetime, 3 points, 3 moles

GameMediator (Strategy Consumer)
└── Uses strategy to spawn moles and calculate points
```

### Key Benefits
1. **Algorithm Variation**: Easy, Medium, Hard are interchangeable
2. **Easy Extension**: Add Expert, Nightmare, Custom difficulties trivially
3. **No Conditionals**: No `if (difficulty === 'hard')` scattered throughout
4. **Testability**: Each strategy is an independent, testable unit

### Code Example
```typescript
// Define interface
interface DifficultyStrategy {
  spawnInterval: number;
  moleLifetime: number;
  pointsPerHit: number;
  moleCount: number;
}

// Implement concrete strategies
class EasyStrategy implements DifficultyStrategy {
  spawnInterval = 1200;
  pointsPerHit = 1;
}

class HardStrategy implements DifficultyStrategy {
  spawnInterval = 400;
  pointsPerHit = 3;
}

// Mediator uses strategy
class GameMediator {
  private strategy: DifficultyStrategy;

  setDifficulty(level: string) {
    this.strategy = getDifficultyStrategy(level);
    // Behavior automatically changes
  }

  spawnMole() {
    // Uses strategy values
    setTimeout(() => this.spawnMole(), this.strategy.spawnInterval);
  }

  hitMole(id: string) {
    this.score += this.strategy.pointsPerHit; // Different for each difficulty
  }
}
```

### Why This Matters
Without Strategy, difficulties are hard-coded:
```
// BAD: Scattered conditionals
function spawnMole() {
  let interval = 800;
  if (difficulty === 'easy') interval = 1200;
  if (difficulty === 'hard') interval = 400;
  
  setTimeout(spawnMole, interval);
}

function hitMole(id) {
  let points = 2;
  if (difficulty === 'easy') points = 1;
  if (difficulty === 'hard') points = 3;
  
  score += points;
}

// Adding "Nightmare" mode: modify every method!
```

With Strategy, difficulties are encapsulated:
```
// GOOD: Strategies handle themselves
mediator.setDifficulty('hard');
// → Sets strategy = new HardStrategy()
// → spawnMole() automatically uses hard spawn rate
// → hitMole() automatically awards hard points

// Adding "Nightmare": just create new class
class NightmareStrategy implements DifficultyStrategy {
  spawnInterval = 200;
  pointsPerHit = 5;
}
```

---

## How Patterns Work Together

The three patterns form a cohesive system:

```
GameUI → calls → GameMediator
                 ├─ maintains state
                 ├─ uses DifficultyStrategy for game mechanics
                 └─ emits events via GameEvents
                 
GameEvents → notifies → [GitHub, Sound, Analytics, etc.]
                        (all listen independently)

DifficultyStrategy → provides → spawn rates, point values, etc.
```

### Example Flow: Player Hits Mole

```
1. UI clicks mole
2. UI calls: mediator.hitMole(moleId)

3. GameMediator executes:
   - Updates score using strategy.pointsPerHit
   - Removes mole from active list
   - Emits 'mole-hit' event

4. GameEvents notifies all listeners:
   - UI updates score display
   - GitHub records hit
   - Sound plays beep
   - Analytics logs event

5. All independent—no direct connections
```

---

## When to Use Each Pattern

### Use Mediator When:
- Multiple objects need to communicate
- You want to avoid tangled dependencies
- Communication logic is complex
- You'll be adding/removing objects frequently

### Use Observer When:
- One object's state changes affect many others
- You don't want to hard-code who gets notified
- You'll be adding observers later
- Events are the primary communication mechanism

### Use Strategy When:
- Multiple algorithms do the same job
- You want to swap algorithms at runtime
- You'll be adding new algorithms
- Hard-coding conditions would be messy

---

## References

- **Design Patterns: Elements of Reusable Object-Oriented Software** (Gang of Four)
- **UML Diagrams**: See pattern documentation in `skills/design-patterns/`
- **Code**: See `src/core/` for complete implementation

---

## Testing Patterns

Each pattern is independently testable:

```typescript
// Test Mediator
const mediator = new GameMediator(4, 'easy');
mediator.start();
expect(mediator.getState().isRunning).toBe(true);

// Test Observer
const events = new GameEvents();
let hitCount = 0;
events.on('mole-hit', () => hitCount++);
events.emit('mole-hit', { moleId: '1', points: 1 });
expect(hitCount).toBe(1);

// Test Strategy
const easy = new EasyStrategy();
const hard = new HardStrategy();
expect(easy.spawnInterval).toBeLessThan(hard.spawnInterval);
```
