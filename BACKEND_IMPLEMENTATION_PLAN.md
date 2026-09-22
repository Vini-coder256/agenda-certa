# Plano de Implementação do Backend — Agenda Certa

**Status:** planejamento aprovado para implementação futura  
**Data:** 2026-09-22  
**Repositório:** `Vini-coder256/agenda-certa`  
**Branch estável:** `main`

Este documento planeja a transformação do snapshot visual v0.2 em um MVP funcional. Ele não cria Supabase, migrations, autenticação, funções ou dependências.

## 1. Objetivo da fase de backend

O objetivo é substituir mocks e estado local por dados reais, mantendo a experiência já validada no protótipo. Ao final da fase, o produto deverá possuir:

- conta real de empreendedor;
- um negócio real por conta no MVP;
- serviços e profissionais persistidos;
- períodos de atendimento e configurações persistidos;
- bloqueios reais, gerais ou por profissional;
- agendamentos online e manuais reais;
- página pública baseada em slug real;
- cancelamento e remarcação seguros pelo cliente;
- isolamento de dados por negócio;
- políticas RLS;
- proteção contra reservas simultâneas;
- teste grátis e assinatura persistidos, ainda que o pagamento seja manual no MVP.

O backend não deve reproduzir cegamente o mock. Cada fluxo deverá migrar para dados reais em fases pequenas, mantendo a `main` estável.

## 2. Stack prevista

- **Supabase Auth:** cadastro, login, sessão e identidade do empreendedor.
- **Supabase Postgres:** dados do produto, integridade relacional, índices e transações.
- **Supabase RLS:** isolamento entre negócios e proteção das tabelas autenticadas.
- **Funções RPC em Postgres:** operações atômicas e sensíveis próximas aos dados, especialmente disponibilidade, criação, cancelamento e remarcação.
- **Edge Functions:** somente quando houver necessidade que não deva ficar em SQL/RPC, como integrações externas, rate limit adicional ou uso seguro de segredos.
- **Frontend atual:** migração gradual de mocks para consultas reais, rota por rota.

Nenhuma dependência será adicionada durante o planejamento. A escolha e a configuração do cliente Supabase pertencem à primeira branch de implementação.

## 3. Princípios técnicos

- GitHub e documentação oficial continuam sendo a fonte da verdade.
- `main` permanece estável e conectada ao Lovable.
- Alterações de backend entram por branch e revisão.
- O frontend nunca recebe `service_role`.
- O cliente público não grava diretamente em tabelas sensíveis.
- Preço, duração, status e término do atendimento são derivados no servidor.
- Datas persistidas usam UTC; regras de agenda são calculadas no timezone do negócio.
- Histórico de serviço, profissional e agendamento é preservado.
- Disponibilidade mostrada no frontend é informativa; a criação sempre revalida no banco.
- Uma conta corresponde a um negócio no MVP, sem impedir evolução futura.

## 4. Modelo de dados inicial

### 4.1 `profiles`

Complementa `auth.users`.

Campos principais:

- `id uuid primary key references auth.users(id)`;
- `full_name text not null`;
- `phone text`;
- `role text not null default 'entrepreneur'`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

`role` aceita `entrepreneur` e `admin`. O usuário comum não pode promover a si próprio.

### 4.2 `businesses`

Campos principais:

- `id uuid primary key`;
- `owner_id uuid not null references profiles(id)`;
- `name text not null`;
- `slug text not null`;
- `category text`;
- `description text`;
- `phone text`;
- `address text`;
- `logo_url text`;
- `timezone text not null default 'America/Sao_Paulo'`;
- `late_tolerance_minutes integer not null default 15`;
- `status text not null default 'active'`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Restrições:

- `slug` único sem diferença entre maiúsculas e minúsculas;
- um negócio por `owner_id` no MVP;
- tolerância entre 5 e 60 minutos;
- status do negócio: `active`, `paused` ou `blocked`.

Decisão inicial: timezone e tolerância ficam em `businesses`. Uma tabela `business_settings` só deverá ser criada quando existirem configurações numerosas, opcionais ou com ciclo de vida próprio.

### 4.3 `business_hours`

Cada linha representa um período do dia.

Campos principais:

- `id uuid primary key`;
- `business_id uuid not null`;
- `weekday smallint not null` entre 0 e 6;
- `opens_at time not null`;
- `closes_at time not null`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Um dia fechado não possui período ativo. Mais de uma linha no mesmo dia permite almoço e outras pausas. Períodos do mesmo negócio e dia não devem se sobrepor.

### 4.4 `services`

Campos principais:

- `id uuid primary key`;
- `business_id uuid not null`;
- `name text not null`;
- `description text`;
- `price_cents integer not null`;
- `duration_minutes integer not null`;
- `is_active boolean not null default true`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Preço e duração são positivos. Serviço com histórico é desativado, não apagado.

### 4.5 `professionals`

Campos principais:

- `id uuid primary key`;
- `business_id uuid not null`;
- `name text not null`;
- `photo_url text`;
- `is_active boolean not null default true`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Profissional não possui login no MVP. Todo agendamento deve ter `professional_id`.

### 4.6 `professional_services`

Campos principais:

- `professional_id uuid not null`;
- `service_id uuid not null`;
- `business_id uuid not null`;
- `created_at timestamptz`.

Chave única em `(professional_id, service_id)`. O `business_id` ajuda RLS e validações, mas deve ser garantido que profissional e serviço pertençam ao mesmo negócio.

### 4.7 `appointments`

Campos principais:

- `id uuid primary key`;
- `business_id uuid not null`;
- `service_id uuid not null`;
- `professional_id uuid not null`;
- `client_name text not null`;
- `client_phone text not null`;
- `start_at timestamptz not null`;
- `end_at timestamptz not null`;
- `price_cents integer not null`;
- `duration_minutes integer not null`;
- `source text not null`;
- `status text not null default 'scheduled'`;
- `notes text`;
- `manage_code text not null`;
- `manage_token_hash text not null`;
- `cancelled_at timestamptz`;
- `rescheduled_from_appointment_id uuid`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Valores permitidos:

- `source`: `online` ou `manual`;
- `status`: `scheduled`, `completed`, `no_show` ou `cancelled`.

Preço e duração são copiados do serviço validado para preservar o histórico. O token bruto é entregue ao cliente somente na criação; o banco armazena hash. O código amigável não é a única proteção.

### 4.8 `time_blocks`

Campos principais:

- `id uuid primary key`;
- `business_id uuid not null`;
- `professional_id uuid null`;
- `start_at timestamptz not null`;
- `end_at timestamptz not null`;
- `reason text`;
- `created_by uuid not null`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

`professional_id` nulo significa bloqueio de todo o negócio. Quando preenchido, o profissional precisa pertencer ao mesmo negócio.

### 4.9 `subscriptions`

Campos principais:

- `id uuid primary key`;
- `business_id uuid not null unique`;
- `owner_id uuid not null`;
- `status text not null default 'trial'`;
- `plan_name text`;
- `price_cents integer`;
- `trial_started_at timestamptz not null`;
- `trial_ends_at timestamptz not null`;
- `current_period_started_at timestamptz`;
- `current_period_ends_at timestamptz`;
- `last_payment_at timestamptz`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

Status: `trial`, `active`, `past_due`, `paused`, `cancelled` ou `blocked`. Pagamento real e automação financeira ficam fora das primeiras fases; ativação manual pode ser implementada antes.

## 5. Regras financeiras e de status

- ganho previsto: soma de `scheduled` e `completed`;
- ganho real: soma somente de `completed`;
- perda por falta: soma somente de `no_show`;
- `cancelled` não entra nos ganhos e não bloqueia horário;
- `scheduled` continua previsto mesmo após o horário;
- cancelamento registra `cancelled_at`;
- remarcação cancela o registro anterior e cria outro, ligado por `rescheduled_from_appointment_id`.

## 6. Página pública real — `/b/:slug`

A rota deverá consultar uma camada pública mínima, sem expor tabelas completas.

Ordem de decisão:

1. buscar negócio por slug normalizado;
2. se não existir, retornar `business_not_found`;
3. verificar `businesses.status`; pausado ou bloqueado retorna `business_unavailable`;
4. verificar teste e assinatura; teste vencido sem assinatura ativa retorna `subscription_inactive`;
5. carregar serviços ativos; lista vazia retorna `no_active_services`;
6. após escolher serviço, carregar profissionais ativos vinculados; lista vazia retorna `no_active_professionals`;
7. calcular disponibilidade real; lista vazia retorna `no_available_slots`;
8. quando tudo estiver válido, seguir o fluxo normal.

Os estados especiais devem vir de respostas tipadas do backend. O frontend apenas traduz os códigos em mensagens; não deve inferir situação da conta a partir de mocks.

Dados públicos permitidos devem ser mínimos: identidade pública do negócio, serviços ativos, profissionais ativos necessários ao fluxo e slots disponíveis. Clientes, telefones, agenda completa e informações administrativas nunca são públicos.

## 7. Segurança e RLS

### 7.1 Usuário autenticado

- empreendedor lê e altera somente o próprio perfil permitido;
- empreendedor lê e altera somente negócios cujo `owner_id = auth.uid()`;
- tabelas filhas são acessíveis somente quando o `business_id` pertence ao usuário;
- profissional e serviço vinculados devem compartilhar o mesmo negócio;
- ações administrativas exigem `role = 'admin'` validada no servidor;
- campos de papel, assinatura e bloqueio de conta não ficam livremente editáveis pelo empreendedor.

### 7.2 Cliente público

- `anon` não recebe `select`, `insert` ou `update` irrestritos em `appointments`;
- consultas públicas usam views seguras ou RPCs com retorno mínimo;
- criação, cancelamento e remarcação passam por funções seguras;
- preço, duração, negócio, profissional, status e horários são revalidados no servidor;
- código e token dão acesso somente ao agendamento correspondente;
- respostas não revelam se outro telefone ou cliente possui agendamento.

### 7.3 Segredos

- `SUPABASE_SERVICE_ROLE_KEY` nunca vai para o bundle, repositório ou variáveis públicas;
- Edge Functions, quando necessárias, leem segredos somente no ambiente servidor;
- token de gerenciamento é aleatório, comparado por hash e não aparece com o nome técnico na interface;
- logs não devem registrar token, telefone completo ou outros dados pessoais sem necessidade.

## 8. Agendamento real e reservas simultâneas

A criação pública deverá ser uma única operação transacional, preferencialmente uma RPC como `create_public_appointment`.

Fluxo recomendado:

1. receber slug, serviço, profissional, início, nome, telefone e observação;
2. resolver o negócio e verificar status/teste/assinatura;
3. carregar serviço e vínculo profissional–serviço;
4. derivar preço, duração e `end_at` no servidor;
5. converter e validar o horário segundo o timezone do negócio;
6. adquirir lock transacional por profissional e data;
7. verificar períodos, antecedência, horizonte e `time_blocks`;
8. verificar conflitos com agendamentos não cancelados;
9. inserir com status `scheduled`, source `online`, código e hash do token;
10. retornar somente o resumo, código e token/link bruto uma vez.

Proteção recomendada em camadas:

- constraint de intervalo no Postgres para `appointments`, por exemplo exclusão GiST de `professional_id` com `tstzrange(start_at, end_at, '[)')`, aplicável quando `status <> 'cancelled'`;
- extensão `btree_gist` se necessária;
- lock transacional compartilhado pela criação de agendamento e criação de bloqueio;
- nova validação dentro da mesma transação imediatamente antes do insert;
- erro de conflito traduzido para resposta estável, sem detalhes internos.

A constraint protege agendamento contra agendamento. Como `time_blocks` está em outra tabela e pode ser geral ou específico, a RPC também precisa validar bloqueios sob o mesmo lock. Funções que criam bloqueios devem usar a mesma estratégia para não correr contra uma reserva.

## 9. Disponibilidade real

Interface provável da camada de disponibilidade:

- `business_slug` ou `business_id`;
- `service_id`;
- `professional_id` opcional;
- `date` no calendário do negócio.

Saída recomendada: data, profissional e lista de inícios disponíveis; não retornar agenda ocupada.

A função deve:

1. validar negócio, status e assinatura/teste;
2. validar serviço ativo;
3. selecionar profissionais ativos vinculados ao serviço;
4. ler todos os períodos do dia da semana;
5. gerar candidatos em passos de 15 minutos;
6. calcular término com a duração do serviço;
7. descartar candidatos que ultrapassem o período;
8. aplicar antecedência mínima de 1 hora para o mesmo dia;
9. impedir datas além de 30 dias;
10. aplicar timezone do negócio;
11. remover conflitos com `time_blocks` gerais e específicos;
12. remover conflitos com appointments online e manuais não cancelados.

Se `professional_id` não for informado, a função pode retornar slots agrupados por profissional. A página pública continua decidindo se exibe a etapa de profissional conforme a quantidade de profissionais ativos aptos ao serviço.

## 10. Gerenciamento público do agendamento

- consulta por link usa token bruto e comparação segura com `manage_token_hash`;
- consulta por código e telefone usa resposta genérica para evitar enumeração;
- cancelamento e remarcação validam o limite de 1 hora no timezone do negócio;
- cancelamento muda status e registra `cancelled_at`;
- remarcação ocorre em transação: valida novo slot, cancela o antigo e cria o novo;
- falha em qualquer etapa desfaz toda a operação;
- telefone e dados pessoais retornam somente quando a credencial de gerenciamento for válida.

## 11. Estratégia de implementação em fases

### Fase 1 — Fundação Supabase

- **Objetivo:** criar projeto/ambiente autorizado, cliente Supabase e variáveis de ambiente.
- **Arquivos prováveis:** `.env.example`, módulo de cliente para browser/servidor e documentação de configuração.
- **Riscos:** expor service role, misturar ambientes ou quebrar SSR.
- **Critério de pronto:** cliente conecta ao ambiente de desenvolvimento sem segredos públicos indevidos; build passa.
- **Não fazer ainda:** tabelas de produto, auth visual, migração de mocks ou Edge Functions.

### Fase 2 — Migrations iniciais

- **Objetivo:** criar extensões, enums/checks, tabelas, FKs, índices e triggers de `updated_at`.
- **Arquivos prováveis:** diretório oficial de migrations do Supabase e documentação de schema.
- **Riscos:** migrations não idempotentes, relações cross-business e exclusão destrutiva.
- **Critério de pronto:** banco vazio sobe do zero e testes SQL confirmam constraints básicas.
- **Não fazer ainda:** conectar telas ou liberar acesso público.

### Fase 3 — Auth real e profiles

- **Objetivo:** cadastro, login, sessão e criação segura do perfil.
- **Arquivos prováveis:** adaptadores Supabase, rotas de cadastro/login e guards do painel.
- **Riscos:** sessão SSR incorreta, enumeração de usuários e promoção indevida a admin.
- **Critério de pronto:** empreendedor cria conta, entra, sai e acessa somente o próprio perfil.
- **Não fazer ainda:** página pública gravando appointments ou pagamento.

### Fase 4 — Onboarding e negócio

- **Objetivo:** persistir profile, business, slug, timezone, tolerância e assinatura trial.
- **Arquivos prováveis:** serviço de onboarding, formulários existentes e operação transacional/RPC.
- **Riscos:** criação parcial, slug concorrente e mais de um negócio por conta no MVP.
- **Critério de pronto:** onboarding cria exatamente um negócio e trial de 15 dias, podendo ser retomado com segurança.
- **Não fazer ainda:** disponibilidade e agendamento público.

### Fase 5 — Catálogos e configurações

- **Objetivo:** persistir serviços, profissionais, vínculos, períodos e configurações.
- **Arquivos prováveis:** repositórios/queries e telas de Serviços, Profissionais e Configurações.
- **Riscos:** apagar histórico, cruzar negócios e aceitar períodos sobrepostos.
- **Critério de pronto:** CRUD autenticado respeita RLS; desativação preserva históricos; múltiplos períodos persistem.
- **Não fazer ainda:** escrita pública ou pagamentos.

### Fase 6 — Leitura pública real

- **Objetivo:** fazer `/b/:slug` ler identidade, serviços e profissionais reais e exibir estados especiais.
- **Arquivos prováveis:** loader/server function da rota pública e RPC/view pública mínima.
- **Riscos:** vazamento de agenda/clientes, cache incorreto e enumeração de contas bloqueadas.
- **Critério de pronto:** estados de slug, negócio, assinatura, serviços e profissionais vêm do backend e nenhum dado privado é exposto.
- **Não fazer ainda:** insert direto pelo frontend.

### Fase 7 — Disponibilidade e agendamento real

- **Objetivo:** calcular slots e criar agendamentos por função segura e transacional.
- **Arquivos prováveis:** migrations de RPC/constraints, camada server e adaptação da página pública.
- **Riscos:** reservas simultâneas, timezone, preço adulterado e conflito com bloqueios.
- **Critério de pronto:** testes concorrentes não criam sobreposição; preço/duração/status vêm do servidor; disponibilidade respeita todas as regras.
- **Não fazer ainda:** WhatsApp automático ou integrações externas.

### Fase 8 — Painel, status e ganhos

- **Objetivo:** trocar agenda e dashboard mockados por consultas reais e ações autorizadas.
- **Arquivos prováveis:** queries do painel, ações de status, componentes de agenda e cálculo agregado.
- **Riscos:** métricas divergentes, filtros caros e edição além dos campos permitidos.
- **Critério de pronto:** agenda, filtros, edição básica e fórmulas de ganhos usam dados reais e RLS.
- **Não fazer ainda:** relatórios avançados.

### Fase 9 — Bloqueios reais

- **Objetivo:** persistir bloqueios gerais e por profissional e incorporá-los à disponibilidade.
- **Arquivos prováveis:** RPCs de `time_blocks`, Agenda e testes de concorrência.
- **Riscos:** corrida entre bloqueio e reserva, intervalos inválidos e bloqueio de outro negócio.
- **Critério de pronto:** novo bloqueio impede reservas conflitantes sem afetar outros profissionais indevidamente.
- **Não fazer ainda:** horários individuais recorrentes por profissional.

### Fase 10 — Admin, assinatura e pagamento

- **Objetivo:** admin mínimo, estados de conta, ativação manual e preparação para cobrança futura.
- **Arquivos prováveis:** rotas protegidas de admin, políticas administrativas e operações de assinatura.
- **Riscos:** escalada de privilégio, bloqueio indevido e automação financeira prematura.
- **Critério de pronto:** admin autorizado vê contas e pode ativar, pausar ou bloquear; teste vencido aplica regras oficiais.
- **Não fazer ainda:** pagamento automático até decisão e planejamento específicos.

## 12. Testes obrigatórios por fase

- migrations aplicam em banco vazio e em ambiente já migrado;
- testes de RLS usam pelo menos dois negócios e confirmam isolamento;
- testes de autorização cobrem empreendedor, anônimo e admin;
- testes de disponibilidade cobrem múltiplos períodos, duração, fechamento, timezone e 30 dias;
- testes concorrentes tentam reservar o mesmo profissional e intervalo;
- testes de bloqueio cobrem negócio inteiro e profissional específico;
- testes de cancelamento confirmam liberação do horário;
- testes de remarcação confirmam atomicidade;
- testes de trial/assinatura cobrem página pública e painel;
- build, TypeScript e lint dos arquivos alterados passam antes de cada PR.

## 13. Estratégia Git

- `main`: branch estável, sincronizada com o Lovable; não desenvolver a fundação diretamente nela.
- primeira branch sugerida: `backend/supabase-foundation`.
- cada fase relevante deve usar branch curta e PR revisável.
- migrations publicadas nunca devem ser reescritas; correções entram em novas migrations.
- não usar force push, rebase, amend ou squash em commits já publicados.
- revisar diff, segurança, RLS, migration e plano de rollback antes do merge.
- fazer merge normal somente após critérios de pronto e testes da fase.

## 14. Decisões antes da primeira implementação

Antes de criar a branch de fundação, confirmar:

1. projeto Supabase e ambientes de desenvolvimento/produção;
2. convenção de variáveis públicas e privadas;
3. execução de Supabase com SSR no stack atual;
4. estratégia final de geração e hash do token;
5. estratégia de rate limit da criação pública;
6. mecanismo de lock e exclusão GiST em ambiente Supabase;
7. política de backup e rollback de migrations;
8. quais estados de assinatura serão administrados manualmente primeiro.

## 15. Fora desta etapa de planejamento

- criar projeto Supabase;
- instalar cliente ou CLI;
- adicionar variáveis de ambiente;
- criar migration;
- alterar tela ou rota;
- implementar Auth;
- criar RPC ou Edge Function;
- criar pagamento;
- migrar dados fictícios;
- modificar configuração do Lovable.

## 16. Primeiro passo recomendado

Criar a branch `backend/supabase-foundation` a partir da `main` atual e executar somente a Fase 1 em uma tarefa separada, após confirmação do ambiente Supabase e da estratégia de segredos. A primeira PR deve ser pequena, sem migrations de produto e sem migração de telas.
