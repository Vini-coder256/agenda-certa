# Agenda Certa

Micro SaaS de agendamentos para microempreendedores e pequenos negócios que trabalham com horário marcado.

## Objetivo

O Agenda Certa permite que cada empreendedor configure seu negócio, serviços, profissionais e períodos de atendimento e divulgue um link público próprio para receber agendamentos.

O produto não é marketplace. Cada negócio possui sua própria página pública.

## Sobre este repositório

Este é o repositório principal atual do projeto, `Vini-coder256/agenda-certa`, e contém:

- o protótipo visual e o código gerado/sincronizado pelo Lovable;
- a documentação oficial do produto Agenda Certa;
- o histórico do antigo repositório documental, agora preservado em `Vini-coder256/agenda-certa-docs-backup`;
- dados fictícios usados para validar fluxos e telas.

A branch `main` é a versão principal do projeto e deve manter código e documentação juntos. Branches de trabalho podem ser usadas como etapa segura, sem reescrever o histórico publicado.

## Estado atual

- O protótipo visual é navegável.
- A Barbearia do Zé é apenas uma demonstração fictícia.
- Ainda não existe backend real.
- O Supabase ainda não está conectado.
- Agendamentos e buscas usam dados fictícios.
- Pagamentos e integrações externas ainda não foram implementados.

## Funcionalidades representadas no protótipo

- landing page, cadastro e login;
- onboarding do negócio;
- serviços e profissionais;
- múltiplos períodos de atendimento;
- página pública do cliente;
- confirmação e gerenciamento de agendamento;
- cancelamento e remarcação;
- painel do empreendedor;
- teste grátis e assinatura em modo visual.

## Documentação principal

- `PROJECT_CONTEXT.md`: contexto e decisões oficiais;
- `MVP_SCOPE.md`: escopo da primeira versão;
- `SCREEN_FLOW.md`: telas, rotas e estados;
- `DATABASE_PLAN.md`: planejamento dos dados e restrições;
- `AGENTS.md`: instruções do Lovable e regras oficiais para agentes;
- `LOVABLE_NEXT_PROMPT.md`: próximos passos sugeridos para o protótipo;
- `DEVELOPMENT_LOG.md`: histórico de decisões e avanços.

## Integração com Lovable

Este projeto foi construído com [Lovable](https://lovable.dev).

Continue o desenvolvimento no [editor do Lovable](https://lovable.dev/projects/1361dbac-cdf6-4474-8840-7060087e6ef5).

- Alterações feitas no Lovable são commitadas neste repositório.
- Commits enviados à branch conectada aparecem no editor do Lovable.
- Não faça force push nem reescreva commits já publicados.
- Mantenha a branch conectada em estado funcional.

## Desenvolvimento local

Para trabalhar localmente, é necessário Node.js e npm.

```sh
git clone <this-repository-url>
cd agenda-certa
npm i
npm run dev
```

Antes de alterar o projeto, leia `AGENTS.md` e os documentos oficiais.