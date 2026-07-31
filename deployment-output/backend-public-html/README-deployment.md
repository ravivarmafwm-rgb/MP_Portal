# MP Constituency Management System — Laravel Deployment

This directory is a sanitized production Laravel artifact. Point the web server document root to `public/`; do not expose the project root.

1. Copy `.env.example` to a server-managed `.env` and set production secrets, database, URL, CORS, Sanctum, queue, cache, storage, and provider values.
2. Ensure PHP-FPM can write `storage/app`, `storage/framework`, and `bootstrap/cache`.
3. Run migrations during an approved maintenance window: `php artisan migrate --force`.
4. Cache configuration/routes/views: `php artisan optimize:clear`, `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`.
5. Start the queue worker and scheduler described in `../SECURITY-ACTIONS.txt`.
6. Keep private uploads outside the public directory and enforce HTTPS.

This artifact intentionally excludes `.env`, tests, logs, development caches, source maps, editor settings, and Git metadata.
