# Jobrapido (es.jobrapido.com) URL reference & robots.txt notes

## Search

| Purpose | URL |
| --- | --- |
| Keyword | `https://es.jobrapido.com/Ofertas-de-empleo-para-<query>` |
| Keyword + place | `https://es.jobrapido.com/Ofertas-de-empleo-para-<query>-en-<location>` |
| Place only | `https://es.jobrapido.com/Ofertas-de-empleo-en-<location>` |

- The query/location segments are free text; spaces stay as spaces and are
  percent-encoded (`camarero de piso` → `camarero%20de%20piso`).
- Characters that would break the path (`/`, `?`, `#`, `%`, `&`, `+`) are
  folded into a single hyphen. A literal `/` in the segment (encoded `%2F`)
  makes Jobrapido return a `302` to the homepage.
- A query that yields no offers `302`s to `https://es.jobrapido.com/`, whose
  list renders client-side, so the CLI sees zero `data-advert` blocks and
  reports an empty result set.

## Detail

`https://es.jobrapido.com/jobpreview/<advertId>`

## robots.txt (checked 2026-10)

```
User-agent: *
Disallow: /jobpreview/*
...
Disallow: /*?*&p=*
Disallow: /*?o=*
Disallow: /*?l=*
...
Allow: /*?q=*
Allow: /*?o=*
```

The site keeps a second block for named AI agents (`Claude-User`,
`Claude-SearchBot`, `GPTBot`, `PerplexityBot`, …) that **allows**
`/jobpreview/*`. Because the repo's gate is conservative (it requires a path to
be allowed for both `*` and the named AI group), `/jobpreview/*` is treated as
disallowed → `detail` ships with the personal-use warning in `SKILL.md`.

Paths used by this skill:

- `/Ofertas-de-empleo-para-*`, `/Ofertas-de-empleo-en-*` — allowed for `*` ✅
- `/jobpreview/*` — disallowed for `*`, allowed for named AI agents ⚠️
- `?p=`, `?o=`, `?l=` — disallowed ❌ (never used)

## Anti-patterns

- Do **not** use `https://open.app.jobrapido.com/*` — its `robots.txt` is
  `Disallow: /`.
- Do **not** use the `?q=`/`?l=`/`?p=`/`?o=` query params: they are disallowed
  and this skill never builds them.
