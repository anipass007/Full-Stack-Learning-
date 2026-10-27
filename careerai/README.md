# CareerAI

CareerAI is a React + Vite student career and placement app. Supabase provides email/password authentication, PostgreSQL data, and database-enforced role access. Resume scoring, skill-gap plans, roadmaps, and interview feedback use transparent local rules; no paid AI API is used.

## Current integration status

- **Connected to Supabase:** signup/login/password reset, student and recruiter profiles, recruiter jobs, job moderation, applications, pasted-text resume analysis results, roadmap progress, and mock interview history.
- **Rule-based in the browser:** ATS estimate, skill matching, learning recommendations, interview questions, and answer feedback. Pasted resume text is not persisted; only derived analysis results are saved.
- **Not connected:** PDF storage (the My resume page only simulates metadata in the browser), account suspension/deletion, user reports, notification delivery, hiring automation, analytics charts, and platform settings. Student dashboard resume/recommended-job cards and admin analytics/settings still contain sample data. Do not use those areas as live operational controls.
- **Landing page figures/testimonials:** illustrative sample content, not production metrics or endorsements.

Admin role changes are restricted to trusted provisioning. Public signup can request only `student` or `recruiter`; the UI does not offer admin promotion. The initial database migration documents trusted SQL provisioning for the first admin.

## Local development

Requirements: Node.js 18 or newer and npm.

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then set:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

The legacy `VITE_SUPABASE_ANON_KEY` is also accepted. These browser keys are public identifiers; never put a Supabase secret/service-role key in a `VITE_` variable or frontend file. Real `.env` files are ignored by Git.

Apply `supabase/migrations/*.sql` to a new Supabase project in filename order, using the Supabase CLI or SQL editor. Then enable email/password authentication and configure the Auth Site URL and redirect allowlist for local development (`http://localhost:5173`) and the deployed Netlify site. The app does not apply migrations automatically.

```sh
npm run dev
npm run build
npm run preview
```

Without Supabase environment values, public pages still load, but authenticated portals and saved backend features are unavailable.

## Database and security

The SQL migrations define profiles, jobs, applications, resume analyses, roadmap progress, and interview sessions, with foreign keys, indexes, constraints, grants, triggers, and RLS. Frontend route guards are for navigation only; RLS and restricted database functions enforce access. Recruiter job moderation and role changes use admin-only database functions. Never disable RLS or use a secret key from the browser.

For first-admin provisioning, create the Auth user through Supabase, then use the SQL editor as a trusted project operator to set that user's `public.profiles.role` to `admin`. Do not add admin as a public signup option.

## Netlify deployment

1. Push the CareerAI folder to a Git repository and import that repository in Netlify.
2. Set the build command to `npm run build` and publish directory to `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Netlify site's environment-variable settings for the deploy context. These values are compiled into the browser bundle; add only the publishable/anon key.
4. Set the matching deployed URL in Supabase Auth's Site URL and redirect URL allowlist. Include the password-reset route on that same origin.
5. Deploy, then check direct navigation to `/login`, `/student`, `/recruiter`, and `/admin`; `public/_redirects` rewrites client routes to the Vite app shell.

The configured backend and hosting are intended to stay within free tiers. Availability and quotas depend on provider plan limits; the app does not require paid APIs or paid integrations.

## Verification and limits

There is no automated test script or checked-in test suite yet. A production Vite build checks bundling, but it does not test Supabase credentials, migrations, RLS behavior, email delivery, or Netlify deployment. Those need a configured project and manual role-based checks.
