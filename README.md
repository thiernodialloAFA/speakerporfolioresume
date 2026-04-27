# speakerporfolioresume

Speaker portfolio & resume for Thierno Diallo — built with **React + Vite +
TypeScript + Tailwind CSS** and a Zustand store.

The app ships as a fully static React frontend, so it can be deployed both
to **GitHub Pages** (directly from this repository) and to any other React
frontend host (Netlify, Vercel, S3 + CloudFront, …).

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # outputs to ./dist
npm run preview
```

## Configuration (env vars)

Copy `.env.example` to `.env` and adjust as needed. All variables are
**build-time** (Vite inlines them into the bundle).

| Variable                   | Purpose                                                                                  | Default                |
| -------------------------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| `VITE_ADMIN_EMAIL`         | Email accepted by the `/login` page. Overrides `src/data/auth.json`.                     | `admin@portfolio.com`  |
| `VITE_ADMIN_PASSWORD`      | Plain-text password. Overrides the hash in `src/data/auth.json` (hashed at runtime).     | *(unset)*              |
| `VITE_ADMIN_PASSWORD_HASH` | SHA-256 hex digest of the admin password. Overrides `src/data/auth.json`.                | *(unset)*              |
| `VITE_BASE_PATH`           | Public base path the app is served from. Use `/` for site-root, `/<repo>/` for GH Pages. | `/`                    |

The admin password lives in
[`src/data/auth.json`](src/data/auth.json) as a SHA-256 hash and can be changed
**from the page itself** (see "Admin password" below); env vars are only
needed when you want to override the bundled defaults from CI.

Example for a production build deployed at the site root with a
CI-provided password hash (so the plain text never enters the build env):

```bash
VITE_ADMIN_EMAIL=me@example.com \
VITE_ADMIN_PASSWORD_HASH=$(printf '%s' 'a-strong-secret' | sha256sum | cut -d' ' -f1) \
VITE_BASE_PATH=/ \
npm run build
```

> The credentials live entirely in the static bundle, so anyone with the
> built JS can read the email and the password hash. Use a strong password.

## Persistence — pushable on git

Portfolio content (profile, speaking experiences, professional experiences,
certifications) is stored as a **JSON file committed to the repository**:

```
src/data/portfolio.json
```

This is the single source of truth that ships with every build, so any
update pushed to git is immediately reflected for every visitor.

### Editing workflow

1. Sign in at `/login` with the admin credentials.
2. Edit content via the admin pages (Profile / Speaking / Professional /
   Certifications). Changes are kept in the browser only.
3. Open the **Admin Dashboard** (`/admin`) and click **Export JSON** —
   `portfolio.json` is downloaded.
4. Replace `src/data/portfolio.json` with the downloaded file.
5. Commit and push:

   ```bash
   git add src/data/portfolio.json
   git commit -m "content: update portfolio"
   git push
   ```

6. The GitHub Pages workflow rebuilds and redeploys automatically.

The dashboard also exposes **Import JSON** (load a `portfolio.json` from
disk) and **Reset to portfolio.json** (discard local edits).

### Admin password — set / reset / update online

The admin password follows the same git-based persistence model as the
portfolio content. It lives in [`src/data/auth.json`](src/data/auth.json),
stored only as a **SHA-256 hash** (never plain text).

After signing in, open **Dashboard → Change Password** (`/admin/password`)
to:

1. **Set / update the password** — enter the current password plus a new
   one. The new hash is saved in your browser and used immediately for
   future logins on this device.
2. **Export `auth.json`** — downloads the new hash. Replace
   `src/data/auth.json` with it, then commit and push:

   ```bash
   git add src/data/auth.json
   git commit -m "chore: rotate admin password"
   git push
   ```

   The next deployment will use the new password for every visitor.
3. **Import `auth.json`** — load a previously exported file (useful when
   restoring a password on a fresh browser).
4. **Reset to `auth.json`** — discard the local override and fall back to
   the hash bundled in this deployment.

If you forget the password and have nothing saved in your browser, the
`/login` page also has a **"Forgot password? Reset to the default bundled
with this deployment"** link that performs the same reset before you sign
in.

## Deployment

### GitHub Pages (deploy from this repository)

A workflow is provided at `.github/workflows/deploy.yml`. It builds the app
on every push to `main` and publishes it to GitHub Pages.

Setup, once per repository:

1. **Settings → Pages → Build and deployment → Source = GitHub Actions.**
2. *(Optional)* **Settings → Secrets and variables → Actions** and add
   `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD_HASH` (or
   `VITE_ADMIN_PASSWORD`) to override the bundled credentials at build
   time. If the secrets are not set, the values from
   `src/data/auth.json` are used — and those can be rotated online from
   the `/admin/password` page (export → commit → push).
3. Push to `main` — the site is published at
   `https://<your-user>.github.io/speakerporfolioresume/`.

The workflow automatically sets `VITE_BASE_PATH` to the repository name so
asset URLs resolve correctly under the GitHub Pages subpath. A
`public/404.html` SPA fallback is included so deep links and refreshes
work on GitHub Pages too.

### Generic React frontend deploy (Netlify / Vercel / static host)

Build once with `VITE_BASE_PATH=/` (the default) and serve the contents
of `dist/`:

```bash
VITE_BASE_PATH=/ \
VITE_ADMIN_EMAIL=...@example.com \
VITE_ADMIN_PASSWORD='...' \
npm ci && npm run build
# then deploy ./dist to your host
```

For SPA routing on these hosts, configure a fallback to `index.html`
(Netlify: `_redirects` with `/* /index.html 200`; Vercel: rewrites; nginx:
`try_files $uri /index.html;`).
