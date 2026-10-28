# PMSC Simulado

App de estudo para o concurso **Soldado PMSC 2026** (Edital nº 002/CCP/2026 – CFP, banca Instituto AOCP, prova em 13/12/2026).

- **Início**: contagem regressiva, próximas datas, atalhos e progresso.
- **Calendário**: cronograma do Anexo I, resumo do edital (vagas, prova, fases, requisitos) e tabelas do TAF (Anexo V).
- **Estudo**: as 9 matérias do Anexo II com resumo, pontos-chave, pegadinhas e base legal por tópico, progresso salvo e plano semanal. Página de redação com temas, rascunho, contador de linhas e estimativa de nota pela fórmula do edital.
- **Simulado**: prova completa (60 questões na distribuição oficial, 4 h), por matéria ou rápida; cartão-resposta, salvamento automático, nota com a regra de aprovação do item 8.4, gabarito comentado e histórico.

Next.js 16 faz o frontend e o backend juntos: as telas ficam em `src/app/**/page.tsx` (componentes em `src/screens`) e a API em `src/app/api/**/route.ts` (regras em `src/server`). O banco é o Postgres do Supabase, acessado só pela API com Kysely, no mesmo padrão de migrations dos backends.

**Tudo vem do banco:** edital, cronograma, TAF, matérias, tópicos, questões e redação ficam em tabelas. Para incluir uma questão ou um tópico, basta inserir a linha (Table Editor do Supabase ou SQL): o app mostra em até 30 segundos.

## Acesso

- Qualquer pessoa cria o cadastro (nome, e-mail e senha) em `/criar-conta`. O usuário nasce **pendente** e não consegue entrar.
- Para liberar, mude o status no banco:

```sql
UPDATE "user" SET status = 'active' WHERE email = 'pessoa@exemplo.com';  -- liberar
UPDATE "user" SET status = 'blocked' WHERE email = 'pessoa@exemplo.com'; -- bloquear (perde o acesso na hora)
SELECT name, email, status, created_at FROM "user" WHERE status = 'pending' ORDER BY created_at; -- fila
```

- Sessão igual à do facilita_mei_api: senha com bcrypt (custo 12), access token JWT em memória e refresh token rotativo num cookie `httpOnly` (`/api/auth`), com detecção de reuso. O usuário é conferido no banco a cada requisição.

## Rodar

```bash
nvm use                       # Node 24
pnpm install
cp .env-example .env.local    # DB_* (Supabase, pooler 6543) e JWT_SECRET
pnpm migrate:latest
pnpm migrate:seed 01_content  # carga inicial do conteúdo (só na primeira vez)
pnpm dev                      # http://localhost:3000
```

`pnpm typecheck && pnpm lint && pnpm test && pnpm build` rodam no `pre-push`.

## Banco (Kysely)

| Comando | O que faz |
| --- | --- |
| `pnpm migrate:latest` / `pnpm migrate:down` | Aplica / reverte migrations de `src/database/migrations` (controle no schema `kysely`) |
| `pnpm migrate:types` | Regenera `src/database/db/model.ts` a partir do banco (preserva ajustes manuais) |
| `pnpm migrate:seed 01_content` | Carrega o conteúdo inicial de `src/database/seeds/data`. Rodar de novo sobrescreve as linhas com o mesmo id |

| Tabela | Conteúdo |
| --- | --- |
| `user`, `refresh_token` | Cadastro (status `pending` / `active` / `blocked`) e sessões |
| `area`, `subject`, `topic`, `question` | Áreas, matérias (com `exam_questions`, que monta a prova completa), tópicos e questões (`is_active = false` tira dos simulados novos) |
| `contest`, `schedule_group`, `schedule_event`, `taf_test` | Edital (uma linha), cronograma e TAF |
| `essay_guide`, `essay_theme` | Orientações e temas de redação |
| `study_topic`, `exam` | Tópicos estudados e simulados de cada usuário |

Todas as tabelas têm RLS ligado e sem políticas: a chave pública do Supabase não lê nada; só a API, conectada como dona do banco.

Exemplo de questão nova (o `id` é gerado se omitido):

```sql
INSERT INTO question (subject_id, topic_id, statement, alternatives, correct_option, explanation, difficulty)
VALUES ('informatica', 'informatica-t01', 'Enunciado...',
        '{"A":"...","B":"...","C":"...","D":"...","E":"..."}', 'C', 'Comentário da resposta...', 'media');
```

## API

Envelope `{ success, result }` / `{ success: false, error: { code, message } }`. Rotas logadas recebem `Authorization: Bearer <access_token>`.

| Rota | O que faz |
| --- | --- |
| `POST /api/auth/cadastro` | Cria o cadastro (pendente) |
| `POST /api/auth/entrar` · `/renovar` · `/sair` · `GET /api/auth/eu` | Sessão |
| `GET /api/conteudo` | Edital, cronograma, matérias, tópicos, redação e contagem de questões |
| `GET` · `POST /api/progresso` | Tópicos estudados |
| `GET` · `POST` · `DELETE /api/simulados` | Histórico e simulado atual · começar (a API sorteia, sem gabarito) · limpar histórico |
| `GET` · `PATCH` · `DELETE /api/simulados/:id` | Abrir · salvar respostas durante a prova · descartar |
| `POST /api/simulados/:id/entregar` | Entrega: a API corrige com o gabarito do banco e devolve o gabarito comentado |
| `GET /api/simulados/ultimo` | Último resultado |

## Deploy (Vercel)

1. `npx vercel login` e `npx vercel link`
2. Variáveis em Settings → Environment Variables (as mesmas do `.env-example`; use o pooler do Supabase na porta 6543, porque o host direto só tem IPv6)
3. `npx vercel --prod`

## Conteúdo inicial (`src/database/seeds/data`)

Os JSON que o app usava antes do banco ficaram só como carga inicial (`pnpm migrate:seed 01_content`); o app não os lê. O teste `src/database/seeds/content-data.test.ts` valida os arquivos. As questões são inéditas no estilo da banca ou adaptadas de provas anteriores (a origem fica em `source`): material de estudo, confira sempre o texto atualizado da lei.

## Padrões

Frontend no padrão do facilita MEI ([README-PATTERNS.md](README-PATTERNS.md): styled-components, TanStack Query, react-hook-form + Zod, contexto de auth com refresh compartilhado) e banco no padrão dos backends (Kysely, migrations numeradas, `model.ts` gerado, seeds). Diferenças: rotas do Next em vez de react-router; as telas ficam em `src/screens` (a pasta `pages` é reservada pelo Next) e rodam só no navegador.
