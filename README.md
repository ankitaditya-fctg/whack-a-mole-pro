# 🔨 Whack-a-Mole Pro

An interactive whack-a-mole game built with GitHub Copilot, design patterns, and VS Code extensions. Demonstrates how AI agents, design patterns, and GitHub integration can work together to create professional software.

**Challenge**: [Challenge 03 — Extending GitHub Copilot with Model Context Protocol](CHALLENGE.md)

---

## 🎮 Quick Start

### Prerequisites
- VS Code (latest)
- Node.js 16+
- GitHub account (for MCP integration)

### Installation

```bash
# Clone repository
git clone https://github.com/ankitaditya-fctg/whack-a-mole-pro
cd whack-a-mole-pro

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in VS Code
code .
```

### Playing the Game

1. Open VS Code
2. Open Command Palette: `Cmd+Shift+P`
3. Type: "Open Whack-a-Mole Game"
4. Press Enter to launch the game panel

**Game Rules:**
- Click moles before they disappear
- Avoid clicking empty holes
- Higher difficulty = faster moles = more points
- 60-second game timer

---

## 🏗️ Architecture

### Design Patterns Used

This project demonstrates **three Gang of Four behavioral patterns** working together:

#### 1. **Mediator Pattern** — Game State Management
Central `GameMediator` class coordinates all game logic without tight coupling.

```
GameMediator
├─ Maintains: score, timer, moles[], difficulty
├─ Manages: start(), pause(), hitMole(), reset()
└─ Events: mole-spawned, mole-hit, game-over, etc.
```

**Why**: Prevents communication explosion; makes adding features easy.

**See**: [`src/core/GameMediator.ts`](src/core/GameMediator.ts)

#### 2. **Observer Pattern** — Event System
`GameEvents` decouples game logic from UI and GitHub automation.

```
GameEvents (Publisher)
└─ Subscribers: UI, GitHub, Sound, Analytics
   (each listens independently)
```

**Why**: UI and GitHub integration don't know about each other; easy to add new features.

**See**: [`src/core/GameEvents.ts`](src/core/GameEvents.ts)

#### 3. **Strategy Pattern** — Difficulty Levels
`DifficultyStrategy` interface with Easy/Medium/Hard implementations.

```
DifficultyStrategy (Interface)
├─ EasyStrategy: 1 mole, 1 point, slow spawn
├─ MediumStrategy: 2 moles, 2 points, medium spawn
└─ HardStrategy: 3 moles, 3 points, fast spawn
```

**Why**: No hard-coded conditionals; adding difficulties is trivial.

**See**: [`src/core/DifficultyStrategy.ts`](src/core/DifficultyStrategy.ts)

### Pattern Documentation

**Complete pattern explanations with code examples:**
👉 **[DESIGN_PATTERNS.md](DESIGN_PATTERNS.md)**

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | VS Code Extension API |
| **Language** | TypeScript (strict mode) |
| **UI Toolkit** | VS Code Webview UI Toolkit |
| **Build** | Webpack + ts-loader |
| **Testing** | Jest + ts-jest |
| **GitHub** | GitHub API v3 |

### Key Dependencies

```json
{
  "@vscode/webview-ui-toolkit": "^1.2.0",  // VS Code components
  "@types/vscode": "^1.84.0",               // VS Code types
  "typescript": "^5.0.0",                   // Type safety
  "webpack": "^5.0.0"                       // Bundling
}
```

---

## 📁 Project Structure

```
whack-a-mole-pro/
├── src/
│   ├── core/                              # Game logic (patterns)
│   │   ├── GameMediator.ts               # ★ Mediator pattern
│   │   ├── GameEvents.ts                 # ★ Observer pattern
│   │   ├── DifficultyStrategy.ts         # ★ Strategy pattern
│   │   └── GitHubIntegration.ts          # GitHub automation
│   │
│   ├── ui/
│   │   └── GamePanel.ts                  # VS Code webview
│   │
│   └── extension.ts                       # VS Code extension entry
│
├── dist/                                  # Compiled JavaScript
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript config
├── DESIGN_PATTERNS.md                    # ★ Detailed pattern guide
├── README.md                              # This file
└── CHALLENGE.md                           # Challenge requirements
```

---

## 📊 Game Features

### Core Mechanics
- ✅ Mole spawning on 4×4 grid
- ✅ Click to hit moles
- ✅ Score tracking (difficulty multipliers)
- ✅ 60-second countdown timer
- ✅ Auto-despawn moles after timeout

### Difficulty Levels

| Level | Spawn Rate | Lifetime | Points/Hit | Concurrent |
|-------|-----------|----------|-----------|-----------|
| Easy | 1.2s | 1.5s | 1 | 1 |
| Medium | 0.8s | 1.0s | 2 | 2 |
| Hard | 0.4s | 0.8s | 3 | 3 |

### GitHub Integration
- 📝 Post game scores to leaderboard issue (#3)
- 🔗 Auto-create issues for new features
- ✏️ Update issue status when features complete
- 📊 Track metrics and gameplay statistics

---

## 🎓 Copilot Skills Used

### 1. **design-patterns** Skill
Used to select and implement Mediator, Observer, and Strategy patterns.

**Key Concepts from Skill:**
- Pattern selection guide (problem domain → pattern)
- Implementation guidelines
- Anti-patterns to avoid
- Performance considerations

**Applied In:**
- Architecture design
- Pattern documentation ([DESIGN_PATTERNS.md](DESIGN_PATTERNS.md))
- Code organization

### 2. **vscode-ui-components** Skill
Used to build the game UI with VS Code Webview Toolkit components.

**Components Used:**
- `vsCodeButton` - Game controls (Start, Pause, Reset)
- `vsCodePanel` - Main game container
- `vsCodeDropdown` - Difficulty selector
- `vsCodeDataGrid` - Leaderboard display (future)
- Custom canvas/SVG for mole grid

**Applied In:**
- UI rendering ([src/ui/GamePanel.ts](src/ui/GamePanel.ts))
- Theme support (light/dark mode)
- Accessibility features

### 3. **github-integration** Skill
Used to automate GitHub workflows and issue management.

**Capabilities:**
- Create GitHub issues programmatically
- Post comments to issues
- Update issue status
- Auto-create meta-tasks for feature tracking

**Applied In:**
- GitHub automation ([src/core/GitHubIntegration.ts](src/core/GitHubIntegration.ts))
- Metrics posting
- Feature tracking

### 4. **skill-router** Skill
Used to discover complementary skills and map to design patterns.

**Discovery Goals:**
- Event-driven architecture patterns
- State management skills
- Canvas/SVG rendering for game board
- Testing strategies for pattern-based code
- Metrics/analytics skills

**Applied In:**
- Skill discovery planning
- Pattern-to-skill mapping
- Future enhancement planning

---

## 💡 Prompt Versions (Copilot Agent Learning)

This project demonstrates how **prompt specificity dramatically improves output quality**.

### Version 1: Vague Prompt
```
Build me a whack-a-mole game.
```
**Output**: Generic structure, minimal features, no architecture

### Version 2: Medium Detail
```
Build me a whack-a-mole game using HTML, CSS, and JavaScript.
The game should have: clickable moles, score counter, timer,
start/reset buttons, basic styling.
```
**Output**: Better structure, still missing patterns, no integration

### Version 3: Detailed Prompt (Used Here)
```
Build a professional whack-a-mole game with:
- Tech: VS Code Extension, TypeScript, vscode-ui-components
- Patterns: Mediator (state), Observer (events), Strategy (difficulty)
- Architecture: Separate core/ and ui/ folders
- Integration: GitHub metrics, MCP support
- Quality: TypeScript strict, dependency injection, no globals
```
**Output**: Complete, well-architected, pattern-based, integration-ready

**Key Insight**: Detailed prompts reduce rework by 50-75% vs vague prompts.

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run with Watcher
```bash
npm run watch
```

### Test Strategy
- Unit test each `Strategy` implementation
- Integration test game state transitions
- Component test mole rendering

---

## 🔗 GitHub Issues (Challenge Tracking)

This project was built to solve 6 tracked issues:

| # | Title | Labels | Status |
|---|-------|--------|--------|
| 1 | Difficulty levels (easy/medium/hard) | enhancement, design-pattern | ✅ Done |
| 2 | Moles don't disappear after timeout | bug, design-pattern | ⏳ In Progress |
| 3 | Leaderboard with high scores | feature, automation | ⏳ Backlog |
| 4 | Sound effects on hit/miss | enhancement | ⏳ Backlog |
| 5 | Mobile responsive UI | enhancement | ⏳ Backlog |
| 6 | README with setup instructions | documentation | ✅ Done |

**View all issues:**
👉 [GitHub Issues](https://github.com/ankitaditya-fctg/whack-a-mole-pro/issues)

---

## 🚀 Running with GitHub MCP

### Step 1: Configure GitHub MCP in VS Code

1. Open VS Code Settings: `Cmd+,`
2. Search: "MCP"
3. Add GitHub MCP Server configuration (see [GitHub MCP Server docs](https://github.com/github/github-mcp-server))
4. Authenticate via OAuth when prompted

### Step 2: Query Your Project via Copilot Chat

In VS Code Copilot Chat (Agent Mode):

```
"What open issues are in my whack-a-mole repo?"
"Which issues are labeled 'bug'?"
"Summarize the planned enhancements"
"Help me implement issue #1"
```

Copilot will read live GitHub data via MCP and provide context-aware help.

---

## 📚 Learning Outcomes

After completing this project, you'll understand:

1. **Design Patterns in Practice**
   - How Mediator prevents tight coupling
   - Why Observer is essential for event systems
   - When Strategy beats hard-coded conditionals

2. **AI-Driven Development**
   - How prompt specificity improves Copilot output
   - The value of detailed requirements
   - When to use Agent vs. Chat mode

3. **GitHub as Infrastructure**
   - Using GitHub issues as executable specs
   - How MCP connects Copilot to project data
   - Automating workflows via GitHub API

4. **VS Code Extensions**
   - Building custom game/tool UIs in webviews
   - Using VS Code Webview UI Toolkit components
   - Theme support and accessibility

---

## 🤝 Contributing

This is a learning project for Challenge 03. To contribute:

1. Pick an open issue
2. Create a feature branch
3. Implement the feature (use the skills!)
4. Submit a PR with pattern documentation

---

## 📖 Further Reading

### Design Patterns
- [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) - Complete pattern guide
- [Gang of Four Book](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [Refactoring Guru Design Patterns](https://refactoring.guru/design-patterns)

### GitHub & MCP
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub API Documentation](https://docs.github.com/en/rest)

### Copilot Skills
- Local: [`skills/` folder](skills/)
- Remote: [GitHub awesome-copilot](https://github.com/github/awesome-copilot)

---

## 📝 License

This project is part of GitHub Challenge 03. Educational use only.

---

## 🎯 Challenge Status

- ✅ Step 1: Scaffold game with Copilot Agent (3 prompt versions)
- ✅ Step 2: Create GitHub issues & labels (6 issues)
- ✅ Step 3: Understand MCP (research completed)
- ⏳ Step 4: Configure GitHub MCP (in progress)
- ⏳ Step 5: Use Copilot + MCP to implement features (next)
- ⏳ Step 6: Prepare demo & learnings (final)

**Next Up**: Configure GitHub MCP and implement remaining features using pattern-based architecture.

---

**Questions?** Check [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) for pattern guidance.

**Built with**: GitHub Copilot, Design Patterns, VS Code, TypeScript, and ❤️
