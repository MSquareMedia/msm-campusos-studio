# Blue-Green Zero-Downtime Deployment

This document explains the blue-green deployment strategy used in this project.
Every push to `main` or `develop` triggers a zero-downtime container swap with no dropped requests.

---

## How It Works

Two container "slots" — **blue** and **green** — alternate on every deploy.
Only one slot is live at a time. nginx acts as the traffic switch between them.

```
 Internet
    │
    ▼
 nginx (sotapo.com)
    │  upstream campusos_app → 127.0.0.1:3001  (blue)
    │                       OR 127.0.0.1:3002  (green)
    │
    ├── msm-campusos-studio-blue   (port 3001) ← active
    └── msm-campusos-studio-green  (port 3002) ← idle / being deployed to
```

### Deployment Flow (per push)

```
1.  Pull new Docker image from GHCR
2.  Detect active slot  (blue or green)
3.  Boot new image on the idle slot  (alternate port)
4.  Health-check idle slot  → wait up to 60 s for HTTP 200
5.  Write new upstream config  → /etc/nginx/conf.d/campusos-upstream.conf
6.  nginx -t  → validate config
7.  nginx -s reload  → atomic upstream switch (zero dropped requests)
8.  Wait 5 s  → in-flight requests on old slot drain
9.  Stop & remove old slot container
10. Prune dangling images
```

> **User impact:** Steps 1–4 run while the old container is still live.
> Step 7 (nginx reload) is the actual "switch" — it takes ~1 ms and drops no connections.

---

## VM Prerequisites

These steps must be completed **once** on the Linux VM before the first deploy.

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

### 3. Update the nginx site config

Replace every `proxy_pass http://127.0.0.1:3000` with the upstream block:

```bash
sudo sed -i 's|http://127\.0\.0\.1:3000|http://campusos_app|g' \
  /etc/nginx/sites-enabled/sotapo
```

Verify (should show `campusos_app` three times):

```bash
grep "proxy_pass" /etc/nginx/sites-enabled/sotapo
```

Reload nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Give the deploy user ownership of the upstream file

```bash
sudo chown msm-mlapi /etc/nginx/conf.d/campusos-upstream.conf
```

This allows the deploy script to write the new upstream port **without sudo**.

### 5. Allow passwordless nginx commands via sudoers

```bash
# Disable requiretty for the deploy user
echo 'Defaults:msm-mlapi !requiretty' | sudo tee -a /etc/sudoers

# Allow nginx test + reload without a password
echo 'msm-mlapi ALL=(ALL) NOPASSWD: /usr/sbin/nginx' | sudo tee -a /etc/sudoers

# Verify the file is still valid
sudo visudo -c
```

### 6. Bootstrap the first blue container

The deploy script detects the active slot by checking which container is running.
On the very first deploy, start the blue slot manually:

```bash
docker run -d \
  --name    msm-campusos-studio-blue \
  --restart unless-stopped \
  --memory  2g \
  --cpus    1.5 \
  -p        3001:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  ghcr.io/msquaremedia/msm-campusos-studio:main
```

---

## GitHub Actions Secrets Required

| Secret | Description |
|--------|-------------|
| `GHCR_TOKEN` | Personal Access Token with `write:packages` scope |
| `VM_HOST` | Public IP or hostname of the Linux VM |
| `VM_USER` | SSH username (`msm-mlapi`) |
| `VM_SSH_PASSWORD` | SSH password for `VM_USER` |
| `VM_SSH_PORT` | SSH port (default `22`) |
| `DATABASE_URL` | Neon / Postgres connection string |
| `ANTHROPIC_API_KEY` | Anthropic SDK key |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `NEXT_PUBLIC_APP_URL` | Public app URL e.g. `https://sotapo.com` |
| `NEXT_PUBLIC_SITE_NAME` | Site name baked into the JS bundle |

---

## Container Resource Limits

| Limit | Value |
|-------|-------|
| Memory | 2 GB (hard cap — OOM kill if exceeded) |
| CPU | 1.5 cores |
| Restart policy | `unless-stopped` (auto-restart on crash/reboot, not on manual stop) |

---

## Internal Port Mapping

| Slot | Internal port | When active |
|------|--------------|-------------|
| blue | `3001` | Odd-numbered deploys |
| green | `3002` | Even-numbered deploys |

Ports `3001` and `3002` are **internal only** — never exposed to the internet.
All public traffic enters through nginx on port `80`/`443`.

---

## Rollback

If the health check fails (no HTTP 200 within 60 s), the deploy script:

1. Stops and removes the new (unhealthy) container
2. Exits with status `1` — GitHub Actions marks the job as failed
3. The old container **remains running** — no outage occurs

To manually roll back to the previous image, re-run the previous workflow from the GitHub Actions UI
(`Actions → select run → Re-run jobs`).

---

## Troubleshooting

### `sudo: a terminal is required to read the password`

The NOPASSWD rule is not applying. Check:

```bash
sudo visudo -c                         # verify sudoers is valid
sudo grep "msm-mlapi" /etc/sudoers     # confirm rule exists
```

### `nginx: configuration file test failed`

The upstream conf has a syntax error. Check the file:

```bash
cat /etc/nginx/conf.d/campusos-upstream.conf
```

Expected content:

```nginx
upstream campusos_app {
    server 127.0.0.1:3001;   # or 3002
}
```

### `Run Command Timeout` in GitHub Actions

The SSH session is hanging — usually caused by a sudo prompt waiting for input via the PTY.
Verify that `!requiretty` and `NOPASSWD` are set in `/etc/sudoers` (not just `sudoers.d`):

```bash
sudo grep -n "msm-mlapi\|requiretty" /etc/sudoers
```

### Health check fails (HTTP 000 for all 24 attempts)

The container started but Next.js didn't bind to port 3000 in time or crashed.
Check container logs:

```bash
docker logs msm-campusos-studio-blue   # or green
```

### Old `msm-campusos-studio` container still running

This is the pre-blue-green single container. It is no longer used by nginx. Remove it:

```bash
docker stop msm-campusos-studio && docker rm msm-campusos-studio
```

---

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | CI/CD pipeline — lint → build → deploy → healthcheck |
| `/etc/nginx/sites-enabled/sotapo` | nginx site config for `sotapo.com` |
| `/etc/nginx/conf.d/campusos-upstream.conf` | Upstream block — rewritten on every deploy |
| `/etc/sudoers` | NOPASSWD + `!requiretty` rules for `msm-mlapi` |
