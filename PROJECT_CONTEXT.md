# Contexto Oficial do Projeto — Agenda Certa

Este documento é a memória oficial do produto. O GitHub é a fonte oficial da verdade do projeto.

O repositório principal atual é `Vini-coder256/agenda-certa`, reunindo código e documentação na branch `main`. O antigo repositório apenas documental foi renomeado para `Vini-coder256/agenda-certa-docs-backup` e permanece somente como backup histórico.

## 1. Nome e definição

O nome oficial e de trabalho do MVP é **Agenda Certa**. Ele pode mudar no futuro, mas deve ser usado como nome principal em toda a documentação atual.

O Agenda Certa é um Micro SaaS de agendamentos para microempreendedores e pequenos negócios que trabalham com horário marcado.

O produto não é marketplace. Cada empreendedor divulga seu próprio link público no formato:

```text
/b/:slug
```

Exemplo:

```text
/b/ana-nails
```

## 2. Problema e proposta

Muitos pequenos negócios organizam horários por WhatsApp, caderno, memória ou planilhas. Isso causa conflitos, perda de tempo, faltas e dificuldade para acompanhar atendimentos e ganhos.

O Agenda Certa oferece:

- página pública de agendamento;
- painel privado do empreendedor;
- agenda online e manual;
- serviços, profissionais e horários;
- bloqueios de exceção;
- controle simples de faltas e ganhos;
- administração básica da plataforma.

## 3. Público-alvo

O foco são negócios que vendem tempo por horário marcado, como:

- barbearias;
- manicures e cabeleireiras;
- pequenos salões e studios de estética;
- profissionais de cílios e sobrancelhas;
- personal trainers;
- professores particulares;
- massagistas;
- outros prestadores locais com agenda.

O MVP não deve tentar atender todos os tipos de MEI.

## 4. Tipos de uso

### 4.1 Cliente final

Acessa o link público, agenda, cancela ou remarca sem criar conta, login ou senha.

### 4.2 Empreendedor

Cria conta e administra negócio, serviços, profissionais, períodos de atendimento, bloqueios e agendamentos.

### 4.3 Admin da plataforma

É o dono do SaaS. Acompanha empreendedores, negócios, testes grátis e assinaturas e pode ativar, pausar ou bloquear contas.

## 5. Conta, negócio e isolamento

No MVP, vale a regra:

```text
uma conta de empreendedor = um negócio
```

A estrutura técnica pode ser preparada para múltiplos negócios no futuro, mas a interface e as regras atuais devem considerar apenas um.

A assinatura fica ligada ao negócio e ao dono.

O sistema é multiempresa. Um empreendedor nunca pode ver dados de outro. Dados pessoais de clientes também não podem aparecer em páginas públicas.

## 6. Serviços

Cada serviço possui:

- nome;
- descrição opcional;
- preço positivo;
- duração positiva em minutos;
- status ativo/inativo.

Serviços com histórico não são apagados: são desativados. Um serviço desativado não aparece para novos agendamentos, mas permanece nos antigos.

## 7. Profissionais

Profissionais entram no MVP de forma simples.

Cada profissional pode ter:

- nome;
- foto opcional;
- serviços que realiza;
- status ativo/inativo.

Não existem no MVP:

- login ou senha de profissional;
- painel próprio;
- permissões próprias;
- comissão, salário ou repasse;
- horário personalizado por profissional.

Todo agendamento deve salvar `professional_id`, mesmo quando existe apenas um profissional.

Depois que o cliente escolhe o serviço:

- 1 profissional ativo capaz de realizá-lo: não mostrar escolha;
- 2 ou mais profissionais ativos capazes de realizá-lo: mostrar escolha.

Um profissional ocupado não bloqueia os demais.

Profissionais com histórico não são apagados: são desativados. Eles deixam de aparecer para novos agendamentos, mas continuam nos antigos.

## 8. Períodos de atendimento

Cada dia pode ter um ou mais períodos, por exemplo:

```text
Segunda: 09:00–12:00 e 13:00–18:00
```

Pausas como almoço não aparecem ao cliente; os horários indisponíveis simplesmente não são oferecidos.

No MVP, todos os profissionais seguem os períodos gerais do negócio. Horários personalizados por profissional ficam para uma versão futura.

Cada negócio deve possuir timezone. O padrão do MVP é `America/Sao_Paulo`. Navegador, backend e banco deverão tratar datas no mesmo fuso de referência para evitar deslocamentos de horário.

## 9. Bloqueios

Bloqueios entram no MVP para exceções como:

- folga;
- emergência;
- compromisso;
- manutenção;
- profissional que saiu mais cedo;
- horário reservado internamente.

O empreendedor bloqueia um intervalo. O bloqueio pode valer para todo o negócio ou para um profissional específico.

Bloqueios impedem novos agendamentos e não aparecem publicamente. A Agenda deve oferecer a ação **Bloquear horário**.

## 10. Disponibilidade

Horários candidatos são gerados a cada 15 minutos.

Regras do MVP:

- antecedência mínima de 1 hora para agendamento no mesmo dia;
- limite de 30 dias no futuro;
- intervalo automático entre atendimentos de 0 minutos;
- o serviço deve terminar dentro do mesmo período de atendimento;
- agendamentos online e manuais bloqueiam da mesma forma;
- agendamentos cancelados não bloqueiam;
- bloqueios gerais e do profissional devem ser considerados;
- disponibilidade deve usar o timezone do negócio.

A criação precisa considerar períodos, duração, profissional, vínculos entre profissional e serviço, agendamentos, bloqueios, status, antecedência, limite futuro e situação da assinatura ou teste grátis.

## 11. Agendamento público e manual

O cliente não pode escolher livremente preço, duração ou status. Esses valores são definidos pelo sistema a partir do serviço cadastrado.

O status inicial é `scheduled`. Antes de salvar, o servidor ou banco deve validar negócio, serviço, profissional, preço, duração, disponibilidade, bloqueios, horário e assinatura/teste.

Não basta verificar disponibilidade no front-end. Dois clientes podem tentar reservar quase ao mesmo tempo; o backend e o banco deverão impedir sobreposição de forma segura.

O empreendedor também pode criar agendamento manual. Ele ocupa o horário exatamente como um agendamento online.

## 12. Gerenciamento pelo cliente

O cliente pode cancelar ou remarcar sem login por:

- código simples, por exemplo `AC-4827`;
- link seguro de gerenciamento.

Internamente, o agendamento deve prever `manage_code` e um `manage_token` seguro ou estrutura equivalente. A palavra “token” não deve aparecer na interface do cliente.

Usar os textos **Código do agendamento** e **Gerenciar meu agendamento**.

Cancelamento e remarcação online só são permitidos até 1 hora antes do início. Com menos de 1 hora, a interface orienta o cliente a falar com o negócio pelo WhatsApp.

Ao cancelar dentro do prazo, o horário volta a ficar disponível.

Ao remarcar:

1. validar o novo horário;
2. cancelar o agendamento antigo;
3. criar um novo agendamento;
4. liberar o horário antigo;
5. bloquear o novo horário.

Na interface, a ação se chama **Remarcar**. Internamente, pode ser cancelamento antigo mais novo agendamento.

## 13. Edição pelo empreendedor

No MVP, o empreendedor pode editar somente:

- nome do cliente;
- WhatsApp;
- observação.

Para alterar data, horário, serviço ou profissional, deve cancelar o antigo e criar outro. Remarcação avançada no painel fica fora do MVP.

## 14. Status e ganhos

Status oficiais:

- `scheduled` = agendado;
- `completed` = concluído;
- `no_show` = não compareceu;
- `cancelled` = cancelado.

Para um período escolhido:

- ganho previsto = `scheduled` + `completed`;
- ganho real = somente `completed`;
- perda por falta = somente `no_show`;
- `cancelled` nunca entra nos ganhos.

Um atendimento continua no previsto enquanto estiver `scheduled`, mesmo se o horário já passou. `no_show` não conta como ganho real. `cancelled` não bloqueia horário.

## 15. Tolerância

A tolerância de atraso é configurável por negócio no MVP.

Regras:

- valor padrão: 15 minutos;
- valores permitidos: 5, 10, 15, 20 ou 30 minutos;
- se o empreendedor não configurar, usar 15 minutos;
- a configuração fica vinculada ao negócio;
- a página pública mostra o valor configurado antes da confirmação;
- o sistema não cancela automaticamente;
- depois da tolerância, o empreendedor decide se marca `no_show`;
- a tolerância afeta somente avisos e destaque de atraso;
- a tolerância não altera a duração do serviço nem a disponibilidade calculada.

## 16. Teste grátis e assinatura

O teste grátis dura 15 dias e começa quando a conta e o negócio são criados. O sistema mostra quantos dias restam.

Status oficiais:

- `trial` = teste grátis;
- `active` = assinatura ativa;
- `past_due` = pagamento vencido;
- `paused` = conta pausada;
- `cancelled` = assinatura cancelada;
- `blocked` = conta bloqueada.

Se o teste terminar sem assinatura ativa:

- a página pública não aceita novos agendamentos;
- o cliente vê “Agenda temporariamente indisponível”;
- o empreendedor ainda entra no painel e consulta o histórico;
- pode concluir, cancelar ou marcar falta nos agendamentos existentes;
- não pode criar agendamentos online ou manuais;
- ao ativar a assinatura, novos agendamentos voltam a ser aceitos.

O pagamento pode ser manual no MVP. Pagamento automático não deve ser implementado agora.

## 17. Estados especiais da página pública

A interface deve ter mensagens simples para:

- slug inexistente: “Negócio não encontrado.”;
- negócio pausado: “Agenda temporariamente indisponível.”;
- teste vencido: “Agenda temporariamente indisponível.”;
- sem serviços ativos: “Nenhum serviço disponível no momento.”;
- sem profissionais ativos: “Nenhum profissional disponível no momento.”;
- sem horários: “Não há horários disponíveis para esta data.”;
- negócio bloqueado: “Agenda temporariamente indisponível.”;
- cancelamento/remarcação com menos de 1 hora: orientar contato pelo WhatsApp;
- código inválido: “Código do agendamento inválido.”;
- link inválido ou expirado: “Este link de gerenciamento não é válido. Use o código do agendamento ou fale com o negócio.”

## 18. Privacidade, LGPD e anti-spam

O sistema guarda nome e WhatsApp dos clientes. Esses dados são visíveis somente ao empreendedor dono do negócio e aos acessos administrativos autorizados quando necessário.

Dados pessoais não aparecem em páginas públicas nem para outros empreendedores.

Aviso básico da página pública:

> Ao agendar, você informa nome e WhatsApp para que o negócio possa identificar e acompanhar seu atendimento.

Políticas detalhadas de retenção e exclusão ficam para uma versão futura.

Como não há login do cliente, existe risco de agendamentos falsos. No MVP, nome e WhatsApp são obrigatórios e o telefone recebe validação básica. Rate limit, captcha, verificação do telefone e bloqueio de abuso ficam planejados para evolução.

## 19. Admin mínimo

No MVP real, o admin deve poder:

- ver empreendedores;
- ver negócios;
- ver status de teste e assinatura;
- ativar conta;
- pausar conta;
- bloquear conta manualmente.

Relatórios avançados, gráficos complexos, automações financeiras, suporte completo e auditoria avançada ficam fora do MVP.

## 20. Fora do MVP inicial

- marketplace;
- aplicativo mobile nativo;
- pagamento online do serviço pelo cliente;
- WhatsApp automático;
- IA atendente ou agente de WhatsApp;
- login e permissões de profissional;
- comissões e repasses;
- horários individuais de profissional;
- pagamento automático da assinatura;
- financeiro completo, estoque e nota fiscal;
- Google Agenda e Instagram;
- avaliações, cupons e fidelidade;
- relatórios avançados;
- remarcação avançada pelo painel.

WhatsApp automático é uma melhoria de MVP 1.5 ou posterior. Futuramente poderá enviar confirmação, código e instruções por API oficial do WhatsApp Business ou serviço equivalente, usando templates fixos com variáveis, sem IA para escrever mensagens.

## 21. Demonstração

A Barbearia do Zé permanece apenas como demonstração visual. Dados fictícios devem estar claramente separados de dados reais e nunca ser requisito do produto.

## 22. Objetivo de validação

O MVP deve responder se o empreendedor entende a proposta, se o cliente agenda facilmente, se conflitos são evitados, se a agenda e os ganhos são claros e se existe disposição para pagar pelo serviço.

