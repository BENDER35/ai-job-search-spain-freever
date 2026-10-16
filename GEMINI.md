<!-- Thin pointer (Gemini CLI): this file exists only so the runtime discovers the
     repo's canonical specs. Do not copy any spec into it. See COMPATIBILITY.md. -->
# AI Job Search - instructions for Gemini CLI

This workspace is the Spanish adaptation of the **AI Job Search** framework. Its
canonical specifications live in the files below and must not be duplicated in
this file - point at them, so upstream improvements keep reaching the fork.

Read these, in this order:

1. [`AGENTS.md`](AGENTS.md) - the cross-runtime entry point and the thin-pointer design.
2. [`CLAUDE.md`](CLAUDE.md) - the candidate profile and the workflow rules.
3. [`.claude/`](.claude/) - the canonical workflow specs: `commands/` (setup, scrape,
   rank, apply, outcome, interview, upskill, ...) and `skills/`.
4. [`.agents/skills/`](.agents/skills/) - the job-portal search CLIs (portable Agent
   Skills, one `SKILL.md` per portal).

Gemini CLI reads this file automatically. Ask the agent to run a workflow by
naming its spec ("follow `.claude/commands/scrape.md`"), or to load a skill from
`.claude/skills/<name>/SKILL.md`. Slash commands (`/scrape`) are Claude Code
artifacts; here you name the file instead.

Do not restate any spec from `.claude/` here. Platform and runtime notes, plus
the Antigravity path: [`COMPATIBILITY.md`](COMPATIBILITY.md).
