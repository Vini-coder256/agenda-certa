# Próximo Prompt Para o Lovable

Use quando houver créditos suficientes.

Objetivo: atualizar o protótipo visual navegável do **Agenda Certa** sem refazer tudo do zero.

Não conecte Supabase. Não crie banco, backend, migration, pagamento real ou API externa. Use somente dados fictícios e mantenha a Barbearia do Zé claramente identificada como demonstração.

## 1. Posicionamento

O Agenda Certa é um Micro SaaS, não um marketplace. Cada empreendedor possui um negócio no MVP e divulga seu link `/b/:slug`.

Três tipos de uso:

- cliente sem login;
- empreendedor com painel;
- admin da plataforma.

## 2. Landing, cadastro e login

Landing com:

- Começar grátis;
- Ver demonstração do cliente;
- Ver demonstração do empreendedor;
- Login.

Cadastro: nome, e-mail, senha e WhatsApp, com aviso de 15 dias grátis.

Login simulado deve levar ao onboarding quando incompleto ou ao dashboard quando completo.

## 3. Onboarding

Etapas:

1. dados do negócio;
2. slug com prévia `/b/ana-nails`;
3. timezone, padrão `America/Sao_Paulo`;
4. períodos de atendimento, permitindo 09:00–12:00 e 13:00–18:00 no mesmo dia;
5. serviços com preço e duração;
6. profissionais com nome, foto opcional, serviços e status;
7. revisão.

Não criar horário individual, login, comissão, salário ou repasse para profissional.

## 4. Painel e agenda

Menu:

- Dashboard;
- Agenda;
- Novo agendamento;
- Serviços;
- Profissionais;
- Configurações;
- Assinatura;
- Ver página pública.

Na Agenda, incluir:

- concluir;
- não compareceu;
- cancelar;
- editar nome, WhatsApp e observação;
- **Bloquear horário**.

O bloqueio visual pode ser geral ou para um profissional, com início, fim e motivo.

Não permitir edição visual de data, horário, serviço ou profissional; orientar cancelamento e criação de outro.

## 5. Página pública

Fluxo:

1. serviço;
2. profissional somente se dois ou mais profissionais ativos realizarem o serviço;
3. data;
4. horário;
5. nome, WhatsApp e observação opcional;
6. revisão;
7. confirmação.

Simular:

- horários em passos de 15 minutos;
- antecedência mínima de 1 hora;
- até 30 dias no futuro;
- múltiplos períodos por dia;
- bloqueios e conflitos por profissional;
- serviço terminando antes do fechamento.

Horários indisponíveis simplesmente não aparecem.

Antes da confirmação, mostrar:

> Atenção: seu horário possui tolerância de {tolerância configurada} minutos. Caso você não chegue dentro desse prazo, seu horário poderá ser liberado para outro cliente.

> Ao agendar, você informa nome e WhatsApp para que o negócio possa identificar e acompanhar seu atendimento.

Nas configurações do negócio, adicionar um seletor de tolerância com 5, 10, 15, 20 ou 30 minutos. O padrão é 15 minutos quando nada for escolhido.

A página pública deve mostrar o valor configurado. A tolerância serve somente para o aviso e o destaque visual de atraso: não altera a duração do serviço e não cancela automaticamente. O empreendedor decide se marca “não compareceu”.

## 6. Confirmação e gerenciamento

Na confirmação, mostrar resumo, **Código do agendamento** como `AC-4827`, botão **Gerenciar meu agendamento** e instrução para guardar o código/link.

Não mostrar a palavra “token”.

Criar fluxo visual sem login para:

- consultar por código;
- cancelar;
- remarcar.

Até 1 hora antes, cancelamento libera o horário. Remarcação deve parecer uma ação simples, embora represente cancelamento do antigo e criação do novo.

Com menos de 1 hora, orientar contato pelo WhatsApp do negócio.

## 7. Status e métricas

Status visuais:

- agendado;
- concluído;
- não compareceu;
- cancelado.

Cards:

- ganho previsto: agendado + concluído;
- ganho real: concluído;
- perda por falta: não compareceu.

Cancelado não entra nos ganhos.

## 8. Teste e assinatura

Simular status:

- teste grátis;
- ativa;
- vencida;
- pausada;
- cancelada;
- bloqueada.

Após o teste vencido, mostrar painel e histórico, permitir ações em agendamentos existentes, bloquear novo agendamento manual e mostrar página pública temporariamente indisponível.

Não implementar pagamento automático.

## 9. Estados especiais

Criar estados visuais para:

- slug inexistente;
- negócio pausado;
- teste vencido;
- sem serviços ativos;
- sem profissionais ativos;
- sem horários;
- negócio bloqueado;
- cancelamento/remarcação com menos de 1 hora;
- código inválido;
- link inválido ou expirado.

## 10. Admin da plataforma

Protótipo com dados fictícios para:

- listar empreendedores e negócios;
- ver teste e assinatura;
- ativar, pausar e bloquear conta.

Não criar gráficos complexos, automações financeiras, suporte completo ou auditoria avançada.

## 11. Não implementar

- Supabase, banco, backend ou migrations;
- pagamento real;
- WhatsApp automático;
- IA ou agente de WhatsApp;
- marketplace;
- aplicativo nativo;
- login de profissional;
- integrações externas;
- financeiro completo;
- horários individuais de profissional.

WhatsApp automático fica para MVP 1.5 ou posterior, com templates fixos e API oficial, sem IA para escrever mensagens.

## 12. Resultado esperado

Um protótipo visual coerente de plataforma SaaS:

```text
landing
→ cadastro/login
→ onboarding
→ painel
→ página pública /b/:slug
→ agendamento
→ confirmação com código
→ gerenciamento sem login
```

A Barbearia do Zé continua apenas como demonstração.

