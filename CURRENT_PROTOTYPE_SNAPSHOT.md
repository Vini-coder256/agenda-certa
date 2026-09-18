# Estado Atual do Protótipo — Agenda Certa

## 1. Identificação do snapshot

- **Nome do produto:** Agenda Certa
- **Versão do snapshot:** v0.1
- **Data:** 2026-09-18
- **Repositório analisado:** `Vini-coder256/agenda-certa`
- **Branch analisada:** `main`
- **Status geral:** protótipo visual navegável, sem backend real
- **Observação:** dados fictícios/mockados

Este documento registra o estado observado no código e na documentação da branch `main` em 2026-09-18. Ele descreve o protótipo como existe hoje; não afirma que os fluxos visuais já possuem persistência, segurança ou regras de servidor.

## 2. Histórico de snapshots

| Versão | Data | Descrição | Status |
|---|---|---|---|
| v0.1 | 2026-09-18 | Protótipo visual Lovable organizado com documentação oficial migrada para o repositório principal | Atual |

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
| `/painel/agenda` | Agenda visual com filtro por profissional, status e ações simuladas. |
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

Observação de coerência: o cartão da landing chama a funcionalidade de **Tolerância de 15 min**, embora a regra oficial permita configurar 5, 10, 15, 20 ou 30 minutos, com 15 como padrão.

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
- os intervalos mockados não seguem sempre passos de 15 minutos;
- não há cálculo real de duração, fechamento, antecedência mínima, limite de 30 dias, bloqueios ou timezone;
- o aviso básico de privacidade previsto na documentação oficial não aparece no formulário;
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

A Agenda já possui seletor visual de dias, filtro por profissional e cartões com horário, duração, cliente, WhatsApp, serviço, preço, profissional, origem, status e observação. Para itens agendados, existem ações locais de **Concluído**, **Não veio** e **Cancelar**. O atraso acima da tolerância recebe destaque.

Limitações atuais:

- trocar o dia não troca os agendamentos exibidos;
- as alterações de status vivem somente no estado da tela;
- não existe ação **Bloquear horário**;
- não há visualização nem cadastro de bloqueios gerais ou por profissional;
- não há edição de nome, WhatsApp e observação;
- não há validação de transição de status ou cálculo real baseado em data e timezone;
- o texto de atraso diz que o horário pode ser liberado, mas nenhuma operação real acontece.

## 12. Agendamento manual

O formulário contém nome e WhatsApp do cliente, serviço, profissional apto, data, horário, sugestões de horários livres e observação. O resumo mostra duração, valor e tolerância. A interface explica que o horário escolhido deixaria de aparecer publicamente somente para aquele profissional e que os demais continuariam livres.

Ao salvar, surge uma confirmação visual. Nenhum registro é persistido, a Agenda não é atualizada e o horário público não é realmente bloqueado.

## 13. Serviços

A tela lista serviços com nome, descrição, preço, duração e status ativo/inativo. Há formulário visual para novo serviço, botão de edição, alternância entre ativo e inativo e um ícone de exclusão.

O formulário apenas fecha ao salvar; não acrescenta um serviço real. Editar e excluir não possuem implementação funcional. A alternância de status funciona somente na memória da tela.

Desalinhamento visual relevante: a documentação determina desativar, em vez de apagar, serviços que possuam histórico. O ícone de exclusão aparece sem contexto ou proteção, embora não execute exclusão.

## 14. Profissionais

A tela separa ativos e inativos, mostra nome, função, iniciais e serviços realizados e permite ativar/desativar localmente. O cadastro visual contém nome, foto opcional, serviços e status ativo.

Há uma explicação de que a etapa pública fica escondida com um profissional ativo e aparece com dois ou mais. Na página pública, a contagem correta considera profissionais ativos aptos ao serviço selecionado.

O cadastro não persiste, upload e edição não funcionam de verdade, não há agenda individual configurável — conforme o escopo — e o vínculo com serviços existe apenas no estado/mock local.

## 15. Configurações

A tela apresenta:

- nome e descrição do negócio;
- slug/link público e botão visual de copiar;
- WhatsApp e endereço;
- tolerância padrão;
- ativação dos dias e horário de abertura/fechamento;
- botão **Salvar configurações**.

Limitações e diferenças:

- os valores não são persistidos;
- a tolerância é um campo numérico livre, sem restringir a 5, 10, 15, 20 ou 30 minutos;
- não há timezone;
- cada dia permite apenas um intervalo nessa tela, embora o onboarding e a regra oficial permitam múltiplos períodos;
- não há configurações de privacidade ou estado da conta.

## 16. Assinatura e teste grátis

A tela mostra teste grátis de 15 dias, nove dias restantes, datas fixas e barra de progresso. Existem dois planos visuais: Essencial por R$ 39/mês e Equipe por R$ 49/mês. Selecionar **Assinar agora** apenas altera o destaque local.

Não existe cobrança, ativação de assinatura, pagamento manual registrado, controle real dos status `trial`, `active`, `past_due`, `paused`, `cancelled` e `blocked`, nem aplicação das restrições após o teste. O texto explica visualmente que a página pública seria pausada sem apagar dados.

Os nomes, preços e diferenças entre planos são conteúdo do protótipo e ainda não estão consolidados como regra oficial nos documentos de produto.

## 17. Dados mockados

`src/lib/mock.ts` concentra o negócio Barbearia do Zé, serviços, profissionais, agendamentos, status, resumo financeiro, disponibilidade por profissional, datas, teste grátis e planos.

`src/lib/booking.ts` concentra o agendamento fictício `AC-4827`, a geração local de códigos e as opções fictícias de remarcação.

`src/lib/setup.ts` guarda no `localStorage` os dados preenchidos no onboarding. Isso é persistência apenas no navegador, sem usuário autenticado, banco, sincronização ou isolamento seguro.

A busca por agendamento não recupera o que foi criado na página pública: ela sempre retorna o mesmo exemplo. Da mesma forma, agendamentos manuais, status, serviços, profissionais e configurações alterados nas telas não sobrevivem de maneira confiável nem alimentam todo o app.

## 18. Coerência com a documentação

| Área | Classificação | Avaliação |
|---|---|---|
| Posicionamento do produto | **Alinhado** | Agenda Certa é apresentado como Micro SaaS com link próprio, sem marketplace. |
| Cadastro, login e onboarding visual | **Parcialmente alinhado** | Jornada principal existe, mas não há autenticação real, timezone no onboarding nem integração completa da configuração local. |
| Serviços e profissionais | **Parcialmente alinhado** | Cadastro, status e vínculo aparecem visualmente; persistência não existe e há ícone de exclusão de serviço contrário à orientação de preservar histórico. |
| Página pública e escolha de profissional | **Parcialmente alinhado** | Ordem principal, seleção condicional e dados do serviço estão presentes; disponibilidade e regras temporais são mocks. |
| Cancelamento e remarcação | **Parcialmente alinhado** | Fluxos e limite visual de 1 hora existem; não há busca, token, cálculo ou atualização real. |
| Tolerância | **Parcialmente alinhado** | Aviso público e destaque de atraso existem; seletor ainda aceita qualquer número e a landing comunica 15 minutos como se fosse fixo. |
| Ganhos e status | **Alinhado no mock** | Fórmulas e quatro estados seguem as regras oficiais, mas não possuem persistência. |
| Períodos de atendimento | **Parcialmente alinhado** | Onboarding suporta vários períodos; Configurações e mock principal suportam apenas um por dia. |
| Bloqueios | **Desalinhado/ausente** | A documentação inclui bloqueio geral e por profissional no MVP, mas a Agenda não oferece a ação. |
| Passos de 15 minutos | **Desalinhado no mock** | Há horários como 09:40 e 10:20, incompatíveis com uma grade iniciada a cada 15 minutos. |
| Estados especiais | **Desalinhado/ausente** | A maior parte dos estados definidos em `SCREEN_FLOW.md` ainda não está implementada visualmente. |
| Admin da plataforma | **Desalinhado/ausente** | Não há rota ou tela do admin mínimo funcional. |
| Banco e segurança | **Planejado, não implementado** | A ausência é esperada nesta fase; `DATABASE_PLAN.md` descreve o trabalho futuro. |

Em síntese, o protótipo está alinhado com a narrativa e com os fluxos centrais, mas apenas parcialmente alinhado com as regras operacionais completas do MVP.

## 19. Principais lacunas atuais

- backend ou Supabase;
- autenticação e sessão reais;
- banco de dados, migrations e políticas RLS;
- isolamento de dados entre negócios;
- persistência de cadastros e agendamentos;
- validação de disponibilidade no servidor/banco;
- prevenção atômica de conflitos e horários duplicados;
- geração e validação segura de código/token de gerenciamento;
- cálculo consistente com timezone do negócio;
- grade real em passos de 15 minutos, duração, períodos, antecedência e horizonte de 30 dias;
- bloqueios gerais e por profissional;
- atualização real após cancelamento e remarcação;
- restrições reais de teste grátis e assinatura;
- registro manual de pagamento/ativação;
- admin mínimo da plataforma;
- estados especiais da página pública;
- validação básica de telefone, rate limit e demais proteções anti-spam;
- aviso de privacidade no agendamento público;
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

## 22. Conclusão

O Agenda Certa está em uma boa etapa de protótipo visual: as duas jornadas principais são navegáveis, o posicionamento do produto está claro e o painel já demonstra o valor esperado. Ainda não é um MVP funcional, porque regras críticas, segurança e persistência não existem fora dos mocks e do armazenamento local.

O próximo avanço deve continuar pelo painel e pelo alinhamento visual das regras já decididas. A preparação do backend deve começar somente depois de revisar modelagem, RLS, concorrência, timezone, privacidade e gerenciamento seguro de agendamentos.
