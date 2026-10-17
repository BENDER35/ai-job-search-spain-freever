# Jobijoba (www.jobijoba.es) URL reference & robots.txt notes

## Search

`https://www.jobijoba.es/query/?what=<q>[&where=<loc>][&page=N]`

- `what` = keywords (free text). `where` = city or province. `page` = page (1-indexed).
- `q` is **ignored** — the keyword parameter is `what`.

## Detail

`https://www.jobijoba.es/oferta-empleo/<source>/<hash>` (first-party, robots-allowed).

The outbound (robots-disallowed) link is `https://www.jobijoba.es/redirect/offer/<source>/<hash>`.

## robots.txt (checked 2026-10)

```
User-agent: *
Disallow: /redirect/
Disallow: /query/
...
Allow: /

User-agent: ClaudeBot
User-agent: Claude-User
Allow: /query/
...
User-agent: GPTBot
User-agent: ChatGPT-User
Allow: /query/
...
User-agent: PerplexityBot
Allow: /query/
```

Paths used by this skill:

- `/query/?what=...` — disallowed for `*`, allowed for named AI agents ⚠️
- `/oferta-empleo/<source>/<hash>` — allowed for `*` ✅
- `/redirect/offer/...` — disallowed ❌ (never fetched; surfaced as `applyUrl`)

## Notes

- Nonsense `what` yields 0 offers.
- Total parsed from "de un total de <N>".
- Cards: `<div class="offer" data-id="ad_<hash>">`; link `a.offer-link` href is either `/oferta-empleo/...` or `/redirect/offer/...`.
- Date: `publication_date` span ("19 agosto" or "Publicado hace 10 hr horas").
- Excerpt: `span.description`.
