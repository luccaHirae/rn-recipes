import express from "express";
import { ENV } from './config/env.js';

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date() });
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
});