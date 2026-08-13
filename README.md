# Cloud Resume Builder & Portfolio Website (Topic 24)

> **Vibe Coding Activity Evaluation Project**  
> **Topic 24**: Cloud Resume Builder & Portfolio Website  
> **Course Requirement**: Cloud Hosting (Static Edge CDN + Vercel Serverless Function API)  
> **Score Target**: 100 / 100 Marks  

---

## 📌 Problem Statement & Objective

Job seekers and early-career developers struggle with creating, updating, and hosting professional resumes and online portfolios. Standard desktop word processors produce static, non-interactive documents that cannot be easily shared or tracked online.

**Solution**: This project delivers an all-in-one web platform where users can:
1. Edit profile data with real-time visual feedback and **browser local draft saving** (`localStorage`).
2. Toggle between an **A4 Printable Resume** and an **Interactive Web Portfolio**.
3. Apply 3 dynamic visual themes (*Glassmorphism Dark*, *Corporate Minimal*, *Cyber Neon*).
4. Download print-ready PDF resumes via pure CSS `@media print` rules.
5. Deploy to **Vercel Cloud Hosting** with a **Vercel Serverless Function API (`/api/analytics`)** for session analytics.
6. Generate a dynamic **QR Code & Shareable Portfolio Link**.

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
                               v
                   +-----------+-----------+
                   |  Browser LocalStorage |
                   | (Local Draft Saving)  |
                   +-----------------------+
```

### Technical Details & Cloud Specifications

1. **Cloud Hosting**: Deployed on **Vercel Cloud Hosting**, serving static frontend assets globally over CDN with automated HTTPS.
2. **Serverless API**: `/api/analytics.js` is a **Vercel Serverless Function API** handling session analytics for page views and PDF download events.
3. **In-Memory Analytics Behavior**: Analytics metrics are tracked in serverless function instance memory. *(Note: Serverless in-memory state is maintained per active function instance and resets during cold starts or new deployments; it does not use a persistent cloud database at this stage to keep deployment fast and zero-config).*
4. **Local Draft Persistence**: Resume form drafts are saved **locally in the browser** using the HTML5 `localStorage` API, ensuring zero data loss during offline work or page refreshes.
5. **Action Verb Enhancer**: A rule-based utility (`enhanceBulletWithActionVerbs`) that formats resume bullet points using strong technical action verbs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Browser ESM / Babel), HTML5, Vanilla CSS 3 with HSL Custom Properties
- **Design System**: Dark Glassmorphism, Responsive Grid & Flexbox, Google Fonts (`Outfit`, `Inter`)
- **Backend / API**: Vercel Serverless Function (`/api/analytics.js`)
- **Hosting Platform**: Vercel Cloud Hosting / Netlify / GitHub Pages

---

## 🚀 How to Run Locally

1. Open PowerShell / Terminal in the project root:
   ```bash
   python -m http.server 3000
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🌐 One-Click Cloud Deployment Strategy

1. Push code to a public GitHub repository.
2. Log into [Vercel](https://vercel.com).
3. Import the repository. Vercel automatically detects `index.html` and `api/analytics.js` via `vercel.json`.
4. Click **Deploy** to obtain your live cloud domain URL (e.g., `https://cloud-resume-builder.vercel.app`).

---

## 🎤 2-Minute Presentation Pitch Script

1. **Problem & Solution (0:00 - 0:30)**:  
   *"Resumes shouldn't just be static files. We built a Cloud Resume Builder & Portfolio website that dynamically generates both printable PDF resumes and hosted interactive web portfolios."*
2. **Feature Demo (0:30 - 1:15)**:  
   - Demonstrate real-time typing in the editor with automatic local draft saving.
   - Click the Theme Switcher to change from *Dark Glass* to *Corporate Minimal*.
   - Toggle from *A4 Resume View* to *Interactive Web Portfolio View*.
   - Click **Download PDF** to show the `@media print` clean formatting.
3. **Cloud Integration & Analytics (1:15 - 1:45)**:  
   - Point out the **Serverless Analytics Counter** in the header.
   - Click **Share / QR Code** to reveal the dynamic QR code for mobile testing.
   - Explain how `/api/analytics` handles API requests as a Vercel Serverless Function.
4. **Summary & Rubric Alignment (1:45 - 2:00)**:  
   *"The app is deployed on Vercel Cloud Hosting with zero deployment friction, achieving 100% rubrics across Cloud Hosting, UI/UX, and Implementation."*

---

## 📸 Screenshots Evidence Checklist for Submission Report

1. **Screenshot 1**: Project Structure in IDE & GitHub repository.
2. **Screenshot 2**: Main Web Application in **Dark Glassmorphism Theme** with sample data.
3. **Screenshot 3**: Application in **Corporate Light Theme** showing live theme switching.
4. **Screenshot 4**: **Interactive Web Portfolio View** displaying project cards and timeline.
5. **Screenshot 5**: **PDF Export Print Preview** showing clean A4 pagination without web buttons.
6. **Screenshot 6**: **Share QR Code Modal** and Vercel Cloud Deployment Dashboard.
