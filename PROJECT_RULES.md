# PROJECT_RULES.md

## Resumo do Projeto

Nome: (defina posteriormente — ex: DevHub, FolioAPI, Portly)
Descrição:
Plataforma de gerenciamento de portfólios e blogs para desenvolvedores e criadores de conteúdo.
O usuário (autenticado via NextAuth) poderá gerenciar seus portfólios e/ou blogs e consumir seus dados via API REST autenticada por chave secreta (API Key).

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
  Fluxo de autenticação (login e credenciais/OAuth via NextAuth).
  Rotas protegidas e regras de acesso por roles (admin, user).
  NextAuth handler em `app/api/auth/[...nextauth]/route.ts`.

- (dashboard)/
  Área autenticada do usuário.
  Interface para cadastrar e editar dados de portfólios e blogs.
  Subpastas:
  - portfolio/ → CRUD do portfólio (hero, about, projects, experiences, contacts, pages)
  - blog/ → CRUD do blog (posts, categorias)
  - settings/ → Alteração de perfil e visualização da API Key

- api/
  Rotas de API (públicas e privadas).
  Subpastas:
  - v1/
    - portfolio/ → Endpoints GET autenticados via cabeçalho `x-api-key`
    - blog/ → Endpoints GET autenticados via cabeçalho `x-api-key`
  - auth/ → Endpoints internos (admin) para criação/gestão de usuários; login/logout via NextAuth.

- layout.tsx → Layout global
- page.tsx → Landing opcional
- globals.css → TailwindCSS global

components/
- ui/ → Componentes reutilizáveis (Shadcn/UI), snake_case
- forms/ → Formulários com RHF + Zod
- dashboard/ → Widgets, cards e tabelas do painel
- layout/ → Header, sidebar, footer e navegação

lib/
- prisma.ts → Conexão singleton do Prisma
- auth.ts → Integração NextAuth, helpers e validações
- validation/ → Schemas Zod
- utils/ → Funções utilitárias puras
- constants.ts → Constantes globais

prisma/
- schema.prisma → Modelo de dados
- migrations/ → Histórico de migrações

public/
- Assets estáticos

styles/
- CSS adicional quando necessário

tests/
- Reservado para testes (opcional)

---

## Boas Práticas

### Organização
- snake_case para arquivos/componentes; PascalCase apenas para classes/entidades backend.
- Regras de negócio centralizadas em services; controladores (api/) enxutos.
- Separação clara entre domínio e persistência (Prisma).
- Proibido mockar dados em produção; usar banco real.

### Segurança
- Rotas sob `/api/v1` devem validar `x-api-key`.
- Não aceitar parâmetros sensíveis via URL.
- Senhas com bcrypt; tokens com JWT.
- Somente administradores criam novos usuários.
- Usuários só podem alterar seus próprios dados.
- NextAuth com Prisma Adapter; preferir estratégia JWT.

### Lógica de Negócio (Atualizado)
- Um usuário pode ter:
  - Zero ou múltiplos portfólios
  - Zero ou múltiplos blogs
  - Ambos simultaneamente
- Cada portfólio contém seções modulares (hero, about, projects, experiences, contacts, pages).
- Cada blog contém posts e categorias vinculadas ao usuário.
- Tecnologias são entidades independentes e podem ser associadas a:
  - Projetos
  - Sessão “about”
  - Sessão “hero”
  - Empresas (experiências)

### UI e Acessibilidade
- Componentes acessíveis com roles e labels adequadas.
- Suporte a tema claro/escuro.
- Componentes de UI devem ser puros, receber dados via props.

### Padrões de Código
- TypeScript estrito, sem `any` ou `@ts-ignore`.
- Sem dados simulados em produção.
- Campos `created_at` e `updated_at` atualizados automaticamente via Prisma.
- Funções puras e reutilizáveis em utils/services.

---

## Notas de Migração (múltiplos portfólios/blogs)
- `User` agora possui `portfolios: Portfolio[]` e `blogs: Blog[]`.
- Removida a unicidade de `Portfolio.user_id` e `Blog.user_id`.
- Ajustar seeds para não depender de `upsert` por `user_id`.
- Executar migrações (`prisma migrate dev`) e regerar client (`prisma generate`).
- Atualizar consultas para filtrar por `user_id` do usuário autenticado.