# Time Perfected

Crie o protótipo visual de um Micro SaaS de agendamentos para microempreendedores que trabalham com horário marcado, como barbearias, manicures, salões de beleza, estética, personal trainers e professores particulares.

O sistema deve ser uma plataforma única, onde vários empreendedores podem criar suas contas e cadastrar seus próprios negócios. Cada negócio deve ter um link público próprio para os clientes agendarem horários.

IMPORTANTE: neste primeiro momento, crie apenas um protótipo visual navegável com dados fictícios. Não conecte Supabase ainda. Não implemente pagamento real. Não use API externa. Foque em design, fluxo e telas.

O produto terá dois lados principais:

1. Painel do empreendedor

2. Página pública do cliente


No painel do empreendedor, crie as seguintes telas:

1. Dashboard

- Mostrar resumo do dia.

- Cards com:

  - Agendamentos de hoje

  - Ganho previsto

  - Ganho real

  - Clientes que não compareceram

  - Dias restantes do teste grátis

- Mostrar lista dos próximos horários do dia.

- Cada agendamento deve mostrar:

  - horário

  - nome do cliente

  - serviço

  - valor

  - origem: online ou manual

  - status: agendado, concluído, não compareceu ou cancelado

2. Agenda

- Mostrar agenda do dia em formato organizado.

- Permitir visualizar agendamentos online e manuais.

- Criar botões visuais para:

  - marcar como concluído

  - marcar como não compareceu

  - cancelar

- Mostrar aviso quando um cliente passou da tolerância de 15 minutos.

3. Novo agendamento manual

- Formulário para o empreendedor adicionar manualmente um agendamento.

- Campos:

  - nome do cliente

  - WhatsApp

  - serviço

  - data

  - horário

  - observação

- Explicar visualmente que esse horário ficará bloqueado na página pública.

4. Serviços

- Tela para cadastrar e listar serviços.

- Cada serviço deve ter:

  - nome

  - descrição

  - preço

  - duração em minutos

  - status ativo/inativo

- Exemplo:

  - Corte masculino — R$40 — 40 minutos

  - Barba — R$25 — 25 minutos

  - Corte + barba — R$65 — 60 minutos

5. Configurações do negócio

- Tela para editar:

  - nome do negócio

  - descrição

  - link público

  - WhatsApp

  - endereço

  - horários de funcionamento

  - tolerância padrão de 15 minutos

6. Assinatura

- Mostrar que o empreendedor tem 15 dias grátis.

- Mostrar quantos dias restam.

- Mostrar plano mensal fictício de R$39/mês ou R$49/mês.

- Não implementar pagamento real ainda.

- Criar botão visual “Assinar agora”.

-O sistema também deve considerar que alguns negócios possuem mais de um profissional.

Exemplo:

Uma barbearia pode ter vários barbeiros, e o cliente pode querer agendar especificamente com um deles.

Crie uma área chamada “Profissionais” no painel do empreendedor.

Nessa área, o empreendedor pode cadastrar profissionais com:

- nome

- foto opcional

- serviços que realiza

- status ativo/inativo

Regras:

- Se o negócio tiver apenas um profissional ativo, a página pública do cliente NÃO deve mostrar a etapa “Escolha o profissional”.

- Se o negócio tiver dois ou mais profissionais ativos, a página pública deve mostrar a etapa “Escolha o profissional”.

- Os horários disponíveis devem considerar o profissional escolhido.

- Se Carlos está ocupado às 16:00, esse horário fica indisponível para Carlos, mas pode continuar disponível para João se João estiver livre.

- Agendamentos manuais também devem permitir escolher o profissional.

- A agenda do empreendedor deve mostrar qual profissional fará cada atendimento.

No MVP, não crie login separado para cada profissional.

O dono do negócio controla todos os profissionais no mesmo painel.

Não implemente comissão, salário, repasse ou permissões avançadas.-

7. Profissionais

- Tela para cadastrar profissionais do negócio.

- Mostrar lista de profissionais ativos e inativos.

- Cada profissional deve ter nome, foto opcional e serviços que realiza.

- Explicar visualmente que negócios com apenas um profissional não mostram escolha de profissional para o cliente.

Na página pública do cliente, crie o fluxo:

1. Página do negócio

- Mostrar nome do negócio.

- Mostrar descrição.

- Mostrar serviços com preço e duração.

- Cliente escolhe um serviço.

2. Escolha de data e horário

- Mostrar horários disponíveis.

- Apenas horários livres devem aparecer visualmente.

- Mostrar que horários ocupados não aparecem ou ficam indisponíveis.

3. Dados do cliente

- Campos:

  - nome

  - WhatsApp

  - observação opcional

4. Revisão e confirmação

- Mostrar resumo:

  - serviço

  - data

  - horário

  - preço

  - duração

- Mostrar aviso obrigatório:

  “Atenção: seu horário possui tolerância de 15 minutos. Caso você não chegue dentro desse prazo, seu horário poderá ser liberado para outro cliente.”

5. Tela final de confirmação

- Mostrar mensagem:

  “Agendamento confirmado com sucesso.”

- Mostrar dados do agendamento.

Design:

- Interface moderna, simples e limpa.

- Pensada para microempreendedores que não gostam de sistemas complicados.

- Visual profissional, mas fácil de entender.

- Responsivo para celular e desktop.

- Use componentes bem organizados.

- Use dados fictícios realistas.

Não crie marketplace.

Não crie app mobile nativo.

Não crie pagamento real.

Não crie WhatsApp automático.

Não crie integração com Google Agenda.

Não crie IA atendente.

Não complique o sistema.

Objetivo do protótipo:

Validar se o fluxo do cliente e do empreendedor faz sentido antes de conectar banco de dados real.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1361dbac-cdf6-4474-8840-7060087e6ef5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
