import * as vscode from 'vscode';
import { GameMediator } from '../core/GameMediator';

export class GamePanel {
  public static readonly viewType = 'whack-a-mole-pro.gamePanel';
  private panel: vscode.WebviewPanel;
  private mediator: GameMediator;
  private disposables: vscode.Disposable[] = [];

  constructor(extensionUri: vscode.Uri) {
    // Create webview panel
    this.panel = vscode.window.createWebviewPanel(
      GamePanel.viewType,
      'Whack-a-Mole Pro',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [],
      }
    );

    // Initialize game mediator
    this.mediator = new GameMediator(4, 'medium');

    // Set webview content
    this.panel.webview.html = this.getWebviewContent();

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      undefined,
      this.disposables
    );

    // Handle panel disposal
    this.panel.onDidDispose(() => this.dispose(), undefined, this.disposables);

    // Subscribe to game events
    this.setupEventListeners();
  }

  private handleMessage(message: any) {
    switch (message.command) {
      case 'start':
        this.mediator.start();
        break;
      case 'pause':
        this.mediator.pause();
        break;
      case 'resume':
        this.mediator.resume();
        break;
      case 'reset':
        this.mediator.reset();
        break;
      case 'hitMole':
        this.mediator.hitMole(message.moleId);
        break;
      case 'setDifficulty':
        this.mediator.setDifficulty(message.difficulty);
        break;
    }
  }

  private setupEventListeners() {
    const events = this.mediator.getEvents();

    events.on('game-started', (data) => {
      this.postMessage({
        type: 'gameStarted',
        difficulty: data.difficulty,
      });
    });

    events.on('mole-spawned', (data) => {
      this.postMessage({
        type: 'moleSpawned',
        moleId: data.moleId,
        position: data.position,
      });
    });

    events.on('mole-hit', (data) => {
      this.postMessage({
        type: 'moleHit',
        moleId: data.moleId,
        points: data.points,
      });
    });

    events.on('score-updated', (data) => {
      this.postMessage({
        type: 'scoreUpdated',
        score: data.score,
      });
    });

    events.on('time-tick', (data) => {
      this.postMessage({
        type: 'timeTick',
        timeRemaining: data.timeRemaining,
      });
    });

    events.on('game-over', (data) => {
      this.postMessage({
        type: 'gameOver',
        finalScore: data.finalScore,
        difficulty: data.difficulty,
      });
    });
  }

  private postMessage(message: any) {
    this.panel.webview.postMessage(message);
  }

  private getWebviewContent(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Whack-a-Mole Pro</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, var(--vscode-editor-background) 0%, rgba(0,0,0,0.1) 100%);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            min-height: 100vh;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.2);
            padding: 24px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }
          
          h1 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            justify-content: center;
            background: rgba(0,0,0,0.2);
            padding: 12px;
            border-radius: 8px;
            backdrop-filter: blur(5px);
          }
          
          .controls button {
            padding: 10px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .controls button:hover {
            background: var(--vscode-button-hoverBackground);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .controls button:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
          
          .controls select {
            padding: 10px 12px;
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
          }
          
          .controls select:hover {
            border-color: rgba(102, 126, 234, 0.6);
            box-shadow: 0 0 8px rgba(102, 126, 234, 0.2);
          }
          
          .controls select:focus {
            outline: none;
            border-color: var(--vscode-button-background);
            box-shadow: 0 0 12px rgba(102, 126, 234, 0.3);
          }
          
          .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .stat-box {
            background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
            border: 1px solid rgba(102, 126, 234, 0.3);
            padding: 15px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          
          .stat-box:hover {
            background: linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%);
            border-color: rgba(102, 126, 234, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
          }
          
          .stat-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-button-background);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .stat-value.pop {
            animation: scorePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          @keyframes scorePop {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          
          .game-board {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 20px;
            aspect-ratio: 1;
          }
          
          .game-board.flash {
            animation: boardFlash 0.15s ease-out;
          }
          
          @keyframes boardFlash {
            0% { background: rgba(255, 255, 255, 0); }
            50% { background: rgba(255, 255, 255, 0.2); }
            100% { background: rgba(255, 255, 255, 0); }
          }
          
          .mole-hole {
            background: radial-gradient(circle at 30% 30%, rgba(100,100,100,0.3), rgba(50,50,50,0.8));
            border: 2px solid var(--vscode-editor-lineHighlightBackground);
            border-radius: 50%;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
          }
          
          .mole-hole:hover {
            border-color: var(--vscode-button-background);
            background: radial-gradient(circle at 30% 30%, rgba(150,150,150,0.4), rgba(80,80,80,0.8));
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.5), 0 0 8px rgba(102, 126, 234, 0.3);
            transform: scale(1.02);
          }
          
          .mole {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: radial-gradient(circle at 35% 35%, #fff, #333);
            border-radius: 50%;
            border: 3px solid #222;
            box-shadow: inset -2px -2px 4px rgba(0,0,0,0.5);
            animation: molePop 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
            transition: all 0.1s ease;
            cursor: pointer;
          }
          
          .mole:hover {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: inset -2px -2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255, 255, 255, 0.3);
          }
          
          @keyframes molePop {
            0% {
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes moleHit {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(0.8) rotate(5deg);
              opacity: 0.5;
            }
            100% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
            }
          }
          
          .mole.hit {
            animation: moleHit 0.3s ease-out forwards;
          }
          
          .mole::before {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            background: black;
            border-radius: 50%;
            top: 35%;
            left: 30%;
          }
          
          .mole::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            background: black;
            border-radius: 50%;
            top: 35%;
            right: 30%;
          }
          
          .status {
            text-align: center;
            padding: 12px;
            border-radius: 6px;
            background: var(--vscode-notificationCenter-border);
            color: var(--vscode-foreground);
            margin-bottom: 20px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .status.active {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
          }
          
          .status.ended {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔨 Whack-a-Mole Pro</h1>
          
          <div class="controls">
            <button id="startBtn">Start</button>
            <button id="pauseBtn">Pause</button>
            <button id="resumeBtn">Resume</button>
            <button id="resetBtn">Reset</button>
            <select id="difficultySelect">
              <option value="easy">Easy</option>
              <option value="medium" selected>Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div class="stats">
            <div class="stat-box">
              <div class="stat-label">Score</div>
              <div class="stat-value" id="score">0</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Time Remaining</div>
              <div class="stat-value" id="time">60</div>
            </div>
          </div>
          
          <div class="status" id="status">Ready to play</div>
          
          <div class="game-board" id="gameBoard">
            ${Array.from({ length: 16 })
              .map(
                (_, i) => `
              <div class="mole-hole" data-index="${i}" onclick="hitMole('hole-${i}')"></div>
            `
              )
              .join('')}
          </div>
        </div>
        
        <script>
          const vscode = acquireVsCodeApi();
          const holeToMoleMap = new Map(); // Maps hole index to current mole ID
          
          document.getElementById('startBtn').onclick = () => vscode.postMessage({ command: 'start' });
          document.getElementById('pauseBtn').onclick = () => vscode.postMessage({ command: 'pause' });
          document.getElementById('resumeBtn').onclick = () => vscode.postMessage({ command: 'resume' });
          document.getElementById('resetBtn').onclick = () => vscode.postMessage({ command: 'reset' });
          
          document.getElementById('difficultySelect').onchange = (e) => {
            vscode.postMessage({ command: 'setDifficulty', difficulty: e.target.value });
          };
          
          // Handle hole clicks - find the mole in that hole and hit it
          function hitMole(holeIndex) {
            const hole = document.querySelector(\`[data-index="\${holeIndex}"]\`);
            const mole = hole ? hole.querySelector('.mole') : null;
            
            if (mole && mole.dataset.moleId) {
              console.log('Mole clicked:', mole.dataset.moleId);
              vscode.postMessage({ command: 'hitMole', moleId: mole.dataset.moleId });
            } else {
              console.log('No mole in hole:', holeIndex);
            }
          }
          
          window.addEventListener('message', (event) => {
            const message = event.data;
            
            switch (message.type) {
              case 'gameStarted':
                console.log('Game started:', message.difficulty);
                document.getElementById('status').textContent = \`Game started on \${message.difficulty}\`;
                document.getElementById('status').classList.add('active');
                break;
                
              case 'moleSpawned':
                const [row, col] = message.position;
                const index = row * 4 + col;
                const hole = document.querySelector(\`[data-index="\${index}"]\`);
                console.log('Mole spawned:', message.moleId, 'at index:', index);
                
                if (hole) {
                  // Remove any existing mole
                  const oldMole = hole.querySelector('.mole');
                  if (oldMole) oldMole.remove();
                  
                  // Create new mole
                  const mole = document.createElement('div');
                  mole.className = 'mole';
                  mole.dataset.moleId = message.moleId;
                  hole.appendChild(mole);
                  holeToMoleMap.set(index, message.moleId);
                }
                break;
                
              case 'moleHit':
                console.log('Mole hit:', message.moleId, 'points:', message.points);
                // Find and animate the mole
                const holeWithMole = document.querySelector(\`[data-mole-id="\${message.moleId}"]\`);
                if (holeWithMole) {
                  holeWithMole.classList.add('hit');
                  setTimeout(() => holeWithMole.remove(), 300);
                }
                // Flash the board
                const board = document.getElementById('gameBoard');
                board.classList.add('flash');
                setTimeout(() => board.classList.remove('flash'), 150);
                break;
                
              case 'scoreUpdated':
                console.log('Score updated:', message.score);
                const scoreEl = document.getElementById('score');
                scoreEl.textContent = message.score;
                // Trigger pop animation
                scoreEl.classList.remove('pop');
                void scoreEl.offsetWidth; // Trigger reflow
                scoreEl.classList.add('pop');
                setTimeout(() => scoreEl.classList.remove('pop'), 400);
                break;
                
              case 'timeTick':
                document.getElementById('time').textContent = message.timeRemaining;
                break;
                
              case 'gameOver':
                console.log('Game over! Final score:', message.finalScore);
                document.getElementById('status').textContent = \`Game Over! Final Score: \${message.finalScore}\`;
                document.getElementById('status').classList.remove('active');
                document.getElementById('status').classList.add('ended');
                break;
            }
          });
        </script>
      </body>
      </html>
    `;
  }

  public reveal() {
    this.panel.reveal();
  }

  public onDispose(callback: () => void) {
    this.panel.onDidDispose(callback);
  }

  private dispose() {
    this.panel.dispose();
    this.disposables.forEach((d) => d.dispose());
  }
}
