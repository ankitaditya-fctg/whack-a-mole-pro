# MCP Test Queries Guide

## Overview

This guide provides step-by-step MCP test queries to verify GitHub integration and practice context-aware Copilot development.

**Repository**: https://github.com/ankitaditya-fctg/whack-a-mole-pro

---

## Phase 1: Connection Verification

### Query 1.1: List All Issues
```
"What issues are in the whack-a-mole-pro repository?"
```

**Expected Result**: All 6 issues listed
- ✅ Difficulty levels
- ✅ Moles don't disappear after time limit
- ✅ Add a scoring leaderboard
- ✅ Add sound effects on hit/miss
- ✅ Game should be mobile responsive
- ✅ Write a README with setup instructions

**MCP Tools Used**: `list_issues`

---

### Query 1.2: Filter by Status
```
"Show me all OPEN issues in whack-a-mole-pro"
```

**Expected Result**: Issues that haven't been closed
- Currently should show all 6 (or filter by status parameter)

**MCP Tools Used**: `list_issues` with filters

---

### Query 1.3: Filter by Label
```
"Which issues are labeled 'bug' in whack-a-mole-pro?"
```

**Expected Result**: 
- Issue #2: Moles don't disappear after time limit

**MCP Tools Used**: `search_issues` with label filter

---

## Phase 2: Context-Aware Queries

### Query 2.1: Single Issue Details
```
"Get the details of issue #1 in whack-a-mole-pro"
```

**Expected Result**: Full issue details including:
- Title: "Add difficulty levels (easy / medium / hard)"
- Description with requirements
- Labels: enhancement, design-pattern, skills-integration

**MCP Tools Used**: `get_issue`

---

### Query 2.2: Issue-Specific Implementation Help
```
"Read issue #3 in whack-a-mole-pro (leaderboard), then:
1. Summarize what needs to be implemented
2. Suggest which Copilot skills could help
3. Outline the implementation steps"
```

**Expected Result**: Copilot reads issue #3 and provides:
- Summary of leaderboard requirements
- Suggestions to use:
  - `vscode-ui-components` (DataGrid)
  - `github-integration` (auto-post scores)
  - Observer pattern (listen to game-over events)
- Step-by-step implementation guide

**MCP Tools Used**: `get_issue` → Analysis → Guidance

---

### Query 2.3: Design Pattern Issues
```
"List all issues labeled 'design-pattern' in whack-a-mole-pro 
and explain why each uses design patterns"
```

**Expected Result**: 
- Issue #1: Difficulty levels (Strategy pattern)
- Issue #2: Moles timeout (Mediator pattern)
- With explanations

**MCP Tools Used**: `search_issues` with label filter

---

## Phase 3: Implementation Queries

### Query 3.1: Get Issue, Provide Implementation
```
"Help me implement issue #1 (difficulty levels). 
Read the issue first, then provide:
1. The challenge/requirement
2. How this should integrate with existing patterns
3. Code structure suggestions
4. How to test it"
```

**Expected Result**: 
- Issue #1 requirement: Add easy/medium/hard difficulty levels
- Integration: Use Strategy pattern (already implemented!)
- DifficultyStrategy.ts shows the pattern
- Code structure: Easy/Medium/HardStrategy classes
- Testing: Unit test each strategy's properties

**Key Insight**: MCP showed Copilot the existing code!

---

### Query 3.2: Sound Effects with Observer Pattern
```
"Show me issue #4 (sound effects). 
How should I implement this using the Observer pattern 
that's already in GameEvents.ts?"
```

**Expected Result**:
- Issue #4: Add sound effects on hit/miss
- Observer pattern: Listen to game events (mole-hit, mole-timeout, game-over)
- Implementation: Create SoundManager listening to GameEvents
- Copilot can show existing GameEvents.ts structure!

---

### Query 3.3: Leaderboard with Components
```
"For issue #3 (leaderboard), use the vscode-ui-components skill.
Show me:
1. Which components to use (DataGrid is hinted)
2. How to listen to game-over events
3. How to post scores to GitHub issue #3 comments"
```

**Expected Result**:
- Components: vsCodeDataGrid, vsCodePanel
- Event: Listen to 'game-over' event from GameEvents
- GitHub: Use GitHubIntegration.postGameMetrics()
- Integration complete!

---

## Phase 4: Project Status Queries

### Query 4.1: Progress Summary
```
"Summarize the current status of whack-a-mole-pro:
- How many issues total?
- How many are done vs in progress?
- What are the remaining features?"
```

**Expected Result**: 
- 6 total issues
- 3 done (difficulty levels, timeout, README)
- 3 TODO (leaderboard, sound, mobile)
- Implementation roadmap

---

### Query 4.2: Feature Dependencies
```
"Which issues should I implement first to minimize dependencies?
Check issue labels and descriptions."
```

**Expected Result**:
- Issue #1 (difficulty) - no dependencies (already done)
- Issue #3 (leaderboard) - depends on score system (exists)
- Issue #4 (sound) - depends on event system (exists)
- Issue #5 (mobile) - CSS-only, no dependencies

---

### Query 4.3: Pattern Coverage
```
"Which GitHub issues use the Mediator pattern?
Which use Observer? Which use Strategy?"
```

**Expected Result**:
- Mediator: Issue #1, #2 (game state)
- Observer: Issue #3, #4 (event listeners)
- Strategy: Issue #1 (difficulty variations)

**Insight**: All 3 patterns are pattern-aware!

---

## Phase 5: Advanced Workflow

### Query 5.1: Implement + Post Update
```
"I just implemented issue #1 (difficulty levels).
Help me:
1. Create a concise comment describing what I did
2. Post it to issue #1 on GitHub
3. Suggest marking it as 'done'"
```

**Expected Result**: 
- Copilot generates summary comment
- Uses github-integration skill to post
- Issue #1 marked complete

**Real Workflow**: This is how you'd use MCP in actual development!

---

### Query 5.2: Next Feature Planning
```
"For issue #3 (leaderboard), create a checklist:
1. What code files need to change?
2. What tests should I write?
3. How long should each step take?
4. What might go wrong?"
```

**Expected Result**:
- Files: LeaderboardComponent.tsx, GamePanel.ts, GitHubIntegration.ts
- Tests: DataGrid rendering, event listening, GitHub posting
- Timeline: 1-2 hours total
- Risks: GitHub API rate limits, styling challenges

---

### Query 5.3: Code Review with Context
```
"I've implemented the leaderboard. 
Read issue #3, look at my new code, and:
1. Does it match the issue requirements?
2. Am I using the right skills?
3. Any improvements?"
```

**Expected Result**:
- Copilot reads issue context
- Reviews actual code against requirements
- Suggests improvements
- This is code review WITH full project understanding!

---

## Phase 6: Demo Queries

### Query 6.1: Learning Outcome
```
"What did we learn by using MCP in whack-a-mole-pro development?
How is MCP better than developing without GitHub context?"
```

**Expected Result**: Copilot summarizes:
- MCP gave context about project structure
- Issues became executable requirements
- Copilot could suggest patterns/skills automatically
- No context-switching between GitHub and code
- Better suggestions with full understanding

---

### Query 6.2: Impact Statement
```
"If we hadn't used MCP, how much longer would whack-a-mole-pro 
development take? What would we miss?"
```

**Expected Result**:
- Without MCP: ~20-30% slower (need to copy-paste issues)
- Would miss: Automatic pattern suggestions, GitHub context
- Would require: Manual context management

---

## Test Execution Checklist

Use this checklist when running test queries:

### Basic Connection Tests
- [ ] Query 1.1 - List all issues works
- [ ] Query 1.2 - Filter by status works
- [ ] Query 1.3 - Filter by label works

### Context-Aware Tests
- [ ] Query 2.1 - Single issue details work
- [ ] Query 2.2 - Issue-specific help works
- [ ] Query 2.3 - Design pattern issues work

### Implementation Tests
- [ ] Query 3.1 - Get issue + implement pattern works
- [ ] Query 3.2 - Sound effects with Observer works
- [ ] Query 3.3 - Leaderboard with components works

### Project Status Tests
- [ ] Query 4.1 - Progress summary works
- [ ] Query 4.2 - Feature dependencies work
- [ ] Query 4.3 - Pattern coverage works

### Workflow Tests
- [ ] Query 5.1 - Implement + post update works
- [ ] Query 5.2 - Next feature planning works
- [ ] Query 5.3 - Code review with context works

### Demo Tests
- [ ] Query 6.1 - Learning outcome works
- [ ] Query 6.2 - Impact statement works

**All tests pass? You're ready for demo!**

---

## Troubleshooting Test Queries

### Issue: "Tool not available"
**Solution**: Verify MCP is connected (🔧 tools icon shows GitHub tools)

### Issue: "Authentication needed"
**Solution**: Complete OAuth flow and retry query

### Issue: "Rate limit exceeded"
**Solution**: Wait 1 minute, then retry. MCP caches results.

### Issue: "Issue not found"
**Solution**: Verify repository path `ankitaditya-fctg/whack-a-mole-pro` is correct

---

## Success Criteria

✅ All test queries return expected results
✅ Copilot shows full issue context in responses
✅ MCP tools are being used automatically
✅ Queries demonstrate pattern-aware suggestions
✅ Implementation suggestions reference existing code

When all tests pass, you have a fully functional MCP integration ready for demo!

---

## Next Steps

1. **Configure MCP** (see MCP_CONFIGURATION_GUIDE.md)
2. **Run Test Queries** (use this guide)
3. **Implement Features** (use MCP context for issues #3, #4, #5)
4. **Demo Workflow** (show Copilot + MCP queries live)
5. **Prepare Presentation** (learning outcomes, impact analysis)
