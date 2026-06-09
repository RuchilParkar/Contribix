![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![License](https://img.shields.io/badge/License-MIT-green)

# Contribix — Developer Growth & GitHub Analytics Platform

Contribix is a modern SaaS platform designed to help developers analyze, visualize, improve, and showcase their GitHub activity. Instead of focusing on superficial green square generation, it emphasizes genuine code quality, documentation completeness, open-source code reviews, and technical career track progress.

---

## 🚀 Vision

Many developer portfolios rely on basic project lists. Contribix transforms raw GitHub telemetry into dynamic visual graphs, audits project documentation structures, computes objective developer score ranks, and provides AI-powered learning guides to help developers prepare for engineering internships.

---

## 🛠️ Tech Stack

### Frontend & Visuals
* **Next.js 16 (App Router)** - Server actions and static paths.
* **TypeScript** - Strict static type safety.
* **Tailwind CSS v4** - Custom CSS layout overlays and variables.
* **Framer Motion** - Fluid micro-animations.
* **Recharts** - Responsive charts (Area, Pie, Bar).
* **canvas-confetti** - Celebratory scoring milestone triggers.
* **next-themes** - Default dark-first theme selector.

### Backend & Database
* **Prisma ORM & PostgreSQL** - Data schemas for tracked repositories and reports.
* **OpenAI API** - Chat mentor integration.
* **Robust Client Fallback** - If database connections are unconfigured or fail, server actions return custom offline flags (`DB_OFFLINE`) instructing page components to read and write state directly to browser `localStorage`.
* **API Offline Fallback** - If public GitHub API requests rate-limit or fail, the platform falls back to a deterministic, seeded random telemetry generator based on usernames.

---

## 📦 Core Modules

### 1. Profile Visualizer
* **Telemetry**: Fetches public avatar, biography, followers, repositories, and language profiles.
* **Visualizations**: Displays language ratios (Pie), commit history (Area), and stars/forks repo charts (Bar).
* **Audits**: Provides a documentation coverage health meter and consistency ratings.

### 2. Contribution Heatmap Studio
* **Drawing canvas**: Click-and-drag grid cells (levels 0-4) with brush and eraser controls.
* **Presets & Typography**: Load shapes (Smile, Heart, Git Logo) or render custom letters up to 8 characters.
* **Themes**: Choose between *GitHub Classic*, *Cyberpunk*, *Ocean Blue*, *Midnight Purple*, and *Emerald*.
* **Exports**: Save vector SVGs or download backdated commit bash scripts to apply drawings onto actual calendars.

### 3. Open Source Tracker
* **Metrics**: PR creation numbers, merged averages, review audits, and open source score ranks.
* **Logs & Summaries**: Chronological timelines of activity logs alongside toggled weekly and monthly growth synopsis.
* **Track List**: Track custom repositories by entering `owner/repo-name`.

### 4. Developer Score Engine
* **Score Indicator**: Radial progress gauge showing a 0-100 developer index rating.
* **Sub-categories**: Evaluates Code Activity (30%), Code Quality (20%), Open Source (30%), and Community impact (20%).
* **Audits checklist**: Transparent checks showcasing passed or failed audits (e.g. missing descriptions) with positive and negative score impacts.

### 5. AI GitHub Coach
* **Conversational Dialogue**: Interactive chat panel with coach responses and typing loaders.
* **Recommendations**: Tabbed layouts reviewing Skill Gaps, Repository code optimizations, roadmaps, and open source recommendations.

### 6. Resume & Portfolio Assistant
* **Quantified bullet points**: ATS-friendly experience points generated from repository metadata.
* **Descriptions**: Project descriptions suitable for LinkedIn showcases.
* **Markdown biography**: Copyable Markdown Profile templates ready to drop into GitHub READMEs.

### 7. Internship Readiness Dashboard
* **Tracks**: Select career paths including *Frontend*, *Backend*, *Full Stack*, *AI/ML*, *Cybersecurity*, and *DevOps*.
* **Scoring**: Computes track readiness (0-100) using a language matching and repository size requirement algorithm.
* **Paths & Gaps**: Recommends missing languages (e.g., Rust/Go for backends) and lists suggested project architectures.

---

## 📂 Directory Structure

```text
src/
├── app/
│   ├── page.tsx                     # Landing Showcase Page
│   └── dashboard/
│       ├── page.tsx                 # Redirects to /dashboard/visualizer
│       ├── layout.tsx               # Master Sidebar Shell
│       ├── visualizer/page.tsx      # Module 1
│       ├── heatmap/page.tsx         # Module 2
│       ├── tracker/page.tsx         # Module 3
│       ├── score/page.tsx           # Module 4
│       ├── coach/page.tsx           # Module 5
│       ├── resume/page.tsx          # Module 6
│       └── readiness/page.tsx       # Module 7
├── components/
│   └── theme-provider.tsx           # Dark mode toggling provider
├── lib/
│   ├── actions.ts                   # Prisma Actions with LocalStorage fallback
│   ├── ai/                          # AI advice & README generators
│   ├── github/                      # API fetchers & mock profile simulators
│   ├── scoring/                     # Metrics calculations & auditing
│   ├── pattern-utils.ts             # Drawing grid presets & script builders
│   ├── prisma.ts                    # Prisma Client loader
│   └── profile-context.tsx          # Global profile telemetry provider
├── prisma/
│   └── schema.prisma                # PostgreSQL Database Schema models
```

---

## ⚙️ Installation & Run Commands

### 1. Install Dependencies
Run from the project root:
```bash
npm install
```

### 2. Launch Local Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

### 3. Production Build Compilation
To check and compile a production-ready bundle:
```bash
npm run build
```

---

## 🔧 Optional Database & API Setups

### Database Synchronization
If you want to sync records to a PostgreSQL database:
1. Create a `.env` file in the root directory.
2. Add your connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5402/contribix?schema=public"
   ```
3. Push the schema to your database:
   ```bash
   npx prisma db push
   ```

### Live AI Coach
If you want the AI Coach to call live OpenAI GPT completions:
1. Open your `.env` file.
2. Add your OpenAI API key:
   ```env
   OPENAI_API_KEY="sk-proj-..."
   ```
If absent, the application automatically handles chat prompts and roadmaps using the rules-based localized coach advisor fallback.
