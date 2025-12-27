# Cousins Accountability App - PRD

## Overview

A simple web app for 5 cousins to track fitness accountability from December 26, 2024 to July 7, 2025 (28 weeks).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (profile photos)
- **Styling:** Tailwind CSS + shadcn/ui
- **Language:** TypeScript
- **Deployment:** Vercel

## Core Features

### 1. User Management

#### 1.1 User Selection (Top Bar)
- Row of circular avatar bubbles at top of page
- Shows photo (or initials if no photo)
- Selected user has ring highlight
- `+` button to add new user
- No authentication - simple name-based selection

#### 1.2 Add User Modal
- Photo upload (optional)
- Name (required, unique)
- Starting weight in lbs (required)
- Goal weight by July 7 in lbs (required)

#### 1.3 Edit Profile Modal
- Change photo
- Edit name
- Edit starting weight
- Edit goal weight

---

### 2. Personal Stats Card (Floating Elevated Card)

#### 2.1 Header Section
- User name
- Edit button (opens edit modal)

#### 2.2 Progress Bar
- Visual: `240 lbs ━━━━●━━━━━━━━━━━━━━○ 190 lbs`
- Shows current weight → goal weight
- Text: "X lbs to go · July 7 deadline · X% progress"

#### 2.3 Weekly Check-in Grid
- **Week Navigation:**
  - `◀ DEC 23 - 29 (This Week) ▶` arrows
  - Past weeks: view only (greyed, locked)
  - Current week: editable (click to toggle)
  - Future weeks: not shown

- **Checklist Items (3 rows):**
  | Item | Type | Description |
  |------|------|-------------|
  | Workout | Daily | Did you work out today? |
  | Ate Clean | Daily | Did you eat clean today? |
  | Steps (TBD) | Daily | Hit step goal (threshold TBD) |

- **Grid Layout:**
  ```
           M     T     W     T     F     S     S    TOTAL
  Workout [✓]   [✓]   [ ]   [ ]   [ ]   [ ]   [ ]    2
  Clean   [✓]   [✓]   [✓]   [✓]   [✓]   [ ]   [ ]    5
  Steps   [✓]   [✓]   [ ]   [✓]   [✓]   [ ]   [ ]    4

  Total this week: 11 checks
  ```

#### 2.4 Weight Log Section
- List of recent weigh-ins with date and change indicator
- `[+ Log Weight]` button opens modal
- Example: `Dec 27: 240 lbs`, `Dec 20: 242 lbs ↓2`

#### 2.5 Log Weight Modal
- Date (defaults to today)
- Weight input (lbs)
- Shows recent entries for reference

---

### 3. Leaderboard Section (Below Personal Card)

#### 3.1 Header
- "LEADERBOARD · This Week"
- Shows current week context

#### 3.2 Rankings Table
```
#   NAME      CHECKS                                    TOTAL
────────────────────────────────────────────────────────────
1   🏆 Bin    ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓                      21
2      Jay    ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓                         18
3      Ash    ✓✓✓✓✓✓✓✓✓✓✓                                11  ←
════════════════════════════════════════════════════════════
4      Mike   ✓✓✓✓✓✓✓✓                                    8  🔴
5      Dan    ✓✓✓✓✓✓                                      6  🔴
```

#### 3.3 Ranking Logic
- Sort by total check count (workout + clean + steps) for current week
- Top performer gets 🏆 emoji
- Bottom 2 get 🔴 DANGER indicator (red styling)
- Current user gets `←` indicator
- Visual separator line between safe zone and danger zone

#### 3.4 Season Stats Footer
```
SEASON STATS
Weeks: 1/28 · Pot: $0 · Belly dances owed: 0
```

---

### 4. Stakes & Penalties (Display Only)

- **Stake:** $500 per person
- **Penalty:** 2-5 min belly dance video
- **Evaluation:** End of challenge (July 7)
- App tracks weekly performance but penalties assessed manually at end

---

## UI/UX Specifications

### Layout
- Single page, scroll-based
- Personal card: elevated with shadow (floating effect)
- Leaderboard: flat, below personal card
- Clear visual separation between personal and group sections

### Visual Hierarchy
```
┌─────────────────────────────────────┐
│  Header + User Avatars              │
├─────────────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃  Personal Stats Card          ┃  │
│  ┃  (elevated, shadowed)         ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│           ▼ shadow                  │
│                                     │
│  Leaderboard (flat)                 │
│  Season Stats                       │
└─────────────────────────────────────┘
```

### Responsive Design
- Desktop: full layout as shown
- Mobile: stacked, smaller checkboxes, abbreviated labels

### Color Scheme
- Follow shadcn/ui defaults (light mode)
- Danger zone: red background/text for bottom 2
- Success: green for completed items
- Selected user: ring highlight on avatar

---

## Database Schema

```sql
-- Users (no auth, just names)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  starting_weight DECIMAL,
  goal_weight DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily check-ins
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  workout BOOLEAN DEFAULT FALSE,
  ate_clean BOOLEAN DEFAULT FALSE,
  steps BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Weight logs
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Page Structure

```
/                     # Main dashboard (single page app)
```

### Components
```
src/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── UserAvatars.tsx       # Top avatar row + add button
│   ├── PersonalCard.tsx      # Elevated stats card
│   ├── WeeklyCheckin.tsx     # Check-in grid with navigation
│   ├── WeightLog.tsx         # Weight history + log button
│   ├── Leaderboard.tsx       # Rankings table
│   ├── SeasonStats.tsx       # Pot/dances footer
│   ├── AddUserModal.tsx      # New user form
│   ├── EditProfileModal.tsx  # Edit user form
│   └── LogWeightModal.tsx    # Weight entry form
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper functions (week calc, etc.)
└── hooks/
    ├── useUsers.ts           # User CRUD operations
    ├── useCheckins.ts        # Check-in operations
    └── useWeightLogs.ts      # Weight log operations
```

---

## Key Dates

| Date | Event |
|------|-------|
| Dec 26, 2024 | Challenge start (Week 1) |
| July 7, 2025 | Challenge end (Week 28) |
| Every Monday | Week resets |

---

## Week Calculation Logic

```typescript
// Week 1 starts Monday Dec 23, 2024
const CHALLENGE_START = new Date('2024-12-23');
const CHALLENGE_END = new Date('2025-07-07');
const TOTAL_WEEKS = 28;

function getWeekNumber(date: Date): number {
  const diff = date.getTime() - CHALLENGE_START.getTime();
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(weekNum, TOTAL_WEEKS));
}

function getWeekDates(weekNum: number): { start: Date; end: Date } {
  const start = new Date(CHALLENGE_START);
  start.setDate(start.getDate() + (weekNum - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}
```

---

## Interactions Summary

| Action | Trigger | Result |
|--------|---------|--------|
| Select user | Click avatar | Load user's data, highlight in leaderboard |
| Add user | Click + button | Open add modal |
| Edit profile | Click Edit button | Open edit modal |
| Log weight | Click + Log Weight | Open weight modal |
| Toggle checkbox | Click checkbox | Toggle (current week only) |
| Change week | Click ◀ ▶ | Navigate weeks (past = read-only) |

---

## Out of Scope (V1)

- Authentication/login
- Email notifications
- Historical charts/graphs
- Photo proof of workouts
- Comments/chat
- Push notifications
- Multiple challenges
