import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { aiRouter } from "./routes/ai.js";
import { aryeoRouter } from "./routes/aryeo.js";

const app = express();

const corsOptions =
  config.corsOrigin === "*"
    ? { origin: true }
    : { origin: config.corsOrigin.split(",").map((origin) => origin.trim()) };

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "nieri-creative-backend",
    usingMockAryeo: config.useMockAryeo,
  });
});

app.get("/api/notifications/types", (req, res) => {
  res.json({
    data: [
      "Media ready",
      "Upcoming shoot reminder",
      "Don't forget to post your listing",
      "Open house marketing reminder",
    ],
  });
});

app.use("/api/aryeo", aryeoRouter);
app.use("/api/ai", aiRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    error: "Something went wrong",
    detail: process.env.NODE_ENV === "production" ? undefined : error.message,
  });
});

app.listen(config.port, () => {
  console.log(`Nieri Creative backend running on http://localhost:${config.port}`);
});

