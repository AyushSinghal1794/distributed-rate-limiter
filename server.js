const express = require("express");
const redisClient = require("./redisClient");
const rateLimiter = require("./rateLimiter");

const app = express();
app.use(express.json());

// --- Health Check ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", redis: redisClient.isOpen });
});

// --- Config API ---
app.post("/config/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const { maxRequests, windowSeconds } = req.body;

  if (!maxRequests || !windowSeconds) {
    return res.status(400).json({ error: "maxRequests and windowSeconds are required" });
  }

  await redisClient.hSet(`ratelimit:config:${clientId}`, {
    maxRequests,
    windowSeconds,
  });

  res.json({ message: "Config set successfully", clientId, maxRequests, windowSeconds });
});

app.get("/config/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const config = await redisClient.hGetAll(`ratelimit:config:${clientId}`);

  if (!config || Object.keys(config).length === 0) {
    return res.status(404).json({ error: "No config found for client" });
  }

  res.json({ clientId, ...config });
});

// --- Example Rate-Limited Route ---
app.get("/api/test/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  const { allowed, remaining, reset } = await rateLimiter(clientId);

  if (!allowed) {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
      remaining,
      reset,
    });
  }

  res.json({
    message: "Request successful ✅",
    remaining,
    reset,
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Rate Limiter Service running on port ${PORT}`);
});
