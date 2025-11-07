# PROJECT_RULES.md

## Resumo do Projeto

Nome: (defina posteriormente — ex: DevHub, FolioAPI, Portly)  
Descrição:  
Plataforma de gerenciamento de portfólios e blogs para desenvolvedores e criadores de conteúdo.  
O usuário (autenticado via NextAuth) poderá gerenciar seu portfólio e/ou blog e consumir seus dados via API REST autenticada por chave secreta (API Key).

---

## Stack Principal

| Stack | Função | Observações |
|--------|--------|--------------|
| Next.js 15 (App Router) | Framework full-stack React | Suporte a SSR/ISR e rotas de API |
| TypeScript | Tipagem estática e segurança | Configurar `strict: true` |
| Prisma ORM | Acesso ao banco de dados (Postgres/Supabase Postgres) | Schema definido em `/prisma/schema.prisma` |
| NextAuth | Autenticação e sessões | Usar Prisma Adapter; estratégia JWT ou DB sessions |
| Supabase Postgres (DB) | Banco de dados gerenciado (opcional) | Usado apenas como Postgres; sem Supabase Auth |
| Shadcn/UI + TailwindCSS | Componentes e estilização moderna | Interface do dashboard e formulários |
| Zod | Validação de dados | Usado em rotas, formulários e inputs da API |
| Axios | Consumo de APIs externas ou internas | Preferencial em clientes REST |
| React Hook Form | Controle de formulários | Integração com Zod para validação |
| Bcrypt / JWT | Criptografia e autenticação por API Key | Segurança de rotas protegidas |

---

## Estrutura de Pastas

app/  
- (auth)/  
  Contém a experiência de autenticação (páginas de login e fluxo de credenciais/OAuth via NextAuth).  
  Todas as rotas devem estar protegidas e seguir as regras de acesso baseadas em roles (admin, user).  
  NextAuth handler em `app/api/auth/[...nextauth]/route.ts`.

- (dashboard)/  
  Área autenticada do usuário.  
  Contém a interface principal para cadastrar e editar os dados de portfólio e blog.  
  Subpastas:  
  - portfolio/ → CRUD do portfólio (hero, about, projects, experiences, contacts)  
  - blog/ → CRUD do blog (posts, categorias)  
  - settings/ → Alteração de dados do perfil e visualização da API Key  

- api/  
  Contém todas as rotas de API (públicas e privadas).  
  Subpastas:  
  - v1/  
    - portfolio/ → Endpoints GET autenticados via cabeçalho x-api-key  
    - blog/ → Endpoints GET autenticados via cabeçalho x-api-key  
  - auth/ → Endpoints internos apenas para criação/gestão de usuários (apenas admin); login/logout são geridos pelo NextAuth em `app/api/auth/[...nextauth]/route.ts`.

- layout.tsx  
  Layout global da aplicação.  

- page.tsx  
  Página inicial (opcional, pode exibir informações básicas do projeto).  

- globals.css  
  Estilos globais configurados com TailwindCSS.  

---

components/  
- ui/  
  Componentes reutilizáveis baseados no Shadcn/UI.  
  Todos devem seguir padrão snake_case (exemplo: input_field.tsx, primary_button.tsx).  

- forms/  
  Componentes específicos para formulários integrados com React Hook Form e Zod.  

- dashboard/  
  Widgets, cards e tabelas utilizados no painel do usuário.  

- layout/  
  Estrutura de navegação (header, sidebar, footer) e elementos fixos de interface.  

---

lib/  
- prisma.ts → Conexão singleton com o Prisma ORM.  
- supabase_client.ts → (Opcional) Instância do Supabase caso use SDK; preferir acesso via Prisma.  
- auth.ts → Integração com NextAuth (helpers), middlewares e validações de tokens e API Keys.  
- validation/ → Schemas de validação com Zod.  
- utils/ → Funções utilitárias puras e genéricas.  
- constants.ts → Constantes globais do sistema.  

---

prisma/  
- schema.prisma → Definição do modelo de dados do banco (refletindo o DBML do sistema).  
- migrations/ → Histórico de migrações automáticas criadas pelo Prisma.  

---

public/  
- Armazena imagens, logos e recursos estáticos que podem ser servidos publicamente.  

---

styles/  
- Arquivos CSS adicionais, quando necessário.  

---

tests/  
- Pasta reservada para possíveis testes futuros (não obrigatória).  

---

## Boas Práticas de Desenvolvimento

### Organização
- Utilize snake_case para nomes de arquivos e componentes.  
- Utilize PascalCase apenas para classes e entidades no backend.  
- Centralize as regras de negócio em services, mantendo os controladores (api/) enxutos.  
- Mantenha a separação clara entre camada de domínio (regras de negócio) e camada de persistência (Prisma).  
- Proibido mockar dados. Todos os dados devem ser persistidos e lidos do banco de dados real (Supabase).  

### Segurança
- Todas as rotas sob /api/v1 devem validar a API Key enviada via cabeçalho HTTP x-api-key.  
- Nenhuma rota deve aceitar parâmetros sensíveis via URL (?id= ou similares).  
- Armazene senhas com bcrypt e valide tokens com JWT.  
- Garanta que apenas administradores possam criar novos usuários.  
- Usuários podem alterar apenas seus próprios dados.  
 - Autenticação e sessões devem ser geridas pelo NextAuth com Prisma Adapter (Postgres/Supabase Postgres).  
 - Preferir estratégia JWT do NextAuth para ambientes serverless; sessions em DB são opcionais conforme necessidade.  

### Lógica de Negócio
- Um usuário pode ter:  
  - Nenhum ou um portfólio  
  - Nenhum ou um blog  
  - Ou ambos simultaneamente  
- Cada portfólio contém seções modulares (hero, about, projects, experiences, contacts).  
- Cada blog contém posts e categorias vinculadas ao usuário.  
- As tecnologias são entidades independentes e podem ser associadas a:  
  - Projetos  
  - Sessão “about”  
  - Sessão “hero”  
  - Empresas (experiência)  

### UI e Acessibilidade
- Todos os componentes devem ser acessíveis, utilizando roles e labels adequadas.  
- Implementar suporte a modo escuro e claro.  
- Evitar lógica de dados dentro de componentes de interface — eles devem ser puros e receber dados via props.  

### Padrões de Código
- Código 100% tipado com TypeScript.  
- Nenhum uso de any ou @ts-ignore.  
- Nenhum dado simulado (mockado).  
- Atualizar automaticamente campos created_at e updated_at via middlewares Prisma.  
- Funções puras e reutilizáveis em utils e services.  

---

Este documento define todas as regras que devem ser seguidas para manter padronização, segurança e escalabilidade do projeto.  
A estrutura foi planejada para garantir que o sistema cresça de forma modular, sem acoplamento excessivo e com fluxo limpo entre backend e frontend.
