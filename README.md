# DevTrack

Uma aplicação Next.js (App Router) focada em produtividade para desenvolvedores: análises de repositórios, geradores de currículo/portfólio e utilitários que combinam Firebase e OpenAI.

---

<p align="center">
	<img src="https://img.shields.io/badge/status-development-yellow?style=for-the-badge" alt="Status" />
	<img src="https://img.shields.io/badge/license-Unspecified-lightgrey?style=for-the-badge" alt="License" />
	<img src="https://img.shields.io/badge/platform-Web-blue?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Platforms" />
</p>

---

## Tecnologias / Tech Stack

<p align="center">
	<img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next-dot-js&logoColor=white" alt="Next.js" />
	<img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
	<img src="https://img.shields.io/badge/Firebase-Auth-FFA000?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
	<img src="https://img.shields.io/badge/OpenAI-API-111827?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
	<img src="https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
	<img src="https://img.shields.io/badge/Zustand-5.x-8B5CF6?style=for-the-badge" alt="Zustand" />
</p>

---

## Visão rápida

- Objetivo: ajudar desenvolvedores a resumir, avaliar e gerar artefatos (currículo, portfólio) automatizados com apoio de IA.
- Público-alvo: devs que querem melhorar apresentação profissional e análise de projetos.

---

## Principais funcionalidades

- Painel com métricas e análises de projetos
- Integração com Firebase para autenticação
- Integrações com OpenAI para geração/avaliação de conteúdo
- Geradores de currículo, portfólio e análises de entrevistas
- Páginas públicas e áreas premium (ex.: pagamento/assinatura)

## Estrutura principal

Resumo das pastas mais importantes:

- `src/app/` - rotas e views da aplicação
- `src/services/` - integrações (Firebase, OpenAI)
- `src/lib/` - utilitários
- `src/context/` - providers (ex.: autenticação)
- `src/assets/` e `src/components/` - UI

Arquivos úteis:

- [package.json](package.json#L1)
- [src/app/page.tsx](src/app/page.tsx#L1)
- [src/services/firebase.js](src/services/firebase.js#L1)
- [src/services/openai.ts](src/services/openai.ts#L1)

## Scripts úteis

```bash
npm run dev    # roda a aplicação em desenvolvimento
npm run build  # gera build de produção
npm run start  # inicia a versão de produção
npm run lint   # verifica lint
```

## Como rodar localmente

1. Instale dependências

```bash
npm install
```

2. Configure variáveis de ambiente (`.env.local`) conforme seção acima.

3. Rode em modo desenvolvimento

```bash
npm run dev
```

4. Abra http://localhost:3000

## Deploy

Recomendado: Vercel (integração com Next.js). Configure as mesmas variáveis de ambiente na plataforma de hospedagem.

## Contribuição

- Abra uma issue para sugerir mudanças ou relatar bugs
- Envie PRs com descrições claras e referências às issues

## Licença

Este repositório utiliza a licença padrão do projeto — adicione ou atualize conforme necessário.

---

Desenvolvido com ❤️ por João Pedro Ribeiro
