# SkillGap AI

SkillGap AI is an intelligent platform designed to analyze a user's skills against their desired career path, providing actionable insights, personalized learning roadmaps, and interview preparation. 

## Features
- AI-driven skill gap analysis
- Resume and GitHub profile parsing
- Personalized learning roadmaps
- AI Mock Interview sessions

## Status
This project is currently fully functional, optimized, and ready for production deployment on Netlify or Vercel.

## Quick Start
1. Clone the repository
2. Run `npm install`
3. Generate Prisma client: `npm run build:prisma` (handled automatically by `postinstall`)
4. Set up your `.env` following `.env.example`
5. Run development server: `npm run dev`

## Deployment

### Netlify
The project includes a `netlify.toml` for easy deployment to Netlify. 
1. Connect your repository to Netlify.
2. Set the necessary environment variables in the Netlify UI (Database URL, Clerk keys, AI keys).
3. Deploy! The Prisma client generation is handled via the `postinstall` script.

### Vercel
1. Connect your repository to Vercel.
2. Set your environment variables in the Vercel dashboard.
3. Deploy! Vercel will automatically run `npm run build`.

## Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Prisma ORM
- Clerk Authentication
- Three.js (WebGL visualizations)
