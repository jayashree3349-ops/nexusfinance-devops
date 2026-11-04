
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "nexusfinance",
  user: process.env.DB_USER || "nexusadmin",
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (_req, res) => {
  res.json({
    service: "NexusFinance API",
    message: "Welcome to NexusFinance",
  });
});

// Database health check
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "healthy",
      service: "nexusfinance-api",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

// Get all transactions
app.get("/api/transactions", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      error: "Could not fetch transactions",
    });
  }
});

// Add a transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { description, amount, transaction_type } = req.body;

    if (
      typeof description !== "string" ||
      !description.trim() ||
      !Number.isFinite(Number(amount)) ||
      amount === null ||
      amount === undefined ||
      !["credit", "debit"].includes(transaction_type)
    ) {
      return res.status(400).json({
        error: "Invalid transaction data",
      });
    }

    const result = await pool.query(
      `INSERT INTO transactions
       (description, amount, transaction_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [description.trim(), amount, transaction_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding transaction:", error);

    res.status(500).json({
      error: "Could not add transaction",
    });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NexusFinance API listening on port ${PORT}`);
});

