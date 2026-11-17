# Hosting

The web app runs on our Contabo server (www.slim-file.com), not Vercel, since 2026-11-17.

- Deploy: `./deploy/deploy.sh` (builds, makes link-preview pages, uploads, goes live)
- Needs `.env.production.local` here (git-ignored, VITE_ settings). Backup on the server:
  `/opt/slimfile-frontend/env.production.local`
- nginx config: `deploy/nginx-slim-file.conf` (installed as `/etc/nginx/sites-available/slim-file-frontend`)
- DNS: Cloudflare. Full server notes: SlimFile-Backend/DEPLOYMENT.md, "Frontend (www.slim-file.com)"
