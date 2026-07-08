# Deploying Olla Cloud

A static site served by nginx. No build step, no backend.

## Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds the nginx image with the site baked in |
| `default.conf` | nginx server config (gzip, security headers, clean URLs, caching, health check) |
| `docker-compose.yml` | One-command run, maps host `8080` → container `80` |
| `.dockerignore` | Keeps the build context lean |

## Run with Docker Compose (simplest)

```bash
docker compose up -d --build
```

Browse to **http://localhost:8080**. Stop with `docker compose down`.

## Run with plain Docker

```bash
docker build -t olla-cloud-web .
docker run -d --name olla-cloud -p 8080:80 olla-cloud-web
```

## What the config does

- **Clean URLs** — `/pricing` serves `pricing.html` (explicit `.html` URLs still work).
- **gzip** — text assets are compressed (verified: `styles.css` returns `Content-Encoding: gzip`).
- **Security headers** — CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` on every response.
- **Caching** — HTML always revalidates; CSS/JS cached 1h; fonts/images 7d. (Filenames aren't content-hashed, so caches are deliberately short to avoid stale pages.)
- **Health check** — `GET /healthz` returns `200 ok`, wired into Docker's `HEALTHCHECK` and ready for Kubernetes `livenessProbe`/`readinessProbe`.

Check container health: `docker ps` (shows `healthy`) or `docker inspect --format '{{.State.Health.Status}}' olla-cloud`.

## Updating the site

The files are copied into the image at build time, so after editing any `.html`/`.css`/`.js`, rebuild:

```bash
docker compose up -d --build
```

For rapid local iteration without rebuilds, mount the folder instead:

```bash
docker run -d --name olla-cloud -p 8080:80 \
  -v "$(pwd):/usr/share/nginx/html:ro" \
  -v "$(pwd)/default.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.27-alpine
```

## Hardening notes (optional)

- **Run rootless:** swap the base image for `nginxinc/nginx-unprivileged:1.27-alpine`. It runs as a non-root user and listens on **8080** inside the container, so change the Dockerfile `listen` to `8080`, `EXPOSE 8080`, the health check URL to `127.0.0.1:8080`, and map `-p 8080:8080`.
- **TLS:** terminate HTTPS at your ingress / load balancer (or put this behind a reverse proxy like Caddy or Traefik). The container speaks plain HTTP by design.
- **CSP:** the policy allows `'unsafe-inline'` for scripts/styles because the pages use inline styles, an inline JSON-LD block, and one inline form handler. If you externalize those, tighten the policy by dropping `'unsafe-inline'`.

## Kubernetes (if you go that route)

The `/healthz` endpoint is probe-ready:

```yaml
livenessProbe:
  httpGet: { path: /healthz, port: 80 }
  initialDelaySeconds: 5
  periodSeconds: 30
readinessProbe:
  httpGet: { path: /healthz, port: 80 }
  periodSeconds: 10
```
