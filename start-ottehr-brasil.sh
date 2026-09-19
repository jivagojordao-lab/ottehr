#!/usr/bin/env bash
set -e

echo "=================================================="
echo "    Iniciando Ottehr Brasil (Ambiente Local)      "
echo "=================================================="

# 1. Garantir que os arquivos de configuração local existem
mkdir -p packages/zambdas/.env
mkdir -p apps/ehr/env

if [ ! -f packages/zambdas/.env/zambda-secrets-local.json ]; then
  echo "Criando zambda-secrets-local.json..."
  cp config/.env/local.json packages/zambdas/.env/zambda-secrets-local.json 2>/dev/null || cat << 'EOF' > packages/zambdas/.env/zambda-secrets-local.json
{
  "PROJECT_ID": "ottehr-brasil",
  "WEBSITE_URL": "http://localhost:3002",
  "AUTH0_ENDPOINT": "http://localhost:3000/oauth/token",
  "AUTH0_AUDIENCE": "http://localhost:3000",
  "AUTH0_CLIENT": "local-client",
  "AUTH0_SECRET": "local-secret",
  "FHIR_API": "http://localhost:8103/fhir/R4",
  "PROJECT_API": "http://localhost:3000",
  "ENVIRONMENT": "local",
  "ORGANIZATION_ID": "ottehr-brasil-org"
}
EOF
fi

if [ ! -f apps/ehr/env/.env.local ]; then
  echo "Criando apps/ehr/env/.env.local..."
  cat << 'EOF' > apps/ehr/env/.env.local
VITE_APP_NAME="Ottehr Brasil"
VITE_APP_ORGANIZATION_NAME_LONG="Ottehr Saúde Brasil"
VITE_APP_ORGANIZATION_NAME_SHORT="Ottehr Brasil"

PORT=4002
VITE_APP_OYSTEHR_APPLICATION_DOMAIN=localhost:3000
VITE_APP_OYSTEHR_APPLICATION_AUDIENCE=http://localhost:3000
VITE_APP_FHIR_API_URL=/fhir/R4
VITE_APP_PROJECT_API_URL=/local-api
VITE_APP_PROJECT_API_ZAMBDA_URL=/local-api

VITE_APP_ENV=local
VITE_APP_PROJECT_ID=ottehr-brasil
VITE_APP_IS_LOCAL=true
VITE_APP_OYSTEHR_APPLICATION_CLIENT_ID=local-client-id
VITE_APP_OYSTEHR_APPLICATION_REDIRECT_URL=http://localhost:4002/dashboard
VITE_APP_OYSTEHR_APPLICATION_ID=local-app-id
EOF
fi

# 2. Subir o backend Medplum (Postgres + Redis + Medplum Server) caso não esteja rodando
echo ""
echo "[1/3] Verificando servidor FHIR Medplum..."
if ! curl -s http://localhost:8103/healthcheck | grep -q '"ok":true'; then
  echo "Subindo containers do Medplum via Docker..."
  docker compose -f docker-compose.medplum.yml up -d postgres redis medplum-server
  echo "Aguardando o Medplum ficar saudável..."
  for i in {1..30}; do
    if curl -s http://localhost:8103/healthcheck | grep -q '"ok":true'; then
      echo "Medplum Server online e saudável na porta 8103!"
      break
    fi
    sleep 2
  done
else
  echo "Servidor FHIR Medplum já está rodando na porta 8103!"
fi

# 3. Iniciar o backend Express dos Zambdas (porta 3000)
echo ""
echo "[2/3] Iniciando backend ottehr-br-api (porta 3000)..."
ENV=local npx tsx packages/zambdas/src/local-server/index.ts -- secrets=packages/zambdas/.env/zambda-secrets-local.json &
ZAMBDA_PID=$!

# Aguardar a porta 3000 responder
sleep 3

# 4. Iniciar o frontend Ottehr EHR (porta 4002)
echo ""
echo "[3/3] Iniciando frontend Ottehr EHR (porta 4002)..."
cd apps/ehr && ENV=local npx vite --port 4002 --host

# Cleanup ao encerrar
trap "kill $ZAMBDA_PID" EXIT
