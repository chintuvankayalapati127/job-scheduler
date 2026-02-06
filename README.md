
# Job Scheduler & Automation Dashboard

This project is a simplified Job Scheduler & Automation System built as part of the
Dotix Technologies Full Stack Developer Skill Test.

It allows users to create background jobs, run them, track their status, and trigger
webhooks when jobs are completed.

---

## 🚀 Features

- Create jobs with task name, JSON payload, and priority
- Track job status (pending → running → completed)
- Run jobs manually from the dashboard
- Filter jobs by status and priority
- View job details including payload
- Trigger outbound webhook on job completion

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Axios (for webhook calls)
- dotenv

### Frontend
- Next.js (React)
- Tailwind CSS

---

## 📦 API Endpoints

- **POST /jobs** → Create a new job
- **GET /jobs** → List all jobs
- **GET /jobs/:id** → Get job details
- **POST /run-job/:id** → Run a job (simulate processing)
- **POST /webhook-test** → Optional webhook testing endpoint

---

## 🔄 Job Execution Flow

1. Job is created with status **pending**
2. Clicking **Run Job** sets status to **running**
3. Job waits for 3 seconds (simulated processing)
4. Status is updated to **completed**
5. Webhook is triggered with job details

---

## 🌐 Webhook Integration

When a job completes, a POST request is sent to:WEBHOOK_URL=https://webhook.site/c7ea3538-a176-4d36-9036-3cb246305c06






## How to run
1. Install Node.js
2. Go to backend folder
3. Run `npm install`
4. Run `node app.js`

## AI Usage

- Tool used: ChatGPT  
- Model: GPT-4.x  
- Used for:
  - Backend API debugging
  - Frontend logic clarification
  - Git and GitHub issue resolution
- All implementation decisions and final code were written and understood by me.

