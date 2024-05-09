---
"@ponder/core": patch
---

Added automatic support for zero-downtime deployments on [Render](https://render.com) by detecting the `RENDER_SERVICE_NAME` and `RENDER_INSTANCE_ID` environment variables. Also fixed a bug where database connection strings that omitted the port would fail with an `ENOTFOUND` error. Now, Ponder defaults the database port to `5432`.
