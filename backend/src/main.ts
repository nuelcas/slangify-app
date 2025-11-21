import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import slangRouter from "./routes/slang";

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/slang", slangRouter);

// Health check for Seenode and monitoring
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// In production serve the frontend static files (built into ../frontend/dist)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "..", "frontend", "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Seenode -> must listen on process.env.PORT or a default
const port = Number(process.env.PORT || 80);
const host = "0.0.0.0"; // Required for Seenode

app.listen(port, host, () => {
  console.log(`Slangify backend listening on ${host}:${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});

