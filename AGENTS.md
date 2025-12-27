# Agent Instructions

## Project Overview

**Cousins Accountability App** - A fitness tracking web app for 5 cousins running Dec 26, 2024 - July 7, 2025 (28 weeks).

See **[PRD.md](./PRD.md)** for complete specifications including:
- UI mockups and component structure
- Database schema
- Feature requirements
- Week calculation logic

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Styling | Tailwind CSS + shadcn/ui |
| Language | TypeScript |
| Deploy | Vercel |

---

## Issue Tracking (bd/beads)

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

### Creating Issues

```bash
bd create "Title" --type=task --priority=2    # Standard task
bd create "Title" --type=bug --priority=1     # Bug fix
bd create "Title" --type=feature --priority=2 # New feature

# Priority: 0=critical, 1=high, 2=medium, 3=low, 4=backlog
```

### Dependencies

```bash
bd dep add <child> <parent>   # Child depends on parent
bd blocked                     # Show blocked issues
```

---

## Development Workflow

### Starting Work

```bash
bd ready                           # Find available tasks
bd show <id>                       # Review task details
bd update <id> --status in_progress # Claim it
```

### During Development

1. Reference PRD.md for specifications
2. Follow component structure in `src/components/`
3. Use existing patterns from codebase
4. Test changes locally before completing

### Completing Work

```bash
bd close <id>         # Mark task complete
bd sync               # Sync beads with git
```

---

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below:

### Mandatory Workflow

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed):
   ```bash
   npm run lint
   npm run build
   ```
3. **Update issue status** - Close finished work, update in-progress items
4. **Commit and sync**:
   ```bash
   git add .
   git commit -m "descriptive message"
   bd sync
   ```
5. **Verify** - All changes committed, beads updated

### Critical Rules

- Never leave work uncommitted
- Always create beads for discovered work
- Close beads immediately when done (don't batch)
- Reference PRD.md when implementing features

---

## Key Files

| File | Purpose |
|------|---------|
| `PRD.md` | Complete product requirements |
| `AGENTS.md` | This file - agent instructions |
| `.beads/` | Issue tracking database |

---

## Feature Areas

When creating issues, use these categories:

| Area | Description |
|------|-------------|
| `user-mgmt` | User avatars, add/edit modals |
| `personal-card` | Stats card, progress bar, check-ins |
| `leaderboard` | Rankings, danger zone, season stats |
| `weight-log` | Weight tracking, log modal |
| `infra` | Supabase setup, deployment, config |
