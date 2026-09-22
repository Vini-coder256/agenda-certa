# Plano do Banco de Dados — Agenda Certa

Este documento define o modelo de dados e as regras técnicas previstas para a fase de backend. Ele é uma referência de planejamento: não é migration e não significa que Supabase ou backend já estejam configurados.

O plano de execução por fases está em `BACKEND_IMPLEMENTATION_PLAN.md`.

## 1. Princípios

- O sistema é multiempresa.
- No MVP, uma conta de empreendedor possui exatamente um negócio.
- A estrutura pode permitir múltiplos negócios no futuro sem expor isso na interface atual.
- A assinatura está ligada ao negócio e ao dono.
- Cada empreendedor acessa somente os próprios dados.
- Datas persistidas usam instante absoluto; cálculos e exibição respeitam o timezone do negócio, com padrão `America/Sao_Paulo`.
- Dinheiro é salvo em centavos.
- Dados públicos são expostos pelo menor contrato possível; tabelas privadas não ficam abertas para acesso anônimo.
- Operações públicas sensíveis são validadas novamente no backend/banco.

## 2. Stack e limites previstos

- Supabase Auth para identidade e sessão do empreendedor.
- PostgreSQL do Supabase para dados, integridade, transações e índices.
- RLS para isolamento por negócio.
- RPCs transacionais para disponibilidade, criação, cancelamento e remarcação públicas.
- Edge Functions somente quando SQL/RPC não for adequado, por exemplo integrações externas, rate limit adicional ou uso de segredos.
- Pagamento automático, WhatsApp automático e login de profissional continuam fora do MVP inicial.

## 3. Tabelas planejadas

1. `profiles`
2. `businesses`
3. `services`
4. `professionals`
5. `professional_services`
6. `business_hours`
7. `appointments`
8. `time_blocks`
9. `subscriptions`

No início do MVP, `timezone` e `late_tolerance_minutes` permanecem em `businesses`. Não criar `business_settings` sem necessidade concreta; essa separação pode ocorrer futuramente se as configurações crescerem.

## 4. `profiles`

Dados adicionais do usuário autenticado:

```text
id
full_name
email
phone
role
created_at
updated_at
```

`id` referencia de forma segura o usuário do Supabase Auth.

`role`:

- `entrepreneur`;
- `admin`.

Um empreendedor comum não pode conceder a si mesmo a função de admin.

## 5. `businesses`

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

`status`:

- `active`;
- `paused`;
- `blocked`.

Regras:

- `owner_id` é obrigatório;
- no MVP, deve existir no máximo um negócio por empreendedor;
- `slug` é obrigatório e único sem diferenciar maiúsculas e minúsculas;
- `timezone` padrão: `America/Sao_Paulo`;
- `late_tolerance_minutes` pertence ao negócio, tem padrão 15 e aceita inteiro entre 5 e 60;
- se não houver valor configurado, usar 15;
- rota pública padrão: `/b/:slug`.

O status do negócio e o status da assinatura são avaliados antes de aceitar novos agendamentos.

A tolerância serve apenas para avisos e destaque de atraso. Ela não altera `duration_minutes`, `start_at`, `end_at` ou disponibilidade e não cancela agendamentos automaticamente.

## 6. `services`

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
- serviço com histórico é desativado, não apagado;
- serviço inativo não recebe novo agendamento.

## 7. `professionals`

```text
id
business_id
name
photo_url
is_active
created_at
updated_at
```

Regras:

- todo agendamento possui `professional_id`;
- profissional com histórico é desativado, não apagado;
- no MVP, profissionais seguem os períodos gerais do negócio;
- profissionais não possuem login, permissões, comissão, salário, repasse ou horário próprio.

## 8. `professional_services`

```text
id
professional_id
service_id
created_at
```

Regras:

- a relação profissional–serviço é única;
- profissional e serviço pertencem ao mesmo negócio;
- profissional ou serviço inativo não recebe novo agendamento;
- a consistência de negócio deve ser validada no servidor/banco, não apenas no frontend.

## 9. `business_hours`

Cada linha representa um período de atendimento. Um dia pode ter mais de uma linha.

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

- `opens_at` deve ser anterior a `closes_at`;
- o período pertence ao negócio;
- períodos ativos do mesmo dia não devem se sobrepor;
- intervalos como almoço ficam fora dos períodos cadastrados;
- períodos não aparecem ao cliente; somente horários disponíveis são exibidos.

## 10. `appointments`

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
manage_token_hash
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
- serviço e profissional pertencem ao mesmo negócio;
- o profissional realiza o serviço;
- preço e duração vêm do serviço, nunca de valores livres enviados pelo cliente;
- o preço é copiado para o agendamento para preservar histórico;
- `end_at` é posterior a `start_at` e corresponde à duração validada;
- o status inicial do agendamento público é `scheduled` e é definido pelo sistema;
- `manage_code` é único ou possui proteção suficiente contra colisão;
- o token técnico é aleatório e seguro; somente seu hash fica em `manage_token_hash`;
- o token bruto pode ser devolvido uma única vez na criação do link e nunca é exibido com a palavra “token” ao cliente;
- `cancelled_at` registra o cancelamento;
- `rescheduled_from_appointment_id` liga o novo agendamento ao antigo quando houver remarcação;
- `cancelled` não bloqueia horário nem entra nos ganhos;
- registros históricos não são apagados.

O código pode ter formato amigável como `AC-4827`, mas não é a única proteção do link seguro.

## 11. `time_blocks`

```text
id
business_id
professional_id
start_at
end_at
reason
created_by
created_at
updated_at
```

`professional_id` vazio indica bloqueio geral do negócio. Preenchido indica bloqueio de um profissional.

Regras:

- `end_at` é posterior a `start_at`;
- o profissional, quando informado, pertence ao negócio;
- bloqueio impede novos agendamentos sobrepostos;
- bloqueios não aparecem na página pública;
- a criação de bloqueio deve verificar conflitos de forma transacional;
- um bloqueio geral é comparado com todos os profissionais do negócio; um bloqueio específico, somente com o profissional correspondente.

## 12. `subscriptions`

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

`status`:

- `trial`;
- `active`;
- `past_due`;
- `paused`;
- `cancelled`;
- `blocked`.

Regras:

- assinatura ligada ao negócio e ao dono;
- teste grátis de 15 dias começa na criação da conta/negócio;
- pagamento pode ser manual no MVP;
- somente `trial` válido ou `active` aceita novos agendamentos online e manuais;
- o empreendedor mantém acesso ao painel, histórico e ações em agendamentos existentes quando não pode criar novos;
- ativação manual deve ser restrita ao admin.

## 13. Disponibilidade real

Horários candidatos são gerados em intervalos de 15 minutos, com limite de 30 dias no futuro e intervalo automático de 0 minutos entre atendimentos.

A operação de disponibilidade recebe, no mínimo:

- slug ou `business_id`;
- `service_id`;
- `professional_id`, quando já escolhido;
- data local pretendida;
- timezone do negócio.

Ela valida:

1. negócio existente;
2. negócio `active`;
3. teste válido ou assinatura `active`;
4. serviço ativo e pertencente ao negócio;
5. profissional ativo, pertencente ao negócio e vinculado ao serviço;
6. período de atendimento aplicável;
7. término do serviço dentro do mesmo período;
8. timezone do negócio;
9. antecedência mínima de 1 hora no mesmo dia;
10. limite de 30 dias;
11. agendamentos `scheduled`, `completed` e `no_show` sobrepostos;
12. bloqueios gerais e do profissional.

Um horário só é retornado se todo o intervalo `[start_at, end_at)` estiver livre. Agendamentos `cancelled` não bloqueiam.

A listagem de disponibilidade é informativa. A mesma validação é repetida atomicamente na criação.

## 14. Proteção contra sobreposição e concorrência

A verificação no frontend não é suficiente. Dois clientes podem tentar reservar o mesmo profissional no mesmo intervalo.

Estratégia prevista:

- usar intervalos semifechados `[start_at, end_at)`;
- habilitar `btree_gist` quando a implementação for autorizada;
- criar uma restrição de exclusão GiST em `appointments` por `professional_id` e intervalo de tempo, aplicável a registros cujo status não seja `cancelled`;
- executar a criação pública em uma RPC transacional que recalcule preço, duração, disponibilidade, assinatura e bloqueios;
- serializar operações concorrentes relevantes com lock transacional/advisory por negócio/profissional;
- usar o mesmo protocolo de lock ao criar `time_blocks`, pois uma restrição isolada em `appointments` não impede corrida entre tabelas;
- converter conflito de concorrência em resposta estável de “horário indisponível”, sem expor erro interno.

A restrição de exclusão protege conflitos entre agendamentos do mesmo profissional. A RPC e o lock compartilhado protegem também conflitos entre agendamentos e bloqueios gerais/específicos.

## 15. Criação pública segura

O frontend público não insere diretamente em `appointments`.

Uma RPC, por exemplo `create_public_appointment`, deve:

1. localizar o negócio pelo slug;
2. validar estado do negócio e assinatura/teste;
3. validar serviço, profissional e vínculo;
4. ler preço e duração no banco;
5. validar nome e telefone;
6. calcular `start_at` e `end_at` no timezone correto;
7. validar período, antecedência, limite futuro, agendamentos e bloqueios;
8. obter o lock transacional;
9. repetir as verificações críticas;
10. criar com `source = online` e `status = scheduled`;
11. gerar `manage_code` e token seguro;
12. salvar somente o hash do token;
13. devolver apenas os dados necessários à confirmação.

O cliente nunca escolhe livremente preço, duração, status, `business_id` ou relacionamentos internos.

## 16. Cancelamento, remarcação e gerenciamento

O acesso público usa código acompanhado de WhatsApp e/ou link seguro. A palavra “token” não aparece na interface.

Cancelamento e remarcação online são permitidos somente até 1 hora antes do início no timezone do negócio.

Remarcação deve ocorrer em uma operação transacional:

1. autenticar o acesso ao agendamento;
2. validar a janela mínima;
3. validar o novo horário;
4. obter locks necessários;
5. cancelar o antigo e preencher `cancelled_at`;
6. criar o novo;
7. registrar `rescheduled_from_appointment_id`;
8. confirmar a transação inteira ou não alterar nada.

## 17. Estados da página pública vindos do backend

O backend deve distinguir estados sem expor dados privados:

- `business_not_found`;
- `business_paused`;
- `business_blocked`;
- `trial_expired` ou assinatura inapta;
- `no_active_services`;
- `no_active_professionals`;
- `no_availability`;
- `management_code_invalid`;
- `management_link_invalid_or_expired`;
- `management_window_closed`.

A UI traduz esses códigos para as mensagens oficiais. Esses estados não devem continuar baseados em mocks quando a rota for migrada.

## 18. Ganhos

Para o período escolhido:

- ganho previsto: soma de `scheduled` + `completed`;
- ganho real: soma de `completed`;
- perda por falta: soma de `no_show`;
- `cancelled` não entra.

Um agendamento passado continua no previsto enquanto estiver `scheduled`.

## 19. Restrições e índices mínimos

Restrições:

- foreign keys entre entidades relacionadas;
- unicidade de `businesses.owner_id` no MVP;
- slug único sem diferenciar maiúsculas e minúsculas;
- `late_tolerance_minutes BETWEEN 5 AND 60`;
- preço e duração positivos;
- `end_at > start_at` em agendamentos e bloqueios;
- valores padronizados para roles, estados, status e source;
- relação profissional–serviço sem duplicidade;
- serviço, profissional, vínculo e agendamento sempre consistentes com o mesmo negócio;
- relação de remarcação sem autorreferência inválida;
- proteção contra sobreposição de agendamentos ativos.

Índices:

- negócio por `owner_id`;
- negócio por slug normalizado;
- serviços e profissionais por `business_id, is_active`;
- períodos por `business_id, weekday`;
- agendamentos por negócio/início, profissional/início, status e `manage_code`;
- hash de gerenciamento quando a busca exigir;
- bloqueios por negócio/início e profissional/início;
- assinatura por negócio e status.

## 20. RLS e autorização

### Empreendedor autenticado

- lê e altera somente o perfil permitido e o próprio negócio;
- acessa somente serviços, profissionais, períodos, bloqueios, agendamentos e assinatura ligados ao próprio negócio;
- não altera role para admin;
- não ativa assinatura por conta própria;
- não lê dados de outros negócios.

### Cliente anônimo

- não recebe acesso amplo direto às tabelas;
- lê somente projeções públicas mínimas por RPC ou view segura;
- não lê nomes, telefones, notas, agenda completa, hashes ou dados de terceiros;
- cria, cancela e remarca somente por operações seguras e validadas;
- não define preço, duração, status ou relacionamentos internos.

### Admin

- usa autorização explícita e protegida;
- pode consultar contas e negócios e alterar estados administrativos mínimos;
- não deve depender apenas de uma flag enviada pelo cliente.

A service role nunca é enviada ao frontend. Funções `security definer`, se usadas, precisam de `search_path` fixo, validações explícitas e privilégios mínimos.

## 21. Privacidade e anti-spam

Nome e WhatsApp são dados pessoais e ficam visíveis somente ao dono do negócio e a acessos administrativos autorizados.

No MVP:

- nome obrigatório;
- WhatsApp obrigatório;
- validação básica de formato;
- mensagens de erro sem revelar existência de outros agendamentos.

Rate limit, captcha, verificação de telefone e bloqueio avançado de abuso são evoluções planejadas. A criação pública já deve ser desenhada para permitir rate limit futuro.

## 22. Timezone e datas

- O negócio guarda um timezone IANA, padrão `America/Sao_Paulo`.
- O backend interpreta a seleção local usando esse timezone.
- Instantes são persistidos de forma inequívoca, preferencialmente `timestamptz`.
- Regras de antecedência, cancelamento e mudança de dia são calculadas no timezone do negócio.
- O frontend não é fonte de verdade para conversão ou validação de horário.

## 23. Demonstração

Dados da Barbearia do Zé são fictícios. Não devem ser migrados silenciosamente para produção nem misturados a dados reais.

## 24. Próxima etapa

Depois da aprovação deste plano, a primeira implementação deve ocorrer em uma branch curta, sugerida como `backend/supabase-foundation`, seguindo a Fase 1 de `BACKEND_IMPLEMENTATION_PLAN.md`. Nenhuma migration de produto deve ser criada antes da confirmação do ambiente, estratégia de segredos e revisão do modelo.
