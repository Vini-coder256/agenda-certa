<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

---

# Instruções Para IAs e Agentes de Código — Agenda Certa

## Organização dos repositórios

- Repositório principal atual: `Vini-coder256/agenda-certa`.
- Backup histórico da documentação: `Vini-coder256/agenda-certa-docs-backup`.
- Código e documentação permanecem juntos na branch `main` do repositório principal.

O GitHub é a fonte oficial da verdade. Antes de qualquer alteração, ler `PROJECT_CONTEXT.md`, `MVP_SCOPE.md`, `SCREEN_FLOW.md`, `DATABASE_PLAN.md`, este arquivo e `DEVELOPMENT_LOG.md`.

## 1. Produto

O Agenda Certa é um Micro SaaS de agendamentos. Não transformar em marketplace. Cada empreendedor divulga `/b/:slug`.

## 2. Usuários e conta

- Cliente: sem login.
- Empreendedor: um negócio por conta no MVP.
- Admin: separado do empreendedor.

Nunca misturar dados entre negócios.

## 3. Não inventar escopo

Não implementar sem autorização:

- marketplace, app nativo ou IA atendente;
- WhatsApp automático;
- pagamento online do serviço ou assinatura automática;
- login, painel ou permissões de profissional;
- comissão, salário ou repasse;
- horários individuais de profissional;
- financeiro completo, estoque ou nota fiscal;
- integrações externas;
- remarcação avançada no painel;
- relatórios e auditoria avançados.

## 4. Serviços e profissionais

- preço e duração positivos;
- desativar em vez de apagar quando houver histórico;
- todo agendamento possui `professional_id`;
- escolha pública depende dos profissionais ativos capazes de realizar o serviço;
- um profissional ocupado não bloqueia os demais.

## 5. Horários e bloqueios

- um ou mais períodos por dia;
- todos os profissionais seguem os períodos gerais;
- timezone padrão `America/Sao_Paulo`;
- passos de 15 minutos;
- antecedência de 1 hora no mesmo dia;
- limite de 30 dias;
- intervalo entre atendimentos de 0 minutos;
- serviço precisa terminar dentro do período;
- bloqueios gerais e por profissional entram no MVP;
- horários indisponíveis não aparecem ao cliente.

## 6. Agendamentos

- fontes: `online`, `manual`;
- status: `scheduled`, `completed`, `no_show`, `cancelled`;
- cliente não define preço, duração ou status;
- validar tudo no servidor/banco antes de salvar;
- impedir sobreposição de forma atômica;
- agendamento cancelado não bloqueia;
- manual bloqueia igual ao online.

## 7. Gerenciamento

- cliente usa código e/ou link seguro sem login;
- UI diz “Código do agendamento” e “Gerenciar meu agendamento”;
- não mostrar a palavra “token” ao cliente;
- cancelar/remarcar até 1 hora antes;
- remarcação = cancelar antigo + criar novo;
- empreendedor só edita nome, WhatsApp e observação.

## 8. Tolerância e ganhos

- tolerância configurável por negócio;
- padrão de 15 minutos quando nada for configurado;
- permitir somente 5, 10, 15, 20 ou 30 minutos no MVP;
- mostrar o valor configurado ao cliente antes da confirmação;
- usar a tolerância apenas para avisos e destaque de atraso;
- não alterar a duração do serviço;
- sem cancelamento automático;
- previsto = `scheduled` + `completed`;
- real = `completed`;
- perda = `no_show`;
- `cancelled` não entra;
- `scheduled` passado continua previsto.

## 9. Teste e assinatura

Status: `trial`, `active`, `past_due`, `paused`, `cancelled`, `blocked`.

Após teste vencido sem assinatura ativa, manter painel e ações em registros existentes, mas impedir novos agendamentos online e manuais.

## 10. Segurança e privacidade

- dados pessoais não são públicos;
- empreendedor vê somente seus clientes;
- criação pública não recebe campos livres de preço, duração ou status;
- links/códigos gerenciam somente o agendamento correspondente;
- nome e WhatsApp obrigatórios com validação básica;
- considerar risco de spam e abuso.

## 11. Admin

Admin mínimo real: ver empreendedores, negócios e assinaturas e ativar, pausar ou bloquear conta. Não mostrar menu admin para usuário comum.

## 12. UX

Priorizar português simples, mobile first, poucos passos, mensagens claras e estados vazios. Incluir os estados especiais definidos em `SCREEN_FLOW.md`.

## 13. Demonstração

A Barbearia do Zé é somente demo. Dados fictícios devem estar identificados e separados dos reais.

## 14. Disciplina de mudança

- Não reescrever tudo sem necessidade.
- Confirmar que a alteração pertence ao MVP.
- Explicar decisões importantes.
- Não conectar Supabase ou criar backend antes de revisar disponibilidade, concorrência, RLS e privacidade.
- Registrar mudanças documentais relevantes em `DEVELOPMENT_LOG.md`.

