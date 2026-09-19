# 🎨 Guia de Personalização Visual da Clínica (Branding)

O **Ottehr Brasil** foi projetado para facilitar a customização completa da identidade visual de qualquer clínica médica, consultório ou hospital em menos de 1 minuto, sem necessidade de alterar dezenas de arquivos de código.

---

## ⚡ Como Alterar o Nome, Cores e Logotipo

O ponto central de configuração está localizado em:
📂 `apps/ehr/src/constants/clinicBranding.ts`

```typescript
export const CLINIC_BRANDING = {
  // 1. Nome e Subtítulo exibidos na barra superior e títulos
  name: 'Alliance Centro Médico',
  shortName: 'Alliance',
  subtitle: 'Centro Médico',

  // 2. Cores Institucionais da Clínica (HEX)
  primaryColor: '#1877F2',   // Cor principal dos botões, barra e destaques
  primaryHover: '#0D5BBD',   // Cor ao passar o mouse (hover)
  primaryLight: '#E8F2FD',   // Fundo suave de cards e avisos
  primaryDark:  '#0B4A9E',   // Tom escuro de contraste

  // 3. Logotipo da Clínica
  // Deixe vazio '' para usar o logotipo vetorial padrão com brasão de saúde,
  // ou informe o caminho de uma imagem (ex: '/logo.png', '/logo.svg')
  logoUrl: '',
};
```

---

## 🖼️ Como Alterar o Logotipo

Você tem **duas opções simples**:

### Opção A: Inserir a imagem da sua clínica
1. Salve o arquivo do logotipo da sua clínica (formato PNG transparente ou SVG) na pasta:
   `apps/ehr/public/logo.png`
2. No arquivo `clinicBranding.ts`, defina:
   ```typescript
   logoUrl: '/logo.png',
   ```
3. O sistema carregará automaticamente sua imagem na barra de navegação com ajuste responsivo de altura.

### Opção B: Logotipo Vetorial Automático (Sem necessidade de arquivo de imagem)
- Se `logoUrl` estiver vazio (`''`), o componente inteligente `<ClinicLogo />` renderiza automaticamente um brasão médico estilizado em alta definição acompanhado da tipografia profissional com o nome da sua clínica:
  - **Ícone**: Cruz médica em relevo com cantos arredondados e a cor primária institucional (`#1877F2`).
  - **Texto Principal**: Nome da clínica (ex: **Alliance**).
  - **Subtítulo**: Categoria (ex: **CENTRO MÉDICO**).

---

## 🎯 Configuração via Variáveis de Ambiente (Docker / Produção)

Caso você suba a aplicação em contêineres Docker, também pode personalizar tudo diretamente no arquivo `.env` sem mexer em código-fonte:

```env
# Nome e Identidade da Clínica
VITE_APP_CLINIC_NAME="Alliance Centro Médico"
VITE_APP_ORGANIZATION_NAME_SHORT="Alliance"

# Cor Primária da Interface
VITE_APP_PRIMARY_COLOR="#1877F2"

# Caminho ou URL do Logotipo
VITE_APP_LOGO_URL="/logo.png"
```

---

## 🌈 Onde as Cores e o Nome se Aplicam Automaticamente:
- **Barra Superior (Navbar)**: Logo e identificação institucional.
- **Aba do Navegador (`document.title`)**: Título dinâmico de cada tela (`Atendimentos | Alliance Centro Médico`).
- **Botões e Ações (`Primary Buttons`)**: Botões principais, status e seletores Material-UI.
- **Telas de Atendimento Clínico**: Identificação do profissional e clínica no prontuário.
- **Prescrições e Atestados Memed**: Cabeçalho de emissão de receitas médicas ICP-Brasil.
