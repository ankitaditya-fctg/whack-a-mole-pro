// GitHub Integration: Post game metrics and auto-update issues
// Uses github-integration skill for workflow automation

export interface GameMetrics {
  finalScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  playedAt: Date;
  timeSurvived: number; // in seconds
}

export class GitHubIntegration {
  private owner: string;
  private repo: string;
  private token: string;
  private apiBase = 'https://api.github.com';

  constructor(owner: string, repo: string, token: string) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
  }

  async postGameMetrics(metrics: GameMetrics): Promise<void> {
    const body = this.formatMetricsComment(metrics);

    try {
      // Post as discussion comment or issue comment
      await this.createIssueComment(3, body); // Issue #3 is leaderboard
    } catch (error) {
      console.error('Failed to post game metrics:', error);
    }
  }

  async createIssueComment(issueNumber: number, body: string): Promise<void> {
    const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ body }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.status}`);
    }
  }

  async updateIssueStatus(issueNumber: number, state: 'open' | 'closed'): Promise<void> {
    const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ state }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update issue: ${response.status}`);
    }
  }

  async createFeatureIssue(title: string, description: string, labels: string[]): Promise<number> {
    const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/issues`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body: description,
        labels,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create issue: ${response.status}`);
    }

    const data = (await response.json()) as any;
    return data.number;
  }

  private formatMetricsComment(metrics: GameMetrics): string {
    const timestamp = metrics.playedAt.toISOString();
    const scoreEmojiMap = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴',
    };

    return `
${scoreEmojiMap[metrics.difficulty]} **Game Score Recorded**

- **Score**: ${metrics.finalScore} points
- **Difficulty**: ${metrics.difficulty}
- **Time Survived**: ${metrics.timeSurvived}s
- **Recorded At**: ${timestamp}

*Posted via Whack-a-Mole Pro Extension*
`;
  }
}

export function createGitHubIntegration(owner: string, repo: string, token: string): GitHubIntegration {
  return new GitHubIntegration(owner, repo, token);
}
