"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [taskName, setTaskName] = useState("");
  const [payload, setPayload] = useState("");
  const [priority, setPriority] = useState("Low");
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

 const [statusFilter, setStatusFilter] = useState("All Status");
const [priorityFilter, setPriorityFilter] = useState("All Priority");

  const fetchJobs = async () => {
  try {
    const res = await fetch("http://localhost:5000/jobs", {
      cache: "no-store", // prevents Next.js from server caching
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    setJobs(data);
  } catch (err) {
    console.error("Fetch jobs failed:", err);
    setMessage("Cannot connect to backend");
  }
};
const createJob = async () => {
  let parsedPayload;

  // Step 1: Check JSON safely
  try {
    parsedPayload = JSON.parse(payload);
  } catch (e) {
    setMessage("Payload must be valid JSON");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskName,
        payload: parsedPayload,
        priority,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    setMessage(data.message);
    setTaskName("");
    setPayload("");
    fetchJobs();
  } catch (err) {
    setMessage("Server error while creating job");
  }
};


const runJob = async (id: number) => {
  await fetch(`http://localhost:5000/run-job/${id}`);
  fetchJobs();
  setTimeout(fetchJobs, 3500);
};
const deleteJob = async (id: number) => {
  await fetch(`http://localhost:5000/jobs/${id}`, {
    method: "DELETE",
  });
  fetchJobs(); // refresh table
};


  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Job Automation Dashboard</h1>

      {/* Create Job Form */}
      <div className="bg-white shadow p-6 rounded mb-10">
        <h2 className="text-xl font-semibold mb-4">Create Job</h2>

        <input
          type="text"
          placeholder="Task Name"
          className="border p-2 w-full mb-3 rounded"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <textarea
          placeholder='{"email":"test@gmail.com"}'
          className="border p-2 w-full mb-3 rounded h-28"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button
          onClick={createJob}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Create Job
        </button>

        {message && <p className="mt-3 text-green-600">{message}</p>}
      </div>
      <div className="flex gap-4 mb-4">
  <select
    className="border p-2 rounded"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option>All Status</option>
    <option>pending</option>
    <option>running</option>
    <option>completed</option>
  </select>

  <select
    className="border p-2 rounded"
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
  >
    <option>All Priority</option>
    <option>Low</option>
    <option>Medium</option>
    <option>High</option>
  </select>
</div>


      {/* Jobs Table */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">All Jobs</h2>

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Task</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs
  .filter((job) =>
    (statusFilter === "All Status" || job.status === statusFilter) &&
    (priorityFilter === "All Priority" || job.priority === priorityFilter)
  )
  .map((job) => (

              <tr key={job.id}>
                <td className="p-2 border">{job.taskName}</td>
                <td className="p-2 border">{job.priority}</td>
                <td className="p-2 border">{job.status}</td>
                <td className="p-2 border space-x-2">
                  <button
  onClick={() => setSelectedJob(job)}
  className="bg-gray-600 text-white px-3 py-1 rounded"
>
  View
</button>

  {job.status !== "completed" && (
    <button
      onClick={() => runJob(job.id)}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      Run
    </button>
  )}

  <button
    onClick={() => deleteJob(job.id)}
    className="bg-red-600 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedJob && (
  <div className="mt-8 bg-white shadow p-6 rounded">
    <h2 className="text-xl font-semibold mb-4">Job Details</h2>

    <p><strong>ID:</strong> {selectedJob.id}</p>
    <p><strong>Task:</strong> {selectedJob.taskName}</p>
    <p><strong>Priority:</strong> {selectedJob.priority}</p>
    <p><strong>Status:</strong> {selectedJob.status}</p>

    <div className="mt-4">
      <strong>Payload:</strong>
      <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
        {JSON.stringify(selectedJob.payload, null, 2)}
      </pre>
    </div>
  </div>
)}

    </main>
  );
}
