## Objetivo
- Substituir os cards personalizados por tabelas com o padrão do módulo de Usuários.
- Usar o DataTable global (`components/dashboard/data_table.tsx`) com colunas dinâmicas e ações de editar/excluir.
- Manter a primeira coluna como ID sequencial (1..n) e a última como Ações.

## Componentes e Estrutura
- Reutilizar DataTable global: `components/dashboard/data_table.tsx`.
- Para cada página, criar dois arquivos:
  - `columns.tsx` (client) – define tipos, colunas e células (render de ações, formatação, etc.).
  - `data_table.tsx` (client) – wrapper que aplica filtros, ordenação, botão “Novo” (Dialog) e invoca `DataTable`.
- Atualizar a `page.tsx` (server) de cada rota para:
  - Buscar dados via Prisma.
  - Montar o array tipado de linhas.
  - Renderizar o `HeroBanner` e o componente `DataTableX` passando `data`.

## Páginas Alvo e Colunas
- `app/dashboard/portfolio/projects`:
  - Colunas: `ID (seq)`, `Título`, `Slug`, `Descrição`, `Imagem`, `Criado em`, `Ações`.
  - Ações: `Editar` (Dialog com form de update), `Excluir` (softDestructive) usando server action existente.
- `app/dashboard/portfolio/experiences`:
  - Colunas: `ID (seq)`, `Título`, `Subtítulo`, `Portfólio`, `Criado em`, `Ações`.
- `app/dashboard/portfolio/companies`:
  - Colunas: `ID (seq)`, `Nome`, `Cargo`, `Experiência`, `Início`, `Ações`.
- `app/dashboard/portfolio/certificates`:
  - Colunas: `ID (seq)`, `Nome`, `Tipo`, `Horas`, `Experiência`, `Conclusão`, `Ações`.

## Ações e Estilo dos Botões
- `Editar`: `variant="softWarning"`, ícone `SquarePen`.
- `Excluir`: `variant="softDestructive"`, ícone `Trash2`.
- “Novo”: botão principal com Dialog para criação (reutilizando as server actions `create*`).

## Filtros e Ordenação (igual Usuários)
- Campo de busca no header (por título/nome).
- Botão de ordenação por criação asc/desc.
- Import/Export opcional com botões ícones (violeta), seguindo o padrão de Usuários.

## Arquivos a Criar/Editar
- Projetos:
  - Criar: `app/dashboard/portfolio/projects/columns.tsx`, `app/dashboard/portfolio/projects/data_table.tsx`.
  - Editar: `app/dashboard/portfolio/projects/page.tsx` para usar o `DataTable`.
- Experiências:
  - Criar: `app/dashboard/portfolio/experiences/columns.tsx`, `app/dashboard/portfolio/experiences/data_table.tsx`.
  - Editar: `app/dashboard/portfolio/experiences/page.tsx`.
- Empresas:
  - Criar: `app/dashboard/portfolio/companies/columns.tsx`, `app/dashboard/portfolio/companies/data_table.tsx`.
  - Editar: `app/dashboard/portfolio/companies/page.tsx`.
- Certificados:
  - Criar: `app/dashboard/portfolio/certificates/columns.tsx`, `app/dashboard/portfolio/certificates/data_table.tsx`.
  - Editar: `app/dashboard/portfolio/certificates/page.tsx`.

## Considerações Técnicas
- Usar `id` para forms e ações; primeira coluna exibirá `row.index + 1` para sequencial.
- Reutilizar server actions de criação/atualização/exclusão já existentes (ex.: `createProject`, `updateProject`, `deleteProject` etc.).
- Tipos de linha com campos mínimos necessários; datas formatadas (`toLocaleDateString`).
- Acessibilidade: manter `aria-label` e `title` nos botões.

## Validação
- Confirmar render com dados e navegação de Dialogs.
- Testar filtros e ordenação.
- Verificar responsividade e overflow na tabela.

## Entrega
- Implementar para as quatro páginas de forma consistente, mantendo o padrão visual do módulo de Usuários e o sistema de colunas dinâmicas do DataTable global.