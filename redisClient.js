const { createClient } = require("redis");

const redisClient = createClient({ url: "redis://localhost:6379" });

redisClient.on("error", (err) => {
  console.error("❌ Redis Error", err);
});

(async () => {
  await redisClient.connect();
  console.log("✅ Redis connected (from redisClient.js)");
})();

module.exports = redisClient;
