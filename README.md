# Student Authentication Frontend — Task 1 (Shaher)

Part of the **Student Course Registration System** university project.
This folder covers only **Task 1: Student Account & Login**.

| FR | Requirement | Where |
|----|-------------|-------|
| FR-1 | Students can create accounts | `pages/signup.html` |
| FR-2 | Students and administrators can log in | `pages/login.html` |
| FR-3 | Users can log out | Logout button on `pages/dashboard.html` |

## Technology
HTML5, CSS3 and vanilla JavaScript only. No frameworks, libraries, build tools, backend or database.

## Project structure
```
shaher-auth-revision/
├── assets/images/login-bg.png   Background image (scenery only, no UI)
├── css/style.css                Shared glassmorphism design system
├── js/auth.js                   Sign-up, login, session and logout logic
├── pages/
│   ├── dashboard.html           Minimal post-login placeholder (demonstrates logout)
│   ├── login.html
│   └── signup.html
├── index.html                   Redirects to pages/login.html
└── README.md
```

## How to run
Double-click `index.html` (or open it in any modern browser). No server or installation is needed.

## Demo accounts
- **Student:** create one on the Sign-Up page, then sign in with the *Student* role.
- **Administrator (pre-seeded demo account):** `admin@university.edu` / `Admin@123` with the *Administrator* role.

## Demo flow
1. Open `index.html` → Login page.
2. Create a student account (name, email, password ≥ 8 characters, matching confirmation).
3. Sign in as Student → placeholder page shows name and role.
4. Click **Logout** → session is cleared and you return to Login.
5. Sign in again using the Administrator demo account to see the Administrator role.

## Security notice
**This is a frontend-only academic simulation and is NOT secure authentication.**
Accounts and the session are stored in the browser's `localStorage`, passwords are stored in plain text,
and there is no server-side verification. Never use real passwords or deploy this as real authentication.

## Scope
Course browsing, registration, schedules, course management and student records belong to other team members and are intentionally not included.
