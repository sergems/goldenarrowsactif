---
name: Replit port support
description: Which ports Replit's workflow health checker can detect; and why arbitrary ports cause DIDNT_OPEN_A_PORT failures.
---

## The rule

Replit's workflow health checker (used by `restart_workflow` and `restartWorkflow`) can only detect ports from this list:

**3000, 3001, 3002, 3003, 4200, 5000, 5173, 6000, 6800, 8000, 8008, 8080, 8099, 9000**

Any other port (e.g. 23253) will result in a permanent `DIDNT_OPEN_A_PORT` failure, even when the process IS listening on that port and `curl localhost:<port>` returns 200.

**Why:** Replit's artifact system sometimes assigns ports outside this range (e.g. 23253 for a second web artifact). The health checker ignores those ports.

**How to apply:** When an artifact-managed workflow fails with DIDNT_OPEN_A_PORT despite the server starting successfully:
1. Update `artifact.toml` → `localPort` and `[services.env] PORT` to a supported port (5173 for Vite, 8080 for Express).
2. Write to a temp file `artifact.edit.toml` in the same `.replit-artifact/` dir, then call `verifyAndReplaceArtifactToml({tempFilePath, artifactTomlPath})`.
3. Restart the workflow — it will now succeed.
