# Tecnoempleo URL Reference

Public, unauthenticated pages used by this skill. Tecnoempleo is a Spain-only
board: the province filter covers the 52 Spanish provinces (codes 231–282).

> Personal use only. `robots.txt` allows ordinary crawlers on `/ofertas-trabajo/...`
> but **disallows known AI crawler user-agents** (AnthropicBot, Claude, GPTBot, …).
> This CLI sends `Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)` and keeps volume low.

## Search

```
GET https://www.tecnoempleo.com/ofertas-trabajo/
```

Query params (all optional):

| Param | Meaning | Example |
|-------|---------|---------|
| `te` | Free-text keyword query | `python` |
| `pr` | Province selection, comma-wrapped | `,263,` (Madrid) |
| `en_remoto` | Workplace mode, comma-wrapped | `,1,` remote · `,2,` onsite · `,3,` hybrid · `,4,` unspecified |
| `ult_24h` | Only postings from the last 24h | `1` |
| `pagina` | 1-indexed page (30 results/page) | `2` |

Returns server-rendered HTML. The page `<h1>` begins with the total match count
(`"406 Ofertas de empleo de python"`); the CLI reads it into `meta.total`.

### Result-card anchors

Cards are split on the empty anchor Tecnoempleo emits before each one:

```html
<a name="rf-<hash>" id="rf-<hash>"></a>
```

Within a card:

| Field | Anchor |
|-------|--------|
| `id` / `url` | Title anchor `<a href="https://www.tecnoempleo.com/<path>" class="font-weight-bold text-cyan-700" title="<title>">`. `id` is `<path>` (the slug/`rf-<hash>` after the host); `url` is the full href without query. |
| `title` | The `title="…"` attribute of the anchor above (falls back to its text). |
| `company` | `<a title="Ofertas de Empleo <name>" … class="text-primary link-muted"><name></a>` — **absent** on "empresa confidencial" cards → `null`. |
| `location` | Right column `<b>Location</b>` (desktop) or `<b>Location</b> - DD/MM/YYYY` (mobile). |
| `date` | Right column `DD/MM/YYYY` above the location, or the mobile `- DD/MM/YYYY`. Converted to ISO `YYYY-MM-DD`. |
| `workMode` | `(Híbrido)` / `(Presencial)` / `(Teletrabajo)` suffix in the right column; `en_remoto` values resolved by the CLI. |
| `category` | First `<br>`-separated line after the location in the right column. |
| `salary` | A right-column line containing `€` / `euro`. |

Right column markup:

```html
<div class="col-12 col-lg-3 text-gray-700 pt-2 text-right hidden-md-down">
  DD/MM/YYYY <span class="badge …">…</span><br><br>
  <b>LOCATION</b>(Híbrido)<br>CATEGORY<br>SALARY<br>
</div>
```

## Detail

```
GET https://www.tecnoempleo.com/<slug>/<skills>/rf-<hash>
```

The slug segment is **required**: a bare `rf-<hash>` without it returns 404, which
is why `search` emits the whole path as `id`.

The page carries a schema.org `JobPosting` JSON-LD block plus a sidebar list:

| Field | Source |
|-------|--------|
| `description` | JSON-LD `description` (plain text); falls back to `<div itemprop="description">` |
| `date` | JSON-LD `datePosted`; falls back to the `<span class="badge bg-primary-soft p-2">DD/MM/YYYY</span>` |
| `employmentType` | JSON-LD `employmentType` (mapped to Spanish) or sidebar `Tipo contrato` |
| `salary` | JSON-LD `baseSalary` or sidebar `Salario` |
| `location` | sidebar `Ubicación` or JSON-LD `jobLocation.address.addressLocality` |
| `category` | sidebar `Funciones` |
| `skills` | `<button>` tags in the `<i class="fi fi-code">` block |
| `externalApply` | Presence of the "redirigido a la página web de la empresa" notice |
| `applyUrl` | `https://www.tecnoempleo.com/validacion_enviar.php?refer=<hash>` |

**No deadline field exists** on Tecnoempleo detail pages, so `deadline` is always
`null`.

## Notes

- No authentication required.
- Respect rate limits — the CLI backs off on 429/5xx with exponential backoff and
  jitter, and returns `null` on 404.
- `en_remoto` also accepts `4` (unspecified); `--remote` only emits 1/2/3.
- `ult_24h=1` is the portal's only freshness filter; other `--jobage` windows are
  applied client-side by the CLI.
