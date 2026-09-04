# Blue-Green Zero-Downtime Deployment

This document explains the blue-green deployment strategy used in this project.
Every push to `main` (production) or `develop` (staging) triggers a zero-downtime
container swap — nginx switches traffic between slots atomically with no dropped requests.

---

## How It Works

Two container "slots" — **blue** and **green** — alternate on every deploy.
Only one slot is live at a time. nginx acts as the traffic switch.

```
 Internet
    |
    v
 nginx (sotapo.com)
    |  upstream campusos_app -> 127.0.0.1:3001  (blue)
    |                       OR 127.0.0.1:3002  (green)
    |
    +-- msm-campusos-studio-blue   (127.0.0.1:3001) <- active
    +-- msm-campusos-studio-green  (127.0.0.1:3002) <- idle / being deployed to
```

> **Ports 3001 and 3002 are bound to `127.0.0.1` only.**
> Even if the VM firewall permits those ports, they are unreachable from the internet.

### Deployment Flow (per push)

```
1.  Pull new Docker image from GHCR  (SHA-tagged, immutable)
2.  Detect active slot  (blue / green / neither -> first deploy auto-bootstrap)
3.  Stop and remove the idle slot if it exists
4.  Boot new image on the idle slot  (loopback port)
5.  Health-check /api/health -> wait up to 120 s for HTTP 200 or 204
6.  Write new upstream config  -> /etc/nginx/conf.d/campusos-upstream.conf
7.  sudo nginx -t  -> validate config (NOPASSWD, scoped to -t only)
8.  sudo nginx -s reload  -> atomic upstream switch (~1 ms, 0 dropped requests)
9.  Wait DRAIN_SECONDS (default 30 s) for in-flight requests on old slot to finish
10. Stop & remove old slot container
11. Prune dangling images
```

> **User impact:** Steps 1-5 happen while the old container is fully live.
> Step 8 is the actual traffic switch and takes ~1 ms.

---

## Environments

| Branch    | Environment                                    |
|-----------|------------------------------------------------|
| `main`    | Production (`sotapo.com`)                      |
| `develop` | Staging (configure a separate VM / domain)     |

Both branches use the same pipeline. Use GitHub Environment protection rules
(`Settings -> Environments`) to require approval before deploying to production.

---

## VM Prerequisites

Complete these steps **once** on the Linux VM before the first deploy.

### 1. Install nginx

```bash
sudo apt update && sudo apt install -y nginx
```

### 2. Create the nginx upstream file

```bash
sudo tee /etc/nginx/conf.d/campusos-upstream.conf > /dev/null <<'EOF'
upstream campusos_app {
    server 127.0.0.1:3001;
}
EOF
```

### 3. Update the nginx site config to use the upstream block

Replace `proxy_pass http://127.0.0.1:3000;` with `proxy_pass http://campusos_app;`:

```bash
sudo sed -i \
  's|proxy_pass http://127\.0\.0\.1:3000;|proxy_pass http://campusos_app;|g' \
  /etc/nginx/sites-enabled/sotapo
```

Verify (every proxy_pass line should now show `campusos_app`):

```bash
grep -n "proxy_pass" /etc/nginx/sites-enabled/sotapo
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Give the deploy user ownership of the upstream file

The deploy script writes this file directly — no `sudo` needed for the write step.

```bash
sudo chown msm-mlapi /etc/nginx/conf.d/campusos-upstream.conf
```

### 5. Tighten sudoers — scope to exactly two nginx commands

Grant passwordless access to **only** `nginx -t` and `nginx -s reload`.

```bash
echo 'Defaults:msm-mlapi !requiretty' | sudo tee -a /etc/sudoers
echo 'msm-mlapi ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t, /usr/sbin/nginx -s reload' \
  | sudo tee -a /etc/sudoers
sudo visudo -c
```

> **Why not `NOPASSWD: /usr/sbin/nginx`?**
> That would allow `sudo nginx -s stop` or `sudo nginx -s quit`, which could
> take the site down entirely. Scoping to `-t` and `-s reload` eliminates that risk.

### 6. Create the /api/health endpoint in Next.js

```ts
// app/api/health/route.ts  (basic)
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
```

For a stronger check, verify database connectivity:

```ts
// app/api/health/route.ts  (with DB check)
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`SELECT 1`
    return NextResponse.json({ status: 'ok', db: 'connected' }, { status: 200 })
  } catch {
    return NextResponse.json({ status: 'error', db: 'unreachable' }, { status: 503 })
  }
}
```

---

## GitHub Actions Secrets Required

| Secret                      | Description                                          |
|-----------------------------|------------------------------------------------------|
| `GHCR_TOKEN`                | Personal Access Token with `write:packages` scope    |
| `VM_HOST`                   | Public IP or hostname of the Linux VM                |
| `VM_USER`                   | SSH username (`msm-mlapi`)                           |
| `VM_SSH_PASSWORD`           | SSH password for `VM_USER`                           |
| `VM_SSH_PORT`               | SSH port (default `22`)                              |
| `DATABASE_URL`              | Neon / Postgres connection string                    |
| `ANTHROPIC_API_KEY`         | Anthropic SDK key                                    |
| `UPSTASH_REDIS_REST_URL`    | Upstash Redis REST endpoint                          |
| `UPSTASH_REDIS_REST_TOKEN`  | Upstash Redis token                                  |
| `NEXT_PUBLIC_APP_URL`       | Public app URL e.g. `https://sotapo.com`             |
| `NEXT_PUBLIC_SITE_NAME`     | Site name baked into the JS bundle at build time     |

---

## Container Resource Limits

| Limit          | Value                                              |
|----------------|----------------------------------------------------|
| Memory         | 2 GB hard cap (OOM kill if exceeded)               |
| CPU            | 1.5 cores                                          |
| Restart policy | `unless-stopped`                                   |
| Port binding   | `127.0.0.1` only (loopback — not externally reachable) |

---

## Internal Port Mapping

| Slot  | Bound address       | When used                        |
|-------|---------------------|----------------------------------|
| blue  | `127.0.0.1:3001`   | Odd deploys / first-deploy bootstrap |
| green | `127.0.0.1:3002`   | Even deploys                     |

---

## Drain Period

After nginx switches to the new slot, the old slot stays alive for **30 seconds**
(`DRAIN_SECONDS=30` in `deploy.yml`) so in-flight requests can complete.

**Increase `DRAIN_SECONDS`** if your app has:
- Server-Sent Events (SSE) / streaming AI responses
- WebSocket connections
- Large file uploads or slow API responses

`DRAIN_SECONDS` is defined once at the top of the deploy script and can be
adjusted without touching any other logic.

---

## Rollback

### Automatic rollback (health check failure)

If `/api/health` does not return 200 or 204 within 120 seconds:

1. The new container is stopped and removed
2. The deploy script exits with status `1` — GitHub Actions fails the job
3. **The old container keeps running** — zero outage

### Manual rollback

All Docker images are tagged with an immutable Git commit SHA (e.g. `sha-a1b2c3d`).
To redeploy a specific previous version:

1. Go to **Actions -> select the previous successful run -> Re-run jobs**

This re-runs the exact same workflow, deploying the same immutable SHA-tagged image.

> **Limitation:** Re-deploying an older image does not undo database schema migrations.
> See the Database Migrations section below.

---

## Database Migrations

This is the most significant operational risk in any blue-green deployment.

**The problem:** If the new version runs a migration incompatible with the old version,
switching nginx back to the old slot does **not** give you a safe rollback — the old
code is now talking to a migrated schema it was not designed for.

**Recommended practices:**

1. **Expand/contract pattern:** Make schema changes backward-compatible.
   - Add columns as nullable; never drop or rename in the same deploy
   - Remove old columns only in a later deploy after all traffic has migrated

2. **Run migrations separately** from the application start — use a dedicated CI
   step or migration job before the blue-green container swap begins.

3. **Test on staging first** (`develop` branch with a copy of production data)
   before merging to `main`.

---

## Troubleshooting

### `sudo: a terminal is required to read the password`

The `!requiretty` or NOPASSWD rule is not applying. Verify:

```bash
sudo grep -n "msm-mlapi\|requiretty" /etc/sudoers
```

Both lines must be present in `/etc/sudoers` (not just `sudoers.d`):

```
Defaults:msm-mlapi !requiretty
msm-mlapi ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t, /usr/sbin/nginx -s reload
```

### `nginx: configuration file test failed`

Check the upstream file:

```bash
cat /etc/nginx/conf.d/campusos-upstream.conf
```

Expected:

```nginx
upstream campusos_app {
    server 127.0.0.1:3001;   # or 3002
}
```

### Health check returns HTTP 000 for all 24 attempts

The container started but the app is not binding or crashed. Check logs:

```bash
docker logs msm-campusos-studio-blue   # or green
```

### Health check times out but the site seems up

The `/api/health` route does not exist yet. Create it (Step 6 above) or
temporarily change the URL in `deploy.yml` to `/` while building the endpoint.

### `Run Command Timeout` in GitHub Actions

The SSH session is hanging — usually a `sudo` prompt waiting for a password.
Verify both sudoers lines exist in `/etc/sudoers` and test without a TTY:

```bash
sudo -n nginx -t
```

### Old `msm-campusos-studio` container still running

Pre-blue-green container from before this setup. nginx no longer routes to it.
Remove it:

```bash
docker stop msm-campusos-studio && docker rm msm-campusos-studio
```

---

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | Full CI/CD pipeline |
| `/etc/nginx/sites-enabled/sotapo` | nginx site config — uses `proxy_pass http://campusos_app` |
| `/etc/nginx/conf.d/campusos-upstream.conf` | Upstream block — rewritten on every deploy |
| `/etc/sudoers` | `!requiretty` + scoped NOPASSWD for `msm-mlapi` |
| `app/api/health/route.ts` | Health endpoint checked before every traffic switch |
