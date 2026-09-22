# Development Log — Agenda Certa

Este arquivo registra atualizações relevantes do projeto. O GitHub é a fonte oficial da verdade.

## 2026-08-17 — Consolidação das decisões do MVP

### Objetivo da sessão

Revisar e atualizar toda a documentação oficial para remover contradições e registrar as regras definitivas do MVP antes de qualquer conexão com Supabase, criação de backend ou migration.

### Decisões documentadas

- Agenda Certa definido como nome oficial/de trabalho do MVP.
- Produto definido como Micro SaaS, não marketplace, com rota pública `/b/:slug`.
- Três tipos de uso: cliente, empreendedor e admin.
- Uma conta de empreendedor corresponde a um negócio no MVP.
- Profissionais incluídos no MVP de forma simples e sempre associados aos agendamentos.
- Escolha de profissional baseada em quem está ativo e realiza o serviço selecionado.
- Múltiplos períodos de atendimento por dia e timezone padrão `America/Sao_Paulo`.
- Bloqueios gerais e por profissional incluídos no MVP.
- Tolerância definida naquela sessão como fixa em 15 minutos, sem cancelamento automático. Esta decisão foi substituída em 2026-08-30.
- Cancelamento e remarcação pelo cliente sem login, até 1 hora antes.
- Código e link seguro para gerenciamento do agendamento.
- WhatsApp automático movido para MVP 1.5 ou posterior.
- Limites da edição de agendamentos pelo empreendedor.
- Status de agendamento e fórmulas de ganhos padronizados.
- Comportamento exato após o fim do teste grátis.
- Status de assinatura padronizados.
- Intervalos de 15 minutos, antecedência de 1 hora e horizonte de 30 dias.
- Estados especiais da página pública.
- Desativação, em vez de exclusão, de serviços e profissionais com histórico.
- Obrigação futura de impedir sobreposição no servidor/banco.
- Validação segura da criação pública de agendamentos.
- Regras básicas de LGPD, privacidade e anti-spam.
- Restrições planejadas do banco e admin mínimo funcional.
- Barbearia do Zé mantida somente como demonstração.

### Arquivos alterados

- `README.md`
- `PROJECT_CONTEXT.md`
- `MVP_SCOPE.md`
- `SCREEN_FLOW.md`
- `DATABASE_PLAN.md`
- `AGENTS.md`
- `LOVABLE_NEXT_PROMPT.md`
- `DEVELOPMENT_LOG.md` criado nesta sessão

### Contradições resolvidas

- nome indefinido versus Agenda Certa;
- dois usuários versus três tipos de uso;
- profissionais fora versus dentro do MVP;
- contagem geral de profissionais versus profissionais capazes de realizar o serviço;
- horários simples versus múltiplos períodos por dia;
- bloqueios opcionais versus obrigatórios no MVP;
- tolerância fixa versus configurável, conforme a decisão vigente naquela sessão; regra substituída em 2026-08-30;
- admin opcional versus admin mínimo funcional;
- estados divergentes de assinatura;
- fórmula ambígua de ganho previsto;
- remarcação por edição versus cancelamento mais novo agendamento;
- comportamento indefinido após o teste grátis;
- rota pública divergente;
- exclusão versus preservação de histórico.

### Próximos passos recomendados

1. Revisar a documentação consolidada com o responsável pelo produto.
2. Atualizar o protótipo visual conforme `LOVABLE_NEXT_PROMPT.md`.
3. Antes do Supabase, desenhar as políticas de RLS e o fluxo seguro de criação pública.
4. Definir a estratégia atômica contra sobreposição de horários.
5. Definir formato, geração, expiração e recuperação do código/link de gerenciamento.
6. Definir política detalhada de retenção e exclusão de dados pessoais.
7. Somente depois, planejar schema, migrations e backend em uma sessão separada e autorizada.

### Observação

Esta sessão alterou somente documentação Markdown. Nenhum código, backend, Supabase, migration ou arquivo de configuração foi criado ou modificado.



## 2026-08-30 — Tolerância configurável por negócio

### Objetivo da sessão

Atualizar exclusivamente a documentação da tolerância de atraso, substituindo a regra fixa pela configuração por negócio.

### Nova decisão oficial

- padrão de 15 minutos;
- opções permitidas no MVP: 5, 10, 15, 20 ou 30 minutos;
- sem configuração, usar 15 minutos;
- configuração vinculada ao negócio;
- cliente vê o valor configurado antes de confirmar;
- tolerância afeta somente avisos e destaque de atraso;
- tolerância não altera a duração do serviço;
- sistema não cancela automaticamente;
- empreendedor decide se marca “não compareceu”.

### Arquivos alterados

- `README.md`
- `PROJECT_CONTEXT.md`
- `MVP_SCOPE.md`
- `SCREEN_FLOW.md`
- `DATABASE_PLAN.md`
- `AGENTS.md`
- `LOVABLE_NEXT_PROMPT.md`
- `DEVELOPMENT_LOG.md`

### Contradições resolvidas

- removida a afirmação de que a tolerância seria fixa;
- removida a tolerância configurável da lista de itens fora do MVP;
- painel, página pública, plano de dados e prompt do Lovable alinhados à configuração por negócio.

### Observação

Esta sessão alterou somente arquivos Markdown. Nenhum código, backend, Supabase, migration ou arquivo de configuração foi criado ou modificado.


## 2026-08-31 — Avanço do protótipo visual no Lovable

### Objetivo da sessão

Registrar o avanço atual do protótipo visual do Agenda Certa no Lovable e manter a memória oficial do projeto atualizada, sem iniciar backend ou integração com Supabase.

### 1. Landing page atualizada

- Agenda Certa aparece como nome do produto.
- Foram adicionados os botões **Começar grátis**, **Ver demonstração do cliente** e **Ver demonstração do empreendedor**.
- A Barbearia do Zé aparece claramente como demonstração fictícia.

### 2. Cadastro do empreendedor

- Existe uma tela visual para criar conta.
- Campos: nome, e-mail, senha e WhatsApp.
- A tela informa que o empreendedor possui 15 dias grátis.

### 3. Onboarding de seis etapas

O protótipo apresenta:

1. Negócio.
2. Link público.
3. Horários e períodos de atendimento.
4. Serviços.
5. Equipe e profissionais.
6. Revisão.

### 4. Períodos de atendimento

- O protótipo permite visualizar mais de um período por dia.
- Exemplo: 09:00–12:00 e 13:00–18:00.
- Pausas, como o horário de almoço, não aparecem para o cliente.

### 5. Profissionais

- O onboarding diferencia **trabalho sozinho** e **tenho equipe**.
- Profissionais continuam sem login próprio no MVP.

### 6. Página pública do cliente

- A página pública da Barbearia do Zé continua sendo uma demonstração.
- Foi adicionado o link **Já tenho um agendamento** dentro da página pública do negócio.
- Esse link não aparece na landing page principal.
- Essa escolha preserva o modelo de link próprio de cada negócio e mantém o produto fora da lógica de marketplace.

### 7. Gerenciamento de agendamento

O protótipo agora possui:

- busca visual por WhatsApp e código do agendamento;
- exemplo de código `AC-4827`;
- tela de cancelamento;
- tela de remarcação;
- estado visual para quando falta menos de 1 hora;
- orientação para falar com o negócio pelo WhatsApp quando o cancelamento ou a remarcação online não for mais permitido.

### 8. Recurso exclusivo da demonstração

- O botão **Simular horário em menos de 1 hora** existe somente para demonstrar esse comportamento no protótipo.
- Clientes não verão esse botão na versão real.
- Na versão real, o sistema calculará automaticamente se falta menos de 1 hora, usando o horário do negócio e seu timezone.

### 9. Limitação atual do protótipo

- Ainda não existe backend ou Supabase conectado.
- Os dados informados ao criar um agendamento não são realmente recuperados depois.
- A busca por código mostra dados fictícios de exemplo.
- Esse comportamento é esperado e aceitável nesta fase de protótipo visual.

### 10. Próxima evolução no Lovable

Quando houver novos créditos, priorizar o painel do empreendedor, especialmente:

- tela de Agenda;
- bloqueios de horário;
- agendamento manual;
- ações de status;
- resumo do dia;
- tolerância e destaque de atraso no painel.

### Próximos passos recomendados

1. Pausar o Lovable enquanto não houver créditos.
2. Não iniciar Supabase ainda.
3. Usar o Codex para manter a documentação e a memória oficial atualizadas.
4. Quando houver créditos, continuar pelo painel do empreendedor.

### Observação

Esta sessão atualizou somente o `DEVELOPMENT_LOG.md`. Nenhum código, backend, Supabase, migration ou outro arquivo foi criado ou alterado.

## 2026-09-18 — Migração da documentação para o repositório de código

### Contexto

- O Lovable criou o repositório de código, então chamado `time-perfected`, com o protótipo visual.
- O antigo repositório documental, então chamado `agenda-certa`, continha a documentação oficial do produto.
- A documentação oficial foi copiada e integrada ao repositório de código, então chamado `time-perfected`.

### Decisão de organização

- O repositório de código, então chamado `time-perfected`, passou a ser temporariamente o repositório principal do projeto, reunindo código e documentação.
- A branch `main` do repositório de código passou a manter código e documentação juntos.
- O antigo repositório documental permaneceu intacto como backup histórico.
- A branch `docs-migration` foi criada a partir da `main` e usada como etapa segura para preparar a migração.
- Branches não serão usadas para separar permanentemente código e documentação.

### Arquivos migrados

- `PROJECT_CONTEXT.md`
- `MVP_SCOPE.md`
- `SCREEN_FLOW.md`
- `DATABASE_PLAN.md`
- `LOVABLE_NEXT_PROMPT.md`
- `DEVELOPMENT_LOG.md`

### Arquivos mesclados

- `README.md`: contexto oficial do Agenda Certa combinado com informações úteis do repositório e do fluxo Lovable.
- `AGENTS.md`: bloco original do Lovable preservado integralmente, seguido das instruções oficiais do projeto.

### Segurança da migração

- Nenhum código do aplicativo foi alterado.
- Nenhum arquivo do Lovable foi apagado.
- Nenhum arquivo do antigo repositório documental foi removido.
- Não houve force push.
- O histórico publicado não foi reescrito.
- Não houve rebase, amend ou squash de commits publicados.
- Nenhum backend, Supabase ou migration foi criado.

### Próximo passo recomendado

A migração documental foi incorporada à `main` por fluxo normal, sem reescrever o histórico.

## 2026-09-18 — Renomeação e organização final dos repositórios

### Alterações de nome

- O repositório de código chamado anteriormente `time-perfected` foi renomeado para `agenda-certa`.
- O antigo repositório documental chamado anteriormente `agenda-certa` foi renomeado para `agenda-certa-docs-backup`.

### Organização atual

- Repositório principal: `Vini-coder256/agenda-certa`.
- Backup histórico da documentação: `Vini-coder256/agenda-certa-docs-backup`.
- A branch `main` do repositório principal reúne código e documentação.
- O backup histórico não deve ser tratado como repositório principal nem receber o desenvolvimento normal do produto.

### Escopo desta atualização

- Referências correntes ao nome antigo foram substituídas pela organização atual.
- Referências históricas a `time-perfected` foram mantidas somente neste log para registrar a renomeação.
- O bloco original do Lovable em `AGENTS.md` foi preservado integralmente.
- Nenhuma lógica do aplicativo foi alterada.
- Nenhum backend, Supabase ou migration foi criado.
- Não houve force push, rebase, amend, squash ou reescrita de histórico.

## 2026-09-18 — Lovable conectado à main e limpeza de branch antiga

### Estado confirmado

- O Lovable passou a apontar para a branch `main`.
- O preview foi testado após a mudança para `main` e continuou funcionando normalmente.
- A branch `lovable-code` foi removida depois dessa confirmação.
- O repositório principal atual é `Vini-coder256/agenda-certa`.
- O repositório `Vini-coder256/agenda-certa-docs-backup` é somente um backup histórico.
- A branch `docs-migration` foi usada como etapa segura da migração documental, já foi mesclada na `main` e permanece apenas como branch histórica/temporária.
- A branch `main` é a única branch principal do projeto.

### Escopo desta organização

- Nenhum código funcional do aplicativo foi alterado.
- Nenhum backend, Supabase ou migration foi criado.
- Não houve force push, rebase, amend, squash ou reescrita de histórico.
- O bloco original do Lovable em `AGENTS.md` permaneceu intacto.

## 2026-09-18 — Snapshot v0.1 do protótipo visual

### Objetivo da sessão

Documentar o estado atual do protótipo visual antes das próximas alterações no Lovable.

### Registro

- Foi criado o arquivo `CURRENT_PROTOTYPE_SNAPSHOT.md`.
- Versão do snapshot: **v0.1 — Protótipo visual Lovable organizado**.
- Data do snapshot: **2026-09-18**.
- O snapshot registra rotas, telas, dados mockados, coerência com a documentação oficial, lacunas, riscos e próximas prioridades.
- A análise foi feita sobre o repositório `Vini-coder256/agenda-certa`, branch `main`.
- O estado registrado é de protótipo visual navegável, sem backend real e com dados fictícios/mockados.

### Escopo desta atualização

- Somente documentação Markdown foi criada ou atualizada.
- Nenhum código funcional do aplicativo foi alterado.
- Nenhum backend, Supabase ou migration foi criado.
- Nenhuma rota ou lógica do aplicativo foi modificada.

## 2026-09-18 — Snapshot v0.2 do protótipo visual

### Objetivo da sessão

Atualizar a memória do projeto para registrar o estado visual atual antes das próximas evoluções, mantendo backend e persistência fora do escopo.

### Commits funcionais recentes

- `238157862dc64c2fec976b4b1404b79516689a72`: estabilização do TypeScript e dos ajustes parciais feitos pelo Lovable.
- `a702375b1a3458b84d2e1028c954be1c0b9a4b2c`: ajustes visuais de tolerância numérica segura e múltiplos períodos de atendimento.

### Estado registrado no snapshot

- `CURRENT_PROTOTYPE_SNAPSHOT.md` atualizado para **v0.2**.
- Agenda com resumo do dia, filtros, ações de status, edição básica e bloqueio visual de horários.
- Serviços reforçando desativação e reativação em vez de exclusão do histórico.
- Configurações com tolerância numérica de 5 a 60 minutos, avisos visuais e explicação sobre ausência de cancelamento automático.
- Configurações com múltiplos períodos por dia, adição e remoção de períodos, dias fechados apagados e reativação com período padrão.
- Agenda, serviços, profissionais, bloqueios e configurações continuam baseados em mocks, `useState` ou armazenamento local.

### Testes manuais no preview

Os testes abaixo foram executados e passaram:

- tolerância aceita somente números;
- aviso abaixo de 5 minutos;
- aviso acima de 60 minutos;
- segunda-feira com dois períodos;
- adicionar período;
- remover período;
- domingo fechado visualmente apagado;
- reativação de dia fechado com período padrão.

### Decisão sobre persistência

A ausência de persistência é esperada nesta fase. Alterações visuais podem resetar ao sair e voltar para a tela. Persistência real, autenticação, banco, Supabase e RLS permanecem fora do escopo até a fase autorizada de backend.

### Pendências principais

- persistência real das configurações e demais dados;
- autenticação real do empreendedor;
- banco de dados, Supabase e RLS;
- disponibilidade real considerando períodos, bloqueios e agendamentos;
- prevenção segura de reservas simultâneas;
- painel admin;
- assinatura e pagamento real;
- estados especiais reais da página pública.

### Escopo desta atualização

- Somente `CURRENT_PROTOTYPE_SNAPSHOT.md` e `DEVELOPMENT_LOG.md` foram atualizados.
- Nenhum código TypeScript ou React foi alterado.
- Nenhum backend, Supabase, autenticação, migration ou pagamento foi criado.

## 2026-09-22 — Planejamento oficial da fase de backend

### Objetivo da sessão

Planejar, antes de qualquer implementação, a transformação do protótipo visual v0.2 em um MVP funcional com autenticação, persistência, isolamento por negócio e operações públicas seguras.

### Decisões documentadas

- O backend previsto usa Supabase Auth, PostgreSQL, RLS e RPCs transacionais.
- Edge Functions ficam reservadas para necessidades que não devam ficar em SQL/RPC, como integrações externas, rate limit adicional ou uso de segredos.
- Foi criado `BACKEND_IMPLEMENTATION_PLAN.md` com arquitetura, segurança, estratégia Git, testes e dez fases de implementação.
- `DATABASE_PLAN.md` foi atualizado com o modelo planejado, `time_blocks`, hash do token de gerenciamento, regras de RLS, disponibilidade real e proteção contra sobreposição.
- A tolerância vinculada ao negócio foi alinhada ao protótipo atual: padrão de 15 minutos e valor inteiro entre 5 e 60.
- Configurações simples, como timezone e tolerância, permanecem inicialmente em `businesses`; uma tabela `business_settings` só deverá ser criada se houver necessidade concreta.
- A criação pública não fará inserção direta irrestrita. Preço, duração, status, vínculos, assinatura, bloqueios e disponibilidade serão recalculados no backend.
- A prevenção de reservas simultâneas combinará transação, lock compartilhado e restrição de exclusão no banco.
- Os estados especiais da página pública deverão vir de dados e códigos reais do backend quando a rota for migrada, não de mocks.
- O primeiro trabalho sugerido de implementação é uma branch curta chamada `backend/supabase-foundation`, mantendo a `main` estável.

### Decisão sobre Lovable

Não gastar créditos do Lovable com estados cuja fonte correta depende do backend. O Lovable pode continuar apoiando o protótipo visual, mas autenticação, persistência, disponibilidade, RLS e estados públicos reais devem seguir o plano técnico do repositório.

### Escopo desta atualização

- Somente documentação Markdown foi criada ou atualizada.
- Nenhum código TypeScript ou React foi alterado.
- Nenhum projeto Supabase foi conectado.
- Nenhum backend, migration, autenticação, pagamento ou dependência foi criado.
- Nenhuma configuração do Lovable foi alterada.

### Próximo passo recomendado

Confirmar ambiente Supabase, estratégia de segredos, uso de SSR e mecanismo de concorrência. Depois, criar `backend/supabase-foundation` e executar somente a Fase 1 do plano em uma tarefa separada.

