# Compatibility - AI Job Search (Spain)

**Español:** [COMPATIBILIDAD.md](COMPATIBILIDAD.md)

## Why this document exists

This repository is the **Spain adaptation** of the [AI Job Search](README.md)
framework (upstream: `MadsLorentzen/ai-job-search`). Two things differ from
upstream, and this page documents both:

1. **It targets the Spanish job market.** The fork ships Spanish job-board portal
   skills alongside the country-agnostic ones, so `/scrape` searches Spanish
   boards out of the box.
2. **It is not tied to one AI agent.** Upstream is Claude Code-native. This fork
   is built for *any* command-line or IDE AI agent - **free tiers first** - on
   Windows, macOS and Linux, on 64-bit x86_64 and ARM64 machines (with honest
   caveats for 32-bit hosts).

Nothing here is a support promise beyond what is listed. Where a tool's status is
uncertain or was not verified on a real machine, it says so.

## AI agent / runtime compatibility

"Auto-discovers our instructions" means the tool reads `AGENTS.md` or one of the
thin pointer files in this repo without you pasting anything into the chat.
"Freemium" means the tool itself is free or open-source but the *model* may cost
money (bring-your-own key), or a free hosted tier exists with limits.

| Tool | Free tier? | Windows | macOS | Linux | Auto-discovers our instructions? | How it's driven |
|------|-----------|---------|-------|-------|----------------------------------|-----------------|
| **Google Antigravity** | Free (Individual tier); Pro / Ultra paid | ✓ | ✓ | ✓ | Yes - `AGENTS.md` and `GEMINI.md`, plus `.agents/skills/` | Open the repo in the agent-first IDE; the agent reads the pointer, then ask it to follow `.claude/commands/<name>.md` |
| **Claude Code** | Paid - no free tier (Pro / Max / Team subscription or API credits) | ✓ | ✓ | ✓ | Yes, natively - `CLAUDE.md`, `.claude/commands/`, `.claude/skills/` | `claude`, then `/setup`, `/scrape`, `/apply`, ... |
| **OpenAI Codex CLI** | Freemium - CLI is free/open-source; the model needs ChatGPT Plus/Pro or API credits | ✓ | ✓ | ✓ | Yes - `AGENTS.md` | `codex`; ask it to follow `.claude/commands/<name>.md` |
| **Gemini CLI** | Was free (60 req/min, 1,000/day) - **retired 18 Jun 2026** in favour of Antigravity CLI | ✓ | ✓ | ✓ | Yes - `GEMINI.md` | `gemini` (legacy installs only); otherwise use Antigravity |
| **Qwen Code CLI** | Freemium - open-source CLI; the OAuth free tier ended 15 Apr 2026 (free paths remain: local models, DashScope quota) | ✓ | ✓ | ✓ | Yes - `QWEN.md` | `qwen`; ask it to read `AGENTS.md` and the command files |
| **opencode** | Free/open-source - bring your own model (free models available) | ✓ | ✓ | ✓ | Yes - `AGENTS.md` | `opencode` |
| **Aider** | Free/open-source - bring your own model (paid APIs or a free local model) | ✓ | ✓ | ✓ | Partly - it loads `CONVENTIONS.md` when you ask it to | `aider --read CONVENTIONS.md`, then name a command file |
| **Cline** (VS Code) | Freemium - extension is free/open-source; bring your own key | ✓ | ✓ | ✓ | Yes - `.clinerules` | Install the extension; rules load automatically |
| **Roo Code** | Freemium - **discontinued 15 May 2026**; migrate to Kilo Code or Cline | - | - | - | Read `.clinerules` / Roo rules while it existed | Historical |
| **Continue** | Freemium/open-source - **reported discontinued in mid-2026 after a Cursor acquisition; verify before adopting** | ✓ | ✓ | ✓ | Yes - `.continue/rules/`, and `AGENTS.md` | Put a rule under `.continue/rules/` |
| **Goose** (Block) | Free/open-source - bring your own model | ✓ | ✓ | ✓ | Yes - `.goosehints` (also honours `AGENTS.md`) | `goose` |
| **Charm Crush** | Free/open-source (FSL) - bring your own model | ✓ | ✓ | ✓ | Yes - `AGENTS.md`, and `.agents/skills/*/SKILL.md` | `crush` |
| **Kilo Code** | Freemium - open-source VS Code extension; bring your own key (free starter credits) | ✓ | ✓ | ✓ | Its own rules under `.kilocode/rules/`; it does **not** read `.clinerules` | Add a rule under `.kilocode/rules/` |
| **Zed** (agent panel) | Free editor - bring your own model (Zed Pro optional) | ✓ | ✓ | ✓ | Yes - `AGENTS.md` and `.rules` | Open the project, use the agent panel |
| **GitHub Copilot** (agent mode / coding agent) | Freemium - Free tier ~2,000 completions + ~50 chat/agent requests/month; Pro ~$10/mo | ✓ | ✓ | ✓ | Yes - `.github/copilot-instructions.md` (also loads `AGENTS.md`) | VS Code agent mode, or `github.com/copilot/agents` |
| **Cursor** | Freemium - Hobby tier free; Pro ~$20/mo | ✓ | ✓ | ✓ | Yes - `.cursor/rules/*.mdc` and `AGENTS.md` (`.cursorrules` is deprecated) | Open the folder |
| **Windsurf** | Freemium - free tier; Pro ~$15/mo | ✓ | ✓ | ✓ | Yes - `.windsurfrules` (legacy), `.windsurf/rules/`, and `AGENTS.md` | Open the folder |

If you do not need Claude Code specifically, **Google Antigravity is the
recommended no-cost starting point** for a full agentic IDE, and **opencode,
Goose or Crush** are the low-cost terminal options; see below.

## Model providers (Ollama, OpenRouter, Qwen, and friends)

The runtimes above are the *agents*. The *model* they call is a separate
choice, and several of them are free or run entirely on your machine:

| Provider | Type | Free? | Notes |
|----------|------|-------|-------|
| **Ollama** (local) | Local server, OpenAI-compatible API at `http://localhost:11434` | Yes - no account, no key | Runs open-weight models (Llama, Qwen, Mistral, Gemma, Phi, DeepSeek) on your own hardware. Best for offline / zero-cost setups. Model/RAM table in `busqueda_ia_bajosrecursoseconomicos.md`. |
| **OpenRouter** | Cloud aggregator, OpenAI-compatible API | Freemium - free models available (e.g. `meta-llama/llama-3.3-70b-instruct:free`, `qwen/qwen3-8b:free`) | One key, hundreds of models. Good for trying several models without separate accounts. |
| **Qwen (DashScope)** | Cloud API | Freemium - free quota on registration | Alibaba's hosted Qwen models. |
| **Google AI Studio (Gemini)** | Cloud API | Free tier (rate-limited) | Gemini models; the Gemini CLI uses this. |
| **Groq / Cerebras** | Cloud API | Free tier | Fast inference for open-weight models. |
| **GitHub Models** | Cloud API | Free with GitHub account | Good for CI/experimentation. |

### Pointing each runtime at a free provider

- **Aider** — `aider --model ollama/qwen2.5:7b` (Ollama) or `aider --model openrouter/meta-llama/llama-3.3-70b-instruct:free`. Set `OLLAMA_API_BASE` or `OPENROUTER_API_KEY` in the environment. See `aider --list-models`.
- **Goose** — set the provider in `~/.config/goose/config.yaml` (`provider: ollama`, `model: qwen2.5:7b`) or use the OpenRouter provider with `OPENROUTER_API_KEY`.
- **Qwen Code CLI** — point at a local Ollama model with `--model ollama:qwen2.5:7b`, or at DashScope with a key. The OAuth free tier ended 15 Apr 2026.
- **opencode** — pick the model in its TUI; Ollama and OpenRouter are supported providers out of the box.
- **Cline / Kilo Code / Continue** — set the provider to "Ollama" or "OpenRouter" in the extension settings and supply the base URL / key.
- **Claude Code** — requires a Claude subscription or API credits (no free tier). Use one of the above runtimes for a zero-cost setup.

The framework itself is model-agnostic: the canonical specs in `.claude/` are plain Markdown, and the portal CLIs are pure TypeScript with no LLM dependency. Any model that can follow instructions and call tools (or just run shell commands) works.

## How the thin-pointer design works



This repo keeps one copy of every specification and points every runtime at it.
Nothing is duplicated, so an upstream improvement reaches every runtime at once.

| Layer | Where it lives | What it is |
|-------|----------------|------------|
| Cross-runtime entry point | [`AGENTS.md`](AGENTS.md) | The file every agent is told to read first; it states the rule that `.claude/` is the single source of truth. |
| Candidate profile | [`CLAUDE.md`](CLAUDE.md) + `.claude/skills/job-application-assistant/01-*.md` | Your name, education, experience, skills and target preferences. |
| Canonical workflow specs | [`.claude/`](.claude/) | `.claude/commands/*.md` (setup, scrape, rank, apply, outcome, interview, upskill, ...) and `.claude/skills/*/SKILL.md`. |
| Portal search CLIs | [`.agents/skills/`](.agents/skills/) | Portable "Agent Skills": one `SKILL.md` per portal, auto-discovered by `/scrape`. |
| Thin pointer files | repo root and dotfiles | Tell a specific runtime where the above live; they contain **no** specs. |

**Which file each runtime reads:**

- **Claude Code** reads `CLAUDE.md` and the `.claude/` tree natively.
- **Google Antigravity** reads `AGENTS.md` and `GEMINI.md`.
- **Codex CLI, opencode, Zed, Windsurf, Crush, Kilo Code** read `AGENTS.md`.
- **Gemini CLI** reads `GEMINI.md`; **Qwen Code** reads `QWEN.md`.
- **Cline** reads `.clinerules`; **Cursor** reads `.cursor/rules/*.mdc` (and `AGENTS.md`).
- **Aider** reads `CONVENTIONS.md` when you load it; **Goose** reads `.goosehints`.
- **GitHub Copilot** reads `.github/copilot-instructions.md` (and `AGENTS.md`).

**Slash commands are a Claude Code artifact.** `/setup`, `/scrape`, `/apply` and
the rest are triggered by Claude Code reading `.claude/commands/<name>.md`. In
**every other runtime** you do the same thing by hand:

- To run a workflow, ask the agent to **execute the matching spec file** - e.g.
  *"follow `.claude/commands/scrape.md`"* or *"read
  `.claude/commands/apply.md` and do what it says"*.
- To load a skill, ask it to read **`.claude/skills/<name>/SKILL.md`** (or the
  portal skill at `.agents/skills/<name>/SKILL.md`).

That is the whole compatibility story: same files, different day job.

## Google Antigravity and its alternatives

**Google Antigravity** is Google's **agent-first IDE** - a coding environment
built around an autonomous agent rather than around autocomplete. It has a **free
Individual tier** (with weekly usage limits), runs on **Windows, macOS and
Linux**, and can drive Google's Gemini models plus others (Claude, GPT-OSS).
Critically for this repo, it **auto-discovers rules from `AGENTS.md` or
`GEMINI.md`** and reads skills in the `.agents/skills/` Agent Skills format, so
this workspace works with no per-runtime setup.

Google also **retired Gemini CLI on 18 June 2026** and folded that audience into
**Antigravity CLI** (backward-compatible with Gemini CLI constructs). The
`GEMINI.md` pointer is kept because Antigravity reads it and because surviving
Gemini CLI installs and forks still do.

### Alternatives, and when to pick each

| Runtime | Pick this if ... |
|---------|------------------|
| **Google Antigravity** | You want the most complete **free** agent-first IDE, on any OS, with the least setup. |
| **VS Code + Cline / Kilo Code** | You already live in VS Code and want an **open-source extension** with a bring-your-own key (Roo Code is discontinued; Kilo Code is its successor). |
| **Cursor** | You want a polished AI IDE and are comfortable with $20/mo (Hobby tier to try it). |
| **Windsurf** | You want a Cursor-style IDE with a **free tier** and Cascade. |
| **Zed** | You want a **fast, open-source** editor with a built-in agent panel and native `AGENTS.md` support. |
| **OpenAI Codex CLI** | You prefer a terminal agent and already pay for ChatGPT Plus/Pro or have API credits. |
| **Qwen Code CLI** | You want an open-source terminal agent and can supply a key or run a local Qwen model. |
| **opencode** | You want an open-source terminal agent that reads `AGENTS.md` and works with any model, including free ones. |
| **Aider** | You want tight, git-oriented pair programming from the terminal. |
| **Goose (Block)** | You want an extensible local agent that goes beyond coding (MCP extensions). |
| **Charm Crush** | You want a polished Go-based terminal agent and don't mind the FSL licence. |

Each of these gets the repo's instructions through the pointer files below - you
point the tool at the workspace once and it reads the same canonical specs.

### Pointer files in this repo

Each file is a short pointer that names `AGENTS.md`, `CLAUDE.md`, `.claude/` and
`.agents/skills/`, and states that the specs must not be duplicated.

| Pointer file | Runtime | Notes |
|--------------|---------|-------|
| [`GEMINI.md`](GEMINI.md) | Gemini CLI / Antigravity | Gemini CLI is retired (18 Jun 2026); Antigravity reads this file, so the pointer still serves the Antigravity path. |
| [`QWEN.md`](QWEN.md) | Qwen Code CLI | Read automatically by Qwen Code. |
| [`CONVENTIONS.md`](CONVENTIONS.md) | Aider | Load with `aider --read CONVENTIONS.md`. |
| [`.cursorrules`](.cursorrules) | Cursor (legacy) | Deprecated - kept as a fallback; `.cursor/rules/*.mdc` and `AGENTS.md` are preferred. |
| [`.cursor/rules/ai-job-search.mdc`](.cursor/rules/ai-job-search.mdc) | Cursor | Modern project rule, `alwaysApply: true`. |
| [`.windsurfrules`](.windsurfrules) | Windsurf (legacy) | Modern Windsurf also reads `.windsurf/rules/*.md` and `AGENTS.md`. |
| [`.clinerules`](.clinerules) | Cline (and Cline-compatible tools) | Plain markdown. |
| [`.goosehints`](.goosehints) | Goose | Natural-language hints; Goose also honours `AGENTS.md`. |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | GitHub Copilot | Repo-wide instructions for VS Code agent mode and the coding agent; also loads `AGENTS.md`. |

Step-by-step, per-runtime and per-OS setup lives in [SETUP.md](SETUP.md)
([SETUP.es.md](SETUP.es.md) in Spanish).

## Operating systems and CPU architectures

Everything in the framework is plain Markdown, Python (standard library only for
the tools) and TypeScript run by [Bun](https://bun.sh). There is no
per-architecture binary to build.

| Platform | Architecture | Portal CLIs (Bun) | Portal CLIs (Node fallback) | Python tools | LaTeX (`lualatex`/`xelatex`) |
|----------|--------------|-------------------|-----------------------------|--------------|-------------------------------|
| Linux | x86_64 | ✓ | ✓ | ✓ | ✓ |
| Linux | ARM64 (incl. Raspberry Pi 4/5) | ✓ | ✓ | ✓ | ✓ |
| macOS | Apple Silicon (ARM64) | ✓ | ✓ | ✓ | ✓ |
| macOS | Intel (x86_64) | ✓ | ✓ | ✓ | ✓ |
| Windows | x86_64 | ✓ | ✓ | ✓ | ✓ |
| Windows | ARM64 | ✓ (native ARM64 Bun) | ✓ | ✓ | ✓ - check your TeX distribution's ARM64 support |
| Any | 32-bit (i686/ia32, armv7) | ✗ - Bun publishes **no** ia32/armv7 builds | ✓ via Node.js 22+ or `npx tsx`, where a 32-bit runtime is available | ✓ - CPython 3.10+ | ✓ - but 32-bit TeX distributions (TeX Live/MiKTeX/MacTeX) are increasingly deprecated |

**Windows specifics.** Everything works from **PowerShell**, classic **cmd**,
**Git Bash** or **WSL2**. Use `python` instead of `python3` and backslash paths
if you are not in Git Bash/WSL2: `python tools\check_platform.py`. WSL2 is the
closest thing to a Linux install and is the least surprising option.

**32-bit hosts.** The one real limitation: **Bun has no 32-bit builds**, so the
TypeScript portal CLIs cannot run on Bun. They still run under **Node.js 22+**:

```bash
node --experimental-strip-types .agents/skills/linkedin-search/cli/src/cli.ts --help
# or, without a matching Node version:
npx tsx .agents/skills/linkedin-search/cli/src/cli.ts --help
```

The **Python tooling** (`tools/*.py`) only needs **CPython 3.10+** and the
standard library, so it works on 32-bit. **LaTeX** binaries exist on 32-bit, but
TeX Live, MiKTeX and MacTeX are steadily dropping 32-bit builds - treat it as
deprecated and prefer a 64-bit host for `/apply`.

## Checking your own machine

The quickest answer:

```bash
python3 tools/check_platform.py     # Windows (PowerShell/cmd): python tools\check_platform.py
```

It prints your OS and version, machine architecture, 32/64-bit, and a
supported / not-supported verdict for the Python tools, the Bun portal CLIs, the
Node fallback path and LaTeX - plus the detected Bun/Node/Python versions and
next-step hints. It always exits 0: it is a report, not a gate.

Manual checks, if you prefer:

| OS | Command |
|----|---------|
| Linux / WSL2 / Git Bash | `uname -a; uname -m; python3 --version; node --version; bun --version; lualatex --version; xelatex --version` |
| macOS | `sw_vers; uname -m; python3 --version; node --version; bun --version; lualatex --version; xelatex --version` |
| Windows (PowerShell) | `Get-ComputerInfo \| Select-Object OsName, OsVersion, OsArchitecture; python --version; node --version; bun --version` |
| Windows (cmd) | `ver & systeminfo \| findstr /C:"System Type"` |
| 32/64-bit (any) | `python -c "import struct; print(struct.calcsize('P') * 8, 'bit')"` |

## Spanish market notes

This fork adds **Spanish job-board portal skills** under
[`.agents/skills/`](.agents/skills/) - run `ls .agents/skills/` to see exactly
which are installed in your checkout. They follow the same portable contract as
the rest of the repo (`search`/`detail`, `--format json|table|plain`, one
`SKILL.md` per portal) and are discovered automatically by `/scrape`; none of
them needs a separate registration step.

- **Spanish boards** (e.g. `tecnoempleo-search`, `infojobs-search`) - Tecnoempleo
  and InfoJobs. InfoJobs uses its official developer API. Both carry
  Spanish-language trigger phrases in their `SKILL.md`.
- **Country-agnostic, and both cover Spain:** `linkedin-search` (set the location
  flag to a Spanish city or `Remote`) and `freehire-search` (tech-focused,
  multi-market via `--region`/`--country`/`--remote`).
- **Danish demo portals** (`jobbank-search`, `jobdanmark-search`,
  `jobindex-search`, `jobnet-search`) ship `enabled: false`; leave them off
  unless your market is Denmark.

The portal skills are **personal-use only** - keep automated request volume low
and respect each board's terms. To add another Spanish board (InfoJobs
alternatives, regional public-employment portals, niche tech boards), run
`/add-portal` from Claude Code, or ask any other agent to follow
`.claude/commands/add-portal.md`; it investigates the board, scaffolds the skill
and test-runs a live query before registering it.

## Honest caveats

- **Verified on this machine:** 64-bit **Linux x86_64** with Python 3.15, Bun
  1.4.3, Node 25.9 and TeX Live 2026 (`lualatex` + `xelatex`). The report above
  was produced by `tools/check_platform.py` on that machine.
- **Not exercised here:** Apple Silicon, Windows, Windows-on-ARM64, Linux ARM64
  (Raspberry Pi), and every 32-bit host. Their support follows from the vendors'
  published builds and the fact that this repo ships no compiled binaries - but
  it was not run on those machines as part of this fork.
- **Agent tools change fast.** Free tiers, instruction-file names and some
  products' very existence shifted during 2026 (Gemini CLI retired; Roo Code
  discontinued; Continue's status reported as discontinued). The names above are
  the conventions as of **October 2026**; if a tool ignores a pointer file, check
  its own docs for the current convention.
- **No runtime is guaranteed.** Claude Code is the reference runtime the upstream
  framework is tested against. The other runtimes read the same specs, but their
  behaviour is not covered by this repo's CI.
