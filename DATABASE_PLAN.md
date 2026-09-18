# Plano Inicial do Banco de Dados — Agenda Certa

Este documento descreve o planejamento dos dados. Não é migration nem implementação de backend.

## 1. Princípios

- O sistema é multiempresa.
- No MVP, uma conta de empreendedor possui um negócio.
- A estrutura pode permitir múltiplos negócios futuramente sem expor isso na interface atual.
- A assinatura está ligada ao negócio e ao dono.
- Cada empreendedor só acessa os próprios dados.
- Datas e horários devem respeitar o timezone do negócio, com padrão `America/Sao_Paulo`.
- Dinheiro deve ser salvo em centavos.

## 2. Tabelas planejadas

1. `profiles`
2. `businesses`
3. `services`
4. `professionals`
5. `professional_services`
6. `business_hours`
7. `appointments`
8. `blocked_times`
9. `subscriptions`

## 3. `profiles`

Dados extras do usuário autenticado:

```text
id
full_name
email
phone
role
created_at
updated_at
```

`role`:

- `entrepreneur`;
- `admin`.

O perfil deve estar ligado de forma segura ao usuário de autenticação. Um empreendedor comum não pode conceder a si mesmo a função de admin.

## 4. `businesses`

```text
id
owner_id
name
slug
category
description
phone
address
city
state
logo_url
timezone
late_tolerance_minutes
status
created_at
updated_at
```

Regras:

- `owner_id` é obrigatório;
- no MVP, apenas um negócio por empreendedor;
- `slug` é obrigatório e único, sem conflito por maiúsculas/minúsculas;
- `timezone` padrão: `America/Sao_Paulo`;
- `late_tolerance_minutes` pertence ao negócio e tem padrão 15;
- `late_tolerance_minutes` aceita somente 5, 10, 15, 20 ou 30;
- rota pública: `/b/:slug`.

O status do negócio e o status da assinatura devem ser avaliados antes de aceitar novos agendamentos.

A tolerância serve somente para avisos e destaque de atraso. Ela não altera `duration_minutes`, `start_at`, `end_at` ou o cálculo de disponibilidade. O sistema não cancela o agendamento automaticamente quando a tolerância termina.

## 5. `services`

```text
id
business_id
name
description
price_cents
duration_minutes
is_active
created_at
updated_at
```

Regras:

- `price_cents` deve ser positivo;
- `duration_minutes` deve ser positivo;
- serviço pertence a um negócio;
- serviço com histórico é desativado, não apagado.

## 6. `professionals`

```text
id
business_id
name
photo_url
is_active
created_at
updated_at
```

Todo agendamento possui `professional_id`. Profissional com histórico é desativado, não apagado.

No MVP, profissionais seguem os períodos gerais do negócio. Não existem login, permissões, comissão, salário ou repasse.

## 7. `professional_services`

```text
id
professional_id
service_id
created_at
```

Regras:

- relação profissional–serviço deve ser única;
- profissional e serviço devem pertencer ao mesmo negócio;
- profissional inativo ou serviço inativo não pode receber novo agendamento.

## 8. `business_hours`

Cada linha representa um período de atendimento. Assim, um dia pode possuir mais de uma linha.

```text
id
business_id
weekday
opens_at
closes_at
is_active
created_at
updated_at
```

`weekday` usa 0 para domingo até 6 para sábado.

Regras:

- abertura anterior ao fechamento;
- períodos devem pertencer ao negócio;
- intervalos como almoço ficam fora dos períodos cadastrados;
- períodos não aparecem ao cliente, apenas os horários disponíveis.

## 9. `appointments`

```text
id
business_id
service_id
professional_id
client_name
client_phone
start_at
end_at
price_cents
source
status
notes
manage_code
manage_token
cancelled_at
rescheduled_from_appointment_id
created_at
updated_at
```

`source`:

- `online`;
- `manual`.

`status`:

- `scheduled`;
- `completed`;
- `no_show`;
- `cancelled`.

Regras:

- negócio, serviço e profissional são obrigatórios;
- serviço e profissional devem pertencer ao mesmo negócio;
- profissional deve realizar o serviço;
- preço e duração vêm do serviço, nunca de valores livres enviados pelo cliente;
- salvar o preço no agendamento preserva o histórico;
- `end_at` deve ser posterior a `start_at` e corresponder à duração validada;
- status inicial do agendamento público é definido pelo sistema;
- `manage_code` deve ser único ou suficientemente protegido contra colisão;
- `manage_token` deve ser técnico, seguro e nunca exibido como “token” ao cliente;
- `cancelled_at` registra o cancelamento quando aplicável;
- `rescheduled_from_appointment_id` pode ligar o novo agendamento ao antigo;
- agendamentos cancelados não bloqueiam horários.

O código pode ter formato amigável como `AC-4827`, sem depender disso como única proteção do link seguro.

## 10. `blocked_times`

```text
id
business_id
professional_id
start_at
end_at
reason
created_at
updated_at
```

`professional_id` vazio indica bloqueio geral. Preenchido indica bloqueio de um profissional.

Regras:

- fim posterior ao início;
- profissional, quando informado, pertence ao negócio;
- bloqueio impede novos agendamentos sobrepostos;
- bloqueios não aparecem na página pública.

## 11. `subscriptions`

```text
id
business_id
owner_id
status
plan_name
price_cents
trial_started_at
trial_ends_at
current_period_started_at
current_period_ends_at
last_payment_at
created_at
updated_at
```

Status:

- `trial`;
- `active`;
- `past_due`;
- `paused`;
- `cancelled`;
- `blocked`.

Regras:

- assinatura ligada ao negócio e ao dono;
- teste de 15 dias começa na criação da conta/negócio;
- pagamento pode ser manual;
- sem `trial` válido ou `active`, bloquear novos agendamentos online e manuais;
- manter painel, histórico e ações sobre agendamentos existentes.

## 12. Regra de disponibilidade

Horários candidatos são gerados a cada 15 minutos e podem chegar até 30 dias no futuro.

Antes de criar um agendamento, validar no servidor/banco:

1. negócio existente e apto a receber agendamentos;
2. teste válido ou assinatura ativa;
3. serviço ativo e pertencente ao negócio;
4. profissional ativo, pertencente ao negócio e vinculado ao serviço;
5. período de atendimento do dia;
6. término do serviço dentro do período;
7. timezone do negócio;
8. antecedência mínima de 1 hora no mesmo dia;
9. agendamentos online e manuais sobrepostos;
10. bloqueios gerais e do profissional;
11. status dos agendamentos existentes.

Intervalo automático entre atendimentos: 0 minutos no MVP.

## 13. Proteção contra sobreposição

Verificação no front-end não é suficiente. Dois clientes podem tentar marcar o mesmo profissional no mesmo intervalo.

A implementação futura deve usar validação atômica no servidor/banco e restrições ou mecanismo transacional equivalente para impedir sobreposição. A disponibilidade deve ser validada novamente no momento de salvar.

Um agendamento `cancelled` não participa do bloqueio. Os demais registros históricos não devem ser apagados.

## 14. Cancelamento e remarcação

Cancelamento e remarcação pelo cliente exigem código e/ou link seguro e só são permitidos até 1 hora antes.

Remarcação deve:

1. validar o novo horário;
2. cancelar o antigo;
3. criar o novo;
4. registrar a relação quando possível.

Essas etapas devem ser protegidas contra falha parcial na implementação futura.

## 15. Ganhos

Para o período escolhido:

- previsto: soma de `scheduled` + `completed`;
- real: soma de `completed`;
- perda por falta: soma de `no_show`;
- `cancelled` não entra.

Um agendamento passado ainda conta no previsto enquanto estiver `scheduled`.

## 16. Restrições e índices mínimos planejados

- chaves estrangeiras entre todas as entidades relacionadas;
- slug único;
- preços e durações positivos;
- datas válidas;
- valores permitidos para `role`, `status` e `source`;
- relação profissional–serviço sem duplicidade;
- índices por negócio, profissional, início, status, slug e código de gerenciamento;
- regras de exclusão que preservem histórico;
- garantia de que entidades relacionadas pertencem ao mesmo negócio;
- proteção futura contra sobreposição.

## 17. Segurança e RLS

No Supabase futuro, RLS deverá garantir:

- empreendedor acessa somente seu negócio;
- cliente anônimo lê apenas dados públicos necessários;
- cliente não lê agenda completa, nomes ou telefones de terceiros;
- criação pública passa por uma operação segura e validada;
- código e link de gerenciamento dão acesso somente ao agendamento correspondente;
- admin usa autorização protegida;
- cliente não define preço, duração ou status.

As políticas exatas devem ser revisadas antes de conectar o Supabase.

## 18. Privacidade e anti-spam

Nome e WhatsApp são dados pessoais. Devem ser privados e visíveis somente ao dono do negócio e a acessos administrativos autorizados.

No MVP, exigir nome, WhatsApp e validação básica do telefone. Rate limit, captcha, verificação de telefone e bloqueio avançado de abuso ficam para evolução.

## 19. Demonstração

Dados da Barbearia do Zé são fictícios e devem permanecer separados dos dados reais.

