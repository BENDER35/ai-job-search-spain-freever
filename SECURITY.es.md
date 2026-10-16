**Idioma:** [English](SECURITY.md) · Español

# Política de seguridad

## Cómo informar de una vulnerabilidad

Informa de los hallazgos de seguridad en privado a través del **[informe privado de vulnerabilidades de GitHub](https://github.com/MadsLorentzen/ai-job-search/security/advisories/new)** en lugar de abrir un issue público. Recibirás una respuesta en unos días, crédito en la corrección salvo que prefieras lo contrario, y una divulgación pública coordinada con el parche.

Si el formulario privado no está disponible, abre un issue público que describa la *clase* de problema sin una receta reproducible, e indica que tienes detalles que compartir en privado.

## Modelo de amenazas, dicho con honestidad

Este es un flujo de trabajo agéntico: un LLM con acceso a archivos lee contenido web no confiable (ofertas de empleo) junto con tus datos personales (CV, perfil, historial de candidaturas). Esa combinación es la principal superficie de riesgo, y no se puede eliminar del todo, solo reducir. Lo que hace el framework al respecto:

- **Reglas de entrada no confiable**: `/apply` y `/rank` tratan el texto de la oferta como datos, nunca como instrucciones: se indica a los agentes que no sigan las indicaciones incrustadas en las ofertas y que no accedan a las URL que aparezcan dentro del texto de la oferta (la URL de la oferta facilitada por la persona usuaria es la única excepción). La investigación del revisor parte de la identidad de la empresa que la persona usuaria ha confirmado, nunca de enlaces del cuerpo de la oferta.
- **Lista de permisos**: `.claude/settings.json` aprueba previamente solo los comandos concretos que el flujo de trabajo necesita; el trabajo de CI `security-guards` falla cualquier PR que la amplíe, que añada scripts de ciclo de vida a los manifiestos de paquetes o que debilite las reglas de gitignore de datos personales. Ten en cuenta que la lista de permisos gobierna los comandos Bash: las herramientas nativas WebFetch/WebSearch del modelo quedan fuera de su alcance, que es exactamente por lo que existen las reglas a nivel de instrucciones anteriores.
- **Fronteras de los datos personales**: tu perfil rellenado, el rastreador, los datos salariales y el archivo de candidaturas están en el gitignore; los documentos nunca salen de la máquina por diseño (`/notion-sync` sincroniza solo los nombres de archivo; nada sube el contenido de los documentos a ningún sitio).

Las defensas a nivel de instrucciones elevan el listón; no son un entorno aislado. Si ejecutas este flujo de trabajo contra portales de empleo en los que no confías en absoluto, revisa lo que el agente ha obtenido y escrito antes de enviar nada.

## Notas sobre el alcance

- Las skills CLI de portales hacen peticiones en vivo solo cuando las ejecutas tú; la CI nunca lo hace.
- Las skills de forks de la comunidad que se enumeran en el [índice de forks](https://github.com/MadsLorentzen/ai-job-search/discussions/78) **no** están cubiertas por esta política: revisa el código que copies, como dice el propio índice.
