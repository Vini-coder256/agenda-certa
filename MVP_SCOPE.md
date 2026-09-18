# Escopo do MVP — Agenda Certa

Este arquivo define a primeira versão funcional. O GitHub é a fonte oficial da verdade.

## 1. Objetivo

Entregar uma solução simples para que um microempreendedor configure um negócio, receba agendamentos por link público e controle agenda, faltas e ganhos.

## 2. Estrutura do produto

- Não é marketplace.
- Rota pública padrão: `/b/:slug`.
- Cliente final sem login.
- Uma conta de empreendedor corresponde a um negócio no MVP.
- Admin da plataforma separado do empreendedor.

## 3. Funcionalidades obrigatórias

### 3.1 Cadastro, login e onboarding

Cadastro do empreendedor com nome, e-mail, senha e WhatsApp. Depois do cadastro:

1. dados do negócio;
2. slug público;
3. timezone e períodos de atendimento;
4. serviços;
5. profissionais;
6. revisão.

O teste grátis de 15 dias começa na criação da conta e do negócio.

### 3.2 Negócio

Nome, categoria, descrição, WhatsApp, endereço ou região, slug único, timezone, tolerância de atraso e status. O timezone padrão é `America/Sao_Paulo`. A tolerância padrão é 15 minutos.

### 3.3 Serviços

Nome, descrição opcional, preço positivo, duração positiva e status ativo/inativo. Serviços com histórico devem ser desativados, não apagados.

### 3.4 Profissionais

Nome, foto opcional, serviços realizados e status ativo/inativo.

- Todo agendamento possui `professional_id`.
- A escolha só aparece se pelo menos dois profissionais ativos realizarem o serviço escolhido.
- Um profissional ocupado não bloqueia os demais.
- Profissionais com histórico devem ser desativados, não apagados.
- Não há login, painel, permissões, comissão, salário ou repasse para profissional.

### 3.5 Períodos de atendimento

Cada dia aceita um ou mais períodos, como 09:00–12:00 e 13:00–18:00. Todos os profissionais seguem os períodos gerais do negócio no MVP.

### 3.6 Bloqueios

O empreendedor pode usar **Bloquear horário** para criar um bloqueio geral ou específico de profissional. Bloqueios não aparecem ao cliente e impedem novos agendamentos.

### 3.7 Página pública e disponibilidade

Fluxo:

1. serviço;
2. profissional, se necessário;
3. data;
4. horário;
5. nome, WhatsApp e observação opcional;
6. revisão e aviso de privacidade/tolerância;
7. confirmação.

Regras:

- intervalos de 15 minutos;
- antecedência mínima de 1 hora no mesmo dia;
- agendamento até 30 dias no futuro;
- sem intervalo automático entre atendimentos;
- o serviço precisa terminar dentro do período;
- considerar timezone, períodos, profissional, duração, agendamentos, bloqueios, status, antecedência e limite futuro;
- validar teste grátis ou assinatura ativa.

### 3.8 Agendamento online e manual

O cliente não escolhe preço, duração ou status. O sistema usa o serviço cadastrado e inicia em `scheduled`.

Agendamento manual bloqueia igual ao online. A disponibilidade deve ser validada no servidor/banco antes de salvar, com proteção contra duas reservas simultâneas.

### 3.9 Agenda do empreendedor

Exibe horário, cliente, WhatsApp, serviço, profissional, valor, origem, status e observação.

Ações:

- concluir;
- marcar não comparecimento;
- cancelar;
- editar nome, WhatsApp e observação;
- bloquear horário.

Para mudar data, horário, serviço ou profissional, cancelar o antigo e criar outro.

### 3.10 Cancelamento e remarcação pelo cliente

Sem login, usando código e/ou link seguro.

- código visível, como `AC-4827`;
- botão **Gerenciar meu agendamento**;
- permitido até 1 hora antes;
- com menos de 1 hora, orientar contato pelo WhatsApp;
- cancelamento libera o horário;
- remarcação cancela o antigo e cria um novo.

### 3.11 Status e ganhos

- `scheduled`: previsto e bloqueia horário;
- `completed`: previsto, real e bloqueia o intervalo histórico;
- `no_show`: perda por falta, não é ganho real;
- `cancelled`: não entra em ganhos e não bloqueia.

Para o período escolhido:

- previsto = `scheduled` + `completed`;
- real = `completed`;
- perda = `no_show`.

Um atendimento passado continua previsto enquanto estiver `scheduled`.

### 3.12 Tolerância

Configurável por negócio, com padrão de 15 minutos e opções de 5, 10, 15, 20 ou 30 minutos. Sem configuração, usar 15 minutos.

O cliente sempre vê o valor configurado antes de confirmar. O sistema destaca o atraso, mas não cancela automaticamente. O empreendedor decide marcar `no_show`.

A tolerância afeta somente avisos e destaque de atraso; não altera a duração do serviço.

### 3.13 Teste e assinatura

Status: `trial`, `active`, `past_due`, `paused`, `cancelled`, `blocked`.

Sem assinatura ativa após o teste:

- página pública não aceita novos agendamentos;
- painel e histórico continuam acessíveis;
- ações em agendamentos existentes continuam permitidas;
- novos agendamentos online e manuais ficam bloqueados;
- ativação reabre a agenda.

Pagamento pode ser manual.

### 3.14 Admin mínimo

- ver empreendedores e negócios;
- ver teste e assinatura;
- ativar, pausar e bloquear conta.

No protótipo visual, os dados podem ser fictícios.

### 3.15 Privacidade e validação básica

Nome e WhatsApp só podem ser vistos pelo dono do negócio e acessos administrativos autorizados. A página pública deve exibir:

> Ao agendar, você informa nome e WhatsApp para que o negócio possa identificar e acompanhar seu atendimento.

Nome e WhatsApp são obrigatórios, com validação básica de telefone.

## 4. Estados especiais obrigatórios

Prever mensagens para slug inexistente, negócio pausado ou bloqueado, teste vencido, ausência de serviços, profissionais ou horários, tentativa tardia de cancelar/remarcar, código inválido e link inválido ou expirado.

## 5. Fora do MVP

- marketplace e app nativo;
- WhatsApp automático e IA atendente;
- pagamento online do serviço;
- pagamento automático da assinatura;
- login e permissões de profissionais;
- comissão, salário e repasse;
- horários personalizados por profissional;
- financeiro completo, nota fiscal e estoque;
- Google Agenda e Instagram;
- avaliações, promoções e fidelidade;
- remarcação avançada no painel;
- relatórios, gráficos, suporte e auditoria avançados;
- captcha, verificação de telefone e proteção antiabuso avançada.

WhatsApp automático fica para MVP 1.5 ou posterior, com API oficial e templates fixos, sem IA para redigir mensagens.

## 6. Critérios de sucesso

O MVP deve demonstrar que:

1. o empreendedor entende a proposta;
2. o cliente agenda e gerencia o agendamento com facilidade;
3. horários duplicados são impedidos;
4. bloqueios e múltiplos períodos funcionam;
5. isolamento e privacidade são respeitados;
6. agenda, status e ganhos são claros;
7. a regra de teste grátis funciona;
8. existe disposição para pagar pelo produto.

## 7. Demonstração

A Barbearia do Zé é somente demonstração visual. Dados fictícios devem permanecer separados dos dados reais.

