# HR Management System

A comprehensive Human Resource Management System (HRMS) built with Next.js, designed to streamline HR operations and task management with AI-powered capabilities.

## Features

- 👥 Employee Task Management
- 📋 HR Process Automation
- 🤖 AI-Assisted Task Breakdown
- 📊 HR Dashboard
- 📱 Responsive Design for Access Anywhere
- 🔐 Role-Based Access Control
- 📅 Task Organization (Today, Next 7 days, Inbox)
- ⏱️ Time Management & Tracking

## Core HR Modules

### Task Management

- Create and assign HR tasks
- Track employee onboarding processes
- Manage performance review tasks
- Monitor compliance-related activities

### Process Automation

- Automated task assignment
- AI-powered task breakdown for complex HR processes
- Streamlined workflow management
- Checklist-based process tracking

### Employee Management

- Task assignment and tracking
- Performance monitoring
- Process compliance tracking
- Employee engagement tracking

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Google Gemini AI](https://ai.google.dev/) - AI Integration

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Google Gemini AI API key
- Proper security clearance for HR data handling

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
Installation
Clone the repository:

git clone [repository-url]

Copy

Insert at cursor
bash
Install dependencies:

npm install
# or
yarn install

Copy

Insert at cursor
bash
Run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
