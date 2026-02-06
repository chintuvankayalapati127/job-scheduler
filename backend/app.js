require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create Job
app.post("/jobs", async (req, res) => {
  try {
    const { taskName, payload, priority } = req.body;

    if (!taskName || !payload || !priority) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ payload already comes as an object from frontend
    const [result] = await db.query(
      "INSERT INTO jobs (taskName, payload, priority) VALUES (?, ?, ?)",
      [taskName, JSON.stringify(payload), priority]
    );

    res.json({ message: "Job created", id: result.insertId });
  } catch (err) {
    console.error("CREATE JOB ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Jobs
app.get("/jobs", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM jobs ORDER BY createdAt DESC");
  res.json(rows);
});

// ✅ Run Job MUST BE HERE
app.get("/run-job/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    await db.query("UPDATE jobs SET status='running' WHERE id=?", [jobId]);

    setTimeout(async () => {
      try {
        await db.query("UPDATE jobs SET status='completed' WHERE id=?", [jobId]);
        const [job] = await db.query("SELECT * FROM jobs WHERE id=?", [jobId]);

        await axios.post(process.env.WEBHOOK_URL, {
          jobId: job[0].id,
          taskName: job[0].taskName,
          priority: job[0].priority,
          payload: JSON.parse(job[0].payload),
          completedAt: new Date(),
        });

        console.log("✅ Webhook sent");
      } catch (err) {
        console.log("❌ Webhook failed", err.message);
      }
    }, 3000);

    res.json({ message: "Job started" });
  } catch (err) {
    console.error("RUN JOB ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Job By ID (MUST STAY LAST)
app.get("/jobs/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM jobs WHERE id=?", [req.params.id]);
  res.json(rows[0]);
});
// Delete Job
app.delete("/jobs/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM jobs WHERE id=?", [req.params.id]);
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
