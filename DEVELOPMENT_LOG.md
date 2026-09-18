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

## 2026-09-18 — Migração da documentação oficial para time-perfected

### Contexto

- O Lovable criou o repositório `time-perfected` com o código do protótipo visual.
- O repositório `agenda-certa` continha a documentação oficial do produto.
- A documentação oficial foi copiada e integrada ao repositório `time-perfected`.

### Decisão de organização

- `time-perfected` passa a ser temporariamente o repositório principal do projeto, reunindo código e documentação.
- A branch `main` de `time-perfected` deve continuar sendo a versão principal com código e documentação juntos.
- O repositório `agenda-certa` permanece intacto como backup histórico.
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
- Nenhum arquivo do repositório `agenda-certa` foi removido.
- Não houve force push.
- O histórico publicado não foi reescrito.
- Não houve rebase, amend ou squash de commits publicados.
- Nenhum backend, Supabase ou migration foi criado.

### Próximo passo recomendado

Revisar a branch `docs-migration` e, estando correta, abrir um Pull Request para incorporar a documentação à `main` de `time-perfected` por merge normal.
