# Setup Guide

Step-by-step instructions for getting the AI Job Search framework running.

> **Español:** esta guía también está disponible en español en [SETUP.es.md](SETUP.es.md).

## 1. Prerequisites

### Claude Code

Install Claude Code (Anthropic's CLI for Claude):

```bash
npm install -g @anthropic-ai/claude-code
```

You'll need an Anthropic API key or a Claude Pro/Team subscription. See the [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code) for details.

### Which AI/CLI agent to use (all are optional-but-pick-one)

Everything the framework actually needs is plain Markdown: your profile files, the workflow specs in `.claude/commands/` and `.claude/skills/`, and the portal skills in `.agents/skills/`. None of it is tied to one vendor, so you can drive it with **any** AI agent that can read files in a folder and run shell commands in it. Install one, open this repository as the workspace, and you are done — there is no per-agent plugin to build.

If you are job-hunting from Spain on a low budget, prefer a runtime with a free tier: **Google Antigravity** (GUI, free tier, no API key) or **Gemini CLI** (terminal, generous free tier). The full Antigravity walkthrough is section 9.

> **A precision about the slash commands.** `/setup`, `/apply`, `/rank`, `/interview` and the rest are **Claude Code command files**: they live in `.claude/commands/<name>.md`, and only Claude Code turns them into literal `/slash` commands. (Scraping is a *skill*, not a command — its spec is `.claude/skills/job-scraper/SKILL.md`, so there is no `.claude/commands/scrape.md`.) In every other runtime, you get identical behaviour by asking the agent, in plain language, to **follow the spec in that file** — for example, "follow `.claude/commands/setup.md`". The Markdown file *is* the spec; nothing needs rewriting.

#### Google Antigravity — free tier

Google's agentic IDE: a GUI you drive conversationally, free with a personal Google account, no API key required. It reads the repo's instruction files when you open the folder.

- **Desktop app (all OSes):** download from <https://antigravity.google/download> — macOS 12+ (Apple Silicon or Intel), Windows 10+ (64-bit), Linux (Ubuntu 20+/Debian 10+/Fedora 36+/RHEL 8+).
- **CLI:**
  - macOS / Linux:
    ```bash
    curl -fsSL https://antigravity.google/cli/install.sh | bash
    ```
  - Windows (CMD):
    ```cmd
    curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
    ```
- **Cost:** free tier.
- **How to use this repo:** open the repository folder as the workspace, then ask the agent to follow the workflow file (for example, *"read `.claude/commands/setup.md` and run it"*). Full steps in section 9.

#### Claude Code — paid (Pro/Max subscription or API credits)

The reference runtime, and the only one where the slash commands work verbatim. The install is above; it needs Node.js 18+, plus a Claude Pro/Max subscription or Anthropic API credits. Paid, but the most polished experience. Reads `CLAUDE.md` and everything under `.claude/`.

#### OpenAI Codex CLI — free tier with a ChatGPT account, or API credits

OpenAI's open-source terminal agent. Reads this repo's `AGENTS.md`.

```bash
npm i -g @openai/codex
```

Works on Windows, macOS and Linux (Node.js 18+). Free usage is included with a paid ChatGPT plan (with a smaller allowance on the free tier); you can also pay per token with an OpenAI API key. Run `codex` in the repository root and ask it to follow `.claude/commands/setup.md`.

#### Gemini CLI — generous free tier

Google's open-source terminal agent and the closest free equivalent to Claude Code. Reads `GEMINI.md` by default and also honours `AGENTS.md`.

```bash
npm i -g @google/gemini-cli
```

Works on all three OSes (Node.js 18+). Free with a personal Google account (at the time of writing, about 60 requests/minute and 1,000/day). Because this repo ships `AGENTS.md` and not a `GEMINI.md`, either run `/memory add AGENTS.md` inside the session or add a one-line `GEMINI.md` that says `See AGENTS.md`.

#### Qwen Code CLI — free-tier friendly

An open-source fork of Gemini CLI tuned for Alibaba's Qwen models, with a large free quota. Reads `QWEN.md` and `AGENTS.md`.

```bash
npm install -g @qwen-code/qwen-code@latest   # or: brew install qwen-code
```

Point it at this repo's `AGENTS.md` with `/memory add AGENTS.md`. Free tier (roughly 2,000 requests/day); bring your own API key for more.

#### opencode — free (bring your own model)

An open-source, terminal-native agent. The tool itself is free; you supply a model provider (many cheap and free options work, including local models). Reads `AGENTS.md`.

```bash
curl -fsSL https://opencode.ai/install | bash          # macOS / Linux
npm install -g opencode-ai                              # any OS (Node.js)
```

On Windows you can also use `choco install opencode` or `scoop install opencode`.

#### Aider — free (bring your own model)

A veteran terminal pair-programmer, installed as a Python package. Free and open source; you pay only your chosen model provider. Also installable with `pipx install aider-chat` or `brew install aider`. Reads whatever you pass via `--read` (and `CONVENTIONS.md` if present).

```bash
python -m pip install aider-install
aider-install
```

Aider does not auto-discover instruction files, so load the specs explicitly:

```bash
aider --read AGENTS.md --read .claude/commands/setup.md
```

#### Cline — free extension (bring your own model)

A free, open-source autonomous-agent extension for VS Code, installed from the VS Code Marketplace ("Cline") on any OS. The extension is free; you connect a model (including local models via Ollama, or a free Gemini key). Reads `AGENTS.md` and `.clinerules/`.

#### Continue — free extension (bring your own model)

A free, open-source chat-and-edit assistant for VS Code and JetBrains, installed from the marketplace ("Continue"). Free extension; bring your own model or run a local one. Add `AGENTS.md` under its "Rules" configuration so it loads the repo's specs.

#### Goose — free (bring your own model)

Block's open-source local agent, as a CLI or a desktop app. Free; bring your own model provider. Reads `.goosehints`; copy `AGENTS.md` into `.goosehints`, or mention it in your prompt.

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash   # macOS / Linux
brew install block-goose-cli                                                                     # macOS / Linux
```

A Windows/macOS/Linux desktop build is also available from the Goose releases page.

#### Crush — free (bring your own model)

Charm's terminal agent. Free and open source; bring your own provider. Reads `CRUSH.md`, `AGENTS.md` and `.crush/`.

```bash
npm install -g @charmland/crush            # any OS (Node.js)
brew install charmbracelet/tap/crush       # macOS / Linux
winget install charmbracelet.crush         # Windows
```

#### Comparison at a glance

| Tool | Cost | OS support | Instruction file we ship | Notes |
|------|------|-----------|--------------------------|-------|
| **Google Antigravity** | Free tier | Windows, macOS, Linux | `AGENTS.md` | GUI + agentic; no API key. See section 9 |
| **Claude Code** | Paid (Pro/Max or API credits) | Windows, macOS, Linux | `CLAUDE.md` (+ `.claude/`) | Only runtime where `/slash` commands run verbatim |
| **OpenAI Codex CLI** | Free tier (ChatGPT account) or API credits | Windows, macOS, Linux | `AGENTS.md` | Terminal agent |
| **Gemini CLI** | Free tier (generous) | Windows, macOS, Linux | `GEMINI.md` / `AGENTS.md` | Closest free equivalent to Claude Code |
| **Qwen Code CLI** | Free tier (generous) | Windows, macOS, Linux | `QWEN.md` / `AGENTS.md` | Gemini CLI fork |
| **opencode** | Free (bring your own model) | Windows, macOS, Linux | `AGENTS.md` | Terminal TUI |
| **Aider** | Free (bring your own model) | Windows, macOS, Linux | `CONVENTIONS.md` / `AGENTS.md` (via `--read`) | Python; explicit file loading |
| **Cline** | Free extension (bring your own model) | VS Code (all OSes) | `AGENTS.md` / `.clinerules` | Editor extension |
| **Continue** | Free extension (bring your own model) | VS Code, JetBrains | `AGENTS.md` | Editor extension |
| **Goose** | Free (bring your own model) | Windows, macOS, Linux | `.goosehints` / `AGENTS.md` | CLI + desktop |
| **Crush** | Free (bring your own model) | Windows, macOS, Linux | `CRUSH.md` / `AGENTS.md` | Terminal TUI |

> **Cost tip for Spain:** the portal CLIs under `.agents/skills/*/cli/` are local programs, so scraping job boards costs no AI credits at all. The only thing you pay for is the agent that drives them — and the free tiers above (Antigravity, Gemini CLI) are genuinely enough. Free-tier limits change often, so check the vendor's page before relying on one.

### Python

Python 3.10+ is required for the salary lookup tool. Check with:

```bash
python3 --version
```

On Windows, `py --version` is often the most reliable check. If your system exposes Python as `python` instead of `python3`, use `python` in the commands below.

### Bun (for job search tools)

The job portal CLIs (four Danish portals plus the country-agnostic `linkedin-search` and `freehire-search` tools) are written in TypeScript and run with Bun.

- macOS/Linux:

```bash
curl -fsSL https://bun.sh/install | bash
```

- Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://bun.sh/install.ps1 | iex"
```

If you prefer a package manager, `winget install Oven-sh.Bun` also works on Windows.

### LaTeX (for compiling CVs and cover letters)

Install a LaTeX distribution to compile the generated `.tex` files to PDF:

- **Windows:** [MiKTeX](https://miktex.org/download)
- **macOS:** [MacTeX](https://tug.org/mactex/)
- **Linux:** `sudo apt install texlive-full` or `sudo dnf install texlive-scheme-full`

The CV compiles with `lualatex` (pdflatex often fails on modern MiKTeX installs with `fontawesome5` font-expansion errors). The cover letter compiles with `xelatex` because `cover.cls` requires `fontspec` for its custom Lato/Raleway fonts.

#### Minimal TeX install: TinyTeX/BasicTeX

Full TeX distributions work out of the box, but minimal distributions need a few extra packages before the stock templates compile.

On macOS, a user-level TinyTeX install avoids a system-wide installer and does not require `sudo`:

```bash
curl -fsSL https://yihui.org/tinytex/install-bin-unix.sh -o /tmp/tinytex-install-bin-unix.sh
sh /tmp/tinytex-install-bin-unix.sh /tmp --no-path
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
```

Then install the template dependencies:

```bash
tlmgr install \
  moderncv fontawesome5 fontawesome6 academicons import luatexbase pgf \
  titlesec textpos xltxtra xunicode cite realscripts needspace
```

For BasicTeX/MacTeX, make sure the TeX binary directory is on `PATH` first (for example via `/Library/TeX/texbin`), then run the same `tlmgr install ...` command.

Quick smoke tests after setup:

```bash
cd cv && lualatex -interaction=nonstopmode -halt-on-error main_example.tex && cd ..

SMOKE_DIR="$(mktemp -d /tmp/ai-job-cover-smoke.XXXXXX)"
cp -R cover_letters/cover.cls cover_letters/OpenFonts "$SMOKE_DIR/"
cat >"$SMOKE_DIR/cover_smoke.tex" <<'EOF'
\documentclass[]{cover}
\begin{document}
\namesection{Test}{Candidate}{test@example.com}
\companyname{Example Company}
\companyaddress{123 Hiring Street\\Example City}
\currentdate{\today}
\lettercontent{Dear Hiring Manager,}
\lettercontent{This smoke test verifies that xelatex can load cover.cls and the bundled fonts.}
\closing{Sincerely,}
\signature{Test Candidate}
\end{document}
EOF
(cd "$SMOKE_DIR" && xelatex -interaction=nonstopmode -halt-on-error cover_smoke.tex)
```

#### Windows: Basic MiKTeX

The full MiKTeX installer bundles every CTAN package and works out of the box, but the smaller [Basic MiKTeX](https://miktex.org/download) installer (`basic-miktex-*.exe`) only ships a minimal package set and needs a couple of one-time settings before the stock templates compile.

By default, MiKTeX installs missing packages on demand but pops up a GUI prompt for each one — which blocks non-interactive terminals (including Claude Code's Bash tool). Turn that into a silent auto-install instead:

```powershell
initexmf --admin --set-config-value=[MPM]AutoInstall=1
initexmf --set-config-value=[MPM]AutoInstall=1
```

(Run the first line from an elevated/Admin PowerShell if you installed MiKTeX for all users; the second line covers a per-user install. Only one will apply depending on how you installed it — running both is harmless.)

If you'd rather not rely on on-the-fly installs at all (for example, for a fully offline compile later), pre-install the same package set the macOS TinyTeX section above lists, using MiKTeX's package manager:

```powershell
mpm --admin --install=moderncv --install=fontawesome5 --install=fontawesome6 --install=academicons --install=import --install=luatexbase --install=pgf --install=titlesec --install=textpos --install=xltxtra --install=xunicode --install=cite --install=realscripts --install=needspace
```

Drop `--admin` if MiKTeX is installed for the current user only. If a package name doesn't resolve, `mpm --find=<name>` searches the repository for the correct name.

Quick smoke tests after setup (PowerShell):

```powershell
Set-Location cv; lualatex -interaction=nonstopmode -halt-on-error main_example.tex; Set-Location ..

$SmokeDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "ai-job-cover-smoke-$(Get-Random)")
Copy-Item cover_letters\cover.cls, cover_letters\OpenFonts -Destination $SmokeDir -Recurse
@'
\documentclass[]{cover}
\begin{document}
\namesection{Test}{Candidate}{test@example.com}
\companyname{Example Company}
\companyaddress{123 Hiring Street\\Example City}
\currentdate{\today}
\lettercontent{Dear Hiring Manager,}
\lettercontent{This smoke test verifies that xelatex can load cover.cls and the bundled fonts.}
\closing{Sincerely,}
\signature{Test Candidate}
\end{document}
'@ | Set-Content (Join-Path $SmokeDir "cover_smoke.tex")
Push-Location $SmokeDir; xelatex -interaction=nonstopmode -halt-on-error cover_smoke.tex; Pop-Location
```

### Optional: ATS text extraction (pypdf, then pdftotext)

`/apply` runs an ATS parseability check on the compiled CV: it extracts the PDF's text layer and verifies contact details, reading order, and keyword coverage the way an applicant-tracking system sees them.

The default extractor is **pypdf** (BSD, `pip install pypdf`). Poppler `pdftotext` remains an optional fallback:

- **macOS:** `brew install poppler`
- **Debian/Ubuntu:** `sudo apt install poppler-utils`
- **Windows:** `choco install poppler`

If a command still uses `pdftotext -layout`, it must pass `-enc UTF-8` as well. If **neither** extractor is available, `/apply` skips the mechanical check with a warning and falls back to a visual keyword review — everything else works normally.

### Cross-platform support and CPU architectures

Everything in this repo runs on the three mainstream desktop platforms, but the install path and the CPU architecture both matter:

- **Windows** — PowerShell or `cmd`. The CLI tools install with `npm i -g …` (Node) or the vendor scripts; `winget`, `choco` and `scoop` cover most of them, and MiKTeX/Poppler have their own installers (see above).
- **macOS** — Intel and Apple Silicon. Bun, Node and every agent here ship native builds for both, and Homebrew (`/opt/homebrew` on Apple Silicon, `/usr/local` on Intel) installs them.
- **Linux** — x64 and ARM64, including a Raspberry Pi 4/5 running a 64-bit OS.

Architecture notes:

- **x86_64 (amd64) and ARM64 (aarch64) are fully supported** on all three operating systems.
- On **32-bit x86** or **ARMv7 / armhf** (for example a Raspberry Pi running a 32-bit OS, where Bun has no build), run the TypeScript portal CLIs with **Node.js 22+** using `node --experimental-strip-types`, or with `tsx`, instead of `bun`. The Python tools simply need CPython 3.10+, which works wherever Python runs.
- If `bun --version` fails, `/scrape` is not blocked: the workflow falls back to `WebSearch` automatically (see [Troubleshooting](#troubleshooting)).

The full support matrix, with per-tool notes, lives in [COMPATIBILITY.md](COMPATIBILITY.md) (Spanish mirror: [COMPATIBILIDAD.md](COMPATIBILIDAD.md)).

## 2. Fork and clone

```bash
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
gh repo set-default <your-github-username>/ai-job-search
```

Or manually: fork on GitHub, then clone your fork.

> **The `set-default` line is not optional.** `gh repo fork --clone` sets the
> **upstream** repo as gh's default repository ("The `upstream` remote will be set as
> the default remote repository" — `gh repo fork --help`), and gh uses the default for
> **creating issues and PRs**. Without it, any later `gh issue create` run from this
> clone — by you or by an agent you have asked to track your applications — silently
> files on the upstream **public** tracker, publishing whatever the issue contains
> under your GitHub identity, on a repo where you cannot delete it (#389).

> **Before you go further: forks are public.** GitHub cannot make a fork of a public
> repository private, and `/setup` (section 6) writes your personal data into **tracked**
> files — pushing those commits to a fork publishes them. If this copy is for your own
> job search rather than for contributing, prefer a **private repository** with this repo
> as `upstream`: see section 8, step 1 for the exact commands and why committing your
> personalization there is still the right move. Everything else in this guide works
> identically either way.

## 3. Install job search CLI dependencies
Run these from the repository root.

```bash
python3 tools/install_portal_clis.py   # Windows: python tools\install_portal_clis.py
```

It runs `bun install` in every portal CLI under `.agents/skills/*/cli/` - discovered, not listed, so a portal you add with `/add-portal` or copy from another fork is included on a fresh clone. A CLI whose `package.json` declares an install-time lifecycle script is skipped and reported rather than run. `--dry-run` shows what it would install.

For `linkedin-search` and `freehire-search` the install is optional: both have zero runtime dependencies and run with plain `bun`; `bun install` only pulls TypeScript dev types.

If you're outside Denmark, you can generate an equivalent search skill for your local job board with `/add-portal` — it scaffolds the same CLI structure for any public portal and test-runs a live query before registering. See the "Job search tools" section in the README.

## 4. Run the setup interview

Start Claude Code in the repository:

```bash
claude
```

Then run the onboarding:

```
/setup
```

Claude will offer three paths:

- **Path A (documents folder):** Add your CV, LinkedIn export, diplomas, references, or past applications under `documents/`. Claude reads and cross-references them before proposing profile updates. This is best when you have several source files.
- **Path B (single CV import):** Share one CV/resume by mentioning the file with `@` or pasting the text. Claude extracts it and asks follow-up questions for anything missing.
- **Path C (interview mode):** Answer structured interview questions section by section.

All three paths produce the same result: fully populated profile files.

### What gets populated

| File | Content |
|------|---------|
| `CLAUDE.md` | Your full candidate profile |
| `01-candidate-profile.md` | Structured education, experience, skills |
| `02-behavioral-profile.md` | Behavioral assessment |
| `04-job-evaluation.md` | Personalized skill match areas and career goals |
| `05-cv-templates.md` | Profile statement templates for your background |
| `07-interview-prep.md` | STAR examples from your experience |
| `cv/main_example.tex` | Your LaTeX CV with actual details |
| `search-queries.md` | Job search queries for `/scrape` |

### Re-running setup

You can update specific sections later:

```
/setup --section skills
/setup --section experience
/setup --section search
```

The `--section search` option is especially useful as your priorities evolve. It re-runs the search configuration interview and suggests role types you may not have considered based on your full profile.

## 5. Optional: Set up salary benchmarking

If you have salary data (from a union, salary survey, Glassdoor, or personal research):

1. **Option A:** Create `salary_data.json` manually in the repo root (see `tools/README_SALARY_TOOL.md` for the format)
2. **Option B:** Convert from Excel:
   ```bash
   pip install openpyxl
   python3 tools/convert_salary_excel.py path/to/salary-data.xlsx --source "My Salary Data 2025"
   ```

This creates `salary_data.json` which the `/apply` workflow uses for salary benchmarking. If you skip this step, salary lookup is simply omitted.

## 6. Test the workflow

Find a job posting you're interested in, then:

```
/apply https://jobindex.dk/job/1234567
```

Or paste the job description directly:

```
/apply [paste job posting text here]
```

Claude will:
1. Evaluate the fit against your profile
2. Ask if you want to proceed
3. Draft a tailored CV and cover letter
4. Have a reviewer agent critique the drafts
5. Revise and present the final output

## 7. Compile your documents

After `/apply` creates the LaTeX files:

```bash
# Bash / zsh / Git Bash
cd cv && lualatex main_<company>_<role>.tex && cd ..
cd cover_letters && xelatex cover_<company>_<role>.tex && cd ..
```

```powershell
# PowerShell
Set-Location cv; lualatex main_<company>_<role>.tex; Set-Location ..
Set-Location cover_letters; xelatex cover_<company>_<role>.tex; Set-Location ..
```

These commands apply to the stock templates (moderncv CV, `cover.cls` cover letter). If you'd rather use your own LaTeX template, run `/add-template` — it captures the template's compile engine, fonts, style rules, and page limit, test-compiles it, and wires it into `/apply`. See the "LaTeX templates" section in the README.

## 8. Pulling upstream updates into your fork

Upstream keeps improving the methodology files your fork has personalized, so plan for updates from day one:

**Prefer releases over raw `master`.** Tagged [releases](../../releases) are vetted checkpoints, each described in [CHANGELOG.md](CHANGELOG.md). Updating to a tag pulls a stable, documented state instead of whatever `master` happens to be mid-review. Fetch tags with `git fetch upstream --tags` and merge a release (for example `git merge v1.0.0`) when you want stability; pull `master` directly only when you specifically want the latest unreleased changes. The steps below apply either way - substitute the release tag for `upstream/master` where you see it.

1. **Commit your personalization - but know where those commits land.** `/setup` edits CLAUDE.md and the profile skill files in place; those edits are *yours*, and committing them is what lets updates merge cleanly. But a GitHub **fork of this repo is public** - forks of public repositories cannot be made private - so anything you commit *and push to a fork* is visible to anyone. If you want your profile in a remote at all, don't push it to a fork: create a **private** repository, push there, and add this repo as the `upstream` remote (`git remote add upstream https://github.com/MadsLorentzen/ai-job-search.git`) to keep receiving updates. Committing locally without pushing is also fine. The genuinely sensitive files (tracker, salary data, `documents/`, application archives) are gitignored and never enter git either way. An uncommitted working tree is the most common reason `git pull` refuses to merge at all (`Your local changes ... would be overwritten`).
2. **Preview what changed before pulling:**
   ```bash
   git remote add upstream https://github.com/MadsLorentzen/ai-job-search.git   # first time only, if you cloned your own fork
   git fetch upstream    # or origin, if you cloned the template directly
   python3 tools/check_upstream_updates.py
   ```
   It compares the `framework_version` markers in your framework files against upstream and lists exactly which methodology files changed, with the diff command for each.

   Two tools answer two different questions, and it's worth running both:
   - **`check_upstream_updates.py`** — *which of my personalized files changed?* It reads the `framework_version` stamp on each methodology file, so it flags exactly the customized files a release touched.
   - **`upstream_triage.py`** — *which upstream commits deserve my attention?* It walks the commits you're behind and sorts them into "worth reviewing" vs "probably skip", dropping anything you've already cherry-picked (matched by `git patch-id`, so ported work falls off with no bookkeeping), commits that only touch files your fork removed, and SHAs you've listed in `.github/upstream-wontport.txt`. It's report-only — it prints ready-to-run `git cherry-pick` lines but never merges, pushes, or opens a PR, because on a fork "applies cleanly" isn't "correct".

     ```bash
     python3 tools/upstream_triage.py --remote upstream
     ```

     Forks also inherit a `.github/workflows/upstream-watch.yml` that runs this weekly and writes the result into a single rolling issue (it no-ops on the upstream template itself, and stays disabled on a fork until you enable Actions).
3. **Merge normally.** `git merge upstream/master` (or `git pull`) three-way-merges upstream's edits around your personalization; because methodology edits rarely touch the lines `/setup` filled in, most updates land cleanly. A conflict in a personalized file is a *feature*, not a failure — it means upstream changed methodology in a section you customized, and the version marker plus its changelog commit tell you why. Resolve by keeping your data and adopting the methodology change around it.

## 9. Google Antigravity: step-by-step setup (Windows, macOS, Linux)

This section mirrors the Claude Code walkthrough in sections 2–7, using **Google Antigravity** instead. Everything else in this guide applies unchanged, and Antigravity's free tier makes this the cheapest way to drive the framework end to end.

### 9.1 Install Antigravity

Download the installer for your operating system from <https://antigravity.google/download> and run it:

- **Windows 10+ (64-bit):** download the `.exe` installer, run it, and launch "Antigravity" from the Start menu.
- **macOS 12 (Monterey) or later:** download the `.dmg` (Apple Silicon or Intel build), drag Antigravity to `Applications`, and launch it. The first launch may warn that the app was downloaded from the internet — allow it under *System Settings → Privacy & Security*.
- **Linux (Ubuntu 20+, Debian 10+, Fedora 36+, RHEL 8+):** install the package your distro uses, for example `sudo apt install ./antigravity*.deb` or `sudo dnf install ./antigravity*.rpm`.

There is also a **headless CLI** if you prefer the terminal:

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

```cmd
:: Windows (CMD)
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### 9.2 Sign in (free tier)

Launch Antigravity and sign in with a **personal Google account**. The free tier is enough to run this framework; you do not need to add a payment method or an API key. Pick a model in the agent panel (Gemini models are included).

### 9.3 Open this repository as the workspace

Use **File → Open Folder** (or "Open Workspace") and select the folder where you cloned this repository — the same folder you ran the fork/clone commands in for section 2. Antigravity treats that folder as the project root.

### 9.4 Confirm it picked up the repo's instruction files

This repo ships its agent instructions at the root:

- [`AGENTS.md`](AGENTS.md) — the thin pointer that tells any runtime where the canonical specs live.
- [`CLAUDE.md`](CLAUDE.md) — your candidate profile (created by `/setup`, section 4).

Ask Antigravity, in the chat panel:

> Read `AGENTS.md` and `CLAUDE.md` at the root of this workspace, then summarise the workflow files they point to.

If it lists `.claude/commands/*.md` and `.claude/skills/*`, discovery worked. If it does not read them on its own, you can always attach a file to a prompt explicitly.

### 9.5 Run the first three workflow steps

Remember: the `/slash` commands are Claude Code command files (see section 1). In Antigravity, you ask the agent to *follow the file*.

1. **Profile setup** — ask the agent:

   > Follow the spec in `.claude/commands/setup.md` and run the onboarding interview.

   Antigravity walks you through Path A/B/C exactly as described in section 4 and writes your profile files.

2. **Scrape for jobs** — the scrape workflow is a skill, not a command, and its spec is [`.claude/skills/job-scraper/SKILL.md`](.claude/skills/job-scraper/SKILL.md). Ask the agent:

   > Follow the spec in `.claude/skills/job-scraper/SKILL.md` and find new jobs.

   This fork also ships Spanish portal skills — [`.agents/skills/tecnoempleo-search`](.agents/skills/tecnoempleo-search), [`.agents/skills/infojobs-search`](.agents/skills/infojobs-search), [`.agents/skills/indeed-search`](.agents/skills/indeed-search) and [`.agents/skills/infoempleo-search`](.agents/skills/infoempleo-search) and [`.agents/skills/ticjob-search`](.agents/skills/ticjob-search) — alongside the country-agnostic [`linkedin-search`](.agents/skills/linkedin-search) and [`freehire-search`](.agents/skills/freehire-search). `/scrape` discovers every skill under `.agents/skills/` automatically, so the Spanish portals are searched with no extra configuration once their CLIs are installed (next step).

3. **Apply to a posting** — ask the agent:

   > Follow the spec in `.claude/commands/apply.md` with this job posting: <paste a URL or the posting text>.

   The same drafter/reviewer workflow from section 6 runs.

### 9.6 Enable and verify the portal CLIs

The `/scrape` workflow drives the portal CLIs under `.agents/skills/*/cli/`. Install them once from the repository root (section 3):

```bash
python3 tools/install_portal_clis.py   # Windows: python tools\install_portal_clis.py
```

The CLIs are TypeScript and run on **Bun**. Check it is available:

```bash
bun --version
```

If Bun is missing, install it as shown in section 1 — `curl -fsSL https://bun.sh/install | bash` on macOS/Linux, or `winget install Oven-sh.Bun` on Windows. Verify that a single portal CLI runs before you rely on it:

```bash
bun run .agents/skills/infojobs-search/cli/src/cli.ts --help
```

If Bun has no build for your CPU (some 32-bit or ARMv7 systems), run the same entry point with Node.js 22+ (`node --experimental-strip-types`) or with `tsx` instead — see the cross-platform note at the end of section 1.

### 9.7 Differences vs Claude Code

| | Claude Code | Google Antigravity |
|--|-------------|--------------------|
| **Invocation** | Literal `/setup`, `/scrape`, `/apply` slash commands | Plain-language request to follow the matching `.claude/…` spec file |
| **Interface** | Terminal | GUI (IDE-like), with a headless CLI available |
| **Cost** | Pro/Max subscription or API credits | Free tier |
| **Instruction file** | `CLAUDE.md` | `AGENTS.md` |
| **Sub-agents / hooks** | Native (`Agent` tool, `.claude/settings.json`) | Agent panel; hooks and settings are not shared |
| **Behaviour** | The reference implementation | Same specs, read mechanically — expect small wording/formatting differences in the output |

The specs are identical, so your profile, tracker and documents stay portable between the two: nothing in this repo is locked to one runtime.

## Troubleshooting

### "salary_data.json not found"
This is expected if you haven't set up salary benchmarking. The `/apply` workflow skips this step automatically.

### Job search CLI tools not working
Make sure Bun is installed and you ran `bun install` in each CLI directory. The tools require network access to fetch job listings.

### LaTeX compilation errors
- CV: uses `lualatex` (pdflatex often fails on modern MiKTeX with `fontawesome5` font-expansion errors; lualatex handles the same sources cleanly)
- Cover letter: uses `xelatex` (for custom fonts in `OpenFonts/fonts/`)
- Make sure your LaTeX distribution includes the `moderncv` package

### Fonts not found in cover letter
The cover letter template expects fonts in `cover_letters/OpenFonts/fonts/`. Make sure this directory exists and contains the Lato and Raleway font files.

### Stale `.claude/settings.local.json` from an older clone
Shared Claude Code permissions now live in `.claude/settings.json` (scoped to `bun run`, `python salary_lookup.py`, and `python3 salary_lookup.py`). Earlier versions of this repo committed a broader `.claude/settings.local.json` that pre-approved `Bash(curl:*)`, `Bash(python:*)` and `Bash(bun:*)`. If you cloned before that change, git leaves the old file behind in your working copy, and its permissions still apply on top of `settings.json`. Delete it (or trim it to your own personal overrides):

```bash
rm .claude/settings.local.json
```
