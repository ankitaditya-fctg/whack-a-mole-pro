import * as vscode from 'vscode';
import { GamePanel } from './ui/GamePanel';

let gamePanel: GamePanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  const openGameCommand = vscode.commands.registerCommand(
    'whack-a-mole-pro.openGame',
    () => {
      if (gamePanel) {
        gamePanel.reveal();
      } else {
        gamePanel = new GamePanel(context.extensionUri);
        gamePanel.onDispose(() => {
          gamePanel = undefined;
        });
      }
    }
  );

  context.subscriptions.push(openGameCommand);
}

export function deactivate() {}
