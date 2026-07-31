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
2. This package includes the current backend `.env` copied from `mp-dashboard/.env`. Review every value before upload and replace any local or development credentials with production values. If you prefer to configure it manually, use `.env.example` as the template.
3. Generate an application key if one is not already present: `php artisan key:generate --force`.
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

## Verification

- Open `https://mpportaldashboard.focuswebmedia.in/` and confirm Laravel responds.
- Check an API endpoint under `https://mpportaldashboard.focuswebmedia.in/api`.
- Confirm login, authenticated API requests, uploads, and authorized downloads.
- Confirm the frontend GitHub deployment uses `VITE_API_URL=https://mpportaldashboard.focuswebmedia.in/api` and contains no localhost URL.

## Operations

Configure the scheduler cron and queue worker only if the selected production queue driver requires them. Back up PostgreSQL and the `storage/app` directory before migrations or releases. Restart PHP-FPM/OPcache from hPanel after deploying new PHP code.
