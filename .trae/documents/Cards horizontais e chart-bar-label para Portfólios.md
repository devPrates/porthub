## Objetivo
Transformar `/dashboard/portfolios` em:
1. Um card de cadastro no topo, idêntico ao padrão usado em Páginas.
2. Uma lista de cards horizontais reutilizáveis, cada um ocupando a largura total, com um gráfico "chart-bar-label" dinâmico ao centro exibindo contagens (Projetos, Experiências, Social Links, Páginas), e ações (Editar/Excluir).

## Componentes Reutilizáveis
1. `components/dashboard/portfolio_horizontal_card.tsx`
- Props: `portfolio` (title, subtitle), `counts` ({ projects, experiences, socials, pages }).
- Layout: esquerda (ícone + título/subtítulo), centro (gráfico), direita (ações: Editar → `/dashboard/portfolio/[slug]`, Excluir → server action).
- Acessível: roles/labels, foco visível, botões com `aria-label`.

2. `components/dashboard/chart_bar_label.tsx`
- Baseado em `recharts` (já presente) e utilitários de `components/ui/chart`.
- Props: `items: { key, label, value, color? }[]`, `variant?: "compact" | "wide"`.
- Exibe barras com labels e valor no topo (como solicitado). Tooltip e legenda opcionais.
- Alternativa: se preferir, podemos reaproveitar `components/dashboard/mini_bar_spark.tsx` para o modo compacto e `components/dashboard/stats_bar_chart.tsx` para o modo amplo; porém criaremos um wrapper com a API uniforme.

## Atualizações na Página
1. `app/dashboard/portfolios/page.tsx`
- Substituir o botão de criar atual pelo card de cadastro usando `CreateCard` (como em `app/dashboard/pages/page.tsx:70`). Campos: Título (obrigatório), Subtítulo (opcional). Ação: `createPortfolio` (já existente em `app/dashboard/portfolios/actions.ts:7`).
- Renderizar, abaixo, a lista de `PortfolioHorizontalCard` para cada portfólio do usuário, passando os contadores de `_count` (já buscados na página) e o slug derivado de `title` via `toSlug`.

## Dados e Integração
- Consulta: manter `findMany` com `include: { _count: ... }` (já implementado em `app/dashboard/portfolios/page.tsx`).
- Slug: derivar com `toSlug` (já existente em `lib/utils`).
- Revalidação: preservar `revalidatePath("/dashboard/portfolios")` após criar/excluir (já alinhado em `app/dashboard/portfolios/actions.ts:36` e `components/dashboard/portfolio_card.tsx:91`).

## Acessibilidade e UX
- Botões: `aria-label` descritivos (Criar, Editar, Excluir).
- Cards horizontais: responsivos (stack no mobile, horizontal em md+), foco visível, contrastes legíveis.
- Gráfico: tooltip com labels e valores; legendas quando `variant="wide"`.

## Verificação
- Rodar dev e validar navegação pelo Sidebar (já ajustado em `components/app-sidebar.tsx:127`).
- Criar portfólio e verificar atualização automática da lista.
- Excluir portfólio e verificar revalidação.
- Checar responsividade dos cards e gráficos.

## Perguntas (para refinar antes de executar)
1. O card de cadastro deve incluir apenas `title` e `subtitle`, correto?
2. Deseja ações extras no card horizontal (ex.: "Ver API" ou "Duplicar")?
3. Prefere o gráfico em modo `compact` ou `wide` por padrão?
4. Há necessidade de paginação ou filtro na listagem de portfólios?
5. Algum esquema de cores específico para cada métrica (ex.: projetos = azul, experiências = verde)?
6. Manter links de edição em `/dashboard/portfolio/[slug]` está OK?
