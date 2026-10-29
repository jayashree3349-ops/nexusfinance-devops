
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    service: "NexusFinance API",
    message: "Welcome to NexusFinance",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "nexusfinance-api",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NexusFinance API listening on port ${PORT}`);
});
