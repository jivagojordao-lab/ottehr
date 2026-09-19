# Guia de Implantação e Hospedagem - Ottehr Brasil (R$ 0 / mês)

Este guia orienta como colocar o **Ottehr Brasil** em produção com **custo zero de nuvem (R$ 0/mês)** e total soberania dos dados médicos da sua clínica.

---

## 1. Arquitetura 100% Aberta e Auto-Hospedada

O Ottehr Brasil foi completamente desacoplado dos serviços pagos de nuvem proprietária ($1,000/mês):
- **Caddy 2**: Servidor web e proxy reverso com **emissão automática de certificados SSL/HTTPS gratuitos** (Let's Encrypt / ZeroSSL).
- **Medplum Server**: Servidor open-source padrão internacional **HL7 FHIR R4** para armazenamento e interoperabilidade de prontuários.
- **PostgreSQL 16 & Redis 7**: Armazenamento relacional e cache em memória com persistência local.
- **Local API & Zambdas**: Motor de regras clínicas locais, busca instantânea de **CID-10 em português** e integração com **Memed** (ICP-Brasil).
- **EHR Web App**: Interface médica e administrativa de alta velocidade em React/Vite.

---

## 2. Opções de Hospedagem Recomendadas

### Opção A: Oracle Cloud Free Tier (Recomendada - R$ 0 para sempre)
A Oracle oferece gratuitamente no programa *Always Free*:
- **Instância Ampere ARM**: Até 4 OCPU e 24 GB de memória RAM.
- **Armazenamento**: Até 200 GB de disco SSD gratuito.
- **IP Público**: Endereço IPv4 fixo incluído sem custo adicional.
*Essa configuração é mais que suficiente para atender dezenas de médicos e milhares de pacientes simultâneos.*

### Opção B: Servidor Local na Clínica (On-Premise)
Qualquer computador dedicado na clínica (Windows, Linux ou Mac) com Docker instalado:
- Pode funcionar na rede Wi-Fi/Ethernet interna da clínica (`http://192.168.1.100` ou `localhost`).
- Se desejar acesso externo seguro pela internet sem abrir portas no roteador, basta usar o **Cloudflare Tunnel (gratuito)**.

---

## 3. Passo a Passo de Instalação em Produção

### Pré-requisitos
1. Git
2. Docker e Docker Compose instalados
3. Node.js 20+ (apenas para o build inicial dos arquivos estáticos)

### 1. Clonar o Repositório
```bash
git clone https://github.com/jivagojordao-lab/ottehr.git
cd ottehr
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo de produção:
```bash
cp .env.prod.example .env
```
Abra o `.env` e configure:
- `APP_DOMAIN`: Seu domínio (ex: `prontuario.suaclinica.com.br`) ou `localhost` para testes locais.
- `ACME_EMAIL`: Seu e-mail de contato para o certificado SSL automático.
- `POSTGRES_PASSWORD`: Defina uma senha forte para o banco de dados interno.
- `MEMED_API_KEY`: Sua chave de parceiro Memed (gratuita em https://memed.com.br).

### 3. Gerar a Build do Frontend
```bash
npm install
npm --prefix apps/ehr run build:production
```
*(Os arquivos estáticos serão gerados na pasta `apps/ehr/dist` e servidos em alta velocidade pelo Caddy).*

### 4. Inicializar os Serviços Docker
Execute o comando de inicialização em segundo plano:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 5. Verificar o Status
```bash
docker compose -f docker-compose.prod.yml ps
```
Todos os 5 contêineres deverão estar no status `running` ou `healthy`:
- `ottehr-caddy`
- `ottehr-medplum`
- `ottehr-local-api`
- `ottehr-postgres`
- `ottehr-redis`

---

## 4. Recursos Prontos para Uso

1. **Cadastro de Pacientes**:
   - Validação de CPF (Módulo 11 da Receita Federal).
   - Preenchimento automático de endereço por CEP (BrasilAPI e ViaCEP).
2. **Painel de Atendimentos**:
   - Fila de espera em tempo real ("Sala de Espera" e "Consultórios").
   - Status em português ("Pendente", "Chegou", "Triagem", "Em Consulta", "Alta Concedida").
3. **Atendimento Clínico & CID-10**:
   - Busca instantânea de diagnósticos por código ou descrição em português com sinônimos populares.
   - Registro de sinais vitais no sistema métrico (°C, kg, cm, mmHg) com cálculo de IMC.
4. **Prescrição Memed**:
   - Integração com receituário digital e assinatura eletrônica com certificado digital ICP-Brasil.
   - Histórico de receitas salvas como `DocumentReference` no prontuário FHIR do paciente.

---

## 5. Manutenção e Backups

### Backup do Banco de Dados FHIR
```bash
docker exec -t ottehr-postgres pg_dump -U medplum medplum > backup_ottehr.sql
```

### Restaurar Backup
```bash
cat backup_ottehr.sql | docker exec -i ottehr-postgres psql -U medplum medplum
```