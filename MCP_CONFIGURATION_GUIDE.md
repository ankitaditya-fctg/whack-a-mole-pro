# GitHub MCP Server Configuration Guide

## What is MCP?

**Model Context Protocol (MCP)** is a standardized way for AI tools (like Copilot) to access external data and services. It works by:

1. **Tools**: Actions the AI can take (e.g., "search GitHub issues", "read pull requests")
2. **Resources**: Data the AI can read (e.g., issue details, code files)
3. **Protocol**: Standardized communication between client (Copilot) and server (GitHub)

---

## Why GitHub MCP Matters for This Challenge

**Without MCP**: Copilot only sees your open VS Code files
- Can't query GitHub issues
- Can't check PR status
- No context about project structure/status

**With MCP**: Copilot becomes context-aware
- Query: "What open issues are in my repo?"
- Query: "Which issues need implementation?"
- Query: "Help me implement issue #3"
- **Result**: Copilot understands your project and can make better suggestions

---

## MCP Configuration Steps

### Step 1: Verify GitHub Token Availability

GitHub MCP requires OAuth authentication. VS Code handles this automatically via OAuth flow.

```bash
# Verify you can authenticate
# (No manual token needed - OAuth handles it)
```

**Note**: Do NOT use Personal Access Tokens for MCP. Use OAuth.

### Step 2: Add GitHub MCP Server in VS Code

1. **Open VS Code Settings**
   - Mac: `Cmd + ,`
   - Windows/Linux: `Ctrl + ,`

2. **Search for "MCP"**
   - You should see settings related to Model Context Protocol

3. **Look for "Copilot: MCP Servers"**
   - This is where you configure available MCP servers

4. **Add GitHub MCP Server**
   - Click the "+" button to add a new server
   - Select "GitHub" from available servers (or enter manually):
     ```
     github-mcp-server
     ```

5. **Configure Connection**
   - Server name: `github`
   - Server type: `GitHub MCP`
   - Authentication: OAuth (will prompt when needed)

### Step 3: Authenticate with GitHub

1. **First MCP Query in Copilot Chat**
   - Open Copilot Chat (Cmd+Shift+I or Ctrl+Shift+I)
   - Make sure you're in **Agent mode**
   - Type a query like: "What issues are in my repository?"

2. **OAuth Flow**
   - VS Code will prompt: "GitHub MCP Server wants to authenticate"
   - Click "Authorize"
   - You'll be redirected to GitHub.com
   - Log in and approve access
   - Return to VS Code

3. **Connection Verified**
   - Copilot Chat now has access to your GitHub data
   - All queries will use live data

---

## Verification: Test MCP Connection

### 1. Check Tools Available

In VS Code Copilot Chat, open the Tools panel (🔧):
- You should see GitHub-related tools
- Examples:
  - `search_issues` - Find issues by query
  - `list_issues` - List all issues
  - `get_issue` - Get issue details
  - `search_code` - Search code in repo
  - `list_pull_requests` - Find PRs
  - `get_commit` - View commit info

### 2. Test Basic Query

Try these queries in Copilot Chat Agent mode:

```
"What open issues are in the whack-a-mole-pro repository?"
```

**Expected Response**: Copilot lists your 6 GitHub issues with status

```
"Which issues are labeled 'bug' or 'feature'?"
```

**Expected Response**: Filtered issue list

```
"Summarize the planned enhancements for this project"
```

**Expected Response**: Overview of enhancement issues

### 3. Test Context-Aware Help

```
"Help me implement issue #1 (difficulty levels) - read the issue first"
```

**Expected**: Copilot reads the issue #1 description, then provides implementation guidance based on the issue requirements.

---

## Using MCP for Feature Implementation

Once MCP is configured, you can use Copilot in powerful new ways:

### Pattern 1: Read Issue → Implement

```
"Read issue #3 (Leaderboard), then help me implement it"
```

Copilot will:
1. Query GitHub for issue #3
2. Read the full description
3. Understand the requirements
4. Provide implementation suggestions

### Pattern 2: Check Status → Plan Work

```
"What issues should I work on next? Filter by 'good first issue' label"
```

Copilot will:
1. Query GitHub issues
2. Filter by label
3. Suggest which to implement next

### Pattern 3: Implement → Auto-Update Issue

```
"I've implemented the leaderboard. Post a comment to issue #3 
summarizing what I did and mark it as done"
```

Copilot can:
1. Post comments to GitHub
2. Update issue status (via github-integration skill)
3. Keep your team updated

---

## Architecture: How MCP Connects

```
You (VS Code)
    ↓
Copilot Chat (Agent Mode)
    ↓
MCP Protocol (standardized)
    ↓
GitHub MCP Server
    ↓
GitHub API
    ↓
GitHub Data (Issues, PRs, Commits, Code)
```

**Result**: Copilot has real-time access to your GitHub data in context-aware development.

---

## Troubleshooting

### Issue: "MCP Server not found"
- Verify GitHub MCP Server is installed in VS Code
- Check that you're in **Agent mode** (not regular Chat mode)
- Restart VS Code

### Issue: "Authentication failed"
- Clear OAuth tokens and re-authenticate
- Settings → Search "GitHub" → Clear cached tokens
- Try MCP query again to re-authenticate

### Issue: "Tool unavailable"
- Verify OAuth authentication completed
- Ensure GitHub token has repo access
- Check that MCP server is connected (🔧 tools icon)

### Issue: "API rate limit"
- GitHub MCP has rate limits
- Query results may be cached
- Wait a few minutes before retrying

---

## Integration with Whack-a-Mole Project

### Your Repository
- **URL**: https://github.com/ankitaditya-fctg/whack-a-mole-pro
- **Issues**: 6 with custom labels
- **Labels**: bug, enhancement, feature, documentation, design-pattern, skills-integration, automation

### Recommended MCP Queries for This Project

1. **Check Project Status**
   ```
   "What's the status of whack-a-mole-pro? 
    How many issues are open vs closed?"
   ```

2. **Implement Issue with Context**
   ```
   "Help me implement issue #3 (leaderboard). 
    Read the issue, suggest the implementation, 
    and tell me what design patterns to use"
   ```

3. **Check Design Pattern Issues**
   ```
   "Show me all issues labeled 'design-pattern'. 
    Are they all implementation-ready?"
   ```

4. **Track Skills Integration**
   ```
   "Which issues use the github-integration skill?
    What GitHub automation have I implemented?"
   ```

---

## Next Steps After MCP Configuration

1. ✅ Verify MCP connection works
2. ⏳ Run test queries (see Verification section above)
3. ⏳ Use Copilot + MCP to implement remaining issues:
   - Issue #3: Leaderboard (DataGrid component)
   - Issue #4: Sound effects (Observer listener)
   - Issue #5: Mobile responsive (CSS media queries)
4. ⏳ Demo: Show Copilot Chat querying your repo live
5. ⏳ Prepare learning outcomes for presentation

---

## Key Benefits of MCP

| Benefit | Example |
|---------|---------|
| **Context-Aware** | Copilot knows about your specific issues/PRs |
| **Time-Saving** | No context-switching between GitHub and VS Code |
| **Workflow Integration** | Copilot helps with planning, implementation, and tracking |
| **Team Visibility** | Issues stay updated; team sees progress via GitHub |
| **Learning** | See how AI reasoning improves with full project context |

---

## References

- [GitHub MCP Server Repository](https://github.com/github/github-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [VS Code Copilot Chat Modes](https://code.visualstudio.com/docs/copilot/copilot-chat)
- [GitHub API Documentation](https://docs.github.com/en/rest)

---

## Challenge Progress

With MCP configured, you're ready for:
- ✅ Step 1: Copilot Agent scaffolding
- ✅ Step 2: GitHub issues & labels
- ✅ Step 3: MCP understanding
- ⏳ **Step 4: Configure GitHub MCP** ← You are here
- ⏳ Step 5: Use Copilot + MCP (next)
- ⏳ Step 6: Demo & learnings (final)

**Next**: Follow Steps 1-3 above to configure and verify MCP, then proceed to test queries and feature implementation!
