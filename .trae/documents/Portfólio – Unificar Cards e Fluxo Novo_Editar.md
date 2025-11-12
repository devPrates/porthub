## Objetivo

* Padronizar os cards da página de Portfólio para o mesmo visual dos demais cards do site.

* Permitir criar um novo portfólio via rota dedicada `[novo]` e editar portfólios pela rota `[slug]`.

* Manter fluxo para criar Hero e About dentro do portfólio.

## Rotas e Páginas

* Criar `app/dashboard/portfolio/novo/page.tsx`:

  * Formulário vertical (título, subtítulo) com server action para criar portfólio.

  * Após criar, `redirect` para `/dashboard/portfolio/{slug}`.

* Confirmar/usar já existentes:

  * `app/dashboard/portfolio/[slug]/page.tsx` (detalhe do portfólio com ações Hero e About).

  * `app/dashboard/portfolio/[slug]/hero/page.tsx` e `app/dashboard/portfolio/[slug]/about/page.tsx` (CRUD de seções).

## Alterações de UI na página de Portfólio

* Em `app/dashboard/portfolio/page.tsx`:

  * Substituir o card "Criar Portfólio" atual por um card de cadastro com estilo unificado (gradiente, borda Indigo, ícone lucide) contendo um botão que redireciona para `/dashboard/portfolio/novo`.

  * Listar os portfólios ao lado do card de cadastro num único grid responsivo (wrap por largura): `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.

  * Remover o `<Separator />` entre cadastro e listagem.

  * Atualizar cada card de portfólio para o mesmo padrão visual:

    * Cabeçalho com ícone `FolderKanban`, título/descrição.

    * Conteúdo com resumo (contadores) já existente.

    * Footer com botões “Editar” (link para `/dashboard/portfolio/{slug}`) e “Excluir”.

## Fluxo do Usuário

* Botão "Cadastrar Portfólio" na página `/dashboard/portfolio` → redireciona para `/dashboard/portfolio/novo`.

* No `[novo]`, usuário salva e é redirecionado para `/dashboard/portfolio/{slug}`.

* Na página do `[slug]`, usuário acessa cards/links para gerenciar Hero e About.

## Implementação Técnica

* Criar página `novo` com server action reutilizando action de criação (ou criar action específica que retorne slug e faça `redirect`).

* Atualizar `PortfolioCard` (ou render inline) para usar estilo unificado (mesmo envelope visual dos `CreateCard`).

* Garantir links:

  * Cadastro: `/dashboard/portfolio/novo`.

  * Edição: `/dashboard/portfolio/{slug}`.

* Ícones: lucide-react (sem SVGs inline), `FolderKanban` para portfólio.

## Validação

* Testar criação: preencher título/subtítulo, salvar e verificar `redirect` para `{slug}`.

* Testar edição: navegar para `{slug}` e abrir Hero/About.

* Verificar responsividade: grid quebra em `sm`, `lg`, `xl` sem separador visual.

* Conferir acessibilidade: labels, `aria-label` em botões.

## Arquivos a editar/criar

* Criar: `app/dashboard/portfolio/novo/page.tsx`.

* Editar: `app/dashboard/portfolio/page.tsx` (grid único, card de cadastro com redirect, cards listados com estilo).

* Opcional: `components/dashboard/portfolio_card.tsx` para aplicar envelope visual unificado (ou render cards diretamente na página seguindo o padrão).

