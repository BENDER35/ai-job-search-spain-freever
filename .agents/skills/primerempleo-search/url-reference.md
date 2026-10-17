# Primerempleo (www.primerempleo.com) URL reference

## Search

`https://www.primerempleo.com/?keywords=<q>`

(Note: the board does not filter server-side by keyword; results are filtered client-side by title match.)

## Detail

`https://www.primerempleo.com/<type>/<location>/<slug>/<id>`

Types: `primer-empleo`, `trabajo-estudiantes`, `trabajo-temporal`, `primer-empleo/teletrabajo`.

## robots.txt

`User-agent: *` with `Disallow: /php/` and `/oposiciones/` only → all other paths allowed.
