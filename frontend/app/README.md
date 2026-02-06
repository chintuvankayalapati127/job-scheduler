# Job Scheduler & Automation Dashboard

## Overview
This is a full stack Job Scheduler & Automation system built as part of the Dotix Technologies assignment.

The system allows users to create jobs, run them, track their status, and trigger a webhook when a job is completed.

---

## Tech Stack

Frontend:
- Next.js
- React
- Tailwind CSS

Backend:
- Node.js
- Express

Database:
- MySQL

---

## Features

- Create a job with task name, JSON payload, and priority
- Jobs are saved with status = pending
- Run job manually
- Job status changes: pending → running → completed
- Webhook is triggered when job completes
- Dashboard with filters by status and priority

---

## API Endpoints

- POST /jobs → create job
- GET /jobs → list all jobs
- GET /jobs/:id → job details
- POST /run-job/:id → run a job

---

## Database Schema

jobs table:
- id
- taskName
- payload (JSON)
- priority
- status
- createdAt
- updatedAt

---

## Webhook

When a job is completed, a POST request is sent to webhook.site.

Payload includes:
- jobId
- taskName
- priority
- payload
- completedAt

---

## How to Run the Project

### Backend
```bash
cd backend
npm install
npm start
