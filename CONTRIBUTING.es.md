**Idioma:** [English](CONTRIBUTING.md) · Español

# Contribuir

¡Gracias por plantearte contribuir! Este repositorio tiene una filosofía deliberada y acotada, y la mayoría de los PR rechazados son trabajo bien hecho que sencillamente no la conocía. Lee esto primero; te ahorrará esfuerzo y te dirá dónde encajará mejor tu trabajo.

> **Nota para este fork.** Este repositorio (`BENDER35/ai-job-search-spain-freever`) es un
> **fork de mercado** de [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search):
> existe para adaptar el framework al mercado laboral español y para hacerlo funcionar en cualquier
> agente de IA de línea de comandos. Las reglas de abajo describen la política de revisión del
> **proyecto original** (donde las skills específicas de cada país y los ports a otros runtimes pertenecen a los
> forks, no al proyecto original), que es exactamente por lo que este fork puede albergarlos. Al contribuir aquí:
>
> - **Las skills de portales españoles, la documentación en español y las guías de compatibilidad/runtime
>   pertenecen a este repositorio.** Añade un nuevo portal de empleo español con `/add-portal` (consulta
>   [COMPATIBILIDAD.md](COMPATIBILIDAD.md) y las actuales `.agents/skills/tecnoempleo-search` y
>   `.agents/skills/infojobs-search` como referencias).
> - **El español es el segundo idioma de la documentación.** Todos los documentos de nivel superior tienen un
>   espejo `.es.md` (`README.es.md`, `SETUP.es.md`, `SECURITY.es.md`, `CONTRIBUTING.es.md`,
>   `CHANGELOG.es.md`, `AGENTS.es.md`, `COMPATIBILIDAD.md`, `GUIA_TECNICA.md`). Si cambias un
>   documento en inglés, actualiza su espejo en el mismo cambio.
> - **Mantén las invariantes del proyecto original**: CLI de portales sin dependencias, el contrato
>   search/detail, la frontera de gitignore de los datos personales, y
>   `python3 tools/lint_skills.py`, `python3 tools/security_guards.py`,
>   `python3 tools/check_framework_version.py` y `python3 -m unittest discover -s tests` en verde.
> - **Devolver correcciones al proyecto original** es bienvenido y apreciado: abre el PR contra
>   `MadsLorentzen/ai-job-search`, no contra este fork.
>
> La versión en inglés de este archivo es [CONTRIBUTING.md](CONTRIBUTING.md).

## La única regla de la que se deriva todo lo demás

**Este repositorio es una plantilla universal.** La gente hace un fork y la adapta a su propio mercado, idioma y perfil. El proyecto original sigue siendo agnóstico respecto al mercado, a la persona y nativo de Claude Code. El corolario: una contribución se juzga primero por su encaje con esta regla y después por la calidad de su ejecución. Algo bien construido pero fuera de la política se rechaza igualmente (con amabilidad y con motivos).

## Qué se fusiona

- **Funciones de personalización universales**: cualquier cosa que mejore el camino de fork-and-adapt para todo el mundo. Precedente: `/add-template` ([#30]), `/add-portal` ([#37]).
- **Correcciones de robustez y corrección** con el caso que falla demostrado. Precedente: validación de la flag NaN ([#35]), decodificación de entidades HTML ([#55], [#56]), detección de la columna de salario ([#64]).
- **Documentación que cierra lagunas reales**: configuración específica de plataforma ([#41], [#60]), referencias obsoletas ([#36], [#68]).
- **Infraestructura que reduce la carga de revisión** y se argumenta con pruebas, no con especulaciones. Precedente: la CI ([#59]), que detectó un bug latente mientras se construía.

## Qué se rechaza

- **Skills y contenido específicos de un mercado o país.** El portal de un país abre la puerta al portal de todos los países; no hay un punto de parada con criterio. Precedente: [#31] (India), [#39] (Francia, a pesar de un PR honesto y excelente), [#67] (China). Las skills de portales incluidas en el árbol son o bien independientes del país (`linkedin-search`) o bien la instancia de demostración del propio mantenedor (los portales daneses).
- **Datos personales del perfil.** La plantilla incluye marcadores de posición; tu perfil rellenado vive en tu fork. La CI lo exige (`placeholder-integrity`). Precedente: [#17], [#72].
- **Ports a otros runtimes y fuentes de flujos de trabajo duplicadas.** Las especificaciones en Markdown SON la implementación; una segunda copia (otra CLI de agente, una capa de orquestación, un comando envoltorio) se desvía de la primera en cuanto cambia cualquiera de las dos. Precedente: [#44], [#49], [#66].
- **Infraestructura especulativa.** La complejidad debe argumentarse a partir de un problema que existe, no de uno que podría existir. Precedente: [#63].
- **PR «de todo un poco».** Un tema por PR. Los paquetes que mezclan varios se pide que se dividan ([#73]), y las divisiones se revisan rápido ([#75], [#76] llegaron en menos de una hora y se gestionaron el mismo día).

## El listón para los comandos nuevos

El ciclo de vida principal está **completo en cuanto a funciones**: `/setup` → `/scrape` → `/rank` → `/apply` → `/interview` → `/outcome` → calibración de vuelta a `/setup`, con `/expand`, `/upskill`, `/add-template`, `/add-portal` y `/reset` alrededor. Cada fase de una búsqueda de empleo real tiene un responsable.

Un comando nuevo, por tanto, se enfrenta a un listón alto. La prueba que admitió a los existentes: **¿operacionaliza algo propenso a errores que ya existe en el framework** (maquinaria documentada que nada ejecuta, datos que algo escribe pero nada lee)? «Útil» y «posible» no bastan; las propuestas más sólidas conectan dos cosas que ya existen sin modificar ninguna de las dos ([#43], [#54]).

## Las afirmaciones se verifican

Aquí las revisiones son empíricas. Los informes de bugs se reproducen en master antes de que se considere la corrección; «todas las pruebas en verde» se comprueba contra si las pruebas pueden distinguir master de la corrección. Los PR cuyo punto de partida no se reproduce se rechazan aunque el código esté bien: ha ocurrido (la corrección del conversor de [#35], la primera versión de [#52]). Puedes hacer que esto sea rápido:

- Indica el caso que falla y cómo reproducirlo.
- **Reproduce en la ruta real, no con una entrada construida.** Una prueba que falla en master y pasa con la corrección es necesaria pero no suficiente: la entrada que falla tiene que ser una que el flujo de trabajo produzca de verdad, no una que la prueba fabrique a mano. Muestra el fallo a través de la ruta que el código ejecuta realmente (la invocación documentada de la CLI, la salida real de un portal, un archivo de datos real), no un valor sintético pasado directamente a la función. Una corrección cuya única demostración es una entrada que la ruta real del código nunca recibe se rechaza aunque su prueba esté en verde.
- Pon las pruebas de CLI en `.agents/skills/<name>/cli/tests/` (bun test, sin red cuando sea posible); las pruebas de herramientas Python en `tests/`.
- Ejecuta lo que ejecuta la CI: `python3 tools/lint_skills.py`, `python3 tools/check_framework_version.py`, `python3 tools/security_guards.py`, `python3 -m unittest discover -s tests` y, en las CLI que toques, `bun run typecheck` + `bun test`.

**Norma de crédito:** un cambio que incorpora tu código real recibe un trailer `Co-authored-by`; un cambio escrito de forma independiente a partir de tu observación o informe recibe una mención con tu nombre en el mensaje del commit y en el PR. Ambas cosas ocurren sin que haga falta pedirlas.

**PR invitados:** cuando un comentario de un mantenedor invita explícitamente a un colaborador concreto a abrir el PR de un issue que ha diagnosticado o diseñado, esa invitación le reserva la implementación: por defecto durante siete días desde la invitación, y más si dice que está trabajando en ello. Un PR duplicado abierto dentro de esa ventana se cerrará en favor del del invitado, independientemente del orden de llegada o del grado de pulido. Revisa, prueba y comenta todo lo que quieras un PR invitado: eso multiplica el trabajo; competir con él no. (Prospectivo desde el 2026-08-14.)

## ¿Vas a construir para tu propio mercado? Haz esto en su lugar

1. Haz un fork del repositorio y ejecuta `/add-portal` con tu portal de empleo local: crea el andamiaje de una skill de portal que cumple el contrato de las incluidas, y `/scrape` la detecta automáticamente.
2. Anuncia tu fork en la discusión fijada [Community forks & adaptations](https://github.com/MadsLorentzen/ai-job-search/discussions/78) para que otros puedan encontrarlo.
3. Ejecuta el comprobador de actualizaciones del framework (`python3 tools/check_upstream_updates.py`) en tu fork para ver si el proyecto original ha actualizado algún archivo del framework y compararlos con tus variantes personalizadas.

Las skills específicas de un mercado son genuinamente valiosas: simplemente viven en los forks, donde quienes las mantienen pueden probarlas y quienes las usan pueden encontrarlas.

Una advertencia práctica: cuando abres un PR desde un fork, GitHub apunta por defecto a este repositorio original, no al tuyo: tres PR de forks personalizados acabaron aquí por accidente en una sola semana ([#155], [#162], [#165]). Comprueba el desplegable «base repository» antes de publicar.

## ¿Vas a portar a otro runtime de IA? También a un fork

Claude Code es el runtime de referencia: es el que usa a diario el mantenedor y sobre el que se verifica cada cambio de metodología. Un árbol de comandos paralelo para otro runtime (Codex, Antigravity, la CLI de Gemini, ...) se distribuiría sin probar en cada cambio —la CI no puede ejecutar esos entornos— y cada runtime aceptado hace más difícil rechazar el siguiente. Es la misma aritmética que mantiene los portales específicos de cada mercado en los forks.

Lo que el proyecto original mantiene para otros runtimes, en cambio:

- Las skills de búsqueda en portales de `.agents/skills/` usan el formato portátil Agent Skills (`SKILL.md` por portal) y Codex y Antigravity las detectan automáticamente hoy.
- El `AGENTS.md` de la raíz señala a cualquier agente las especificaciones canónicas de los flujos de trabajo y el punto de entrada del perfil.
- Los archivos de instrucciones del framework llevan marcadores `framework_version`, de modo que un fork de runtime puede seguir los cambios de metodología con precisión (`python3 tools/check_upstream_updates.py`).

Anuncia tu fork de runtime en la discusión fijada [Community forks & adaptations](https://github.com/MadsLorentzen/ai-job-search/discussions/78) y aparecerá junto a las adaptaciones de mercado. La forma probada es un puntero fino: referencia las especificaciones de aquí en lugar de copiarlas, para que las mejoras del proyecto original lleguen a tu fork al hacer rebase.

Esto es una decisión, no un dogma: si los estándares entre runtimes maduran hasta el punto de que estas especificaciones se ejecuten sin modificar en otros entornos, o si el centro de gravedad de la comunidad se traslada a los forks de runtime, la disyuntiva se reevaluará. Contexto: el hilo de arquitectura en [Community forks & adaptations](https://github.com/MadsLorentzen/ai-job-search/discussions/78).

## Notas prácticas

- **Contrato de las skills de portales**: comandos `search`/`detail`, `--format json|table|plain`, errores JSON en stderr con salida 1, backoff en 429/5xx, cero dependencias en tiempo de ejecución por defecto. Consulta la especificación de `/add-portal` y `linkedin-search` como implementación de referencia.
- **Fronteras de uso personal**: las skills de portales que tocan fuentes restringidas por las condiciones de servicio llevan un aviso destacado de solo uso personal, y la CI deliberadamente no hace peticiones en vivo a los portales. No «arregles» eso.
- **Cambios en LaTeX**: ambas plantillas deben compilar (`lualatex` para el CV, `xelatex` para la carta de presentación) y mantener sus recuentos de páginas exactos. La CI lo comprueba de forma superficial.

Las preguntas y propuestas son bienvenidas en [Discussions](https://github.com/MadsLorentzen/ai-job-search/discussions): un hilo de idea no cuesta nada y puede ahorrarte construir lo que no toca :-)

[#17]: https://github.com/MadsLorentzen/ai-job-search/issues/17
[#30]: https://github.com/MadsLorentzen/ai-job-search/issues/30
[#31]: https://github.com/MadsLorentzen/ai-job-search/issues/31
[#35]: https://github.com/MadsLorentzen/ai-job-search/issues/35
[#36]: https://github.com/MadsLorentzen/ai-job-search/issues/36
[#37]: https://github.com/MadsLorentzen/ai-job-search/issues/37
[#39]: https://github.com/MadsLorentzen/ai-job-search/issues/39
[#41]: https://github.com/MadsLorentzen/ai-job-search/issues/41
[#43]: https://github.com/MadsLorentzen/ai-job-search/issues/43
[#44]: https://github.com/MadsLorentzen/ai-job-search/issues/44
[#49]: https://github.com/MadsLorentzen/ai-job-search/issues/49
[#52]: https://github.com/MadsLorentzen/ai-job-search/issues/52
[#54]: https://github.com/MadsLorentzen/ai-job-search/issues/54
[#55]: https://github.com/MadsLorentzen/ai-job-search/issues/55
[#56]: https://github.com/MadsLorentzen/ai-job-search/issues/56
[#59]: https://github.com/MadsLorentzen/ai-job-search/issues/59
[#60]: https://github.com/MadsLorentzen/ai-job-search/issues/60
[#63]: https://github.com/MadsLorentzen/ai-job-search/issues/63
[#64]: https://github.com/MadsLorentzen/ai-job-search/issues/64
[#66]: https://github.com/MadsLorentzen/ai-job-search/issues/66
[#67]: https://github.com/MadsLorentzen/ai-job-search/issues/67
[#68]: https://github.com/MadsLorentzen/ai-job-search/issues/68
[#72]: https://github.com/MadsLorentzen/ai-job-search/issues/72
[#73]: https://github.com/MadsLorentzen/ai-job-search/issues/73
[#75]: https://github.com/MadsLorentzen/ai-job-search/issues/75
[#76]: https://github.com/MadsLorentzen/ai-job-search/issues/76
[#155]: https://github.com/MadsLorentzen/ai-job-search/pull/155
[#162]: https://github.com/MadsLorentzen/ai-job-search/pull/162
[#165]: https://github.com/MadsLorentzen/ai-job-search/pull/165
