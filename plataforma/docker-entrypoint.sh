#!/bin/sh
set -e

echo "→ Sincronizando schema do banco (prisma db push)…"
npx prisma db push --skip-generate

if [ "$SEED" = "true" ]; then
  echo "→ Populando dados de demonstração (seed)…"
  npx prisma db seed || echo "Seed falhou ou já executado, seguindo."
fi

echo "→ Iniciando Reportia em http://0.0.0.0:3000"
exec node_modules/.bin/next start -H 0.0.0.0 -p 3000
