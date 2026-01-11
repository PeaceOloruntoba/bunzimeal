# BunziMeal – Greenfield Implementation Guide

This guide summarizes the plan to build the new BunziMeal monorepo from scratch, deploy on Vercel (web) and Render/Vercel (API), using USDA FDC for nutrition, OpenAI gpt-4o-mini for AI, and global, goal-driven UX.

## Monorepo
- Turborepo with workspaces:
  - apps/web – Next.js (App Router) + Tailwind + shadcn/ui
  - apps/api – Express + TypeScript
  - packages/shared – shared types and schemas (optional)
  - packages/config – shared tsconfig/eslint (optional)

## Environment
- API: DATABASE_URL, JWT_SECRET, SMTP_*, CLOUDINARY_*, OPENAI_API_KEY, FDC_API_KEY, PAYSTACK_SECRET_KEY
- Web: NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

## First Milestones
- Scaffolding: monorepo, env templates, health checks
- Authentication: register, OTP verify, login, refresh, logout, forgot/reset, soft delete; import v1 users
- Core domain: recipes+uploads, nutrition via FDC (+dataset/LLM fallback), pantry & shopping, planner & validation
- Interactive AI: meal-advice, suggestions, combo, chat streaming
- Billing: Paystack plans, webhooks, entitlements
- UX polish & globalization: units/currency, i18n plumbing, accessibility, performance
- QA & launch: seeds (users, countries, pricing), tests, cutover

## Branding
- Colors (CSS variables):
  - --color-primary: #1f444c
  - --color-accent: #e9be6f
  - --color-accent2: #c77138
- Icons: Lucide. Logo to be updated later.

## USDA FDC
- Primary nutrition lookup; cache results. Local dataset for gaps; LLM fallback for unknown dishes.

## Runbook (after install)
- npm run dev (root) → runs both apps using Turbo
- Configure env vars in Render/Vercel; provision Postgres

Refer back to version2guide.md in the root project for full scope and APIs.
