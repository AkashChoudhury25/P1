# Cloud Resume Builder & Portfolio Website (Topic 24)

> **Vibe Coding Activity Evaluation Project**  
> **Topic 24**: Cloud Resume & Portfolio Builder  
> **Course Requirement**: Cloud Hosting (Static Edge CDN + Vercel Serverless Function API + Supabase DB & Auth Sync)  
> **Score Target**: 100 / 100 Marks  

---

## 📌 Problem Statement & Objective

Job seekers and early-career developers struggle with creating, updating, and hosting professional resumes and online portfolios. Standard desktop word processors produce static, non-interactive documents that cannot be easily shared or tracked online.

**Solution**: This project delivers an all-in-one web platform where users can:
1. **Sign Up & Log In**: Secure cloud sessions backed by Supabase Auth with custom interface themes.
2. **Manage Multiple Resumes**: Create, select, autosave, and delete multiple resumes under a single user account.
3. **Draft Syncing**: Edit profile data with real-time visual feedback and automated cloud updates (with `localStorage` offline guest backup).
4. **Interactive Portfolios**: Toggle between an **A4 Printable Resume** and an **Interactive Web Portfolio**.
5. **Visual Customization**: Switch among 3 dynamic visual themes (*Glassmorphism Dark*, *Corporate Minimal*, *Cyber Neon*) with matching custom selector menus.
6. **One-Click Export & Share**: Download print-ready PDF resumes via pure CSS `@media print` rules, and generate dynamic **QR Codes & Shareable Portfolio Links**.

---

## ☁️ Cloud Architecture & Technical Transparency

```
                                +---------------------------+
                                |      Cloud End-User       |
                                +-------------+-------------+
                                              |
                                      HTTPS   | (Static CDN Edge)
                                              v
                                +-------------+-------------+
                                |      Vercel Cloud         |
                                |     Hosting Platform      |
                                +-------------+-------------+
                                              |
                               +--------------+--------------+
                               |                             |
                               v                             v
                   +-----------+-----------+     +-----------+-----------+
                   |  Static Web Frontend  |     | Vercel Serverless Function|
                   |  (HTML5/CSS3/React)   |     |     (/api/analytics)    |
                   +-----------+-----------+     +---------------------------+
                               |
            +------------------+------------------+
            | (Auth Request / Data Synced)        | (Offline Backup)
            v                                     v
+-----------+-----------+             +-----------+-----------+
|  Supabase Cloud DB    |             |  Browser LocalStorage |
|  & GoTrue Auth Engine |             | (Local Guest Draft)   |
+-----------------------+             +-----------------------+
```

### Technical Details & Cloud Specifications

1. **Cloud Hosting**: Deployed on **Vercel Cloud Hosting**, serving static frontend assets globally over CDN with automated HTTPS.
2. **Cloud Database (Supabase PostgreSQL)**: Stores JSONB resume datasets in the `resumes` table with Row-Level Security (RLS) policies allowing users access only to their own rows.
3. **Cloud Authentication (Supabase Auth)**: Handles user credentials, signup workflows, secure login sessions, and persistent JWT-backed auto-sign-ins.
4. **Serverless API**: `/api/analytics.js` is a **Vercel Serverless Function API** handling session analytics for page views and PDF download events.
5. **Local Draft Backup**: Automatically maintains a local copy of edits in the browser's `localStorage` for offline draft safety.
6. **Action Verb Enhancer**: A rule-based utility (`enhanceBulletWithActionVerbs`) that formats resume bullet points using strong technical action verbs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Browser ESM / Babel), HTML5, Vanilla CSS 3 with HSL Custom Properties
- **Design System**: Dark Glassmorphism, Responsive Grid & Flexbox, Google Fonts (`Outfit`, `Inter`)
- **Backend / Database**: Supabase PostgreSQL database with secure Row-Level Security (RLS) policies
- **Authentication**: Supabase GoTrue Auth engine (JWT sessions)
- **API**: Vercel Serverless Function (`/api/analytics.js`)
- **Hosting Platform**: Vercel Cloud Hosting / Netlify / GitHub Pages

---

## 🚀 How to Run Locally

1. Set up the `resumes` table schema in your Supabase SQL editor.
2. Open PowerShell / Terminal in the project root:
   ```bash
   python -m http.server 3000
   ```
3. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🌐 One-Click Cloud Deployment Strategy

1. Push code to a public GitHub repository.
2. Log into [Vercel](https://vercel.com).
3. Import the repository. Vercel automatically detects `index.html` and `api/analytics.js` via `vercel.json`.
4. Add environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY` if running custom functions, then click **Deploy** to obtain your live cloud domain URL.

---

## 🎤 2-Minute Presentation Pitch Script

1. **Problem & Solution (0:00 - 0:30)**:  
   *"Standard resumes are static and hard to manage. We built a Cloud Resume & Portfolio Builder that generates both clean printable PDF layouts and dynamic interactive portfolios."*
2. **Multi-Resume Management & Auth (0:30 - 1:15)**:  
   - Demonstrate logging in via the custom **Supabase Authentication modal**.
   - Show the **Resume Picker dashboard** displaying multiple saved resumes.
   - Click "New Resume" to start fresh, and show the instant autosave feedback syncing directly to the cloud PostgreSQL database.
3. **Interactive Features & Custom Themes (1:15 - 1:45)**:  
   - Click the Theme Selector to cycle visual styling instantly using custom menus.
   - Toggle to **Web Portfolio View** and show the responsive project grids.
   - Click **Download PDF** to show clean `@media print` spacing rules.
4. **Summary & Cloud Integration (1:45 - 2:00)**:  
   *"Fully deployed on Vercel with automated Supabase DB & Auth synchronization. A production-ready architecture designed for cloud portfolio management."*

---

## 📸 Screenshots Evidence Checklist for Submission Report

1. **Screenshot 1**: Custom **Supabase Authentication modal** showing Sign In / Sign Up.
2. **Screenshot 2**: **Resume Picker dashboard** showing list of user's resumes and timestamps.
3. **Screenshot 3**: Main Web Application in **Dark Glassmorphism Theme** editing form fields.
4. **Screenshot 4**: **Interactive Web Portfolio View** displaying dynamically generated sections.
5. **Screenshot 5**: **PDF Export Print Preview** verifying clean A4 formatting.
6. **Screenshot 6**: Supabase Dashboard displaying user accounts and `resumes` PostgreSQL table.
