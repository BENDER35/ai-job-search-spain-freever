**Idioma:** [English](CHANGELOG.md) · Español

# Historial de cambios

Todos los cambios notables de este proyecto se documentan aquí. El formato se basa en
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), y este proyecto se adhiere
al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

Las releases son puntos de control verificados de `master`. Si mantienes un fork
personalizado, prefiere actualizar a una release etiquetada antes que traer `master` en bruto
(consulta [SETUP.es.md, sección 8](SETUP.es.md#8-traer-las-actualizaciones-del-upstream-a-tu-fork)). Los
marcadores `framework_version` de los archivos de metodología te dicen cuáles de tus archivos
personalizados ha tocado una release; `python3 tools/check_upstream_updates.py` los enumera con
comandos de diff por archivo.

> **Nota sobre la traducción:** las notas de versiones anteriores a la 1.7.1 se mantienen en inglés en [CHANGELOG.md](CHANGELOG.md).

## [1.8.20-es] - 2026-10-17 (fork español)

### Añadido

- **8 nuevas skills de portales españoles**: `jobrapido-search` (Jobrapido, agregador español), `jobijoba-search` (Jobijoba, agregador con páginas de detalle propias), `oficinaempleo-search` (Oficina Empleo, portal español), `studentjob-search` (StudentJob, empleo para estudiantes/jóvenes), `michaelpage-search` (Michael Page, consultora de selección), `hosco-search` (Hosco, hostelería), `randstad-search` (Randstad, consultora de selección), `primerempleo-search` (Primerempleo, empleo para estudiantes/jóvenes). Total: 33 skills de portales.

- **`esenciales/oficinas_empleo_sp.md`** — guía completa de las oficinas de empleo de España: servicios del SEPE, demanda de empleo (alta/modificación/renovación), prestaciones y subsidios, portales de empleo autonómicos, cómo apuntarse a ofertas, formación y cursos con selección automática, y procedimientos paso a paso por comunidad (19 CCAA).

### Cambiado

- README.md y README.es.md actualizados con la lista completa de portales y entradas deduplicadas en la estructura de archivos.
- AGENTS.md, `.claude/settings.json`, `tools/security_guards.py` actualizados con los nuevos registros de portales.

## [1.8.0-es] - 2026-10-16

### Added

- **Un único comando multiplataforma instala todas las CLI de portales: `python3 tools/install_portal_clis.py`**
  (#540, paso 2 del inicio rápido de `README.md`, sección 3 de `SETUP.md`,
  `tests/test_install_portal_clis.py`) - el README y SETUP.md incluían cada uno un bucle de PowerShell y otro de
  Bash sobre una lista copiada a mano de los seis portales incluidos, cuatro copias en total, mientras que el trabajo
  `discover-clis` de la CI hace glob de `.agents/skills/*/cli/package.json` precisamente para que un portal añadido en un
  fork no necesite editar ninguna lista. Por tanto, la instalación documentada omitía, en cada clon nuevo de ese fork,
  cualquier portal generado por `/add-portal` o tomado de otro fork. El script usa el glob de
  la CI, instala cada CLI de forma independiente para que un fallo no detenga el resto, y omite
  —con un mensaje que indica el motivo— cualquier manifiesto que declare un script de ciclo de vida o
  `trustedDependencies`, el mismo conjunto que `security_guards.py` prohíbe en el árbol, de modo que un portal
  tomado que lleve uno se lee antes de ejecutarse. `--dry-run` enumera lo que instalaría.

- **Adaptación para España (`BENDER35/ai-job-search-spain-freever`)**: este fork ahora está orientado al mercado laboral
  español y a cualquier agente de IA de línea de comandos, priorizando los niveles gratuitos. Añade los portales españoles
  `tecnoempleo-search` e `infojobs-search` (junto a `linkedin-search` y
  `freehire-search`, que son independientes del país y ya cubren España), versiones en español de todos los documentos de
  nivel superior (`README.es.md`, `SETUP.es.md`, `SECURITY.es.md`, `CONTRIBUTING.es.md`, `CHANGELOG.es.md`,
  `AGENTS.es.md`, `COMPATIBILIDAD.md`, `GUIA_TECNICA.md`), la matriz de runtime/SO/arquitectura
  (`COMPATIBILITY.md`/`COMPATIBILIDAD.md`), archivos de puntero fino para otros runtimes (`GEMINI.md`,
  `QWEN.md`, `CONVENTIONS.md`, `.cursorrules`, `.cursor/rules/ai-job-search.mdc`, `.windsurfrules`,
  `.clinerules`, `.goosehints`, `.github/copilot-instructions.md`), una guía técnica bilingüe
  (`TECHNICAL_GUIDE.md`/`GUIA_TECNICA.md`), `tools/check_platform.py`, y la guía de IA de bajo presupuesto
  `busqueda_ia_bajosrecursoseconomicos.md` (+ su espejo en inglés `ai_low_budget_job_search.md` y
  sus ediciones en `.docx`/`.pdf`, producidas con el nuevo `tools/md_to_docx.py`). `SETUP.md` gana una
  sección de selección de runtime y un recorrido paso a paso de Google Antigravity para Windows, macOS
  y Linux.

### Changed

- **`/apply` y `/rank` enrutan las URL de portales coincidentes al `detail` de la CLI instalada antes de `WebFetch`**
  (#535, paso 0 de `.claude/commands/apply.md`, paso 2 de `.claude/commands/rank.md`,
  `.claude/skills/job-application-assistant/09-web-research.md`) - las URL de portales de empleo pegadas
  en `/apply` o evaluadas por lotes con `/rank` ahora invocan primero el comando
  `detail <url> --format plain` de la CLI del portal instalada que coincida, evitando los 403 por detección de bots y los
  muros de inicio de sesión de los portales agregadores antes de recurrir a `WebFetch`. El orden de escalado de
  `09-web-research.md` sitúa el `detail` de la CLI del portal como el primer peldaño (`framework_version: 1.1.1 -> 1.1.2`).

- **El paso 5e de `/apply` nombra comandos de shell explícitos de limpieza para los intermedios de compilación**
  (#531, `.claude/commands/apply.md`) - el paso describía antes en prosa la eliminación de `.aux`/`.log`/`.out`,
  dejando la limpieza de artefactos expuesta a que los agentes la omitieran. Ahora especifica comandos
  `rm` explícitos para las cadenas de herramientas LaTeX de serie/personalizadas y los directorios `build/`
  redirigidos, situados después de que terminen los pasos 5b-5d de inspección de registros, y preserva explícitamente
  los recursos de la plantilla (`cover.cls`, `OpenFonts/`, archivos de plantillas personalizadas).

### Fixed

- **`jobnet-search` enruta los anuncios externos al `jobAdUrl` de la empresa en lugar de a los enlaces `find-job` rotos**
  (#538, `.agents/skills/jobnet-search/cli/src/commands/search.ts`, `.agents/skills/jobnet-search/cli/README.md`,
  `.agents/skills/jobnet-search/cli/tests/search-normalization.test.ts`) - las ofertas externas de
  Jobnet (`isExternal: true`) apuntan a `/find-job/{jobAdId}`, que devuelve 404, mientras que la API de Jobnet
  lleva el destino en `jobAdUrl`. El comando de búsqueda ahora enruta los anuncios externos a `jobAdUrl` cuando
  hay un destino http(s) válido, y recurre a `/find-job/{jobAdId}` cuando falta o no es http(s) para preservar
  URL distintas para la deduplicación de `/scrape`. Tanto `url` como `jobAdUrl`
  validan el esquema de la misma forma. Reportado con pruebas en vivo por NishilRathod.

- **Las protecciones de omisión en forks ya no se ejecutan en un fork durante una prueba local** (`tests/_upstream.py`,
  `tests/test_placeholder_integrity.py`, `tests/test_setup_command.py`,
  `tests/test_upstream_checkout.py`) - la omisión del fork leía
  `os.environ.get("GITHUB_REPOSITORY", UPSTREAM)`, así que con la variable sin definir una ejecución
  local recurría al proyecto original y las protecciones de marcadores de posición saltaban en todos los forks personalizados,
  dejando su suite permanentemente en rojo tras `/setup`. Las tres omisiones ahora comparten un único helper:
  `GITHUB_REPOSITORY` decide cuando está definida; si no, se compara el remoto `origin` del clon
  con el repositorio original (formas https y ssh, sufijo `.git` opcional), y un clon
  indeterminable asume el proyecto original. Solo pruebas, sin incremento de `framework_version`.

- **`linkedin-search` y `freehire-search` rechazan flags `--format` inválidas con `BAD_ARG`** (#555,
  `.agents/skills/linkedin-search/cli/src/cli.ts`, `.agents/skills/freehire-search/cli/src/cli.ts`) -
  las flags `--format` no reconocidas antes recurrían silenciosamente a `"json"` con código de salida 0, enmascarando
  errores tipográficos de formato y violando el contrato de la CLI. Ambas CLI ahora validan estrictamente los argumentos de formato
  (`json|table|plain` para search, `json|plain` para detail) y salen con código 1 con `{ error, code: "BAD_ARG" }`
  ante opciones inválidas.

- **`jobdanmark-search detail` ya no conserva una etiqueta de cierre mal formada como texto en la
  rama de HTML renderizado** (#525, `detail.ts`, `tests/detail-parsing.test.ts`) - una página en vivo escribía
  su elemento Jobtype como `Fuldtid </ li >`, y como `node-html-parser` no reconoce una
  etiqueta de cierre con un espacio después de la barra, el fragmento llegaba literalmente a la salida:
  `employmentType: ["Fuldtid </ li >"]`, un valor que no coincide con ninguno de los términos documentados de
  tipo de empleo. El mismo `cleanText` alimenta todos los campos de texto de ambas ramas, así que cualquiera de ellos
  podría llevarlo. `cleanText` ahora descarta la forma de etiqueta de cierre (`</ li >`, `</ li>`, `< /li>`)
  antes de colapsar los espacios, y solo esa forma, porque el analizador decodifica las entidades
  antes de que se ejecute `cleanText`, así que el texto del autor que la página codificó como `&lt;div&gt;` o `&lt;T&gt;`
  llega como un `<div>` / `<T>` literal y debe sobrevivir. Dos casos de prueba: la etiqueta suelta tanto en
  el elemento Jobtype como en un párrafo de descripción (falla en master), y un `<div>` codificado como entidad
  en una descripción que permanece en el texto.

- **`/add-portal` incluye el prefijo `.agents` en los `allowed-tools` generados** (#545,
  `.claude/commands/add-portal.md`, `tests/test_add_portal_command.py`) - la plantilla de especificación
  del frontmatter del `SKILL.md` del nuevo portal escribía `allowed-tools: Bash(bun run skills/<name>/cli/src/cli.ts *)`
  sin `.agents/`, la única ruta del archivo sin él. Los `allowed-tools` de una skill conceden el
  comando listado cuando se invoca esa skill, así que un portal generado invocado por sí solo concedía un
  comando que no existe y preguntaba en su lugar; la cadena ahora nombra la ruta real, coincidiendo
  con los seis archivos `SKILL.md` incluidos.

- **`robots_check` descomilla las cadenas de consulta entrantes y restringe los anclajes `$` al final del patrón**
  (#543, `tools/robots_check.py`, `tests/test_robots_check.py`) - dos casos límite de coincidencia de rutas en
  la barrera de robots.txt fallaban abiertos. Primero, `gate(url)` llamaba a `unquote(parts.path)` pero concatenaba
  `parts.query` en bruto, mientras que `_match()` decodifica el patrón: las reglas dirigidas a parámetros de consulta
  codificados (como `Disallow: /search?q=machine%20learning`) nunca coincidían con la URL entrante, evaluando
  objetivos de scraping prohibidos como permitidos. Los parámetros de consulta ahora se decodifican al ensamblar `path`.
  Segundo, `_match()` convertía cada carácter `$` incondicionalmente en un ancla de fin de cadena de expresión
  regular, haciendo que las reglas con un `$` interno (por ejemplo `/tag/$var`) nunca coincidieran; según
  la sección 2.2.3 de la RFC 9309, `$` es un ancla de fin solo al final del patrón, y los caracteres `$`
  internos ahora se comparan literalmente.

- **La guía de la plantilla de CV alinea la escala de geometry con la plantilla maestra** (#553,
  `.claude/skills/job-application-assistant/05-cv-templates.md`, `tests/test_latex_guidance.py`) -
  el fragmento de preámbulo de `05-cv-templates.md` especificaba `\usepackage[scale=0.77]{geometry}`,
  mientras que la plantilla de referencia maestra `cv/main_example.tex` configura `scale=0.80`. La guía
  se ha alineado con `scale=0.80`, evitando márgenes más ajustados y desbordamientos de página no deseados durante la
  generación del CV, y ahora una prueba protege que los dos archivos se mantengan sincronizados.

- **`.claude/settings.local.json` se ignora en `.gitignore` y se fija en las protecciones de seguridad** (#551,
  `.gitignore`, `tools/security_guards.py`) - Claude Code almacena los ajustes locales de la máquina y las
  aprobaciones de herramientas puntuales en `.claude/settings.local.json`. El archivo ahora queda excluido del control
  de versiones en `.gitignore` y fijado en `REQUIRED_IGNORE_RULES` para impedir que las personas que usan forks
  confirmen por accidente configuraciones de sesión locales.

- **`/rank` retira los empleos puntuados cuya fecha límite conservada ha pasado**
  (`tools/rank_state.py`, `tests/test_rank_state.py`) - una fecha límite `null` nueva
  conserva la fecha almacenada, pero `apply` antes escribía el empleo como `ranked`
  incluso después de que esa fecha hubiera pasado. El barrido posterior excluye las claves re-puntuadas,
  así que no podía corregir el estado ni la lista corta. Ahora `apply` caduca el empleo
  antes de cambiar los metadatos de clasificación; las fechas límite del día en curso, las prórrogas futuras
  explícitas, las fechas inválidas, las ejecuciones en seco y los errores de puntuación conservan su comportamiento.

- **`/reset profile` conserva el frontmatter `framework_version` en los dos archivos que reescribe**
  (paso 3 de `.claude/commands/reset.md`, `tests/test_reset_command.py`) - los esqueletos de archivo completo
  de `01-candidate-profile.md` y `02-behavioral-profile.md` empezaban por el título `#`, mientras que
  los archivos incluidos se abren con un bloque `---` que lleva `framework_version`. Aplicados tal cual,
  un `/reset profile` dejaba ambos archivos fallando `tools/check_framework_version.py` («missing
  'framework_version' in frontmatter») e invisibles para `tools/check_upstream_updates.py`,
  que registra un error de configuración para un archivo sin versión local con la que comparar: la ruta de actualización
  de forks por la que el README hace pasar a todos los forks. El paso ahora dice que hay que conservar el bloque de frontmatter
  y sustituir solo lo que sigue, con una nota bajo «Profile reset» de que el marcador es
  dato del framework, nunca dato del candidato; la versión no está codificada en el esqueleto, donde
  quedaría obsoleta en el siguiente incremento. Una prueba derivada aplica cada esqueleto tal como dice el paso
  y afirma que la versión del archivo incluido sigue analizándose sin cambios; falla en master.
  Detectado al re-verificar la clase de deriva de #519.

- **`/reset profile` ahora apunta a los encabezados que los archivos de skill incluidos tienen realmente**
  (paso 3 de `.claude/commands/reset.md`, `tests/test_reset_command.py`) - dos de sus objetivos del paso 3
  se habían desviado. El paso de `05-cv-templates.md` se anclaba en una sección que comenzaba
  `**Profile statement templates`, una línea que la guía nunca ha contenido (su encabezado es
  `**Create 2-3 profile statement templates for your main role types:**`), así que el borrado no encontraba
  nada: las declaraciones de perfil adaptadas al puesto de la persona usuaria, y cualquier declaración `*[Used for: ...]*`
  que el Camino A de `/setup` hubiera extraído de candidaturas archivadas, sobrevivían a un reset que
  informaba de éxito. El esqueleto de `02-behavioral-profile.md` usaba encabezados que el archivo incluido
  no tiene (`Strongest Behavioral Traits`, `How I Work Best`, un `Growth Areas` truncado)
  y eliminaba `## Core Behavioral Drives` —la tabla de evaluación que lleva el archivo incluido—, así que
  un solo reset dejaba los encabezados del archivo permanentemente distintos
  de los de todos los demás forks, sin nada que recreara la tabla. El ancla ahora nombra el encabezado
  real y el reemplazo lo vuelve a emitir; el esqueleto lleva los encabezados incluidos en orden.
  `01-candidate-profile.md` y `07-interview-prep.md` ya eran correctos. Dos pruebas nuevas
  derivan ambas comprobaciones de los archivos incluidos, de modo que un encabezado renombrado falla hasta que `/reset`
  lo siga; ambas fallan en master.

- **`freehire-search` rechaza los filtros `--facet` vacíos antes de solicitar empleos** (#561) -
  una flag sin valor (incluida una después de una faceta repetida válida), `salary_min=` o una
  lista de valores separados por comas que solo contiene espacios ahora devuelve `BAD_ARG` y
  sale con código 1 en lugar de descartar silenciosamente el filtro y ejecutar una búsqueda más amplia.

- **La prueba de comprobación de host de `/apply` deriva los hosts de sus portales instalados del árbol de skills
  en lugar de un conjunto copiado a mano** (#497, `tests/test_apply_host_check.py`) - `SHIPPED_PORTAL_HOSTS`
  eran seis nombres escritos en la prueba y nada lo vinculaba a nada: un portal añadido por
  `/add-portal` obtiene datos de un host del que la copia nunca había oído hablar, así que sus ofertas llegaban a `/apply`
  clasificadas como «unverified» mientras la suite seguía en verde, y un portal eliminado dejaba un nombre
  obsoleto atrás. La regla 1 de `apply.md` define un portal instalado como «cualquier portal de empleo configurado
  en `.agents/skills/`», así que ese árbol es ahora la fuente: los literales de host de cada
  `*-search/cli/src/**/*.ts` (un `BASE_URL` por CLI incluida, con `www.` eliminado para que el dominio raíz y
  el subdominio coincidan), descubiertos por instalación y no por la flag `enabled:`
  porque un portal instalado pero desactivado sigue siendo una fuente legítima para una oferta pegada.
  El valor por defecto de `classify_posting_host` es ese conjunto descubierto, y una nueva clase de prueba afirma que
  todos los portales instalados tienen un host descubrible y que cada host se clasifica como
  `installed_portal` en el dominio raíz, bajo `www.` y bajo un subdominio. La lista de dominios raíz de ATS sigue
  siendo el conjunto fijo que es; analizar la lista de ejemplo de `apply.md` deliberadamente no se hizo, ya que un
  analizador basado en la redacción de la prosa es lo siguiente que quedaría obsoleto. Reportado por Holo-Eter.

- **`/expand` y `/setup` ahora añaden los hallazgos de comportamiento a las secciones que `02-behavioral-profile.md`
  realmente tiene** (paso 5 de `.claude/commands/expand.md`, paso A7 de `.claude/commands/setup.md`,
  `tests/test_expand_command.py`, `tests/test_setup_command.py`) - ambos indicaban al modelo que añadiera
  a «Strongest Behavioral Traits» y «How I Work Best» / «How [Candidate] Works Best» mientras
  también decían «match existing structure», pero los encabezados del archivo incluido son «Strongest
  Behaviors» y «How You Work Best», así que un rasgo inferido o bien abría una sección duplicada
  casi idéntica o bien se descartaba. El complemento de #519, que corrigió la misma deriva en
  el esqueleto de `/reset`; el mantenedor pidió esta mitad como su propio PR. Ambas viñetas ahora nombran
  los encabezados incluidos, y una prueba derivada en la suite de cada comando lee los nombres de sección citados
  y exige que cada uno sea un encabezado `##` del archivo incluido; ambas fallan en master.

- **Los resultados de búsqueda de `jobnet-search` y `jobdanmark-search` ahora llevan el campo `id` del contrato**
  (`search.ts` y `search-normalization.test.ts` en ambas CLI, ambos `SKILL.md`) -
  el contrato de `/add-portal` dice que cada resultado de búsqueda tiene al menos `id`, `title`, `company`,
  `location`, `date`, `url`, y las otras cuatro CLI incluidas emiten `id`. Cuando #340 añadió los
  alias `company`/`location`/`date`/`url` a estas dos, se omitió `id`: jobnet exponía el
  valor solo como `jobAdId`, jobdanmark solo como `slug`, así que un consumidor que leía el JSON de todos los portales
  con una misma forma tenía que hacer un caso especial con ambos para llamar a `detail`. Puramente aditivo: `id`
  equivale a `jobAdId` en jobnet y a `slug` en jobdanmark, las claves nativas se mantienen, nada se
  renombra. La prueba de contrato aditivo de cada CLI ahora afirma `id` y su igualdad con la
  clave nativa; ambas fallan en master.

- **`jobdanmark-search detail` renderiza una descripción JSON-LD como texto en lugar de dejar pasar
  el marcado** (`.agents/skills/jobdanmark-search/cli/src/commands/detail.ts`,
  `tests/detail-jsonld.test.ts`) - la rama JSON-LD emitía `jobPosting.description`
  literalmente, así que `detail --format plain` imprimía
  `description: <p>Vi søger en udvikler til R&D.</p><ul><li>Python & Go</li>...` mientras que la
  rama de HTML renderizado del mismo comando imprimía una línea limpia por párrafo y viñeta:
  dos formas de descripción de un solo comando según el diseño de página con el que se encontrara, y el
  marcado acababa tal cual en el fragmento almacenado de `/scrape` y en el contexto del agente de `/rank`. El
  contrato del portal (paso 4 de `/add-portal`) pide «readable text (entities decoded, tags
  stripped, paragraph breaks preserved)». La rama JSON-LD ahora renderiza el HTML a través de
  `structuredText` de `node-html-parser` —una línea por elemento de bloque, entidades decodificadas, etiquetas
  eliminadas—, que es la forma que ya produce el método alternativo. Una descripción en texto plano no
  cambia, y una ausente sigue siendo `""`. La prueba de JSON-LD que fijaba el `<p>...</p>` en bruto ahora
  espera el texto, más dos casos nuevos; el caso de HTML falla en master.

- **`job_key.py` ya no da una misma clave a dos ofertas cuando un título o una empresa es en parte
  no latino** (`tools/job_key.py`, `tests/test_job_key.py`) - los métodos alternativos de hash de #487
  y #502 solo se activaban cuando el slug estaba completamente vacío, así que un nombre de escritura mixta conservaba su
  fragmento latino o numérico y los omitía: `Программист 1С` y `Аналитик 1С` en una misma empresa
  se codificaban ambos como `company-6d769a_1`, `Python-разработчик` y `Python-аналитик` como `..._python`,
  `Сбер AI` y `Яндекс AI` como `ai_...`. El paso 4 de `/scrape` descartaba entonces la segunda oferta por
  considerarla ya vista, y como la clave del diccionario se sobrescribe, `--audit` tampoco podía informar de la
  colisión como URL duplicada. Los títulos «1С» y los sufijos de grado «N категории» son
  anuncios rusos cotidianos en freehire, el portal multi-mercado incluido. El plegado ahora se
  trata como con pérdida siempre que descarta una letra fuera del alfabeto latino, y los métodos alternativos
  existentes toman el relevo: la mitad del título usa el id numérico del portal o el hash de la URL con el
  fragmento conservado como prefijo legible (`1-4461771225`, `python-fb29d7`), la mitad de la empresa usa
  el hash del nombre con casefold NFC y el fragmento como prefijo (`ai-d35210`). Las letras latinas que
  tampoco tienen descomposición (`ø`, `æ`, `ß`, `ł`) deliberadamente no se cuentan, así que `Ørsted`
  sigue codificándose como `rsted` y un `seen_jobs.json` danés en vivo no se re-codifica; una entrada
  de escritura mixta existente se re-codifica una vez en el siguiente scrape y `--audit` la enumera bajo
  `keys_not_matching_current_rule`, la misma deriva puntual que aceptó #502. Siete casos nuevos;
  los cuatro casos de colisión fallan en master. Un seguimiento mantiene la regla dentro de su propio caso:
  un título vacío cuya URL no lleva ninguna secuencia de seis dígitos se codifica según la base derivada de la URL
  (`acme_https-example-com-jobs-abc-xyz`) exactamente como antes, donde el primer corte había empezado
  a añadir el resumen: inalcanzable desde `/scrape`, que siempre pasa un título, pero una clave
  es una función pura de la oferta y no debería moverse por un caso que nunca fue el objeto de la regla.

- **`verify_pdf.py --ascii-dates` ya no lee una secuencia similar a un año dentro de un número más largo como una
  fecha** - el patrón de año no tenía límites de dígitos, así que `2000` dentro de `120000` o `12000` hacía
  que `Grew budget DKK 120000–200000` y `12000–15000 events/s` fallaran el paso 5d de `/apply` como
  rangos de fechas con guion corto, y el agente era enviado a arreglar un «date argument» que no existe.
  La guía promete que un rango numérico sin año se deja en paz; ahora es así. `2016–2024` junto
  a un número más largo sigue detectándose. Dos casos nuevos en `test_verify_pdf.py`; el numérico falla
  con el patrón sin límites.

- **La lectura de `git diff` de `check_framework_version.py` ya no se bloquea con contenido no ASCII en archivos
  del framework** (`tools/check_framework_version.py`) - `run_git()` llamaba a
  `subprocess.run(text=True)` sin `encoding` explícito, así que la salida se decodificaba con el
  códec por defecto de la configuración regional del host en lugar de UTF-8. En un clon real de Windows
  (cp1252 por defecto) esto lanzaba `UnicodeDecodeError` ante cualquier byte que cp1252 deje indefinido
  (cirílico Ё/ё, gran parte del CJK, latino de clase Á), que apareciera en el diff de un archivo del framework,
  bloqueando la barrera de versión antes de que llegara a evaluar el cambio. `run_git()` ahora pasa
  `encoding="utf-8"` y `errors="replace"` (coincidiendo con la convención ya usada en otros lugares de este
  repositorio, por ejemplo `robots_check.py`), decodificando de forma determinista independientemente de la configuración regional del host.
  Fijado por `RunGitEncodingTests` en
  `tests/test_check_framework_version.py`, que falla contra la llamada original sin fijar.

- **`/rank` sigue barriendo las fechas límite cuando no hay nada nuevo que puntuar** (paso 1 de `.claude/commands/rank.md`,
  `tests/test_rank_command.py`) - cuando `rank_state.py candidates` no informaba de ningún empleo
  elegible, el paso 1 decía «Nothing new to rank» y se detenía antes de que se ejecutara el barrido de caducidad
  de la regla 6 del paso 3. Una vez que se ha clasificado un backlog, esa es la ruta que sigue cada `/rank`
  posterior, así que los empleos con la fecha límite pasada seguían como `ranked` y los recordatorios de fecha límite cercana
  nunca se mostraban. Reproducido con la CLI real con cuatro entradas `ranked` (fechas límite 2026-09-22, 2026-09-28,
  null, `ASAP`): `candidates --today 2026-09-25` devuelve `eligible: 0` y master se detiene ahí,
  mientras que `sweep --write` sobre el mismo estado caduca la entrada del 09-22, enumera la del 09-28 bajo
  `closing_soon` y `ASAP` bajo `unparseable_deadlines`, y deja en paz la nula. La
  rama de candidatos vacíos del paso 1 ahora ejecuta `python3 tools/rank_state.py sweep --write`, omite
  la carga del perfil y los pasos 2-4 (nada que obtener ni puntuar; el rastreador no se toca) y
  presenta un resumen del paso 5 solo con el barrido (`swept`, `newly_expired`, `closing_soon` con fechas
  límite y URL, `unparseable_deadlines` con portales) antes de sugerir `/scrape`. Un lote vacío
  causado por un filtro de enfoque o por la exclusión del rastreador toma la misma ruta. Fijado por
  `test_step1_empty_candidates_still_sweeps_and_reports`, que falla contra el `rank.md` de master.

- **`robots_check` ya no lee un BOM inicial ni una regla no decodificable como permiso**
  (`tools/robots_check.py`, `tests/test_robots_check.py`) - dos casos límite de decodificación fallaban
  abiertos, ambos señalados como seguimientos en #506. Un robots.txt guardado con marca de orden de bytes UTF-8
  se decodifica a un cuerpo que empieza por U+FEFF, así que su primer campo no era `user-agent`: un
  `User-agent: *` inicial pasaba desapercibido, todas las reglas de ese grupo se descartaban por falta de un
  agente, y la barrera leía el archivo como permitir todo. Reproducido a través de la CLI en hosts reales:
  cnnturk.com y sakarya.edu.tr sirven `EF BB BF` + `User-agent: *`, y master imprimía
  `ALLOWED` para sus `/hesap/` y `/bin/` prohibidos. `_groups()` e `is_robots_body()`
  ahora omiten un U+FEFF inicial, como hace el analizador de referencia de Google, así que queda cubierto todo
  llamador de `allowed()` (un cuerpo solo con BOM ahora es el archivo vacío que es, permitir todo, en lugar de
  un 200 blando). Aparte, el `errors='replace'` de #506 convierte bytes no ASCII en bruto de un
  robots.txt no conforme guardado en una página de códigos heredada (cp1254, ISO-8859-9) en U+FFFD, así que
  una regla como `Disallow: /şirket/` nunca podía coincidir y se omitía silenciosamente. Una
  línea User-agent, Allow o Disallow que contenga U+FFFD ahora hace que el cuerpo sea ilegible, y la
  barrera imprime `UNCONFIRMED`. El campo se nombra con U+FFFD eliminado, así que un byte suelto antes de
  `Disallow` tampoco puede ocultar la línea; U+FFFD en un comentario u otro campo sigue siendo
  inofensivo, y las reglas UTF-8 válidas deciden como antes. Nueve pruebas nuevas; las siete que fijan los
  fallos abiertos fallan en master.

- **`verify_layout.py` encuentra un encabezado de entrada huérfano por dónde empieza el texto**
  (`tools/verify_layout.py`, `tests/test_verify_layout.py`) - la regla de huérfano comparaba los bordes
  izquierdos de las líneas con el margen del documento, y un marcador de lista mueve el borde izquierdo de una línea sin
  mover su texto. Una plantilla que fusiona el marcador de cada viñeta con su primera línea (#481) hacía
  que una viñeta que se partía a lo largo del salto de página se informara como un encabezado huérfano, y un encabezado
  huérfano real seguido de tales viñetas no se informaba en absoluto. En el CV de serie, cuando el marcador exterior
  se extrae como una línea propia, un encabezado `[Job Title]` dejado al pie de una página con sus
  viñetas en la página siguiente no se informaba (su texto en x70.4 contaba como indentado), y un elemento de lista
  cuyo marcador exterior está 1,3 pt por debajo de su línea se informaba como una viñeta partida. La regla ahora
  compara dónde empieza el texto de la última línea impresa de la página —después de cualquier glifo de viñeta
  inicial de `• ‣ ▪ ● ·` (ASCII, guiones y otros glifos son texto)— con dónde empieza el texto de
  la primera línea impresa de la página siguiente, e informa de un encabezado huérfano cuando esta última
  está más adentro. Las líneas de bbox cuyas partes superiores están dentro de 3 pt cuentan como una misma línea impresa, y una
  línea cuyo texto empieza más de 60 pt más allá del margen (un encabezado de página, una fecha alineada a la derecha)
  no es donde reanuda la página siguiente. Un marcador solo sin texto a su lado mantiene el
  informe de viñeta partida. En 304 compilaciones del CV de serie (`\vspace*` de 0 a 600 pt antes de cuatro
  entradas) esto añade 15 informes, cada uno un encabezado `[Job Title]` al pie de una página con sus
  viñetas en la página siguiente, y las otras 289 compilaciones dan la misma salida que antes.

- **Una oferta en un portal sin id numérico ya no recibe una segunda clave cuando su
  título se vuelve a listar con distinta capitalización** (#501, `tools/job_key.py`,
  `tests/test_job_key.py`) - la clave mezclaba un título convertido en slug junto con la URL siempre que
  `normalizeId` no encontrara una secuencia de seis dígitos en la ruta, que es cada oferta de freehire. La
  API en vivo devuelve tanto `Инженер` como `инженер` en distintas filas, y el slugificador los mapea
  a slugs distintos, así que una misma URL podía guardarse con varias claves. `/rank` construye su
  conjunto de exclusión a partir de `seen_jobs.json`, así que una oferta ya vista podía presentarse de nuevo.
  La clave ahora es un hash solo de la URL: la URL es la identidad que `/scrape` almacena, y
  el título nunca fue una mitad estable de ella. **Las entradas escritas antes de esta corrección para un
  título no latino en un portal sin id numérico se re-codificarán una vez en el siguiente scrape.**
  `python3 tools/job_key.py --audit` informa de esas entradas bajo
  `keys_not_matching_current_rule`; nunca las reescribe.

## [1.7.2] - 2026-09-29

### Added

- **`verify_pdf.py --ascii-dates` hace ejecutable la regla documentada de rangos de fechas**
  (`tools/verify_pdf.py`, paso 5d de `/apply`, `05-cv-templates.md`, CI) - «Date fields must be
  ASCII ranges» registra una importación real de Workday que descartó la fecha de fin de un puesto porque
  `2016--2024` llega a la capa de texto como `2016<U+2013>2024`, e indicaba al paso 5d que confirmara que los
  años de cada entrada están unidos por un guion ASCII. Nada ejecutaba eso: la sonda natural,
  `--contains "2016-2024"`, fallaba igual para «con guion corto» y «ausente» antes de #458 y
  pasa en ambos desde entonces, porque el plegado mapea el guion corto de vuelta a `-` a propósito. La nueva flag
  lee la capa en bruto (nunca el plegado), falla ante un año unido a cualquier guion Unicode o al
  signo menos, y nombra cada acierto con su línea y su punto de código. Un año a cualquier lado es
  suficiente (`Mar 2016 – Jul 2016`, `2016 – Present`); un rango numérico sin año no es una
  fecha. El comando de extracción del paso 5d ahora lleva la flag (el volcado se sigue escribiendo antes
  de que falle la comprobación), el elemento «Dates recognizable» de la lista de verificación apunta a ella y mantiene la mitad
  del año único a secas como lectura, el párrafo «add this to the step 5d checks» de la guía
  nombra el comando, y la aserción de CI exclusiva del proyecto original la ejecuta sobre el CV de serie.
  Demostrado con la plantilla de serie: una compilación `\cventry{2016--2024}` falla con `U+2013`, la
  compilación `\cventry{2016-2024}` pasa, y `--contains "2016-2024"` pasa en ambas. Solo puede haber
  espacio en blanco horizontal entre el año y el guion, así que un año que termina una línea no
  se une a un guion que abre la siguiente (una viñeta, una línea de prosa partida): hallazgo de
  yang2632 en la revisión, con la regex y el caso de prueba. Trece casos nuevos en `test_verify_pdf.py`.
  Propuesto por 9scorp4 en la discusión #385.

- **Pruebas de integración con libros de Excel reales para el conversor de salarios**
  (`tests/test_convert_salary_excel_integration.py`, `.github/workflows/ci.yml`) -
  generan archivos `.xlsx` temporales e invocan la CLI documentada del conversor,
  comprobando varias hojas de cálculo, opciones de metadatos, texto Unicode, números
  localizados y compatibilidad con la consulta de salarios. Un libro sin encabezados de salario
  debe fallar sin crear un archivo de salida. La CI instala `openpyxl`
  en toda la matriz de Python; las ejecuciones locales sin esta dependencia opcional omiten
  los dos casos de integración mientras conservan las pruebas existentes sin dependencias.

- **Ingesta del portafolio `documents/projects/` en `/setup` (Camino A)** (`documents/README.md`,
  `.claude/commands/setup.md`, `.claude/commands/reset.md`, `tests/test_setup_command.py`) -
  incorpora descripciones de proyectos, estudios de caso y documentación (`.md`, `.txt`, `.pdf`)
  de `documents/projects/`, extrayendo resúmenes estructurados (ámbito del problema, stack tecnológico,
  retos técnicos y resultados medibles) para rellenar `## Independent Projects`
  en `01-candidate-profile.md`.

- **Verificación del host de origen en el paso 1 de `/apply`** (#431, `.claude/commands/apply.md`,
  `tests/test_apply_host_check.py`) - antes de pasar a redactar el CV y las cartas de presentación,
  el paso 1 verifica la procedencia de la URL de la oferta frente a los portales instalados y los
  seis dominios raíz estándar de ATS (`greenhouse.io`, `lever.co`, `myworkdayjobs.com`/`workday.com`,
  `ashbyhq.com`, `smartrecruiters.com`, `workable.com`). La suplantación por prefijo/sufijo similar
  falla cerrada, y los hosts no reconocidos se marcan claramente como no verificados en la salida de la evaluación
  (`⚠ Unverified source host: <hostname>`) antes de gastar tokens en redactar.

- **Expansión de proyectos y portafolio en `/expand`** (`.claude/commands/expand.md`,
  `tests/test_expand_command.py`) - amplía el descubrimiento de candidatos
  a proyectos técnicos de repositorios públicos de GitHub, extrayendo resúmenes estructurados
  (ámbito del problema, stack tecnológico, retos técnicos clave y resultados verificables) para
  rellenar la sección `## Independent Projects` de `01-candidate-profile.md`.

- **Rama de barrido de estancados en `/outcome`** (`.claude/commands/outcome.md`,
  `tests/test_outcome_stale.py`) - introduce `/outcome stale [N]` (y `/outcome sweep [N]`)
  para resolver por lotes candidaturas abiertas que llevan 60+ (o N) días de silencio. Muestra un resumen numerado
  de las candidaturas que cumplen los criterios, exige confirmación explícita de la persona usuaria (`all`, `select` o `skip`),
  resuelve las filas confirmadas a `no_response`, registra entradas fechadas en `notes`, actualiza los archivos
  `outcome.md` del archivo de candidaturas y pasa a la calibración cuando se resuelven 3+ candidaturas.

- **Verificación mecánica del diseño de PDF compilados** - `tools/verify_layout.py` mide
  lo que el paso 5b de `/apply` antes solo revisaba a ojo: extensión del texto por página, espacio en blanco
  inferior, el mayor hueco vertical interno, colisiones con el pie de página y encabezados de entrada o encabezados de sección
  varados en un salto de página. Existe por un fallo que sobrevive a todas las comprobaciones existentes:
  un `\cventry` de moderncv es un `tabular` inseparable, así que una entrada que no cabe
  salta a la página siguiente y deja un hueco detrás (observado a 273 pt, unas 19 líneas en blanco)
  mientras el documento sigue compilando, sigue informando del recuento de páginas correcto y sigue
  pasando `tools/verify_pdf.py`. La geometría procede de `pdftotext -bbox` de Poppler; Poppler es
  opcional en todo el repositorio (desde #369 `verify_pdf.py` prefiere pypdf), y los cuadros delimitadores de
  palabras no tienen equivalente en pypdf, así que este es el único paso que todavía lo quiere. Un Poppler ausente
  —o el `pdftotext` basado en xpdf que Git para Windows antepone en el PATH, que rechaza
  `-bbox`— se degrada a una salida `skipped:` con código 2 en lugar de informar de un fallo de diseño fantasma.
  El recuento de páginas se deja deliberadamente a `verify_pdf.py --pages` para que una regla mantenga una
  implementación. Los umbrales están calibrados para la geometría de moderncv y `cover.cls` de serie.
  Las pruebas usan geometría de página sintética, así que no necesitan ni Poppler ni una cadena de herramientas
  de LaTeX.

### Changed

- **`/add-template` guarda los intermedios de una plantilla registrada en `build/`**
  (#473, `.claude/commands/add-template.md`, `.gitignore`,
  `tests/test_add_template_build_dir.py`) - el comando de compilación elicitado
  ahora redirige los intermedios (`.aux`, `.log`, ...) a una carpeta `build/` junto al código fuente
  y devuelve el PDF a su sitio, así que la limpieza de la compilación de prueba del paso 4 borra una sola carpeta en lugar de
  enumerar extensiones de LaTeX. El comando de LaTeX borra primero el PDF anterior, así que una
  compilación fallida no deja ningún PDF obsoleto para que lo inspeccione `/apply`. Las cadenas de herramientas sin nada que
  redirigir (`typst compile`) mantienen su comando sin cambios. El bloque `ACTIVE-TEMPLATE` ahora
  indica a `/apply` que ejecute el comando desde el directorio de salida y que borre `build/` en
  su limpieza del paso 5e. Las plantillas de serie no cambian.

### Fixed

- **Los títulos de `freehire-search` ya no llevan entidades HTML ni espacios en blanco sueltos**
  (`.agents/skills/freehire-search/cli/src/helpers.ts`) - los títulos se indexan tal como los escribió el ATS de origen
  y `toResult` los pasaba sin tocar, así que `detail
  intern-fullstack-amp-ai-innovation-noise-edaawqq2` imprimía `Intern - Fullstack &amp; AI
  Innovation ` (espacio final incluido), y el mismo título llegaba a la salida de `search`. En un
  lote de `/scrape` de 93 resultados (`--country IN --seniority intern`), 1 título llevaba `&amp;` y 3
  terminaban en espacio. El paso 4.75 de `/scrape` lee las entidades sin decodificar de los títulos como un
  analizador a medio funcionar, así que por esa regla una sola oferta así marca un portal sano como
  degradado. El título ahora pasa por el `decodeHtmlEntities` existente de la CLI (ya usado
  para las descripciones de `detail`) y se recorta; un título vacío o solo con espacios sigue recurriendo
  a `(untitled)`. Fijado por tres casos nuevos en `parsing.test.ts`, que fallan con el antiguo
  paso directo.

- **`freehire-search detail` conserva el periodo del salario, así que una cifra anual ya no se lee como
  mensual** (`.agents/skills/freehire-search/cli/src/helpers.ts`, `SKILL.md`) - `formatSalary`
  imprimía solo la moneda y los importes, aunque el enriquecimiento de freehire registra el periodo:
  `detail software-developer-trainee-codifi-fra635ux` imprimía `INR 300000–300000` mientras la
  API devuelve `salary_period: "year"` para esa oferta, así que cualquiera que cribara el salario frente a una
  cifra mensual leía un salario anual como mensual, doce veces su valor mensual real.
  Ahora el periodo se añade cuando freehire registra uno (`INR 300000–300000/year`,
  `INR 12000/month`); un registro sin periodo se imprime exactamente como antes. Fijado por dos casos nuevos
  en `parsing.test.ts`, ambos fallando con el antiguo formateador.

- **`robots_check` decodifica la salida de curl como UTF-8, así que una respuesta no ASCII ya no se lee como
  UNCONFIRMED en Windows** (`tools/robots_check.py`, `tests/test_robots_check.py`) -
  `_fetch()` ejecutaba curl con `text=True` y sin encoding, así que Python decodificaba la respuesta con
  la página de códigos ANSI. Ante un byte que esa página de códigos deja indefinido (0x81 en cp1252 y cp1254,
  0x9e en cp1254) el hilo lector de la tubería de subprocess moría, `stdout` volvía como `None` y la
  barrera imprimía `UNCONFIRMED (AttributeError)`, fallando cerrada pero bloqueando el
  reintento con cabeceras de navegador que permite `09-web-research.md`. Reproducido a través de la CLI en hosts
  reales: el robots.txt de tr.indeed.com lleva `Disallow: /職涯貼士/` (職 es `e8 81 b7`), y
  kap.org.tr responde a `/robots.txt` con un 404 HTML UTF-8 cuyo «A.Ş.» lleva `c5 9e`. La
  llamada ahora fija `encoding='utf-8', errors='replace'` (RFC 9309: robots.txt es UTF-8), como
  ya hacen `verify_pdf.py` y `verify_layout.py`. Eso también cierra un fallo abierto silencioso: una
  regla UTF-8 cuyos bytes sí define la página de códigos (`Disallow: /şirket/` bajo cp1254)
  se decodificaba como `/ÅŸirket/`, nunca coincidía y se leía como permitida. Las reglas de decisión no cambian.
  Dos pruebas nuevas sustituyen curl por un proceso hijo que imprime esos bytes y fijan cp1254 cuando no se
  pasa encoding, así que el fallo no depende de la configuración regional del host; ambas fallan sin
  la corrección.

- **La comprobación de avisos de compilación cubre también `tests/*.py`** (`tests/test_verify_pdf.py`,
  `tests/test_verify_layout.py`) - el docstring de `FindNonAsciiDateRangesTests` cita la regex
  `\s*` sin escapar, así que Python 3.12+ imprime un `SyntaxWarning` por el escape inválido `\s` cuando
  se compila el módulo de prueba. Aparece en el propio registro de CI de este repositorio en 3.12, 3.13 y 3.14 mientras
  la ejecución sigue en verde, y bajo `-W error::SyntaxWarning` el módulo no se puede importar. Escapado
  en el docstring; `ToolsCompileWithoutWarnings` ahora compila `tests/*.py` además de
  `tools/*.py` y falla con la versión sin escapar.

- **`linkedin-search detail` ya no obtiene una oferta no relacionada para una URL de otro
  host** - `normalizeId` tomaba el primer segmento de ruta de 6+ dígitos de *cualquier* URL, así que un
  enlace de candidatura de Greenhouse o Lever (del tipo que entrega la propia página de una oferta, y lo que una persona
  pega de vuelta en `detail`) se reducía a ese número y el manejador obtenía
  `jobPosting/<number>` de LinkedIn: volvía cualquier empleo que llevara ese id, impreso con
  código de salida 0, o `NOT_FOUND` si no había ninguno, nunca un error sobre la entrada. Demostrado ejecutando
  el manejador real con un fetch simulado: `https://boards.greenhouse.io/acme/jobs/4567890`
  solicitaba `.../jobPosting/4567890`. Todas las demás CLI de portales rechazan una URL de detail de otro host
  con `BAD_ID` (la forma de #447); linkedin era la única que aún confiaba en los dígitos. Las URL ahora se
  analizan de verdad: un host `linkedin.com` (dominio raíz o cualquier subdominio, esquema opcional) más una
  ruta `/jobs/view/<slug-><id>` produce el id, y cualquier otra cosa —otros hosts, hosts similares y
  con userinfo, una URL de perfil o de búsqueda de linkedin.com— sale con código 1 con el contrato
  `BAD_ID` en JSON por stderr antes de cualquier petición. Los ids a secas, los URN y los slugs de título
  sin barra no cambian. Fijado por cuatro casos nuevos de `normalizeId` y un nuevo `detail-input.test.ts` que
  ejecuta `runDetail` y la CLI con el fetch simulado; los casos de otro host fallan con el antiguo
  patrón.

- **La coincidencia del rastreador en `/rank` preserva nombres de empresa y puesto con Unicode**
  (`tools/rank_state.py`, `tests/test_rank_state.py`) - la normalización solo ASCII
  colapsaba distintos puestos no latinos al mismo valor vacío y descartaba
  por completo las empresas no latinas de las exclusiones del rastreador. Haz la coincidencia con plegado
  de mayúsculas Unicode y normalización NFC, conservando letras, números y marcas
  combinantes mientras se siguen ignorando la puntuación y los espacios. Las regresiones de la CLI
  usan el encabezado estándar del rastreador y cubren nombres distintos, coincidencias rastreadas,
  codificaciones de acentos equivalentes y el comportamiento de coincidencia ASCII existente.

- **Las herramientas de Python ya no se bloquean en Windows cuando una oferta, empresa, línea de CV o nombre
  de archivo queda fuera de la página de códigos ANSI** (`tools/rank_state.py`, `tools/job_key.py`,
  `tools/verify_pdf.py`, `tools/verify_layout.py`, `tools/convert_salary_excel.py`,
  `salary_lookup.py`, `tests/test_tools_utf8_output.py`) - un stdout canalizado en Windows
  usa por defecto la página de códigos ANSI (cp1252 en la mayoría de las instalaciones occidentales), y así es como Claude
  Code ejecuta todas las herramientas. El listado de candidatos de `/rank` imprimía títulos y empresas con
  `ensure_ascii=False`, así que una sola oferta en cirílico, CJK, devanagari, polaco o turco
  terminaba la ejecución con `UnicodeEncodeError` antes de que llegara ninguna salida al flujo de trabajo; la auditoría de claves,
  la consulta de salarios, el conversor de salarios y el informe de diseño fallaban igual.
  Cada herramienta ahora cambia stdout y stderr a UTF-8 al entrar, lo que también evita que los acentos daneses y
  otros acentos occidentales lleguen como bytes cp1252. Las pruebas de regresión ejecutan cada
  herramienta en un proceso hijo con un stdout cp1252 forzado mediante `PYTHONIOENCODING`, de modo que el
  trabajo de CI en Linux reproduce el fallo de Windows; las siete fallan sin la corrección. Los
  helpers de subprocess de `tests/test_rank_state.py` y `tests/test_job_key.py` ahora decodifican
  la salida del hijo como UTF-8 para coincidir.

- **`/rank` rechaza las dimensiones de puntuación inválidas antes de actualizar una entrada**
  (`tools/rank_state.py`, `tests/test_rank_state.py`) - aplica el rango inclusivo de 0 a 100 de la
  rúbrica y rechaza booleanos, NaN e infinitos. Los resultados inválidos
  ahora usan el informe de errores por empleo existente, dejando intacta la entrada rechazada
  mientras se guardan los resultados válidos del mismo lote. Las pruebas de la CLI cubren cada dimensión
  de puntuación, enteros sobredimensionados, valores límite y redondeo de puntuaciones fraccionarias.

- **Los nombres de empresa no latinos distintos ya no comparten la clave de empleo de empresa desconocida**
  (`tools/job_key.py`, `tests/test_job_key.py`) - cuando un nombre de empresa no vacío
  no tiene slug ASCII, deriva su método alternativo de un hash del nombre normalizado.
  Los nombres ausentes conservan `unknown-company`, y las claves ASCII existentes no cambian.
  Las pruebas de la CLI cubren empresas distintas, equivalencia de mayúsculas y Unicode canónico,
  y claves estables entre URL de ofertas. El estado existente no se reescribe; `/scrape`
  ya reconoce las ofertas almacenadas por URL independientemente de su clave anterior.

- **La exclusión del rastreador en `/rank` gestiona los BOM UTF-8 con encabezados CSV reordenados**
  (`tools/rank_state.py`, `tests/test_rank_state.py`) - cuando `company` o `role`
  es la primera columna, un BOM inicial pasa a formar parte del nombre del encabezado y una
  candidatura ya rastreada se selecciona de nuevo para clasificar. Se leen con
  `utf-8-sig` para que los rastreadores con prefijo BOM y en UTF-8 plano coincidan correctamente.
  El encabezado estándar con `date` primero ya funcionaba; la cobertura de regresión comprueba
  los tres órdenes de columnas con y sin BOM.

- **`verify_layout.py` ya no emite un `SyntaxWarning` en cada ejecución** (`tools/verify_layout.py`,
  `tests/test_verify_layout.py`) - el docstring del módulo nombra la macro cuya ausencia desencadena el
  bloqueo de `-bbox` de Poppler, `\hypersetup{pdftitle=...}`, y un `\h` suelto en un docstring no raw es una
  secuencia de escape inválida. Python 3.12+ imprime `SyntaxWarning: "\h" is an invalid escape sequence`
  la primera vez que se compila el módulo (CPython gh-98401): aparece en el propio registro de CI de este repositorio,
  y en medio del informe de diseño del paso 5b de `/apply`. La referencia del lenguaje de 3.15 todavía
  documenta la secuencia como un `SyntaxWarning`, con un `SyntaxError` solo en una versión futura de Python. Escapado
  en el docstring; el nuevo caso `ToolsCompileWithoutWarnings` compila el
  código fuente de cada `tools/*.py` con los avisos capturados y falla con la versión sin escapar, así que el
  siguiente docstring que cite una macro de LaTeX también se detecta.

- **El paso 5b de `/apply` ahora ejecuta de verdad la comprobación de recuento de páginas que decía que ejecutaba el paso 5d**
  (`.claude/commands/apply.md`, `tests/test_apply_page_count.py`) - la prosa del 5b decía
  «Page count is not checked here - that is `verify_pdf.py --pages`'s job, and Step 5d already
  runs it», y el docstring de `verify_layout.py` declina medir el recuento de páginas por la misma
  razón. La única llamada a `verify_pdf.py` del paso 5d es `--dump-text`, y ningún paso del flujo de trabajo
  pasaba `--pages` en absoluto (solo lo hace la aserción de CI exclusiva del proyecto original sobre los ejemplos de serie),
  así que los límites estrictos de 2 páginas para el CV y 1 para la carta de presentación no los aplicaba nada más que la
  lectura visual del PDF: el fallo de «medir primero, luego mirar» que el 5b estaba escrito para evitar. El 5b ahora
  ejecuta `verify_pdf.py --pages 2` sobre el CV y `--pages 1` sobre la carta de presentación antes de
  `verify_layout.py`, nombra el límite de páginas de `ACTIVE-TEMPLATE` como sustituto para una plantilla personalizada
  y la frase de aplazamiento apunta a esas líneas. Cuatro pruebas de especificación fijan las
  invocaciones, sus recuentos, su orden respecto a la medición del diseño, y que ninguna
  prosa aplace la comprobación a un paso que no la ejecute; las cuatro fallan en master.

- **`salary_lookup.py` imprime la nota al pie de privacidad solo cuando una fila lleva realmente `N/A*`**
  - la línea `* N/A = Too few employees to publish (privacy)` se añadía bajo cada
  tabla de categoría, incluida una en la que todas las filas tienen índice, así que la salida afirmaba una
  supresión que nunca ocurrió (el residuo señalado en #470). La nota al pie ahora sigue una
  flag establecida por la rama `N/A*`; una tabla con una fila suprimida se renderiza exactamente como antes.
  Dos casos de `FormatEntryTests` fijan ambas direcciones; el de «omitted» falla en master.

- **`convert_salary_excel.py` empareja un par de columnas `Count`/`Index` a secas en lugar de
  dividirlo, así que `salary_lookup.py` ya no etiqueta un recuento publicado como suprimido por
  privacidad** - el bucle de emparejamiento exigía un nombre de categoría derivado no vacío en
  ambos lados, pero un encabezado sin palabra de categoría (`Count` + `Index`, el danés `Antal` +
  `Lønindeks`) se reduce a un nombre vacío, así que el diseño más simple que anuncia el README
  («auto-pairs count/index columns») salía como dos categorías independientes sin relación:
  `{"count": {"count": 500}, "index": {"index": 108.5}}`. `salary_lookup` entonces renderizaba
  una fila `Count  500  N/A*` encima de una fila `Index  -  108.5`, y la nota al pie leía el
  `N/A*` como «too few employees to publish (privacy)», una afirmación falsa sobre una empresa
  cuyo recuento de empleados está en el archivo, mostrada durante el paso de salario de `/apply`. Demostrado
  a través de la ruta documentada Excel -> JSON -> lookup con `openpyxl`; añadir cualquier sufijo
  (`Antal alle`) hacía funcionar el emparejamiento, que es por lo que las pruebas incluidas, todas con sufijo, nunca
  lo detectaron. Los pares a secas ahora se emparejan bajo el nombre de categoría de nivel superior del README
  (`all_employees`); un `Antal` a secas sin columna de índice a secas sigue siendo un recuento
  independiente, y los pares con nombre de al lado no se tocan. Cuatro casos nuevos en
  `test_convert_salary_excel.py`, incluido uno que renderiza la salida del conversor a través de
  `salary_lookup.format_entry`; los cuatro fallan con la antigua regla de emparejamiento.

- **El mensaje `skipped:` de `tools/verify_layout.py` nombraba solo una causa de un extractor roto
  cuando hay dos** (#451) - culpaba al `pdftotext` basado en xpdf que Git para
  Windows antepone a Poppler en el PATH (sin flag `-bbox`, sale con código 99), pero un Poppler
  real también puede abortar `-bbox`/`-bbox-layout`/`-htmlmeta`: Poppler 26.0x anterior a 26.05 se bloquea ante
  cualquier PDF cuyo diccionario Info lleve una cadena vacía en cualquier campo, y `hyperref`
  escribe exactamente eso para cada campo que no define. Un documento `lualatex`/`pdflatex`
  construido con `hyperref` y sin `\hypersetup{pdftitle=...}` —una plantilla de CV de `/add-template`
  normal, no una mal formada— se topa con esto con un Poppler en funcionamiento instalado, y el
  antiguo mensaje enviaba a quien lo leía a revisar su PATH cuando no tenía nada mal. El
  mensaje ahora nombra ambas causas; el comportamiento no cambia, degradándose a `skipped:` con código 2
  en cualquier caso, ya que un extractor roto sigue sin ser un documento roto.

- **La protección de marcadores de posición de plantillas en `test_setup_command.py` ahora se omite en los forks** (#463) -
  `TemplatesStillCarryThePlaceholders` afirma que `05-cv-templates.md` y
  `06-cover-letter-templates.md` siguen conteniendo `[FIRST_NAME]`, `[LAST_NAME]`, `[YOUR_EMAIL]`,
  `[YOUR_PHONE]`, `[YOUR_NAME]` y `[YOUR_LINKEDIN_URL]`. Ejecutar `/setup` —la ruta documentada, y lo que
  existen para hacer los pasos 3.5/3.6 de ese comando— reemplaza exactamente esos tokens, así que en
  un fork personalizado `python3 -m unittest discover -s tests` falla ambas comprobaciones de forma permanente y
  marca cada push en rojo. La clase ahora usa el mismo `@unittest.skipIf` sobre `GITHUB_REPOSITORY`
  (asumiendo el proyecto original cuando no está definida, para que las ejecuciones locales con plantilla inalterada sigan ejecutando las protecciones)
  que recibió `test_placeholder_integrity.py` en #407. La protección llegó tres días después de esa
  corrección y no adoptó el patrón; el trabajo `placeholder-integrity` de la CI está restringido al proyecto original y
  no cubre los tokens de `05`/`06`, así que `python-tests` era su única comprobación.
- **`verify_pdf.py --contains` ahora ve a través de las sustituciones tipográficas de LaTeX y
  la capa de texto de pdflatex mantiene los acentos precompuestos** (discusiones #385, #384) - la
  comparación solo plegaba el espacio en blanco, pero LaTeX liga `'` en U+2019 y `--` en
  U+2013, así que en el CV de serie compilado con el comando `lualatex` documentado
  `--contains "Master's degree"` y `--contains "2016-2024"` informaban ambos de palabra clave
  ausente en un documento que claramente la contiene (medido con ambos extractores;
  `Six Sigma` y `Statistics` en la misma página pasaban). El remedio documentado para una
  palabra clave ausente es añadirla, así que el falso negativo empujaba hacia lo único que la sección ATS
  prohíbe. `normalize_text()` ahora pliega ambos lados —NFC, luego apóstrofos/comillas tipográficos a ASCII, guiones
  cortos/largos a `-`, espacio duro a espacio— solo en el momento de la comparación; `--dump-text` sigue escribiendo la capa
  en bruto, porque eso es lo que analiza un ATS y la regla de rangos de fechas de `05-cv-templates.md` necesita el guion corto en bruto visible
  allí. Aparte, pdflatex sin codificación de fuentes T1 almacena los acentos descompuestos
  (`e` + U+0300; pypdf lo lee como un acento espaciador suelto), que NFC no puede reparar
  del todo: moderncv 2.5 carga T1 por sí mismo bajo pdflatex, pero el 2.3.1 empaquetado en apt no lo
  hace, así que `cv/main_example.tex` y el preámbulo de la guía ganan
  `\ifpdftex\usepackage[T1]{fontenc}\fi`, una operación nula en la ruta de lualatex. Fijado por
  diez casos nuevos en `test_verify_pdf.py` (los de plegado fallan con el código que solo pliega espacios)
  y una protección en `test_latex_guidance.py` de que la línea existe y se mantiene
  solo para pdflatex. Reportado y diagnosticado por 9scorp4. Personas que usan forks: vuestro
  `cv/main_example.tex` personalizado gana la única línea de preámbulo protegida al hacer rebase (una fusión
  de 3 vías limpia salvo que hayas editado el preámbulo); los CV personalizados compilados con lualatex no necesitan nada.
- **`jobdanmark-search detail` ahora aplica backoff en 429/5xx como el comando detail de todos los demás portales**
  - el manejador llamaba a `fetch()` directamente en lugar de pasar por los propios envoltorios de petición
  de la CLI, así que no llevaba ninguna de las tres cosas que garantizan `apiFetch`/`apiPost`:
  sin bucle de reintentos en 429/5xx (una página de detail con límite de peticiones escribía `API_ERROR` y salía tras un
  intento, mientras que jobnet, jobbank, jobindex, linkedin y freehire reintentan hasta seis
  veces), una cadena User-Agent insertada a mano que se desviaría del `USER_AGENT` exportado,
  y un tiempo de espera que las pruebas de los envoltorios nunca veían. `/scrape` llama a `detail` una vez por
  oferta preseleccionada, así que una ráfaga que activara el limitador de peticiones de jobdanmark descartaba esas
  ofertas por completo —sin descripción, sin fecha límite— mientras que la misma ráfaga en cualquier otro
  portal la superaba. Demostrado ejecutando el manejador real del comando con un 429 simulado:
  1 intento de fetch y salida 1 antes, 7 intentos después (el intento inicial del contrato más seis
  reintentos). Corregido añadiendo `htmlFetch` a `helpers.ts` con el mismo calendario de backoff,
  tiempo de espera y User-Agent compartido que los envoltorios de JSON (404 devuelve `null` para que `detail` mantenga
  su contrato `NOT_FOUND`) y enrutando `detail` a través de él. Fijado en las suites existentes
  `retry-backoff`, `user-agent` y `request-timeout`, que ahora cubren los tres
  envoltorios, más un nuevo `detail-backoff.test.ts` que ejercita la propia ruta del manejador:
  sus casos de reintento fallan contra el `fetch()` a secas.

- **Las notas de formato libre del rastreador ya no rompen la fila del CSV** (#454) (`.claude/commands/gmail-sync.md`,
  `.claude/commands/outcome.md`, `tests/test_tracker_notes_csv_safe.py`) - dos escritores metían texto de formato libre
  en la columna `notes` de `job_search_tracker.csv`: el paso 7a de `/gmail-sync`
  copiaba el asunto en bruto de un correo recibido, y el paso 4 de `/outcome` añadía «una nota corta fechada»
  sin ninguna restricción sobre su contenido. Ningún escritor del framework emite un campo del rastreador
  entrecomillado, así que una coma sin escapar parte la fila tanto para un split ingenuo como para `csv.DictReader`, y
  este último es lo que usa el único lector mecánico del rastreador del repositorio
  (`tools/rank_state.py`). `notes` es la columna 10 de 14, así que un asunto tan corriente como
  `Re: Your application, Data Scientist`, o una nota tan natural como `rejected, no feedback given`,
  desplazaban `cv_file`, `cover_letter_file` y `source` una columna a la izquierda. Un salto de línea es peor:
  termina la fila y empieza una segunda. Nada validaba la fila después, y la mitad de
  `/gmail-sync` se escribió sin supervisión, así que la corrupción era silenciosa. Ahora ambas instrucciones de añadido
  llevan la regla ellas mismas —`/gmail-sync` elimina las comas, las comillas dobles y los
  saltos de línea del asunto, `/outcome` escribe su nota sin ellos— en lugar de una nota general que un escritor puede
  pasar por alto. Del lado de `/gmail-sync` no se pierde nada: el punto 2 del paso 7a sigue
  registrando el asunto literal en el `outcome.md` del archivo de candidaturas, que es Markdown y no lleva tal
  restricción. Los escritores de formato fijo (`followed up YYYY-MM-DD`,
  `stale resolved no_response (YYYY-MM-DD)`, `redrafted`) nunca podrían contener estos caracteres
  y no cambian.

- **`jobindex-search detail` ya no obtiene URL arbitrarias ni inventa una salida con forma de oferta** (#447) -
  el comando obtenía cualquier entrada `http(s)` literalmente (sin comprobar el host) y,
  cuando la ruta no coincidía con su único patrón, usaba silenciosamente toda la URL de entrada como id del empleo;
  la única red era «la página obtenida tiene un título», así que una página que no era una oferta volvía como
  una oferta falsa bien formada con código de salida 0 (demostrado con la propia página de inicio de jobindex:
  `id` = la URL, `title` = el eslogan del sitio, `description` = la interfaz de navegación). Todas las demás
  CLI de portales rechazan una entrada de detail no analizable con `BAD_ID` y construyen su URL de fetch a partir del
  id extraído; jobindex era la única CLI que confiaba en la cadena en bruto, y los agentes de
  `/scrape`/`/rank` le pasan URL almacenadas, así que una URL fantasma o redirigida (la clase de #331)
  producía basura plausible en lugar de un error. `buildUrl` ahora exige un host jobindex.dk (dominio raíz o
  subdominio; las tretas de host similar y userinfo se rechazan mediante un análisis real de la URL) más una ruta
  `/jobannonce/<id>`, reconstruye la URL de fetch a partir del id extraído (la forma corta canónica que
  siempre usó la ruta de id a secas) y sale con código 1 con el contrato `BAD_ID` en JSON por stderr en caso contrario;
  los ids a secas siguen siendo tokens permisivos sin esquema ni barra (el precedente de jobnet: el servidor devuelve
  404 ruidosamente ante los desconocidos). Fijado por ocho casos en el nuevo `detail-input.test.ts`; los cinco casos
  de rechazo/canonicalización fallan contra la extracción literal sin protección. Complementario a la regla
  de comprobación de host de `/apply` propuesta en #431, que sigue con su proponente.

- **`/outcome` e `/interview` ya no confunden dos puestos en la misma empresa** (#443)
  (`.claude/commands/outcome.md`, `.claude/commands/interview.md`,
  `tests/test_apply_records_application.py`) - cuando las columnas `cv_file` /
  `cover_letter_file` de una fila del rastreador están vacías, ambos comandos recurrían a un glob con prefijo de empresa
  (`cv/main_<company>*.tex`). Dos puestos en una misma empresa coinciden ambos, así que `/outcome` copiaba
  el primero que devolviera el sistema de archivos al archivo de candidaturas como `cv_draft.tex` —el archivo cuyo
  propósito es registrar lo que se envió realmente— y su propia regla de «dejar un archivo archivado
  existente» hacía entonces permanente la copia equivocada. Ambos métodos alternativos ahora hacen glob del
  tallo `<company>_<role>` completo, derivado por la regla de **Subfolder naming** de
  `documents/README.md` en lugar de reformulada, y se omiten con una nota en lugar de ampliar la búsqueda.
  Eliminar el `.tex` codificado también hace localizable una plantilla registrada por
  `/add-template`.

- **`jobnet-search detail` ya no informa de un anuncio alojado externamente como no encontrado** (#432) -
  `/FindJob/JobAdDetails/<id>` de Jobnet devuelve 404 para los anuncios con `isExternal: true`, así que `detail`
  sobre un anuncio que `search` acababa de listar salía con código 1 con `NOT_FOUND`, y `/scrape` leía la oferta como
  desaparecida en lugar de alojada en otro sitio (2 de 3 anuncios en una muestra reciente). Ante ese 404 el comando ahora
  recurre al endpoint de búsqueda, que sí lleva la descripción del anuncio y la URL de candidatura externa, y devuelve
  el registro marcado `isExternal: true` con una nota en stderr; los campos que la carga de
  búsqueda no lleva (`views`, `approvalStatus`, las flags booleanas) son `null`, nunca
  adivinados. Verificado en vivo en dos anuncios externos.

- **Los fragmentos de curl de `09-web-research.md` ya no escriben en el repositorio cuando `$SCRATCHPAD`
  no está definida** - ambos bloques ejecutables de la ruta de escalado ante 403 empiezan por `cd "$SCRATCHPAD"`,
  y nada en el repositorio define nunca esa variable (`git grep 'SCRATCHPAD='` no devuelve
  nada). Sin definir, se expande a `cd ""`, que tiene éxito y deja el shell donde
  estaba, así que la cadena `&&` continúa y `curl -o page.html` escribe en el directorio de trabajo
  (en la práctica el clon del repositorio), que es exactamente lo que prohíbe el párrafo justo debajo
  del bloque de curl («Write to the session scratchpad directory, never into the repo»).
  La instrucción del archivo y su propio fragmento no coincidían, y el fragmento ganaba en silencio.
  Ambas expansiones ahora están protegidas con `${SCRATCHPAD:?...}`, convirtiendo una escritura silenciosa en el repositorio en
  un fallo inmediato cuyo mensaje indica de dónde viene el valor. El comportamiento no cambia
  allí donde la variable está definida. La misma referencia sin definir en `.claude/commands/rank.md`
  la eliminó #425 como efecto secundario de reescribir el paso 2/4; esta es la instancia que quedaba.

- **Las claves de `seen_jobs.json` ahora son una función pura de la oferta** - el paso 4 de `/scrape` describía
  la clave en prosa (`"<url_or_company_title_key>"`) y nada decía cómo derivarla, así que cada
  ejecución la convertía en slug a su manera. Se produjeron dos fallos, ambos observados en un archivo de estado en vivo. Las claves
  llevaban caracteres que rompen la ruta en la que se convierten después: `/apply` y `/outcome` derivan una
  carpeta de archivo de candidaturas del mismo par empresa+puesto, que es por lo que `documents/README.md` tiene una
  regla de subcarpetas, y claves como `deloitte_junior-cybersecurity-analyst-(ot/iot)` y
  `neverhack-estonia_penetration-tester-/-red-teamer` la violan. Y la misma oferta se
  almacenaba dos veces cuando dos ejecuciones truncaban un título en puntos distintos
  (`deloitte_cyber-intelligence-center-security-analy` y
  `...-security-analyst-at` son un mismo empleo, una misma URL, dos entradas), lo que anula la deduplicación para la
  que existe el archivo. `tools/job_key.py` ahora es dueño de la derivación: el slug se normaliza, y el
  truncado está limitado en longitud *y* desambiguado por un hash del slug completo, de modo que un título largo
  produce siempre la misma clave y dos títulos largos que comparten prefijo no pueden colisionar. El paso 4
  llama al helper en lugar de describirlo. `--audit` informa de las entradas no conformes de un
  archivo de estado existente y deliberadamente nunca las reescribe: las claves almacenadas se comparan con
  `job_search_tracker.csv` por empresa+puesto en otros lugares, así que una reescritura silenciosa rompería el vínculo
  entre un empleo almacenado y su registro de candidatura.
  Los archivos de estado existentes no necesitan migración: el filtro de candidatos del paso 2 hace coincidir una oferta con una entrada
  almacenada por URL independientemente de la clave de esa entrada, así que un espacio de trabajo cuyas entradas sean anteriores al helper no
  ve sus ofertas aún vivas representadas como nuevas.

## [1.7.1] - 2026-09-06

### Added

- **Protección de estructura de CHANGELOG** (`tests/test_changelog_structure.py`) - cada PR edita este único
  archivo compartido a mano cerca de la misma línea, y nada comprobaba el resultado: un segundo encabezado `### Fixed`
  apareció directamente bajo `[Unreleased]`, por encima de `### Added`, en #425 y se corrigió a mano
  al fusionar. La sección `[Unreleased]` ahora se comprueba en cada PR en busca de encabezados duplicados,
  encabezados fuera del conjunto de Keep a Changelog, entradas por encima de cualquier encabezado y marcadores
  de conflicto sobrantes. Las secciones ya publicadas son historia y no se inspeccionan.

- **`/rank` ahora consume el `posted_date` que persiste #391** (#390, la segunda mitad diferida) - el paso 3
  gana una marca de obsolescencia: una oferta cuyo `posted_date` almacenado tiene más de 30 días
  en el momento de clasificar lleva un marcador ⚠ visible con su antigüedad explicitada
  junto a la puntuación («⚠ posted 2024-05-13, 27 months ago»), el mismo tratamiento FLAG que
  la ubicación y el idioma, en la clasificación, para que la persona usuaria lo juzgue, nunca una exclusión (la
  oferta de #390 tenía 27 meses *y seguía viva*; la antigüedad es una señal, no un veto, y una
  `deadline` futura almacenada tiene prioridad sobre ella). No cuesta ninguna petición: la antigüedad se vuelve a derivar en cada
  ejecución del valor almacenado y nunca se persiste. Las reglas de frontera se trasladan literalmente del
  esquema y de la regla 6: sin `posted_date` o `null` significa sin marca y sin conjetura (nunca
  inferida de `first_seen`), y los valores no analizables se tratan como ausentes y se notifican
  una vez con su portal. Fijado por cuatro casos nuevos en `test_rank_command.py`, cada uno
  verificado como fallo contra la especificación sin la regla.

### Security

- **`settings.json` ya no preaprueba `bun run` sobre archivos arbitrarios** (#396) - la
  lista de permisos de la plantilla concedía `Bash(bun run:*)`, que autoaprobaba
  `bun run <cualquier archivo del disco>` en todos los forks. Ahora es una entrada con ámbito de ruta por cada
  CLI de portal incluida, coincidiendo con lo que ya declara el SKILL.md de cada portal. `/scrape` no se ve afectado
  en ningún portal, incluidos los añadidos por `/add-portal`: los `allowed-tools` de la propia
  skill job-scraper llevan el comodín con ámbito de ruta que los cubre durante el flujo de trabajo.
  Ejecutar una CLI de portal de forma puntual fuera de una skill ahora pregunta una vez, que es el comportamiento previsto
  para todo lo que no está en la lista revisada. Gracias @vkotaru.

### Fixed

- **`/setup` ahora rellena los bloques de contacto dentro de `05-cv-templates.md` y
  `06-cover-letter-templates.md`, y `/reset` los restaura** - el paso 3 personalizaba
  `cv/main_example.tex` pero nunca los bloques de contacto de LaTeX incrustados en los dos archivos de plantilla
  desde los que `/apply` compila de verdad, así que una ejecución completa de Camino B o C dejaba `[YOUR_NAME]`, `[YOUR_EMAIL]`
  y `[YOUR_PHONE]` en ambos, y que llegaran a un documento o no dependía de que el redactor
  se diera cuenta (una persona usuaria real ejecutó `/setup` y luego editó ambos archivos a mano, #420).
  `06-cover-letter-templates.md` no era un objetivo del paso 3 en absoluto. El paso 3.5 ahora nombra los tokens
  de contacto de `05`, un nuevo paso 3.6 cubre la línea de contacto y la firma de `06` (el Camino A nunca lo rellena,
  así que se ejecuta en todos los caminos), el resumen de finalización enumera `06`, y `/reset` limpia ambos
  bloques en lugar de listar `06` como solo del framework. Fijado por `tests/test_setup_command.py`; la
  prueba de cobertura de `/reset` existente es lo que forzó la mitad de `reset.md`.

- **`/rank` ya no lee ni reescribe todo `seen_jobs.json` en cada ejecución** (#395) -
  el paso 1 antes leía todo el archivo de estado a la conversación para seleccionar candidatos a
  ojo, y el paso 4 lo volvía a emitir para registrar las puntuaciones: un coste que se pagaba en cada ejecución independientemente del
  tamaño del lote, y que crecía durante toda la vida del espacio de trabajo. `tools/rank_state.py` ahora es dueño de ese
  tráfico: `candidates` selecciona y proyecta solo los campos que necesita un agente de puntuación, `sweep`
  ejecuta la pasada de caducidad de la regla 6 en disco, y `apply` escribe los resultados de vuelta de forma atómica e imprime
  las filas a partir de las que se construye el informe del paso 5. Conserva exactamente las reglas de escritura existentes del paso 4:
  la migración heredada de `location` → `location_verdict`, la regla de que null no es una corrección de la fecha límite
  y la persistencia literal de fortalezas/lagunas. Sin cambios en la política de puntuación: ningún valor de estado nuevo,
  ningún campo persistido nuevo.

- **Los comandos detail de `jobbank-search`, `jobdanmark-search` y `jobnet-search` ahora aceptan URL completas** -
  el contrato del portal especifica `detail <id|url>`. Pasar una URL de oferta completa (con o sin
  barras finales, segmentos de slug o parámetros de consulta) antes hacía que `jobbank-search` y
  `jobdanmark-search` construyeran cadenas de URL dobles inválidas, y que `jobnet-search` interpolara la
  URL completa en la ruta del endpoint de la API. Los tres manejadores de detail ahora extraen y normalizan el
  ID o slug subyacente mediante funciones helper dedicadas, y salen con código 1 con el código `BAD_ID` ante entradas
  no analizables, igual que `linkedin-search` y `freehire-search`. Fijado por 24 pruebas unitarias en los
  `detail-url-normalization.test.ts` de las tres CLI.

- **`/rank` ahora limita cada lote de puntuación** (#395) - una ejecución a secas puntúa como máximo 10
  empleos elegibles en lugar de intentar todo el backlog. `--limit <N>` controla la puntuación independientemente de
  `--top`, y el informe hace visibles el trabajo diferido para que volver a ejecutar `/rank` pueda continuarlo.

- **La protección de flags desconocidas de las CLI de portales ya no deja pasar una flag con un solo guion** (#426) -
  la protección de las cuatro CLI basadas en bunli (`jobnet`, `jobbank`, `jobindex`, `jobdanmark`) inspeccionaba
  solo los tokens que empiezan por `--`, así que una flag *corta* no definida la evitaba por completo: bunli
  la descartaba, la búsqueda se ejecutaba sin filtro y la CLI salía con código 0 sin error. En vivo contra
  jobnet, `search -q "sygeplejerske"` devolvía los 18.179 anuncios como una búsqueda exitosa frente a 667
  para la consulta real `--search-string`, la misma forma que el hallazgo F13 de la revisión (jobdanmark, 13.862
  resultados) que motivó la protección en primer lugar, alcanzada por la ruta más probable: `-q` es la
  abreviatura documentada de la búsqueda por palabra clave en `linkedin-search`, `freehire-search` y
  `jobindex-search`, así que un hábito entre portales la produce. Ahora se comprueban ambas formas de guion, con las
  abreviaturas declaradas (`-q` de `jobindex`) y las integradas de bunli `-h`/`-v` aún válidas. También se rechaza un número negativo
  en lugar de omitirlo: bunli no consume un token precedido de `-` como valor de la flag anterior, así que `--radius -5` recurría silenciosamente
  al radio por defecto en lugar de fallar su propio esquema `min(1)`; fallar ante él es el intercambio que ya hace
  `linkedin-search`, y un valor que deba empezar por un guion usa la forma `--flag=value`. `linkedin-search` y
  `freehire-search` no se vieron afectados; normalizan `-x` a un nombre largo antes de comprobarlo. Fijado
  por trece casos nuevos en los `cli-flag-validation.test.ts` de las cuatro CLI, sin red porque
  la protección se ejecuta antes del despacho: ocho casos que fijan el bug (la flag corta y el número negativo,
  por CLI), cada uno verificado como fallo con la protección sin corregir, más cinco protecciones de regresión que pasan
  en ambos y existen para evitar que la corrección rechace de más: `-h` en cada CLI y el `-q` declarado de
  `jobindex`.

- **El autocompletado de `jobdanmark-search` ya no muere por una sola sugerencia sin texto**
  (#421, cerrando la auditoría #416/#418: todos los demás puntos de desreferencia de las seis CLI
  comprobados y confirmados protegidos) - el filtro desreferenciaba `item.text.toLowerCase()` de una
  respuesta de la API convertida en la misma línea que ya protege `g.items ?? []`, así que un elemento
  con `text` nulo o ausente lanzaba `TypeError` y todo el comando salía con código 1 como
  `API_ERROR`. El filtro ahora vive en un `filterAutocompleteGroups` exportado (el
  patrón de testabilidad de jobnet), `text` está tipado como nullable para que el compilador exija la
  protección, y se omite un elemento sin texto utilizable: nunca puede coincidir con la consulta no vacía requerida,
  así que la salida posterior nunca ve ninguno. Fijado por tres casos en el
  nuevo `autocomplete-filtering.test.ts`; el caso de texto nulo falla contra la extracción literal
  sin proteger con el `TypeError` de producción exacto.

- **`jobnet-search` ya no muere por un solo anuncio con fecha de publicación nula** (#418, hermano de #416
  de la misma auditoría) - `date: job.publicationDate.slice(0, 10)` confiaba
  en una afirmación de interfaz de TypeScript (`publicationDate: string`) que nada valida en
  tiempo de ejecución: `apiFetch` convierte el cuerpo JSON, así que un solo `null` lanzaba `TypeError` dentro del
  map de `jobAds` y toda la búsqueda de un portal activado por defecto salía con código 1 como `API_ERROR`, mientras
  que el campo vecino `applicationDeadline` ya estaba protegido contra nulos con una comprobación de centinela `1900-01-01`. El campo ahora está tipado como nullable (para que el compilador exija la protección) y
  se degrada por elemento a `date: null`, la forma que documenta el contrato de `seen_jobs.json`.
  Fijado por un caso nuevo en `search-normalization.test.ts`, verificado como fallo con el código sin
  corregir con el `TypeError` de producción exacto.

- **Las pruebas de integridad de marcadores de posición en `python-tests` ahora se omiten en los forks** (#405) - el trabajo dedicado
  `placeholder-integrity` ya está restringido al nombre del repositorio original, pero `python-tests` ejecutaba
  `unittest discover` sin tal protección, así que los forks que personalizaban archivos mediante `/setup` fallaban
  tres comprobaciones centinela de forma permanente. Ambas clases de prueba ahora usan `@unittest.skipIf` sobre
  `GITHUB_REPOSITORY` (asumiendo el proyecto original cuando no está definida para que las ejecuciones locales con plantilla inalterada sigan
  ejecutándose).
- **`convert_salary_excel.py` ya no confunde una fila de título/cita con la fila de encabezado**
  (#414) - la detección de la fila de encabezado aceptaba la primera fila de las 10 primeras en la que *cualquier* celda contuviera meramente
  una palabra con patrón de empresa, sin comprobar que la fila se pareciera realmente a un encabezado. Una
  línea de cita de la fuente por encima de la tabla de encabezado real —habitual en exportaciones reales de sindicatos/estadísticas danesas, por ejemplo «Kilde: ... opdelt efter arbejdsgiver ...»— la activaba solo porque
  «arbejdsgiver» (empleador) aparecía en la prosa. La fila de encabezado real se analizaba entonces como fila de datos
  (su celda «Firma» se convertía en una entrada de empresa falsa), y cada empresa real perdía todos sus datos salariales, en silencio: salida 0, «Done! Wrote N company entries», con `categories: {}` en todas ellas. Ahora una
  fila candidata se acepta solo cuando *otra* celda de la misma fila también coincide con un
  patrón de ciudad/recuento/índice; la corroboración en la misma celda no cuenta, ya que una frase de cita puede
  meter una palabra con patrón de recuento en la misma frase que una con patrón de empresa (por ejemplo «...opdelt
  efter arbejdsgiver, antal svar 1234»). Las hojas cuyo único encabezado real tiene columnas salariales puramente sin tipo
  (por ejemplo «Base pay 2025» / «Bonus 2025», ninguna de las cuales coincide con un patrón conocido de ciudad/recuento/índice)
  no tienen nada con lo que corroborar en ninguna fila, así que la detección recae en la regla original
  de cualquier celda que mencione una empresa cuando la pasada estricta no encuentra nada en las 10 primeras filas. Como red de seguridad independiente de cualquiera de las pasadas, una hoja que acabe con cero columnas salariales
  detectadas ahora imprime un aviso en lugar de informar de éxito en silencio. Fijado por cuatro casos en
  `tests/test_convert_salary_excel.py`: los casos originales de fila de cita y de cero columnas fallan
  contra el script anterior a la corrección; los casos de corroboración en la misma celda y de método alternativo para columnas sin tipo fallan cada uno
  contra la versión de una sola pasada de esta corrección que precedió a la adición del método alternativo.

- **`jobbank-search` ya no muere por una sola fecha de feed mal formada** (#416) - `new Date()`
  sobre un `pubDate` presente pero no analizable produce un Invalid Date cuyo `toISOString()`
  lanza `RangeError`, y `normalizeSearchItem` se ejecuta dentro de un `items.map()` sin protección,
  así que un solo elemento RSS defectuoso mataba toda la búsqueda con `{"error": "Invalid Date",
  "code": "API_ERROR"}` y salida 1: un portal entero activado por defecto perdido por un elemento, con
  el error apuntando a la API. La captura de método alternativo sin CDATA en `parseRssItems` puede
  entregar exactamente ese valor. Un `pubDate` no analizable ahora se degrada a la misma forma
  que uno ausente (`posted` vacío, `date: null`, según el contrato de `seen_jobs.json` en el que
  #391 puso este campo), y todos los demás elementos sobreviven. Fijado por tres casos nuevos en
  `search-normalization.test.ts`, cada uno verificado como fallo con el código sin corregir.

- **`linkedin-search` rechaza las flags numéricas fraccionarias en lugar de cambiar silenciosamente
  la consulta** (#371) - `parseInt` a secas truncaba los valores antes de la validación, así que
  `--jobage 0.5` se convertía en `0` y omitía silenciosamente el filtro de frescura `f_TPR` de LinkedIn
  mientras la CLI no informaba de ningún error de argumento. `--jobage`, `--jobage-minutes`, `--page`
  y `--limit` ahora aceptan solo números enteros >= 1 y rechazan las fracciones y el cero con
  el contrato `BAD_ARG` en JSON por stderr, igual que las demás CLI de portales. Fijado por ocho
  casos verificados como fallo con la CLI sin corregir. Reportado por @Meet6338-X.

- **`linkedin-search detail` acepta URL de empleo de LinkedIn con barras finales** (#411) -
  pasar una URL de empleo con barra final (por ejemplo, `https://www.linkedin.com/jobs/view/<id>/`
  o una variante con slug, con o sin cadenas de consulta) fallaba la validación y salía con código 1 con
  `BAD_ID` antes de cualquier petición de red porque el delimitador de la regex esperaba estrictamente `?`
  o el fin de cadena inmediatamente después del ID numérico. La comprobación de frontera ahora coincide con
  `[\/?]`, extrayendo correctamente los ID de las URL copiadas del navegador, los subdominios regionales y
  los enlaces con parámetros de seguimiento. Fijado por once casos nuevos en `parsing.test.ts`.

- **La regla de ignorado `documents/interview/**` ya no afirma que la preparación de entrevistas se escriba ahí**
  (#336). `/interview` guarda su paquete en
  `documents/applications/<company>_<role>/interview_prep_<stage>.md`, ya ignorado por
  `documents/applications/**`; nada ha escrito nunca en `documents/interview/`. Nada se filtró,
  pero era la única línea dedicada del bloque de datos personales sobre material de entrevistas, así que un auditor
  que revisara el artefacto más sensible del framework tenía todas las razones para leerla y detenerse, en la
  única ruta del bloque sin escritor. El razonamiento de protección ahora está por encima de
  `documents/applications/**`, la regla que realmente la proporciona, para que quien la lea después la encuentre
  donde vive; `documents/interview/**` se mantiene, reetiquetada como cinturón y tirantes en lugar de protección primaria
  (`REQUIRED_IGNORE_RULES` la fija, así que eliminarla solo de `.gitignore` hace fallar la protección).
  Fijado por `tests/test_security_guards.py`, que deriva la ruta del paquete de preparación de
  la propia especificación de `/interview` en lugar de codificarla, de modo que mover esa ruta hace fallar la CI en vez de
  dejar obsoleto el comentario en silencio.

- **`/scrape` ahora persiste la fecha de publicación de cada oferta** (#390) - el contrato del paso 2 garantiza un
  `date` en la salida de búsqueda de cada CLI de portal (la CI lo exige en `test_scrape_contract.py`) y
  el paso 1b usa esa fecha para limitar una ejecución a los últimos 14 días, pero el esquema de `seen_jobs.json` del paso 4
  no almacenaba ninguna fecha de publicación: `first_seen` es cuándo vio el scraper una entrada, no cuándo
  la publicó la empresa. La ventana de frescura era por tanto no auditable en el momento en que terminaba una ejecución, y
  `/rank` —que lee la entrada almacenada, no la ejecución— no tenía señal de antigüedad que ponderar. Una
  oferta de `freehire-search` fechada el 2024-05-13 se extrajo 27 meses después y se clasificó como Strong Fit en
  la posición 1 de 133; la nota de puntuación registraba que la oferta «may be long stale» en una prosa
  que nadie lee, y una ejecución de `/apply` redactó un CV adaptado y una carta de presentación para ella. El esquema
  gana `posted_date` (`null` cuando el portal no devolvió ninguna fecha, nunca inferida ni rellenada hacia atrás).
  Fijado por tres casos nuevos en `test_scrape_contract.py`, cada uno verificado como fallo con la
  especificación sin corregir. Reportado y diagnosticado a partir de una ejecución real por @sandunwijerathne.

- **`salary_lookup.py` ya no se bloquea con un `metadata` o `categories` `null`** - `--validate`
  trata un `"metadata": null` / `"categories": null` explícito igual que una clave omitida (las
  comprobaciones de forma son «...must be an object *when provided*» y omiten `None`), pero el renderizador leía
  ambos mediante `dict.get(key, {})`, que solo sustituye el valor por defecto de una clave *ausente*: un
  valor presente pero nulo pasaba directamente. `format_entry` entonces llegaba a `None.get("index_label",
  ...)` (`AttributeError`) o, a través del método alternativo de campos numéricos, a `None[key] = value` (`TypeError`),
  así que un `salary_data.json` mantenido a mano que usara `null` para «sin valor aquí» moría con un traceback
  no capturado justo después de imprimir `Found 1 match(es)`. `format_entry` ahora fuerza ambos a `{}` de
  antemano, así que `null`, ausente y `{}` se comportan igual. Fijado por cuatro casos en
  `test_salary_lookup.py`: dos llamadas unitarias a `format_entry` y dos de extremo a extremo (`main()
  --validate` bendice el archivo, y luego la ruta de consulta lo renderiza), una por forma nula, todas verificadas
  como fallo con el renderizador sin corregir.

[Unreleased]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.7.2...HEAD
[1.7.2]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.7.1...v1.7.2
[1.7.1]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/MadsLorentzen/ai-job-search/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MadsLorentzen/ai-job-search/releases/tag/v1.0.0
