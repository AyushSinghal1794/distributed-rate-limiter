# Distributed Rate Limiting Service (Node.js + Redis)

A lightweight, production-grade **distributed rate limiting service** built using **Node.js**, **Express**, and **Redis**.  
This service applies rate limits **consistently across multiple API servers**, preventing API abuse and ensuring fair client usage in high-traffic systems.

---

## 🚀 Features

- **Distributed & Scalable** — Limits are enforced globally across all application instances.
- **Fixed Window Counter Algorithm** — Simple, predictable, and easy to reason about.
- **Centralized Configuration** — Configure per-client request limits in real time (no restarts needed).
- **Redis-Backed Atomic Operations** — Guarantees **race-free** and **thread-safe** counters.
- **Low Latency** — O(1) operations per request ensure stable performance under load.
