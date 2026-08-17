#!/bin/sh
set -e

mkdir -p /app/content /app/public/uploads

if [ "$(id -u)" = "0" ]; then
  chown -R nextjs:nodejs /app/content /app/public/uploads || true
  chmod -R ug+rwX /app/content /app/public/uploads || true
  exec su-exec nextjs "$@"
fi

exec "$@"
