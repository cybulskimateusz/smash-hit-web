#!/bin/sh
set -e

if [ -n "$WS_URL" ]; then
  echo "Replacing WS_URL placeholder with: $WS_URL"
  find /app/dist -name '*.js' -exec sed -i "s|__WS_URL_PLACEHOLDER__|${WS_URL}|g" {} +
fi

exec serve -s dist -l 3000
