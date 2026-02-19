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
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          
          h1 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 28px;
          }
          
          .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .controls button {
            padding: 10px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          
          .controls button:hover {
            background: var(--vscode-button-hoverBackground);
          }
          
          .controls select {
            padding: 10px 12px;
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            border: 1px solid var(--vscode-dropdown-border);
            border-radius: 4px;
            cursor: pointer;
          }
          
          .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .stat-box {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-editor-lineHighlightBackground);
            padding: 15px;
            border-radius: 6px;
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
          }
          
          .game-board {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 20px;
            aspect-ratio: 1;
          }
          
          .mole-hole {
            background: var(--vscode-editor-background);
            border: 2px solid var(--vscode-editor-lineHighlightBackground);
            border-radius: 50%;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .mole-hole:hover {
            border-color: var(--vscode-button-background);
            background: var(--vscode-editor-selectionBackground);
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
            padding: 10px;
            border-radius: 4px;
            background: var(--vscode-notificationCenter-border);
            color: var(--vscode-foreground);
            margin-bottom: 20px;
          }
          
          .status.active {
            background: var(--vscode-testing-runAction);
            color: white;
          }
          
          .status.ended {
            background: var(--vscode-notificationsErrorIcon-foreground);
            color: white;
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
          const board = new Map();
          
          document.getElementById('startBtn').onclick = () => vscode.postMessage({ command: 'start' });
          document.getElementById('pauseBtn').onclick = () => vscode.postMessage({ command: 'pause' });
          document.getElementById('resumeBtn').onclick = () => vscode.postMessage({ command: 'resume' });
          document.getElementById('resetBtn').onclick = () => vscode.postMessage({ command: 'reset' });
          
          document.getElementById('difficultySelect').onchange = (e) => {
            vscode.postMessage({ command: 'setDifficulty', difficulty: e.target.value });
          };
          
          function hitMole(moleId) {
            vscode.postMessage({ command: 'hitMole', moleId });
          }
          
          window.addEventListener('message', (event) => {
            const message = event.data;
            
            switch (message.type) {
              case 'gameStarted':
                document.getElementById('status').textContent = \`Game started on \${message.difficulty}\`;
                document.getElementById('status').classList.add('active');
                break;
                
              case 'moleSpawned':
                const [row, col] = message.position;
                const index = row * 4 + col;
                const hole = document.querySelector(\`[data-index="\${index}"]\`);
                if (hole && !hole.querySelector('.mole')) {
                  const mole = document.createElement('div');
                  mole.className = 'mole';
                  mole.dataset.moleId = message.moleId;
                  hole.appendChild(mole);
                }
                break;
                
              case 'moleHit':
                const moles = document.querySelectorAll(\`[data-mole-id="\${message.moleId}"]\`);
                moles.forEach(m => m.remove());
                break;
                
              case 'scoreUpdated':
                document.getElementById('score').textContent = message.score;
                break;
                
              case 'timeTick':
                document.getElementById('time').textContent = message.timeRemaining;
                break;
                
              case 'gameOver':
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
