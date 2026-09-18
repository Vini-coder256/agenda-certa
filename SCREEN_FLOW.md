# Fluxo de Telas — Agenda Certa

## 1. Usuários

- Cliente final: agenda e gerencia sem login.
- Empreendedor: administra um negócio no MVP.
- Admin: administra contas, negócios, testes e assinaturas.

## 2. Mapa geral

```text
Landing
├── Começar grátis → Cadastro → Onboarding → Painel
├── Login → Painel ou Onboarding incompleto
├── Demo do cliente → Página pública da Barbearia do Zé
└── Demo do empreendedor → Painel fictício da Barbearia do Zé

Página pública /b/:slug
→ Serviço
→ Profissional, se necessário
→ Data e horário
→ Dados
→ Revisão
→ Confirmação
→ Gerenciar meu agendamento
```

## 3. Landing `/`

Botões:

- Começar grátis → `/cadastro`;
- Login → `/login`;
- Demo do cliente → `/demo/barbearia-do-ze`;
- Demo do empreendedor → `/demo/painel`.

A demo deve estar identificada como fictícia.

## 4. Cadastro e login

### Cadastro `/cadastro`

Nome, e-mail, senha e WhatsApp. Informar 15 dias grátis e ausência de cobrança automática inicial.

### Login `/login`

E-mail e senha. Levar para `/onboarding` se a configuração estiver incompleta; caso contrário, `/app/dashboard`.

## 5. Onboarding `/onboarding`

1. negócio: nome, categoria, descrição, WhatsApp e endereço/região;
2. link público: slug e prévia `/b/:slug`;
3. timezone: padrão `America/Sao_Paulo`;
4. períodos de atendimento: permitir mais de um por dia;
5. serviços: nome, descrição, preço e duração;
6. profissionais: nome, foto opcional, serviços e status;
7. revisão e entrada no painel.

Se apenas um profissional ativo realizar um serviço, ele será selecionado sem exibir etapa pública.

## 6. Painel do empreendedor `/app`

Menu:

- Dashboard;
- Agenda;
- Novo agendamento;
- Serviços;
- Profissionais;
- Configurações;
- Assinatura;
- Ver página pública.

## 7. Dashboard `/app/dashboard`

Cards para o período selecionado:

- agendamentos;
- ganho previsto (`scheduled` + `completed`);
- ganho real (`completed`);
- perda por falta (`no_show`);
- dias restantes do teste ou status da assinatura.

Também exibir próximos horários, link público e avisos de tolerância ou assinatura.

## 8. Agenda `/app/agenda`

Filtros por data, status, profissional e origem.

Ações:

- concluir;
- marcar não comparecimento;
- destacar atraso após o horário marcado mais a tolerância configurada;
- cancelar;
- editar nome, WhatsApp e observação;
- criar agendamento manual;
- **Bloquear horário**.

Para mudar data, horário, serviço ou profissional, cancelar e criar outro.

### Bloquear horário

Campos:

- início e fim;
- geral do negócio ou profissional específico;
- motivo opcional.

## 9. Novo agendamento manual `/app/novo-agendamento`

Nome, WhatsApp, serviço, profissional, data, horário e observação.

Aplicar as mesmas regras de disponibilidade do agendamento online. Se o teste terminou e não existe assinatura ativa, impedir a criação.

## 10. Serviços `/app/servicos`

Listar, criar, editar e ativar/desativar. Serviços com histórico não podem ser apagados.

## 11. Profissionais `/app/profissionais`

Listar, criar, editar, ativar/desativar e vincular serviços. Profissionais com histórico não podem ser apagados.

Não exibir login, permissões, comissão, salário, repasse ou horário individual.

## 12. Configurações `/app/configuracoes`

- nome, descrição e categoria;
- WhatsApp e endereço/região;
- slug público;
- timezone;
- períodos de atendimento;
- tolerância de atraso.

A tolerância deve usar um seletor com 5, 10, 15, 20 ou 30 minutos. O padrão é 15 minutos quando nada for configurado.

## 13. Assinatura `/app/assinatura`

Exibir plano, dias restantes, fim do teste, valor e status:

- teste grátis;
- ativa;
- vencida;
- pausada;
- cancelada;
- bloqueada.

Pagamento pode ser representado como manual no MVP.

## 14. Página pública `/b/:slug`

### Fluxo normal

1. listar serviços ativos;
2. contar profissionais ativos que realizam o serviço;
3. ocultar escolha se houver um; mostrar se houver dois ou mais;
4. mostrar datas dentro dos próximos 30 dias;
5. mostrar apenas horários válidos em passos de 15 minutos;
6. pedir nome, WhatsApp e observação opcional;
7. mostrar revisão, privacidade e tolerância;
8. confirmar.

Avisos:

> Atenção: seu horário possui tolerância de {tolerância configurada} minutos. Caso você não chegue dentro desse prazo, seu horário poderá ser liberado para outro cliente.

> Ao agendar, você informa nome e WhatsApp para que o negócio possa identificar e acompanhar seu atendimento.

O aviso deve mostrar o valor salvo no negócio. A tolerância não muda a duração do serviço e não cancela automaticamente.

## 15. Confirmação

Exibir:

- serviço, profissional, data, horário e preço;
- **Código do agendamento**, por exemplo `AC-4827`;
- botão **Gerenciar meu agendamento**;
- instrução para guardar o código e o link.

Não usar a palavra “token” para o cliente.

## 16. Gerenciamento sem login

Acesso por link seguro e/ou tela de consulta por código.

Ações:

- Cancelar;
- Remarcar.

Até 1 hora antes, cancelamento libera o horário e remarcação cancela o antigo e cria o novo.

Com menos de 1 hora:

> Este agendamento não pode mais ser cancelado ou remarcado online. Fale com o negócio pelo WhatsApp.

## 17. Estados especiais

- slug inexistente: “Negócio não encontrado.”;
- pausado, bloqueado ou teste vencido: “Agenda temporariamente indisponível.”;
- sem serviços: “Nenhum serviço disponível no momento.”;
- sem profissionais: “Nenhum profissional disponível no momento.”;
- sem horários: “Não há horários disponíveis para esta data.”;
- código inválido: “Código do agendamento inválido.”;
- link inválido/expirado: orientar uso do código ou contato com o negócio.

## 18. Admin `/admin`

No MVP real:

- listar empreendedores e negócios;
- consultar teste e assinatura;
- ativar, pausar ou bloquear conta.

No protótipo, pode usar dados fictícios. Relatórios, gráficos, automações financeiras, suporte e auditoria avançados ficam fora do MVP.

## 19. Teste vencido

O painel continua acessível para consulta e ações nos agendamentos existentes. A criação manual fica bloqueada e a página pública deixa de aceitar novos agendamentos até a assinatura ser ativada.

