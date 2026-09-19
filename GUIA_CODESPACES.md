# Guia Prático: Subindo o Ottehr Brasil no GitHub Codespaces

O **GitHub Codespaces** oferece um ambiente Linux completo na nuvem, com **60 horas mensais gratuitas**, sem consumir nada do seu computador e sem exigir cadastro de cartão de crédito.

---

## Passo 1: Fazer o Fork do Ottehr no GitHub

1. Acesse o repositório original do Ottehr: **[https://github.com/masslight/ottehr](https://github.com/masslight/ottehr)**
2. No canto superior direito, clique no botão **Fork**.
3. Escolha a sua conta pessoal e defina o nome do repositório (ex: `ottehr` ou `ottehr-brasil`).
4. Clique em **Create fork**.

---

## Passo 2: Iniciar o Codespace

1. Na página do seu repositório recém-criado (o fork), clique no botão verde **`<> Code`**.
2. Clique na aba **Codespaces**.
3. Clique em **Create codespace on main**.
4. O GitHub vai preparar o ambiente e abrir um **VS Code completo diretamente no seu navegador**.

---

## Passo 3: Subir a Infraestrutura (Medplum + PostgreSQL + Redis)

Dentro do terminal do Codespaces, faça o seguinte:

1. Baixe o arquivo de docker-compose que preparamos:
   ```bash
   curl -O https://raw.githubusercontent.com/... # ou copie o conteúdo de docker-compose.medplum.yml
   ```
   *(Ou se já tiver commitado esses arquivos no seu fork, eles já estarão lá).*

2. Suba os containers do Medplum:
   ```bash
   docker compose -f docker-compose.medplum.yml up -d
   ```

3. Verifique se os 3 containers estão saudáveis:
   ```bash
   docker compose -f docker-compose.medplum.yml ps
   ```

4. Acesse o **Medplum Server** na porta `8103`:
   * O Codespaces exibirá uma notificação informando que a porta `8103` foi encaminhada.
   * Você pode abrir o link no navegador para testar a API FHIR R4 (`/fhir/R4/metadata`).

---

## Passo 4: Próximo Teste Técnico

Com o Medplum ativo no Codespace:
1. Criaremos um projeto local de teste no Medplum (`Ottehr Teste`).
2. Adaptaremos o primeiro Zambda (`packages/zambdas/src/ehr/search-patients`) para consultar o Medplum em vez do Oystehr.
