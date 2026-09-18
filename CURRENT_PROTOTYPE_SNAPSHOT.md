# Estado Atual do Protótipo — Agenda Certa

## 1. Identificação do snapshot

- **Nome do produto:** Agenda Certa
- **Versão do snapshot:** v0.2
- **Data:** 2026-09-18
- **Repositório analisado:** `Vini-coder256/agenda-certa`
- **Branch analisada:** `main`
- **Status geral:** protótipo visual navegável, sem backend real
- **Observação:** dados fictícios/mockados

Este documento registra o estado observado no código e na documentação da branch `main` em 2026-09-18, após os commits `238157862dc64c2fec976b4b1404b79516689a72` e `a702375b1a3458b84d2e1028c954be1c0b9a4b2c`. Ele descreve o protótipo como existe hoje; não afirma que os fluxos visuais já possuem persistência, segurança ou regras de servidor.

## 2. Histórico de snapshots

| Versão | Data | Descrição | Status |
|---|---|---|---|
| v0.1 | 2026-09-18 | Protótipo visual Lovable organizado com documentação oficial migrada para o repositório principal | Histórico |
| v0.2 | 2026-09-18 | Agenda aprimorada, bloqueios visuais, preservação de histórico em serviços e configurações com tolerância segura e múltiplos períodos | Atual |

## 3. Visão geral do protótipo

O Agenda Certa é hoje um protótipo visual navegável de um Micro SaaS de agendamentos para microempreendedores e pequenos negócios que trabalham com horário marcado. Ele apresenta a jornada do empreendedor — landing page, cadastro, login, onboarding e painel — e a jornada do cliente pelo link público próprio de um negócio.

O protótipo demonstra:

- página pública própria no formato `/b/:slug`, sem catálogo geral de negócios e sem lógica de marketplace;
- cadastro e login simulados;
- onboarding de negócio, períodos, serviços e equipe;
- agendamento público com serviço, profissional, data, horário, dados do cliente e confirmação;
- código visual de gerenciamento do agendamento;
- cancelamento e remarcação simulados;
- painel com resumo, agenda, agendamento manual, serviços, profissionais, configurações e assinatura;
- avisos de tolerância e estados de status em memória.

Grande parte do conteúdo vem de dados fixos em `src/lib/mock.ts` e `src/lib/booking.ts`. O onboarding é a exceção parcial: ele salva a configuração no `localStorage` do navegador por meio de `src/lib/setup.ts`, mas essa configuração não vira uma conta real, não alimenta integralmente as demais telas e não é sincronizada com servidor.

Não existem autenticação real, banco de dados, Supabase conectado, API de backend, migrations, RLS, pagamento real, envio automático por WhatsApp ou persistência real de agendamentos.

## 4. Estrutura de rotas

| Rota | Estado atual |
|---|---|
| `/` | Landing page do Agenda Certa, com apresentação do produto e acessos às demonstrações. |
| `/cadastro` | Formulário visual de criação de conta do empreendedor. Ao enviar, segue para o onboarding. |
| `/entrar` | Login simulado. Qualquer e-mail e senha preenchidos levam ao painel. |
| `/onboarding` | Guia visual de seis etapas para configurar o negócio. Usa estado local e `localStorage`. |
| `/b/:slug` | Página pública de agendamento. Atualmente exibe a Barbearia do Zé mesmo sem validação real do slug. |
| `/b/:slug/gerenciar` | Busca e gerenciamento visual de um agendamento por WhatsApp e código. |
| `/painel` | Layout do painel e dashboard inicial. Pode mostrar estado vazio, configuração local ou demonstração. |
| `/painel/agenda` | Agenda visual com resumo do dia, filtros, ações de status, edição básica e bloqueios de horário simulados. |
| `/painel/novo-agendamento` | Formulário de agendamento manual simulado. |
| `/painel/servicos` | Listagem e manutenção visual de serviços. |
| `/painel/profissionais` | Listagem e manutenção visual de profissionais e seus serviços. |
| `/painel/configuracoes` | Dados do negócio, link público, contato, tolerância e horários. |
| `/painel/assinatura` | Teste grátis e seleção visual de planos, sem cobrança. |

O arquivo `src/routes/painel.tsx` funciona como rota-pai com `Outlet`. O menu responsivo do painel fica em `src/components/painel/painel-shell.tsx`.

## 5. Landing page

A landing apresenta o selo **Agenda Certa · protótipo navegável** e a mensagem principal **“Agenda Certa: a agenda do seu negócio, sem complicação”**. O texto posiciona o produto para negócios que atendem por hora marcada e explica que cada empreendedor cria sua conta, cadastra seu próprio negócio e recebe agendamentos por um link próprio.

Botões principais:

- **Começar grátis**, para `/cadastro`;
- **Ver demonstração do cliente**, para a página pública da Barbearia do Zé;
- **Ver demonstração do empreendedor**, para `/painel?demo=true`;
- **Entrar**, para `/entrar`.

A seção **O que já está no protótipo** destaca resumo do dia, vários profissionais, link público próprio, tolerância, agendamento manual e planos. Há ainda um cartão com o link fictício da Barbearia do Zé e um aviso explícito de que ela é apenas demonstração.

A separação entre empreendedor e cliente ocorre pelos dois botões de demonstração e pelas jornadas distintas. O produto não apresenta busca, vitrine ou catálogo de negócios; o link público pertence a um negócio específico, o que mantém a proposta fora de marketplace.

A landing apresenta a funcionalidade como **Tolerância configurável**, com padrão visual de 15 minutos e sem cancelamento automático.

## 6. Cadastro e login

O cadastro contém nome, e-mail, senha e WhatsApp. A senha exige visualmente pelo menos seis caracteres, e a tela anuncia 15 dias grátis sem cartão de crédito. O envio apenas navega para `/onboarding`; os dados não são enviados a servidor e não criam usuário real.

O login contém e-mail e senha. Qualquer combinação preenchida habilita a entrada e leva para `/painel`. Não há validação de credenciais, sessão, recuperação de senha, autorização nem isolamento entre contas.

## 7. Onboarding

O onboarding possui seis etapas:

1. **Negócio:** nome, categoria, descrição, WhatsApp e endereço/região.
2. **Link:** criação e prévia do slug no formato `agendacerta.app/b/:slug`.
3. **Horários:** dias ativos e um ou mais períodos por dia; o padrão visual é 09:00–12:00 e 13:00–18:00.
4. **Serviços:** nome, preço e duração, com inclusão de múltiplos serviços.
5. **Equipe:** escolha entre **Trabalho sozinho** e **Tenho equipe**; no segundo caso, permite adicionar nome e função.
6. **Revisão:** resumo de negócio, link, WhatsApp, dias, serviços e profissionais, além do aviso de tolerância padrão de 15 minutos.

As regras do MVP já representadas incluem múltiplos períodos, pausas ocultas do cliente, preço e duração associados ao serviço, um profissional padrão para quem trabalha sozinho e fluxo de equipe sem login próprio.

Limitações: não há campo de timezone, foto ou vínculo explícito dos serviços por profissional nessa etapa. O resultado é guardado somente no `localStorage`; o painel usa o nome configurado e exibe números fictícios como demonstração, enquanto página pública, serviços, profissionais e agenda continuam baseados principalmente nos mocks da Barbearia do Zé.

## 8. Página pública do cliente

O cabeçalho mostra nome, descrição, endereço, WhatsApp, dias de atendimento e o link **Já tenho um agendamento**. Hoje todos esses dados vêm do mock da Barbearia do Zé.

O fluxo visual é:

1. escolha de serviço ativo, com descrição, duração e preço;
2. escolha de profissional somente quando dois ou mais profissionais ativos realizam o serviço;
3. escolha de data e horário;
4. nome, WhatsApp e observação opcional;
5. revisão, confirmação e apresentação do código.

Quando há um único profissional apto, ele é escolhido automaticamente e a etapa fica oculta. A disponibilidade é separada por profissional, e horários marcados como ocupados no mock não aparecem.

Antes de confirmar, a tela mostra serviço, profissional quando aplicável, data, horário, duração, valor e o aviso com a tolerância configurada no objeto do negócio. Após confirmar, gera localmente um código no formato `AC-0000`, apresenta o resumo, repete o aviso de tolerância e oferece **Gerenciar meu agendamento**.

Limitações observadas:

- o slug não é validado contra negócios reais;
- a confirmação não persiste o agendamento;
- as datas e disponibilidades são fixas;
- os intervalos mockados foram ajustados visualmente para uma grade de 15 minutos;
- não há cálculo real de duração, fechamento, antecedência mínima, limite de 30 dias, bloqueios ou timezone;
- o formulário mostra o aviso básico de privacidade antes da confirmação;
- estados como slug inexistente, negócio pausado, teste vencido e ausência de horários ainda não estão representados nesta rota.

## 9. Gerenciamento de agendamento pelo cliente

A rota de gerenciamento possui busca visual por WhatsApp e **Código do agendamento**. Atualmente qualquer entrada leva ao mesmo agendamento fictício `AC-4827`, definido em `src/lib/booking.ts`.

A tela de detalhes mostra negócio, serviço, profissional, data, horário, duração, cliente, WhatsApp, código e valor. O usuário pode:

- abrir a confirmação de cancelamento e visualizar a mensagem de liberação do horário;
- escolher outro dia e horário e visualizar a confirmação de remarcação;
- voltar para a página do negócio.

Existe o controle **Simular horário em menos de 1 hora**, exclusivo da demonstração. Quando ativado, os botões de cancelamento e remarcação são substituídos por orientação para falar diretamente com o negócio pelo WhatsApp.

Não existe consulta real, validação do par WhatsApp/código, token de gerenciamento, cálculo de prazo, cancelamento persistido ou criação de novo agendamento na remarcação. Código inválido e link inválido/expirado ainda não têm estados funcionais.

## 10. Painel do empreendedor

O painel usa layout responsivo com menu lateral no desktop e menu móvel. O menu inclui Dashboard, Agenda, Novo agendamento, Serviços, Profissionais, Configurações, Assinatura e acesso à página pública. A lateral mostra dias restantes do teste grátis.

O dashboard exibe cards de:

- agendamentos de hoje;
- ganho previsto;
- ganho real;
- não comparecimentos e perda estimada;
- dias restantes do teste grátis.

Também apresenta próximos horários, origem online/manual, status, link público e destaque de atraso acima da tolerância. As fórmulas do mock seguem a documentação: previsto soma agendados e concluídos; real soma concluídos; cancelados ficam fora.

Os números, clientes, datas e valores são fictícios. Após o onboarding local, o painel informa que o negócio foi criado, mas mantém os números de exemplo para demonstrar uma agenda preenchida.

## 11. Agenda do empreendedor

A Agenda agora possui resumo do dia com total de agendamentos, concluídos, faltas, cancelados, ganho previsto, ganho real e perda por falta. Também apresenta filtros visuais de período, data, profissional e status.

Cada cartão mostra horário, cliente, WhatsApp, serviço, profissional, duração, valor, origem, status e observação quando existente. Para itens agendados, as ações locais permitem:

- marcar como concluído;
- marcar como não compareceu;
- cancelar;
- editar nome do cliente, WhatsApp e observação.

A edição não oferece data, horário, serviço ou profissional e orienta cancelar o agendamento e criar outro quando esses dados precisarem mudar.

A ação **Bloquear horário** abre uma janela visual com data, início, fim, profissional específico ou negócio inteiro e motivo. A tela também exibe bloqueios fictícios e explica que eles não aparecem ao cliente.

Limitações atuais:

- filtros, alterações, edições e bloqueios vivem somente no estado local da tela;
- trocar período ou data não consulta dados reais;
- bloqueios não alteram a disponibilidade pública real;
- não há validação de transição de status ou cálculo real baseado em data e timezone;
- nenhuma dessas ações é persistida ao sair e voltar para a tela.
## 12. Agendamento manual

O formulário contém nome e WhatsApp do cliente, serviço, profissional apto, data, horário, sugestões de horários livres e observação. O resumo mostra duração, valor e tolerância. A interface explica que o horário escolhido deixaria de aparecer publicamente somente para aquele profissional e que os demais continuariam livres.

Ao salvar, surge uma confirmação visual. Nenhum registro é persistido, a Agenda não é atualizada e o horário público não é realmente bloqueado.

## 13. Serviços

A tela lista serviços com nome, descrição, preço, duração e status ativo/inativo. Há formulário visual para novo serviço, botão de edição e alternância entre ativo e inativo.

A interface agora reforça **Desativar serviço** e **Reativar serviço**, removendo o incentivo visual à exclusão de histórico. Também explica que serviços com histórico devem ser desativados, nunca apagados.

O formulário ainda não cria um registro persistente e a edição não possui backend. A alternância de status funciona somente na memória da tela.
## 14. Profissionais

A tela separa ativos e inativos, mostra nome, função, iniciais e serviços realizados e permite ativar/desativar localmente. O cadastro visual contém nome, foto opcional, serviços e status ativo.

Há uma explicação de que a etapa pública fica escondida com um profissional ativo e aparece com dois ou mais. Na página pública, a contagem correta considera profissionais ativos aptos ao serviço selecionado.

O cadastro não persiste, upload e edição não funcionam de verdade, não há agenda individual configurável — conforme o escopo — e o vínculo com serviços existe apenas no estado/mock local.

## 15. Configurações

A tela apresenta:

- nome e descrição do negócio;
- slug/link público e botão visual de copiar;
- WhatsApp e endereço;
- tolerância numérica editável, com padrão de 15 minutos;
- aceitação somente de dígitos;
- mínimo de 5 e máximo de 60 minutos;
- avisos visuais quando o valor fica abaixo ou acima do intervalo;
- explicação de que a tolerância afeta somente avisos e destaque de atraso, sem cancelamento automático;
- ativação e desativação dos dias;
- um ou mais períodos de atendimento por dia;
- ações **Adicionar período** e **Remover período**;
- dias fechados visualmente apagados;
- criação de um período padrão quando um dia fechado é reativado;
- botão **Salvar configurações**.

A segunda-feira demonstra os períodos 09:00–12:00 e 13:00–18:00. A tela explica que pausas como almoço não aparecem ao cliente e apenas tornam aqueles horários indisponíveis.

Todas as mudanças permanecem em `useState`. Nada é persistido: ao sair da tela e voltar, os valores podem retornar aos mocks. Não há timezone configurável, backend ou gravação no Supabase.
## 16. Assinatura e teste grátis

A tela mostra teste grátis de 15 dias, nove dias restantes, datas fixas e barra de progresso. Existem dois planos visuais: Essencial por R$ 39/mês e Equipe por R$ 49/mês. Selecionar **Assinar agora** apenas altera o destaque local.

Não existe cobrança, ativação de assinatura, pagamento manual registrado, controle real dos status `trial`, `active`, `past_due`, `paused`, `cancelled` e `blocked`, nem aplicação das restrições após o teste. O texto explica visualmente que a página pública seria pausada sem apagar dados.

Os nomes, preços e diferenças entre planos são conteúdo do protótipo e ainda não estão consolidados como regra oficial nos documentos de produto.

## 17. Dados mockados

`src/lib/mock.ts` concentra o negócio Barbearia do Zé, serviços, profissionais, agendamentos, status, resumo financeiro, disponibilidade por profissional, datas, teste grátis e planos.

`src/lib/booking.ts` concentra o agendamento fictício `AC-4827`, a geração local de códigos e as opções fictícias de remarcação.

`src/lib/setup.ts` guarda no `localStorage` os dados preenchidos no onboarding. Isso é persistência apenas no navegador, sem usuário autenticado, banco, sincronização ou isolamento seguro.

A busca por agendamento não recupera o que foi criado na página pública: ela sempre retorna o mesmo exemplo. Agenda, serviços, profissionais, bloqueios e configurações continuam baseados em mocks, `useState` ou armazenamento local. Alterações visuais podem resetar ao sair da tela e não alimentam todo o app.

## 18. Coerência com a documentação

| Área | Classificação | Avaliação |
|---|---|---|
| Posicionamento do produto | **Alinhado** | Agenda Certa é apresentado como Micro SaaS com link próprio, sem marketplace. |
| Cadastro, login e onboarding visual | **Parcialmente alinhado** | Jornada principal existe, mas não há autenticação real, timezone no onboarding nem integração completa da configuração local. |
| Serviços e profissionais | **Parcialmente alinhado** | Serviços agora reforçam desativar/reativar e profissionais representam status e vínculos; a persistência ainda não existe. |
| Página pública e escolha de profissional | **Parcialmente alinhado** | Ordem principal, seleção condicional, aviso de privacidade e grade visual de 15 minutos estão presentes; disponibilidade e regras temporais continuam mockadas. |
| Cancelamento e remarcação | **Parcialmente alinhado** | Fluxos e limite visual de 1 hora existem; não há busca, token, cálculo ou atualização real. |
| Tolerância | **Parcialmente alinhado** | O protótipo permite valor numérico de 5 a 60 minutos, mostra avisos e não cancela automaticamente; não há persistência nem efeito real fora da tela. |
| Ganhos e status | **Alinhado no mock** | Fórmulas e quatro estados seguem as regras oficiais, mas não possuem persistência. |
| Períodos de atendimento | **Alinhado visualmente** | Configurações agora permite múltiplos períodos, dias fechados e reativação com período padrão; tudo permanece local. |
| Bloqueios | **Alinhado visualmente** | A Agenda oferece criação, exibição e remoção de bloqueios gerais ou por profissional; eles ainda não afetam a disponibilidade pública real. |
| Passos de 15 minutos | **Alinhado no mock** | Disponibilidade, remarcação e sugestões foram ajustadas para horários em grade de 15 minutos. |
| Estados especiais | **Desalinhado/ausente** | A maior parte dos estados definidos em `SCREEN_FLOW.md` ainda não está implementada visualmente. |
| Admin da plataforma | **Desalinhado/ausente** | Não há rota ou tela do admin mínimo funcional. |
| Banco e segurança | **Planejado, não implementado** | A ausência é esperada nesta fase; `DATABASE_PLAN.md` descreve o trabalho futuro. |

Em síntese, o protótipo está mais alinhado visualmente com as regras operacionais, mas continua sem persistência, autenticação, isolamento e validações de servidor.
## 19. Principais lacunas atuais

- persistência real das configurações;
- autenticação real do empreendedor;
- banco de dados e migrations;
- Supabase conectado;
- políticas RLS e isolamento de dados entre negócios;
- disponibilidade real considerando períodos, duração, bloqueios e agendamentos;
- prevenção atômica de reservas simultâneas e horários duplicados;
- persistência de agenda, serviços, profissionais e bloqueios;
- geração e validação segura de código/token de gerenciamento;
- cálculo consistente com timezone do negócio;
- atualização real após cancelamento e remarcação;
- painel admin da plataforma;
- assinatura e pagamento real;
- estados especiais reais da página pública;
- validação básica de telefone, rate limit e demais proteções anti-spam;
- política detalhada de retenção e exclusão de dados.
## 20. Próximas prioridades recomendadas

1. Melhorar visualmente o painel sem iniciar backend: Agenda, bloqueios, edição permitida, estados vazios e feedbacks.
2. Alinhar o protótipo às regras documentadas: múltiplos períodos nas Configurações, tolerância com opções fechadas, timezone, passos de 15 minutos, privacidade e estados especiais.
3. Revisar o desenho de bloqueios gerais e por profissional e sua interação com agendamentos online e manuais.
4. Fechar decisões ainda não oficiais sobre planos e preços apresentados no protótipo.
5. Antes de conectar Supabase, revisar modelagem, RLS, privacidade, geração de código/token e prevenção atômica de sobreposição.
6. Implementar autenticação e isolamento por negócio.
7. Implementar persistência e disponibilidade real no servidor/banco.
8. Conectar os fluxos de agendamento, cancelamento, remarcação, status e assinatura somente após as garantias de segurança.

## 21. Riscos

- **Horários duplicados:** verificações apenas no front-end não impedem reservas simultâneas.
- **Vazamento entre negócios:** sem autenticação e RLS, dados de clientes podem ser associados ou expostos incorretamente.
- **Timezone:** navegador, backend e banco podem interpretar datas de formas diferentes.
- **Código e token:** códigos simples não podem substituir um segredo técnico seguro; busca e links precisam limitar acesso ao agendamento correto.
- **Abuso e spam:** página pública sem login pode receber agendamentos falsos.
- **Mocks divergentes:** datas, horários e regras fixas podem transmitir comportamento diferente do MVP oficial.
- **Dependência de estado local:** `localStorage` e estado React podem desaparecer, divergir entre telas ou criar falsa impressão de persistência.
- **Exclusão de histórico:** controles de exclusão visual sem regra clara podem incentivar implementação incompatível com a preservação de histórico.
- **Assinatura:** telas de plano podem parecer definitivas mesmo sem preços e diferenças formalmente consolidados.

## 22. Testes manuais do snapshot v0.2

Os seguintes testes foram realizados no preview e passaram:

- tolerância aceita somente números;
- aviso aparece abaixo de 5 minutos;
- aviso aparece acima de 60 minutos;
- segunda-feira aparece com dois períodos;
- adicionar período funciona;
- remover período funciona;
- domingo fechado fica visualmente apagado;
- reativar um dia fechado cria um período padrão.

Esses testes confirmam o comportamento visual. Eles não validam persistência, backend, disponibilidade real ou segurança.

## 23. Conclusão

O Agenda Certa permanece um protótipo visual navegável. A versão v0.2 melhora principalmente Agenda, bloqueios, preservação visual de histórico em Serviços e Configurações de tolerância e períodos.

Ainda não existem backend real, Supabase conectado, autenticação real ou persistência real. Dados de agenda, serviços, profissionais, bloqueios e configurações permanecem em mocks, estado local ou `localStorage`. A persistência foi deliberadamente mantida fora do escopo até a fase de backend.
