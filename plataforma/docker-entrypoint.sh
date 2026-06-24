#!/bin/sh
set -e

echo "→ Aplicando migrations do banco (prisma migrate deploy)…"
npx prisma migrate deploy

if [ "$SEED" = "true" ]; then
  echo "→ Populando dados de demonstração (seed)…"
  npx prisma db seed || echo "Seed falhou ou já executado, seguindo."
fi

echo "→ Iniciando Reportia em http://0.0.0.0:3000"
exec node_modules/.bin/next start -H 0.0.0.0 -p 3000
