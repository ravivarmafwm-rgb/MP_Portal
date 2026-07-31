# Hostinger/cPanel Deployment Guide

This package contains a Laravel backend and a static React frontend. It is prepared for a shared-hosting layout where the Laravel application is private and only `public_html` is web-accessible.

## 1. Upload layout

Create this layout under your hosting account:

```text
/home/USERNAME/
├── mp-dashboard/       # upload deployment-output/backend contents EXCEPT public_html/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   └── artisan
├── public_html/        # upload deployment-output/backend/public_html contents
│   ├── index.php
│   ├── .htaccess
│   └── ...
└── frontend/           # optional separate static host/CDN copy
```

The generated `public_html/index.php` already points to `../mp-dashboard/vendor/autoload.php` and `../mp-dashboard/bootstrap/app.php`. Do not move the Laravel folder after upload without updating those two paths.

## 2. PHP and domain setup

Select PHP 8.3+ in cPanel MultiPHP Manager. Point the domain document root to `/home/USERNAME/public_html`. Enable the PHP extensions listed in `SECURITY-ACTIONS.txt`. Keep `mp-dashboard` outside the public web root.

## 3. Environment

Inside `/home/USERNAME/mp-dashboard/`, copy `.env.example` to `.env` and set production values. At minimum configure `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `APP_KEY`, PostgreSQL credentials, frontend URL/CORS, session/Sanctum domains, queue/cache drivers, storage disk, and provider credentials.

If `APP_KEY` is empty, run `php artisan key:generate --force` once before caching configuration. Never upload a local `.env` or commit production secrets.

## 4. Database and caches

From the Laravel directory run:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
# Optional only when loading approved reference data:
php artisan db:seed --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

If Composer cannot run on the account, this package already includes `vendor`; verify it matches `composer.lock` before deployment.

## 5. Permissions and workers

Set directories to 755 and files to 644. Set `storage/` and `bootstrap/cache/` to 775 (or the hosting provider's equivalent writable mode) for the PHP-FPM user. Configure a cron entry for `php artisan schedule:run` every minute and a Supervisor/cron queue worker if queued jobs are enabled. Restart PHP-FPM after changing PHP settings and run `php artisan queue:restart` after releases.

## 6. Frontend

`deployment-output/frontend/` contains only the Vite production assets. Upload its contents to the static web root or CDN. Configure SPA fallback to `index.html` if the frontend is served from its own domain. Set the production API URL at build time; this artifact contains the already-built URL from the source environment.

## 7. SSL, backups, and validation

Issue an SSL certificate before enabling the optional HTTPS redirect block in `.htaccess`. Confirm `/up`, login, CSRF, API calls, document storage, queue processing, and frontend routing after deployment. Back up PostgreSQL and private storage before migrations and test restoration regularly.
