## Objetivo

* Deixar os cards de itens cadastrados visualmente parecidos ao card de cadastro.

* Exibir o card de cadastro ao lado dos cards listados, com quebra automática de linha conforme a largura da tela.

* Remover a linha separadora entre cadastro e lista, mantendo um grid único e coeso.

## Alterações de UI (Card de Item)

* Aplicar o mesmo estilo do `CreateCard` aos cards de itens:

  * Container: `relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all`.

  * Overlay decorativo: `absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10`.

  * Cabeçalho horizontal com ícone em pill: `h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600` + ícone lucide.

  * Título `text-base leading-tight` e descrição `text-muted-foreground text-sm`.

  * Footer com ações alinhadas à direita e espaçamento: `CardFooter className="justify-end gap-2"`.

* Ícones por entidade (mesmas chaves usadas no `CreateCard`/Hero):

  * `folderKanban` (Projetos), `briefcase` (Experiências), `building` (Empresas), `award` (Certificados), `share2` (Social Links), `fileText` (Páginas), `bookOpen` (Posts), `tags` (Categorias), `code2` (Tecnologias).

* Botões de ação:

  * Editar: `variant="outline" size="sm"` com dialog já existente.

  * Excluir: `variant="destructive" size="sm"` (opcional: incluir ícone `Trash2`).

## Layout Responsivo (Cadastro + Lista)

* Remover `<Separator />` entre cadastro e lista.

* Envolver `CreateCard` e os cards de itens no mesmo container grid:

  * `div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"`.

  * Alternativa auto-fit: `grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]` para melhor wrap.

* Posicionar o `CreateCard` como o primeiro item do grid, seguido pelos itens.

* Manter cada card com `max-w-[22rem]` para alinhamento visual, permitindo quebra natural.

## Páginas Afetadas

* `app/dashboard/portfolio/projects/page.tsx`

* `app/dashboard/portfolio/experiences/page.tsx`

* `app/dashboard/portfolio/companies/page.tsx`

* `app/dashboard/portfolio/certificates/page.tsx`

* `app/dashboard/portfolio/socials/page.tsx`

* `app/dashboard/portfolio/pages/page.tsx`

* `app/dashboard/blog/posts/page.tsx`

* `app/dashboard/blog/categories/page.tsx`

* `app/dashboard/technologies/page.tsx`

## Implementação por Página (passos)

1. Importar o ícone adequado (lucide) e aplicar no cabeçalho do card de item.
2. Atualizar classes do card de item para o estilo do `CreateCard`.
3. Substituir a área de listagem por um único grid contendo:

   * `CreateCard` primeiro

   * `items.map(...)` renderizando cada card com o novo estilo
4. Remover `<Separator />` entre cadastro e lista.
5. Garantir que as ações edit/excluir permanecem funcionais.

## Detalhes Técnicos

* Evitar passar componentes para Client Components a partir de Server Components; ícones devem ser resolvidos no Client ou via `iconName` quando houver props.

* Manter consistência com Hero dinâmico (mesmas chaves de ícone por rota).

* Acessibilidade: manter `aria-label` nos botões e dialog triggers.

## Validação

* Verificar visual e wrap em `sm`, `lg`, `xl`.

* Testar diálogo de edição e exclusão em pelo menos duas entidades.

* Confirmar que não há regressão de layout no dashboard geral.

## Entrega

* Aplicar as mudanças em todas as páginas listadas, mantendo o padrão unificado e removendo separadores, com o `CreateCard` sempre visível como primeiro item do grid.

