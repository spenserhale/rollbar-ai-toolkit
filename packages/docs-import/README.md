# `@rollbar-toolkit/docs-import`

Imports Rollbar's documentation into `docs/api/` at the repo root so every package in the toolkit (and any agent working in this repo) can grep, search, and reference Rollbar's prose + reference docs offline.

## How it works

Rollbar publishes an [llms.txt](https://llmstxt.org/) manifest at
`https://docs.rollbar.com/llms.txt` and serves every doc page as raw markdown
when the URL is suffixed with `.md`. The importer:

1. Fetches `llms.txt` (saved to `docs/api/llms.txt` as the index)
2. Extracts every `https://docs.rollbar.com/**.md` URL from the manifest
3. Fetches all pages concurrently via `httpx`
4. Writes each to `docs/api/<url-path>.md`, preserving the URL hierarchy

No browser, no JavaScript rendering, no `crawl4ai` — just HTTP + markdown.

## Usage

From the repo root:

```bash
bun run docs:import                       # full import (~5–15s, 400+ pages)
bun run docs:clean                        # wipe docs/api/
```

Or directly:

```bash
uv run --project packages/docs-import python packages/docs-import/src/import_docs.py
uv run --project packages/docs-import python packages/docs-import/src/import_docs.py --concurrency 16
uv run --project packages/docs-import python packages/docs-import/src/import_docs.py --output-dir custom/path
```

## Output layout

```
docs/api/
  llms.txt                          # original manifest (links + descriptions)
  docs/                             # guides
    getting-started.md
    javascript.md
    ...
  reference/                        # API reference
    list-all-items.md
    create-or-update-item.md
    ...
```

Each file starts with `<!-- source: https://docs.rollbar.com/... -->` so its provenance stays traceable.

## When to re-run

Rerun whenever Rollbar publishes meaningful doc changes — and commit the diff. `docs/api/` is a committed snapshot, like `packages/api-docs/docs/`.
