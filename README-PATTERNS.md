# Padrões do Frontend

Tudo o que deve ser seguido ao mexer neste repositório. Ele espelha o padrão do backend (`backend-node-pk`), adaptado para React.

## Stack fixa

Node 24 (`.nvmrc` + `engines`) · pnpm via `packageManager` · TypeScript strict · Vite · React 19 · `react-router` · `styled-components` · TanStack Query · `react-hook-form` + Zod · `react-icons` (Lucide) · `vite-plugin-pwa` · Vitest + React Testing Library + jsdom · ESLint + Prettier · Husky + commitlint.
Não troque nenhuma dessas peças sem uma decisão explícita. Não use CSS-in-JS diferente, Tailwind, UI kits (MUI, Chakra, AntD) ou Redux.

## Regra de ouro: sem regra de negócio

| Pode no front | Não pode no front |
| --- | --- |
| formatar moeda, data, CPF/CNPJ | calcular imposto, saldo, vencimento, próxima recorrência |
| validar formato de campo (obrigatório, tamanho, máscara) | decidir se uma nota pode ser emitida, cancelada ou editada |
| esconder botão com base em um campo que a API devolve (ex.: `status`) | inferir permissão ou status por conta própria |
| mostrar a mensagem de erro que a API devolveu | inventar mensagens de erro de domínio |

Se a tela precisa de um número calculado, a API devolve esse número.

## Estrutura de pastas

| Pasta | Responsabilidade | Pode importar | Não pode |
| --- | --- | --- | --- |
| `app/` | `app.tsx`, `router.tsx` (rotas), `layouts.tsx` (guardas e `AppShell`), `routes.ts`, `navigation.tsx`, `providers.tsx` | tudo | — |
| `configs/` | `env.ts`: Zod sobre `import.meta.env`, acessado só pelo objeto `Env` | libs | componentes |
| `services/` | `http-client.ts` (fetch, envelope, refresh) e um arquivo por módulo da API (`facilita-mei/actor.ts`, `nota-stack/service-catalog.ts`). Só chamadas HTTP tipadas | `configs`, `types` | React |
| `types/` | `i*`, `t*`, `e*` espelhando os schemas da API, um arquivo por entidade | — | — |
| `hooks/` | hooks de dados (TanStack Query) e utilitários (`use-media-query`) | `services`, `types` | styled |
| `contexts/` | `auth`, `theme`, `company` (empresa selecionada) | `services`, `hooks` | — |
| `components/` | peças reutilizáveis e sem conhecimento de entidade (`Button`, `DataList`, `TextField`) | `styles`, `utils`, `hooks` de tela (`use-media-query`) | `services`, hooks de dados |
| `forms/` | um form por entidade (`actor-form`), usado em criar e editar | `components`, `types` | `services` direto (recebe `onSubmit`) |
| `pages/` | uma pasta por tela: compõe componentes, forms e hooks | tudo acima | — |
| `styles/` | `theme.ts` (tokens), `global-style.ts`, `breakpoints.ts`, `styled.d.ts` | — | — |
| `utils/` | formatação pura (`format-money`, `format-document`, `format-date`) | — | estado |
| `tests/` | setup do Vitest, `render-with-providers`, mocks de API | tudo | — |

Aliases: `@/*`, `@components/*`, `@forms/*`, `@pages/*`, `@services/*`, `@hooks/*`, `@contexts/*`, `@types/*`, `@styles/*`, `@utils/*`, `@configs/*`, `@tests/*`.

## Componentes

```
src/components/data-list/
  index.tsx          export function DataList<T>(props: iDataListProps<T>)
  styles.ts          export const Card = styled.article`...`
  data-list.test.tsx
```

- Um componente por pasta. Props tipadas com `interface iXxxProps`, e a função exportada em `PascalCase`.
- `styles.ts` só tem styled-components. Os nomes descrevem o papel (`Card`, `Row`, `Label`), não a aparência (`BlueBox`).
- Props só para estilo usam o prefixo `$` (transient props: `$variant`, `$isActive`), para não vazarem para o DOM.
- Página com estilo próprio tem `pages/<pagina>/styles.ts`. Se um estilo aparecer em duas páginas, ele vira componente.
- Form repetido vira `forms/<entidade>-form/`, recebendo `defaultValues`, `onSubmit` e `isSubmitting`. Criar e editar usam o mesmo form.

## Tema

- Cada cor forte tem a versão `Soft` (fundo pastel) e a `on*` (texto sobre ela). Selo e aviso usam a forte sobre a `Soft`.
- Os tokens ficam em `styles/theme.ts` (`lightTheme`, `darkTheme`) com os mesmos nomes: `colors.*`, `space.*` (escala de 4px), `radius.*`, `font.*`, `shadow.*`, `breakpoint.*`. A tipagem vem por `styles/styled.d.ts` (`DefaultTheme`).
- Componentes usam só tokens: `${({ theme }) => theme.colors.primary}`. Nada de hex no componente.
- `ThemeContext` resolve `system`/`light`/`dark`. `system` escuta o `prefers-color-scheme`. A preferência vem do usuário (API) e fica em `localStorage` só para a primeira pintura.
- A paleta (pastéis de azul e verde sobre branco) está em `styles/theme.ts`. O contraste AA dos pares texto/fundo é conferido em `theme.test.ts`: cor nova entra lá também.

## Mobile first

- O CSS base é o do celular, e `@media (min-width: md|lg)` amplia. Nunca o contrário.
- Breakpoints: `md` 768px, `lg` 1024px. Alvo de toque com no mínimo 44px. Fonte base de 16px (evita o zoom do iOS no input).
- Listas: `DataList` com a mesma definição de colunas vira **cards** abaixo de `md` e **tabela** a partir de `md`.
- Navegação: barra inferior no mobile e menu lateral a partir de 1024px (`AppShell`).
- `Modal` abre como bottom sheet no celular e centralizado a partir de 768px: não existe um componente separado de bottom sheet.
- Rotas em português na barra de endereço (`/entrar`, `/notas`), centralizadas em `src/app/routes.ts`. Páginas carregam sob demanda (`lazy` no `router.tsx`).
- PWA: `manifest.webmanifest`, `theme-color`, `apple-mobile-web-app-capable` e os ícones no `index.html`. O service worker só faz cache dos assets.

## Dados e sessão

- `http-client.ts` desembrulha `{ success, result }` e lança `ApiError` com `code` e `message` em `{ success: false, error }`.
- Access token em memória. `401` → um único `POST /auth/refresh` compartilhado (promise única), depois repete a request. Refresh falhou → logout.
- O token do nota_stack é pedido por empresa e renovado quando expira. O cliente `services/nota-stack/` usa outra base URL.
- Estado do servidor só no TanStack Query (chaves `['actor', 'list', filtros]`). Estado local com `useState`. Nada de store global.

## Nomes (ESLint aplica)

| Símbolo | Formato | Exemplo |
| --- | --- | --- |
| variável / função / hook | `camelCase` (hook com `use`) | `formatMoney`, `useActorList` |
| componente | `PascalCase` | `DataList`, `ActorForm` |
| constante de módulo | `UPPER_CASE` | `QUERY_KEYS`, `BREAKPOINTS` |
| booleano | `is` / `has` / `should` | `isLoading`, `hasError` |
| interface | prefixo `i` | `iActor`, `iDataListProps` |
| type | prefixo `t` | `tThemeMode` |
| enum | prefixo `e` | `eInvoiceStatus` |
| arquivo / pasta | `kebab-case` | `data-list/index.tsx`, `use-actor.ts` |

- Código e nomes em inglês. Textos de tela, comentários e docs em português.
- JSDoc em hooks, services e componentes públicos. Sem comentários de histórico.
- Sem `any`, sem `console.log`, sem emojis.

## Testes

- `x.test.tsx` ao lado do arquivo. Renderize com `renderWithProviders` (tema + router + query client).
- O `matchMedia` é simulado (`src/tests/match-media.ts`): a tela começa com 375px e tema claro; use `setViewportWidth` e `setSystemDarkScheme` para mudar.
- Teste o comportamento (o que o usuário vê e faz), não detalhes internos. Mocks de rede no `services/`, não no `fetch` global.
- `pnpm typecheck && pnpm test` rodam no `pre-push`.

## Branch e commit

Iguais ao backend: branch `tipo/contexto-da-demanda` e commit `tipo(escopo): descrição`, em português (ex.: `feat(actor): adiciona tela de cadastro de atores`).
