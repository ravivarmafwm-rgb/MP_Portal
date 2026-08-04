# Hostinger Deployment Guide

## Package layout

Upload the **contents** of `deployment-output/backend-public-html/` directly into the domain's `public_html` directory. The package is intentionally flattened: `index.php`, `app/`, `bootstrap/`, `vendor/`, and the Laravel configuration are all siblings. No parent-directory path or external Laravel folder is required.

The React frontend is deployed from GitHub. Run the frontend build in CI/GitHub; no frontend deployment artifact is included here.

## Server prerequisites

- PHP version compatible with `composer.json` (PHP 8.3+ recommended for this Laravel 13 application).
- PostgreSQL extension (`pdo_pgsql`) and the extensions listed in `SECURITY-ACTIONS.txt`.
- HTTPS enabled for `mpportaldashboard.focuswebmedia.in`.
- Composer 2.x only when installing/updating dependencies on the host.

## Upload and configuration

1. Back up the current site, then upload all files from `backend-public-html/` into `/home/USERNAME/domains/mpportaldashboard.focuswebmedia.in/public_html/` (use the actual Hostinger path shown in hPanel).
2. This emergency upload archive includes `.env` because the current Laravel runtime requires the verified production configuration. Upload it only over a secure channel, confirm restrictive permissions, and never expose it in tickets or commit it. If you create it manually instead, use `.env.example` and the same production values.
3. Set `APP_ENV=production`, `APP_DEBUG=false`, the production `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS` and `CORS_ALLOWED_ORIGINS`. Generate an application key if one is not already present: `php artisan key:generate --force`.
4. Ensure `storage/` and `bootstrap/cache/` are writable by PHP. This package includes the Laravel storage tree and does not require a symlink.
5. The public storage fallback is merged into `storage/app/public`; uploaded files should be served through the application's authorized document endpoints rather than exposing the storage directory.

## Optional host commands

From the uploaded directory, if SSH/Terminal is available:

```text
composer install --no-dev --optimize-autoloader
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

If SSH is unavailable, upload the included `vendor/` directory and use hPanel's PHP/cron configuration. Do not enable debug mode in production.

## Clean replacement and recovery

Do not extract this archive over a partially old release. Back up the current `.env` and `storage/app`, rename the existing `public_html` directory to a dated backup when hPanel permits, create an empty `public_html`, and extract the archive contents directly into it. If renaming is unavailable, remove the old application files (including hidden files) after backup, preserving only the domain's required `.well-known` directory.

After replacement, clear stale Laravel state:

```text
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Login is intentionally limited to five attempts per minute per email/IP, and registration to five attempts per hour per IP. A `429 Too Many Requests` response means the limiter fired; wait for the window to expire or run `php artisan cache:clear`. Do not disable throttling or add a public cache-reset script.

## Verification

- Open `https://mpportaldashboard.focuswebmedia.in/` and confirm Laravel responds.
- Check an API endpoint under `https://mpportaldashboard.focuswebmedia.in/api`.
- Confirm login, authenticated API requests, uploads, and authorized downloads.
- Confirm the frontend GitHub deployment uses `VITE_API_URL=https://mpportaldashboard.focuswebmedia.in/api` and contains no localhost URL.
- Confirm that requesting `/.env`, `/composer.json`, `/artisan` and `/storage/` is denied by the production `.htaccess`.

## Operations

Configure the scheduler cron and queue worker only if the selected production queue driver requires them. Back up PostgreSQL and the `storage/app` directory before migrations or releases. Restart PHP-FPM/OPcache from hPanel after deploying new PHP code.
