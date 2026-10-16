# Free and Low-Budget AI for Your Job Search in Spain

> **Read this first.** Tool names, free-tier limits and model names change constantly — Google, OpenAI, Anthropic and the rest revise them every few months. Every figure in this guide was checked around October 2026 and each one is labelled so you can tell what is stable from what is not. Wherever you read *"check current limits — they change"* or *"verify current availability"*, do exactly that before you rely on it. All URLs were valid in October 2026.

This document is the English mirror of the primary Spanish deliverable, [`busqueda_ia_bajosrecursoseconomicos.md`](busqueda_ia_bajosrecursoseconomicos.md). Both files carry the same structure and the same facts.

## 1. Introduction: what this is, who it is for, and what you can do for €0

This is a practical guide for using artificial intelligence to find and apply for jobs **from Spain, with almost no money**. It assumes you may have €0 to spend and an old computer, and it is honest about what a free tier and an old machine can and cannot do.

**Who it is for**

- Anyone job-hunting in Spain whose budget for tools is realistically €0–€10 a month.
- People on older hardware: 4th–7th-generation Intel laptops, and even 2nd–4th-generation machines with 4–8 GB of RAM and no dedicated GPU.
- People who want to keep their data local where possible, and who are willing to learn a few terminal commands.
- People who may want, *while* they look for work, to build a small online income (e-commerce, freelancing) as a bridge — the guide covers that path too, with Spanish specifics.

**What you can genuinely do for €0**

- Register for the free tier of the major AI assistants and use them as a career assistant.
- Run this repository's own workflow — `/setup`, `/scrape`, `/rank`, `/apply`, `/upskill`, `/interview` — driven by a free command-line agent or even a web chat.
- Run a language model **on your own machine** with Ollama (or an alternative), entirely offline.
- Build an ATS-friendly CV with free builders (Europass, FlowCV, Reactive Resume, JSON Resume).
- Check how an applicant-tracking system (ATS) reads your CV, using free tiers.
- Rehearse interviews for free.
- Upskill for free through Spanish public and private programmes.
- Search Spanish job portals and the European EURES network.

**What €0 will not give you**

- It will not give you a frontier model for unlimited agentic coding. The strongest free agentic tiers (Antigravity, Copilot Free, Cursor Hobby, Windsurf free) are all metered, and the big ones change their terms often.
- It will not make a 2013 laptop run a 7B model fast. It will run a small one slowly.
- It will not automate applications without risk. Mass auto-apply tools are paid, frequently breach portal terms of service, and produce low-quality applications. This guide deliberately does not push them.

> **Disclaimer.** This is practical guidance, not legal, tax, immigration or financial advice. The Spanish fiscal and business references (autónomo, RETA, IVA, dropshipping obligations) are provided so you know what questions to ask — always confirm the details with the official sources (Agencia Tributaria / AEAT, Seguridad Social, SEPE) or a professional before acting.

## 2. How to register for the FREE tier of every relevant AI

The table below summarises the registration requirements. Detailed notes per tool follow it. **None of the free tiers listed require a credit card**, but several require a Google/Apple/Microsoft/Meta/X account and, in a few cases, a phone number for verification.

### Quick-reference registration table

| Tool | URL | Account? | Phone? | Card? | Free tier in one line |
|---|---|---|---|---|---|
| Google Gemini (web) | gemini.google.com | Google account | No | No | Free chatting with Gemini models |
| Google AI Studio | aistudio.google.com | Google account | No | No | Free web prompting + free API key tier |
| Google Antigravity | antigravity.google | Google account | No | No | Free individual tier, weekly agent quota |
| ChatGPT (free) | chatgpt.com | Yes (email/Google/Apple) | Usually no | No | Free chat tier, limited model |
| OpenAI Codex | chatgpt.com/codex | Yes | Usually no | No | $0 tier exists; CLI access is limited (verify) |
| Anthropic Claude | claude.ai | Yes | Sometimes | No | Free web/app chat; **no** free CLI |
| Microsoft Copilot | copilot.microsoft.com | Microsoft account | No | No | Free consumer chat, limited |
| Perplexity | perplexity.ai | Yes | No | No | Unlimited quick searches, few Pro/day |
| DeepSeek | chat.deepseek.com | Yes | Sometimes | No | Free generous chat, peak-hour queues |
| Qwen Chat | chat.qwen.ai | Yes | No | No | Free account, full preview model, rate-limited |
| Qwen Code CLI | qwen.ai/qwencode | Yes for cloud | No | No | CLI is free/open-source; cloud free tier ended (verify) |
| Mistral (Le Chat / Vibe) | chat.mistral.ai | Yes | No | No | Free ~20–25 messages/day |
| Meta AI | meta.ai | Meta account | No | No | Free chat, also in WhatsApp/Instagram |
| Grok (X) | grok.com / x.com | X account | No | No | Free tier, limits unpublished |
| Poe | poe.com | Yes | Sometimes | No | ~300 compute points/day |
| Hugging Face | huggingface.co | Yes | No | No | Free Hub + small monthly inference credit |
| GitHub Copilot | github.com/features/copilot | GitHub account | No | No | Free: 2,000 completions + 50 chats/month |
| Windsurf | windsurf.com | Yes | No | No | Free: ~25 Flow Actions/month (verify) |
| Cursor | cursor.com | Yes | No | No | Hobby plan, limited agent/tab usage |
| Zed | zed.dev | Optional | No | No | Free editor; bring your own model/keys |
| Cline / Roo / Kilo | cline.bot, roo, kilo.ai | No | No | No | Extension free; you supply the key/model |

### 2.1 Google: Gemini, AI Studio and Antigravity

- **Gemini (consumer chat):** [gemini.google.com](https://gemini.google.com/). Free with a Google account. No card.
- **Google AI Studio:** [aistudio.google.com](https://aistudio.google.com/). Free to prompt in the browser, and it issues a **free API key tier**. The free API tier has been narrowed to Flash-class models; *check current limits — they change*.
- **Google Antigravity:** [antigravity.google](https://antigravity.google/). Google's agent-first platform — an IDE, a CLI and an agent manager. The **individual tier is genuinely $0** and, at the time of writing, includes unlimited Tab completions and Command requests, with a **weekly cap on autonomous agent runs**. Model list has included Gemini 3.x Flash/Pro, Claude Sonnet/Opus and gpt-oss-120b. *Verify current availability and limits.*
- **Important:** On **18 June 2026**, Google retired **Gemini CLI** and the Gemini Code Assist IDE extensions for free, Pro and Ultra individual users, replacing them with the **Antigravity CLI**. Enterprise Code Assist licences and API-key authentication were unaffected. So if a tutorial tells you to install the Gemini CLI for a free account, that path is dead — use Antigravity CLI instead.
- **Antigravity CLI install:** macOS/Linux `curl -fsSL https://antigravity.google/cli/install.sh | bash`; Windows PowerShell `irm https://antigravity.google/cli/install.ps1 | iex`; Windows CMD `curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd`. It auto-imports Gemini CLI skills, MCP servers and `gemini.md` memory.

**OS caveats:** Antigravity IDE targets modern 64-bit Windows/macOS/Linux. The CLI runs on 64-bit Windows, macOS and Linux; on Windows, WSL2 gives the smoothest experience.

### 2.2 OpenAI: ChatGPT free and Codex

- **ChatGPT free:** [chatgpt.com](https://chatgpt.com/). Free tier, no card, limited access to the newest models and a daily message cap.
- **Codex:** OpenAI's coding agent. There is a **$0 tier**, but free CLI access is limited or absent depending on the current packaging — some sources report the free tier is desktop-app only, others that Codex is included at every level. **Verify the current state before planning around it.** Codex CLI (`npm install -g @openai/codex`, or `brew install codex`) signs in with your ChatGPT account or an API key.
- **OS caveats:** Codex CLI runs on 64-bit Windows/macOS/Linux; on native Windows it prefers Git for Windows or WSL.

### 2.3 Anthropic: Claude (free web only)

- **Claude free:** [claude.ai](https://claude.ai/). Free web and mobile chat. Limits are dynamic — observed roughly **15–40 messages per 5-hour window**, but *check current limits — they change*. No card.
- **There is no free Claude Code CLI tier.** Claude Code requires a **Pro, Max, Team, Enterprise or Console (API)** account. The free claude.ai plan does **not** include Claude Code. This is the single biggest reason this fork exists: you do not need Claude Code to run the workflow.
- If you ever do get access, Claude Code installs with `curl -fsSL https://claude.ai/install.sh | bash` (macOS/Linux/WSL), `irm https://claude.ai/install.ps1 | iex` (PowerShell), `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd` (CMD), `brew install --cask claude-code`, `winget install Anthropic.ClaudeCode`, or `npm install -g @anthropic-ai/claude-code` (needs Node 22+).

### 2.4 Microsoft Copilot

- **URL:** [copilot.microsoft.com](https://copilot.microsoft.com/) (and the Copilot apps). Free consumer chat with a personal Microsoft account. No card. The free tier is limited — image generation, file uploads and the newest models sit behind paid plans. *Check current limits — they change.*

### 2.5 Perplexity

- **URL:** [perplexity.ai](https://www.perplexity.ai/). Free plan gives **unlimited quick searches with citations** and only a handful of advanced **Pro Searches per day** (~3–5, varies). No card. Useful for company research because every answer is sourced.

### 2.6 DeepSeek

- **URL:** [chat.deepseek.com](https://chat.deepseek.com/). Free web chat and app, account required (email; sometimes phone). DeepSeek publishes no fixed daily message cap; the genuine limits are **peak-hour queues** and rate throttling. The API is paid and needs a top-up. Good value for reasoning-style prompts.

### 2.7 Qwen

- **Qwen Chat:** [chat.qwen.ai](https://chat.qwen.ai/) — free account, full preview model, rate-limited. Also a desktop/mobile app.
- **Qwen Code CLI:** an open-source terminal agent ([github.com/QwenLM/qwen-code](https://github.com/QwenLM/qwen-code)). Install with `npm install -g @qwen-code/qwen-code@latest` (needs Node 22+), `brew install qwen-code`, or the standalone installer. **The Qwen OAuth free cloud tier was discontinued on 15 April 2026** — the CLI itself stays free and open-source, but you now point it at your own provider (a free API key, or a local Ollama model). *Verify current availability.*

### 2.8 Mistral (Le Chat / Vibe)

- **URL:** [chat.mistral.ai](https://chat.mistral.ai/). The free plan gives web and mobile chat with a **soft cap around 20–25 messages a day** on the free model tier, plus web search and basic image generation. No card. Good multilingual handling of Spanish.

### 2.9 Meta AI

- **URL:** [meta.ai](https://www.meta.ai/) and inside WhatsApp, Instagram and Messenger. Free with a Meta/Facebook account. No card. Handy because it is already where you chat.

### 2.10 Grok (X)

- **URL:** [grok.com](https://grok.com/) or inside X. Free with an X account. xAI publishes **no exact free-tier number** — its own pricing page describes the free tier as "generous limits" and real-time web/X search as "Limited". Older figures (10 prompts / 2 hours) come from a retired system. *Check current limits.*

### 2.11 Poe

- **URL:** [poe.com](https://poe.com/). One subscription-style front-end over many models. Free tier is **compute-point based**: roughly **300 points/day** (about 15–30 short messages), after a ~90% cut in March 2026. Points reset daily and do not roll over. No card.

### 2.12 Hugging Face

- **URL:** [huggingface.co](https://huggingface.co/). Free account. The **Inference API** free tier is now a small **monthly credit** (historically ~$0.10/month) spent at partner-provider prices, rather than a fixed request count. The Hub allows free users around 1,000 API calls per 5 minutes. Useful for hosting your own Spaces and datasets.

### 2.13 GitHub Copilot (Free plan)

- **URL:** [github.com/features/copilot](https://github.com/features/copilot/plans). A **Copilot Free** plan needs only a GitHub account and no card: historically **2,000 code completions and 50 chat requests per month**, with auto model selection only. GitHub moved all Copilot plans to **usage-based "AI Credits" billing on 1 June 2026**, so the exact free allowance has shifted — *check current limits*.

### 2.14 Windsurf and Cursor (free IDE tiers)

- **Windsurf:** [windsurf.com](https://windsurf.com/). Free tier historically **~25 Flow Actions per month**, the SWE-1 mini model, and a 16K context window. *Verify current limits.*
- **Cursor:** [cursor.com](https://cursor.com/). **Hobby** plan at $0, no card: limited Agent requests and limited Tab completions. Cursor no longer publishes a fixed public Hobby number, so treat any quoted figure as stale.

### 2.15 Zed

- **URL:** [zed.dev](https://zed.dev/). A fast, open-source editor. The **free plan is free forever** and, importantly, lets you use **your own API keys or external agents** (including local models) without a Zed subscription. Paid plans add hosted model credits and edit predictions. Great if you already have a free API key or a local Ollama model.

### 2.16 Cline, Roo Code and Kilo Code (bring your own key)

These are **VS Code / JetBrains extensions**, and they are **free when you supply your own model**: a free cloud API key (Groq, OpenRouter, Cerebras, Google AI Studio) or a local Ollama model.

- **Cline:** [cline.bot](https://cline.bot/). In 2026 it added hosted options, but the BYOK path is still free.
- **Roo Code:** a Cline fork; same pattern. *Note: at least one source reports Roo Code was discontinued in May 2026 — verify current availability.*
- **Kilo Code:** [kilo.ai](https://kilo.ai/). Open-source agent for VS Code, JetBrains and CLI; no markup on model usage if you use your own keys, and it can run local models.

### 2.17 Local-first options

If you have no money **and** no reliable internet, everything can run on your machine: Ollama (section 5), or an alternative from section 7. These need no account, no phone and no card.

## 3. AIs dedicated to job search and job applications

### 3.1 This repository's own workflow (the strongest free option)

This repository *is* an AI job-search system. The workflow lives in [`.claude/`](.claude/): the specs under `.claude/skills/` and the commands under `.claude/commands/`. You drive it with **any** command-line AI agent — Google Antigravity CLI/IDE, Codex CLI, Qwen Code, **opencode**, **Aider**, Cline, Roo, Kilo, Continue or Goose — through thin pointer files (`GEMINI.md`, `QWEN.md`, `CONVENTIONS.md`, `.cursorrules`, etc.). See [SETUP.md](SETUP.md) and [COMPATIBILITY.md](COMPATIBILITY.md).

The commands you will actually use:

- **`/setup`** — interviews you and fills in your profile.
- **`/scrape`** — searches job portals via the installed `*-search` CLIs (Tecnoempleo, InfoJobs, LinkedIn, freehire and more), deduplicates, and presents new matches.
- **`/rank`** — batch-scores the scraped jobs and returns a ranked shortlist, so you spend `/apply` effort only where it counts.
- **`/apply`** — the drafter–reviewer workflow: evaluates fit, drafts a tailored CV and cover letter in LaTeX, has a second agent critique them, then compiles and visually inspects the PDFs and ATS-checks the text layer.
- **`/upskill`** — compares tracked jobs against your profile and produces a prioritised learning plan.
- **`/interview`** — builds a stage-specific interview prep pack, with an optional mock interview.
- **`/expand`**, **`/outcome`**, **`/html-report`**, **`/notion-sync`**, **`/gmail-sync`**, **`/add-portal`**, **`/add-template`**, **`/reset`** — profile enrichment, outcome tracking, a dashboard, syncs and customisation.

Most of this runs comfortably on a free agentic tier, because the heavy lifting is text: parsing a posting, assessing fit, drafting. The one genuinely demanding step is drafting LaTeX and iterating on compiled PDFs — see section 5.5 for what a local model can and cannot do here.

### 3.2 Spanish-market AI job tools

- **RadarJobs** ([radarjobs.ai](https://radarjobs.ai/)) — a Spanish "personal radar" that explains the fit per posting, covering the Spanish tech corpus, and it was **free in beta** at the time of writing. *Verify current availability and pricing.*
- **InfoJobs AI** ([infojobs.net](https://www.infojobs.net/)) — Spain's largest portal. Its internal **AI fit scoring is free**, and it has a nice privacy touch: your salary expectation is never shown to the employer. Search is free.
- **Tecnoempleo** ([tecnoempleo.com](https://www.tecnoempleo.com/)) — the specialist IT/telecoms portal. Free to search and apply. A Spanish portal skill for it ships in this repo under `.agents/skills/`.
- **LinkedIn** — conversational job search is **free**; the deeper AI "how well you match" analysis sits in **Premium** (~€40/month). Do not pay for it while you are broke.
- **Talent.com** ([talent.com](https://es.talent.com/)) — free aggregator with salary data.
- **Jobcopilot / Jobloo / Sorce / LazyApply** — AI job-search and auto-apply apps. Some have free tiers (Jobloo advertises up to 50 applications/day free; Sorce ~40 swipes/day), but **auto-apply tools are paid, often breach portal terms, and are not recommended here**. Treat their free claims sceptically.

> **Could not verify:** the guide brief mentioned a Spanish tool called **"Ajos"**. Repeated web searches found no such AI job-search product — the word only appears in unrelated contexts (garlic harvesting, etc.). It may be a confusion with a different name. **Ajos does not appear to exist as a job-search tool; verify before trusting any mention of it.**

### 3.3 CV builders with real free tiers

| Builder | URL | Free tier | Notes |
|---|---|---|---|
| Europass | europass.europa.eu | Fully free | The reference CV for Europe; issue it in Spanish and English |
| FlowCV | flowcv.com | Free plan | Clean ATS-friendly templates; check how many free resumes/exports |
| Reactive Resume | rxresu.me | Fully free, open source (MIT) | No ads, no paid tier; self-hostable via Docker |
| JSON Resume | jsonresume.org | Free, open standard | Portable data; pairs with free themes |
| Canva CV | canva.com/resumes | Free with free elements | PDF download is free if you use only free elements; ~20 AI uses/month |

### 3.4 ATS checkers with useful free tiers

| Checker | URL | Free tier | Notes |
|---|---|---|---|
| Jobscan | jobscan.co | ~5 scans/month | Best job-description keyword matching; paywalled fast |
| Teal | tealhq.com | Generous free tier | ~90% of features free, including Match Mode and a job tracker |
| Huntr | huntr.co | Free tier | Job tracker plus resume tools |
| Resume Worded | resumeworded.com | Limited free | General score + line feedback free; targeted matching is premium |

ATS-checking is one of the few places a free tool beats a free chat model, because the checker knows how real parsers behave. But be honest with yourself about what the score means: the same healthy CV can score 15–20 points differently between tools. Use it as a keyword-gap check, never as a reason to stuff keywords.

### 3.5 Interview preparation

> **Important correction.** **Google's "Interview Warmup" has been shut down.** It was removed during 2026; the old link (`grow.google/certificates/interview-warmup/`) no longer offers it. Do not plan around it. If a paid tool or a tutorial still points you to it, it is out of date.

Free replacements:

- **Use a free chat model** as a mock interviewer. Paste the job posting and ask it to interview you in Spanish, question by question, then critique your answers. This is free with Gemini, ChatGPT, DeepSeek, Qwen or a local model.
- **Use this repo's `/interview`** command, which builds a stage-specific prep pack from your own tracked applications.
- **Grow with Google** ([grow.google](https://grow.google/)) still publishes free interview-preparation articles and tactics, even though the Warmup tool is gone.

### 3.6 Cover-letter helpers

There is no free dedicated cover-letter tool worth paying attention to; the best free approach is a **free chat model plus this repo's `/apply`**, which drafts a cover letter grounded strictly in your real profile and then checks it for fabrication. See section 11 (never fabricate).

### 3.7 Using free chat models well

- Give the model the **posting text and your CV text** in the same message, and ask for a gap analysis before it writes anything.
- Ask it to **quote the exact line of your CV** that supports each claim, so you can catch a hallucination.
- Keep a **"master facts" document** with your real numbers and achievements, and paste it every time. This is exactly what this repo's profile files are for.

## 4. Installing the command-line AIs for free (Windows, Linux, macOS)

You do not need all of these. Pick one free CLI agent plus the basics.

### 4.1 The minimum viable setup

**Node.js + npm + one free CLI + git.** That is enough to clone this repo, run the portal CLIs, and drive the workflow with opencode, Qwen Code, Codex or Antigravity. Add Python 3 only if you want Aider or the repo's Python helper tools (`tools/*.py`).

### 4.2 Prerequisites

| Tool | Windows | macOS | Linux |
|---|---|---|---|
| **Node.js + npm** | `winget install OpenJS.NodeJS.LTS` | `brew install node` | `sudo apt install nodejs npm` (Debian/Ubuntu), `sudo dnf install nodejs npm` (Fedora) |
| **Bun** (optional, faster) | `powershell -c "irm bun.sh/install.ps1 | iex"` | `curl -fsSL https://bun.sh/install | bash` | `curl -fsSL https://bun.sh/install | bash` |
| **Python 3** | `winget install Python.Python.3.12` | `brew install python` | `sudo apt install python3 python3-pip` |
| **Git** | `winget install Git.Git` | `brew install git` (or `xcode-select --install`) | `sudo apt install git` |
| **WSL2** (Windows, recommended) | `wsl --install` in an admin PowerShell, then reboot | — | — |

Package managers for Windows: **winget** is built into Windows 10/11 (App Installer); **Chocolatey** ([chocolatey.org](https://chocolatey.org/)) and **Scoop** ([scoop.sh](https://scoop.sh/)) are alternatives. macOS: **Homebrew** ([brew.sh](https://brew.sh/)). Linux: **apt** (Debian/Ubuntu), **dnf** (Fedora/RHEL), **pacman** (Arch).

Verify your tools:

```bash
node --version
npm --version
python3 --version
git --version
```

### 4.3 The command-line AIs

| Agent | Install | Free path | Notes |
|---|---|---|---|
| **Antigravity CLI** | `curl -fsSL https://antigravity.google/cli/install.sh | bash` | Free individual tier | Google's successor to Gemini CLI |
| **Qwen Code** | `npm install -g @qwen-code/qwen-code@latest` | CLI free; cloud free tier ended | Needs Node 22+; point at your own/local model |
| **Codex CLI** | `npm install -g @openai/codex` or `brew install codex` | Limited free (verify) | ChatGPT account or API key |
| **opencode** | `curl -fsSL https://opencode.ai/install | bash` or `npm install -g opencode-ai` | Free CLI; use a free/local model | Also `brew install anomalyco/tap/opencode`, `choco/scoop install opencode`, `sudo pacman -S opencode` |
| **Aider** | `python -m pip install aider-install && aider-install` | Free; use free/local model | Also `pipx install aider-chat`, `brew install aider` |
| **Claude Code** | `curl -fsSL https://claude.ai/install.sh | bash` | **No free tier** | Needs Pro/Max/Team/Enterprise/Console |
| **Cline / Roo / Kilo** | VS Code marketplace | Extension free (BYOK) | Point at a free key or Ollama |
| **Continue** | VS Code / JetBrains marketplace | Extension free (BYOK) | Good local-model UX |
| **Goose** | `curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash` | Free, BYOK | Rust-built agent |

**Gemini CLI note:** `npm install -g @google/gemini-cli` still installs the package, but for free/individual accounts it no longer serves requests (retired 18 June 2026). Use it only with a paid API key or Vertex AI.

## 5. Ollama: a language model on your own machine

### 5.1 What Ollama is

[Ollama](https://ollama.com/) is the easiest way to download and run open-weight language models **locally**. It runs a small server on your machine (default `http://localhost:11434`) with a CLI and an **OpenAI-compatible API**, so most AI tools can talk to it as if it were OpenAI. It is free, open-source, and requires no account for local models.

### 5.2 Installing Ollama

- **macOS:** `brew install ollama`, or download the app from [ollama.com/download](https://ollama.com/download).
- **Linux:** `curl -fsSL https://ollama.com/install.sh | sh`. Then run it as a service: `sudo systemctl enable ollama && sudo systemctl start ollama`. Manual start: `ollama serve`.
- **Windows:** `irm https://ollama.com/install.ps1 | iex` in PowerShell, or download the installer. It runs as a background service.
- **Check:** `ollama --version`, then `ollama list`.

### 5.3 Pulling models

```bash
ollama pull llama3.2:3b
ollama pull qwen2.5:3b
ollama pull phi3.5
ollama pull gemma2:2b
ollama pull mistral:7b
ollama pull deepseek-r1:1.5b
ollama pull deepseek-r1:7b
ollama pull llava          # vision
ollama pull nomic-embed-text
```

> **Check the library.** The open-model field moves fast. Newer families — **qwen3, gemma3/gemma4, llama3.3, deepseek-v3** — now exist, and Ollama's own quickstart now recommends a small `gemma4` model as the starter. The tags above are still useful, but run `ollama list` / browse [ollama.com/library](https://ollama.com/library) for the current names.

### 5.4 RAM/VRAM guidance

Rule of thumb: a **4-bit** (Q4) model needs roughly **0.6 GB of RAM per billion parameters**, plus overhead for the context window and the OS. A machine with a dedicated GPU is much faster, but CPU-only works.

| Model tag | Approx. download | Minimum RAM (CPU) | Comfortable |
|---|---|---|---|
| qwen2.5:0.5b | ~0.4 GB | 2 GB | 4 GB |
| llama3.2:1b | ~1.3 GB | 3 GB | 4 GB |
| gemma2:2b | ~1.6 GB | 4 GB | 6 GB |
| qwen2.5:3b | ~1.9 GB | 4 GB | 8 GB |
| llama3.2:3b | ~2.0 GB | 4 GB | 8 GB |
| phi3.5 | ~2.2 GB | 4 GB | 6 GB |
| deepseek-r1:1.5b | ~1.1 GB | 3 GB | 4 GB |
| mistral:7b | ~4.1 GB | 8 GB | 16 GB |
| deepseek-r1:7b | ~4.7 GB | 8 GB | 16 GB |
| deepseek-r1:8b | ~5.2 GB | 10 GB | 16 GB |
| llava (vision) | ~4.7 GB | 8 GB | 12 GB |
| nomic-embed-text | ~0.3 GB | 2 GB | 4 GB |

Figures are indicative; the exact size depends on the quantisation tag and the context length you request.

### 5.5 Using Ollama with THIS repository: what a local model can and cannot do

**A local 3B–7B model can realistically do, offline:**

- **Summarising a job posting** — collapse a long ad into requirements, must-haves and red flags.
- **Drafting and translating text** — a first-draft cover-letter paragraph, or Spanish↔English translation of a posting.
- **Keyword extraction** — pull the skills an ATS will look for.
- **Mock interviews** — act as an interviewer and ask follow-ups.
- **`pdftotext` post-processing** — clean up or reformat extracted CV text.
- **First-pass fit triage** — a rough "is this worth a closer look" before you spend cloud quota.

**A local 3B–7B model genuinely cannot do well, and needs a strong cloud model:**

- **The full drafter–reviewer `/apply` pipeline.** It needs long-context reasoning, careful instruction-following across many turns, and reliable tool use. Small local models drift, forget the profile, and hallucinate.
- **Long-context reasoning** over a whole CV plus a long posting plus the framework specs at once.
- **LaTeX debugging.** Fixing a page-break or a font-fallback error in `.tex` requires precision that small models rarely deliver; you will spend more time correcting them than writing the file.
- **Any agentic multi-step run** where reliability matters. Local small models are also far weaker at the structured tool-calling that agents rely on.

**Honest summary:** use the local model for the cheap, high-volume, forgiving jobs (summary, translation, keywords, mock Q&A). Spend your free *cloud* quota on the demanding steps (`/apply`'s drafting and PDF iteration, company research, final review). This split is the whole trick to running the workflow at €0.

### 5.6 Wiring Ollama into a CLI agent

- **opencode** — create `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": { "baseURL": "http://localhost:11434/v1" },
      "models": { "qwen2.5:7b": { "name": "Qwen2.5 7B (local)" } }
    }
  }
}
```

- **Aider** — `aider --model ollama/qwen2.5:7b` (Aider talks to Ollama natively), or set `OPENAI_API_BASE=http://localhost:11434/v1` and `OPENAI_API_KEY=ollama`.
- **Cline / Roo / Kilo / Continue** — in the extension settings choose the **OpenAI Compatible** provider, Base URL `http://localhost:11434/v1`, any API key string, and the exact model name from `ollama list`.
- **Goose** — configure an OpenAI-compatible provider with the same base URL.
- **Ollama's own launcher** — newer Ollama builds can start an agent for you: `ollama launch opencode`, `ollama launch claude`, `ollama launch codex`.
- **The server** — `ollama serve` starts it; set `OLLAMA_HOST` to change the bind address (e.g. to expose it to another machine on your LAN).

### 5.7 Trade-offs to expect

- **Context window.** Local models often use a smaller effective context than cloud models; they will drop the middle of a long prompt.
- **No reliable tool use / agentic behaviour.** Expect to do more manual step-by-step work.
- **Speed.** On CPU, small models may run at only a few tokens per second — fine for short answers, painful for long drafts.
- **Quality.** A 3B model writes like a 3B model. Do not send its raw output anywhere without reading it.

## 6. Old hardware: running a useful model below 8th-gen (and below 5th-gen) Intel

The honest headline: on old CPU-only machines you *can* run a small model, but you will feel every limitation. If your machine is genuinely ancient, the free **cloud** tiers in section 2 will serve you better than a local model. Use the local model for offline/privacy work, and the cloud for quality.

### 6.1 Tier A — below 8th-gen Intel (4th–7th gen i5/i7), 8 GB RAM, no dGPU

- **Quantisation:** prefer **Q4_K_M** (the good balance). If RAM is tight, **Q3_K_M**.
- **Models:** `llama3.2:3b`, `qwen2.5:3b`, `phi3.5`, `deepseek-r1:1.5b`; a 7B such as `mistral:7b` only if you have 16 GB.
- **Expected speed (CPU):** roughly **2–8 tokens/second** for 3B models, lower for 7B.
- **Verdict:** usable for summaries, translations and mock interviews. Too slow and too error-prone for full agentic runs.

### 6.2 Tier B — below 5th-gen Intel (2nd–4th gen), 4–8 GB RAM

- **Quantisation:** **Q3** and **Q2_K** to fit the RAM; quality drops noticeably at Q2.
- **By RAM:**
  - **4 GB:** `qwen2.5:0.5b`, `llama3.2:1b`, `gemma:2b`.
  - **8 GB:** `llama3.2:3b`, `qwen2.5:3b`, `phi3.5`, `deepseek-r1:1.5b`.
  - **16 GB (if you have it):** `qwen2.5:7b`, `llama3.1:8b`, `mistral:7b` at 4-bit.
- **Expected speed:** **1–4 tokens/second** for 1B–3B models; a 7B may be under 1 tok/s.
- **Verdict:** a 1B model is genuinely useful only for terse tasks. Treat it as a helper, not an assistant.

### 6.3 Tuning and housekeeping

- **`num_ctx`** — the context window in tokens. Lower it (e.g. 2048 or 4096) to save RAM and speed things up. Set it per run, e.g. `ollama run llama3.2:3b --parameter num_ctx 4096` or via a Modelfile.
- **`num_thread`** — match your **physical** CPU cores (not hyperthreads). Too many threads slows things down.
- **Keep models on disk** — `OLLAMA_MODELS` lets you point the model store at a larger disk, e.g. `export OLLAMA_MODELS=/mnt/bigdisk/ollama`. On Windows set it as a system environment variable.
- **CPU-only expectations** — a few tokens per second is normal. Do not assume your machine is broken.
- **Swap risk** — if a model does not fit in RAM, the OS starts swapping to disk and the machine becomes unusable. If you see the disk light pinned, stop and pick a smaller model or a lower quantisation.
- **Thermals and old batteries** — sustained CPU inference heats the machine and drains the battery. Use it plugged in, on a hard surface, and give it breaks. On an old laptop, thermal throttling can halve your already-low speed.
- **The realistic alternative:** on Tier B hardware, skip local models for anything important and use the **free cloud tiers** (Antigravity, ChatGPT free, Gemini, DeepSeek, Qwen, Copilot). They are faster, smarter and cost nothing.

### 6.4 32-bit-only machines

**Ollama ships no 32-bit (ia32) build.** If your machine is 32-bit-only (some very old Windows XP/Vista-era laptops and a few old netbooks), you cannot run Ollama at all. **What to do instead:**

- Use **free web chats** in a browser (they do the inference on the server, so your CPU only has to render a page).
- Use a **phone** with a small on-device app (see PocketPal/MLC in section 7).
- If the machine can run a lightweight Linux and a 32-bit `llama.cpp` build exists for it, that is the only local route — but expect it to be extremely slow. *Verify your specific architecture before spending time on it.*
- Honestly? On a 32-bit-only machine, treat the **cloud free tiers as your only practical AI**, and use the machine for browsing and writing.

## 7. Alternatives and complementary programs to Ollama

### 7.1 Comparison table

| Tool | OS | 32-bit? | RAM needed | Notes |
|---|---|---|---|---|
| **Ollama** | Win, macOS, Linux | No | 2 GB+ (tiny) to 16 GB+ | CLI + OpenAI-compatible API; the default choice |
| **LM Studio** | Win, macOS, Linux | No | 6 GB+ | Polished GUI, model browser, server on :1234; closed-source |
| **llamafile** | Win, macOS, Linux (64-bit) | No | 4 GB+ | One executable = model + runtime + server; no install |
| **Jan** | Win, macOS, Linux | No | 4 GB+ | Open-source, zero telemetry; privacy-first |
| **GPT4All** | Win, macOS, Linux | No | 4 GB+ | Smallest install; built-in document chat (LocalDocs) |
| **LocalAI** | Win, macOS, Linux, Docker | No | 4 GB+ | OpenAI drop-in API, also TTS/STT/image |
| **llama.cpp / llama-server** | Win, macOS, Linux | Rare 32-bit builds | 2 GB+ | The engine under many tools; deepest control |
| **vLLM** | Linux | No | **GPU required** | High-throughput serving; not for old hardware |
| **text-generation-webui (oobabooga)** | Win, macOS, Linux | No | 6 GB+ | Power-user web UI, many loaders |
| **KoboldCpp** | Win, macOS, Linux | No | 4 GB+ | Single-file, strong for creative writing |
| **Msty** | Win, macOS, Linux | No | 6 GB+ | Polished desktop workspace, multi-model |
| **AnythingLLM** | Win, macOS, Linux | No | 6 GB+ | Document workspaces + agents over Ollama/LM Studio |
| **Open WebUI** | Docker/Linux | No | 4 GB+ | Self-hosted ChatGPT-style front end for Ollama |
| **PocketPal / MLC-LLM** | iOS, Android | N/A | Phone RAM | Runs small models **on your phone** |

### 7.2 If you decide not to run anything locally

Free, no-install routes to real models:

- **Free web chats** — Gemini, ChatGPT free, Copilot, DeepSeek, Qwen Chat, Mistral, Grok, Perplexity, Poe.
- **Google Colab** ([colab.research.google.com](https://colab.research.google.com/)) — free tier with limited weekly GPU hours (historically T4-class). Good for a one-off run of a bigger model, not for daily use.
- **Google AI Studio API** — free API key tier (Flash-class models); *check current limits*.
- **Vertex AI Express mode** — 90 days free within quotas, no billing account, for new Google Cloud users with a @gmail.com account (verify). A $300 Google Cloud free credit exists but, since around March 2026, does not cover the standalone Gemini API — only Vertex.
- **Groq** ([groq.com](https://groq.com/)) — free tier with very fast inference on open models.
- **Cerebras** ([cerebras.ai](https://www.cerebras.ai/)) — free tier on its hosted open models.
- **OpenRouter** ([openrouter.ai](https://openrouter.ai/)) — one API key, 20+ free models; free tier around **20 requests/minute and 50/day**, rising to ~1,000/day after a one-time $10 top-up. The `:free` model roster changes often.

## 8. Google Antigravity and its alternatives for job-search automation on a budget

Antigravity (section 2.1) is currently the most generous free agentic tier for driving this repository, but it is not the only option. Here is how to choose.

| Tool | Type | Free tier | Best for | Pick this if… |
|---|---|---|---|---|
| **Google Antigravity** | IDE + CLI + agent manager | Free individual tier, weekly agent cap | Driving the full `/apply` workflow | You want one free tool that can run multi-step tasks |
| **opencode** | Terminal agent | CLI free, BYOK/local | All three OSes, scriptable | You like the terminal and want model freedom |
| **Qwen Code** | Terminal agent | CLI free, BYOK/local | Long-context coding | You already use Qwen or want a Gemini-CLI-style tool |
| **Aider** | Terminal agent | Free, BYOK/local | Git-aware editing, works with Ollama | Your project is a Git repo (this one is) |
| **Kilo Code / Cline** | VS Code extension | Extension free, BYOK/local | Editing the LaTeX CV/cover letter visually | You prefer a GUI inside VS Code |
| **Continue** | VS Code/JetBrains | Extension free, BYOK/local | Mixing local and cloud models | You want one panel for both |
| **Goose** | CLI + desktop | Free, BYOK | MCP-heavy workflows | You want a Rust-fast agent |
| **Trae** | IDE | Free tier (ByteDance) | A Cursor-like feel for free | You want a polished IDE and can accept the trade-offs |
| **Cursor (Hobby)** | IDE | Limited free | Trying an agentic IDE | You might upgrade later |
| **Windsurf** | IDE | ~25 actions/month free | Occasional agentic edits | Your usage is light |
| **GitHub Copilot** | IDE extension | 2,000 completions + 50 chats/month | Autocomplete while editing LaTeX | You are a student/OSS contributor already |

**Simple rule:** if you want the least friction and the most capability for free, **start with Antigravity**. If you want to run mostly offline or on an old machine, pair a thin terminal agent (**opencode** or **Aider**) with a **local Ollama model**, and keep a free cloud tier for the hard steps.

## 9. Finding work with AI when money is very tight

### 9.1 Free upskilling (Spain)

- **Fundación Telefónica — Conecta Empleo** ([fundaciontelefonica.com](https://www.fundaciontelefonica.com/)) — free digital-skills and employability courses, including AI and data.
- **Fundae** ([fundae.es](https://www.fundae.es/)) — the state training foundation. The free portals **Experiencia Fundae** ([experienciafundae.es](https://experienciafundae.es/)) and **eFundae** ([efundae.es](https://www.efundae.es/)) offer subsidised, 100%-free courses in AI, cybersecurity, digital marketing and more.
- **SEPE-funded training** ([sepe.es](https://www.sepe.es/)) — free courses for employed and unemployed people, delivered through your regional employment service.
- **Google Career Certificates / Grow with Google** ([grow.google](https://grow.google/)) — free courses and, in some programmes, scholarships.
- **Microsoft Learn** and **Meta Blueprint** — free learning paths (certification exams may be paid).
- **freeCodeCamp** ([freecodecamp.org](https://www.freecodecamp.org/)) and **CS50** ([cs50.harvard.edu](https://cs50.harvard.edu/)) — fully free, high quality.
- **Coursera audit mode** — watch lectures for free; you only pay if you want the certificate.

Use this repository's **`/upskill`** to turn the jobs you have actually tracked into a prioritised learning plan, then **`/rank`** to focus your effort on the roles where you are closest to qualifying.

### 9.2 Spanish public employment services

- **SEPE** ([sepe.es](https://www.sepe.es/)) — the state public employment service: unemployment benefits, job search, training.
- **Your regional service** — each autonomous community has its own: e.g. SEPE plus the *Servicio Público de Empleo* of your community (Madrid, Cataluña/SOC, Andalucía/SAE, País Vasco/Lanbide, etc.). Register with your regional service, not just SEPE.
- **Garantía Juvenil** — the EU Youth Guarantee for people aged **18–29**: free training, apprenticeships and job support. Requirements include being enrolled/registered in Spain; *verify current conditions*.
- **EURES** ([eures.europa.eu](https://eures.europa.eu/)) — the European job-mobility network. Free, and it lists jobs across the EU, plus **Targeted Mobility Scheme** support for interviews, relocation and language courses. Pair it with a **Europass** CV.

### 9.3 Speculative applications and remote work

- **Speculative applications** work well with AI: research a company's public roadmap, then send a short, specific letter to a named person. Use `/apply` with a pasted job description or a research summary as the "posting".
- **Remote work for foreign companies** often pays more than the Spanish market for the same work. Search the country-agnostic portals in this repo (LinkedIn, freehire) and EURES. Check the tax and *autónomo* implications if you invoice a foreign client (section 9.5).

### 9.4 Freelance platforms with free tiers

| Platform | Free to join? | Notes |
|---|---|---|
| **Malt** | Yes | The best-known marketplace for Spanish tech/consulting freelancers |
| **Workana** | Yes | Strong in Spain and Latin America |
| **Upwork** | Yes | Broadest category coverage; takes a service fee on earnings |
| **Freelancer.com** | Yes | Large; competitive |
| **Fiverr** | Yes | Sell packaged "gigs"; good for repeatable services |

All charge fees on what you earn (never to join). Budget for that, and remember that invoicing as a freelancer in Spain generally means registering as *autónomo* (section 9.5).

### 9.5 The e-commerce / online-income ramp-up path (Spanish specifics)

If you want to build online income *while* you job-hunt, here is the Spanish reality. **This is orientation, not legal or tax advice — confirm everything with AEAT, Seguridad Social and a professional.**

- **Dropshipping is legal in Spain**, but it is not obligation-free. You must comply with online-commerce rules: **alta en Hacienda** (census registration), VAT (IVA) rules, consumer-protection law, and data-protection (RGPD) obligations.
- **The 2026 VAT shift.** From **1 July 2026**, an intermediary facilitating a sale must collect the VAT and remit it to Hacienda through the **One-Stop Shop (OSS / Ventanilla Única)**. This changes the numbers for marketplace-based dropshipping — verify how it applies to you.
- **Autónomo vs "marginal".** Selling occasionally and without a habitual, profit-seeking activity can sometimes fall outside mandatory *autónomo* registration, but selling regularly, buying to resell, or using a marketplace makes registration the safe and usually required path. **If in doubt, register** — undeclared activity carries back-taxes and penalties.
- **High of alta.** Registering as *autónomo* (RETA) is done through **Import@ss**. The **tarifa plana** in 2026 is about **€80/month for the first 12 months** (plus the MEI, an intergenerational-equity charge of ~0.9%, giving a total around **€88.64/month**). It can be extended to 24 months if your net income stays below the SMI, and some regions offer a **"cuota cero"** rebate. *Verify current figures — they change.*
- **Pluriactivity.** If you are also employed, there are reduced-base options (roughly 50% off for the first 18 months at full-time employment, less at part-time). *Verify.*
- **The honest warning.** E-commerce is not passive income. Spanish dropshipping is competitive, thin-margin and increasingly regulated. Treat it as a bridge, not a rescue.

## 10. A realistic 30-day plan at €0

**Week 1 — set up and profile**

- [ ] Day 1: Install Node.js/npm and Git. Run `node --version` and `git --version`.
- [ ] Day 2: Install **one** free CLI agent (Antigravity CLI, or opencode).
- [ ] Day 3: Clone this repository and run `/setup`; fill in your profile honestly.
- [ ] Day 4: Register for two free clouds — e.g. Google (Antigravity/Gemini) and DeepSeek or Qwen.
- [ ] Day 5: Write your "master facts" file (or let `/setup` build it). Real numbers only.
- [ ] Day 6: Build a clean ATS-friendly CV in Europass or Reactive Resume.
- [ ] Day 7: Rest. Skim the repo's README and `/apply` docs.

**Week 2 — find and triage**

- [ ] Day 8: Run `/scrape`; let the portal CLIs find fresh postings.
- [ ] Day 9: Run `/rank`; pick your top 5.
- [ ] Day 10: For each top job, ask a free chat model for a gap analysis against your CV.
- [ ] Day 11–12: Run `/upskill`; start the first learning item (a free Fundae/Telefónica course).
- [ ] Day 13: Check your CV against a job description with a free ATS checker (Teal or Jobscan free).
- [ ] Day 14: Rest.

**Week 3 — apply properly**

- [ ] Day 15: `pip`-install or set up the tools `/apply` needs (LaTeX if you want PDFs).
- [ ] Day 16–17: Run `/apply` on two jobs — one "safe", one "stretch". Read every word before sending.
- [ ] Day 18: Tailor one speculative application to a company you admire.
- [ ] Day 19: Register with your regional employment service and check **Garantía Juvenil** eligibility.
- [ ] Day 20: Create a Malt or Workana profile (free).
- [ ] Day 21: Rest.

**Week 4 — interviews and follow-through**

- [ ] Day 22: Run `/interview` on your best application; do a mock interview with a free model.
- [ ] Day 23: Fix the weak answers the mock exposed.
- [ ] Day 24: Apply to 3–5 more jobs with `/apply`.
- [ ] Day 25: Set up the free ATS checker routine and a simple tracker.
- [ ] Day 26: Follow up on every application older than a week.
- [ ] Day 27: Review what is working; adjust your target roles.
- [ ] Day 28: Rest.
- [ ] Day 29: Check EURES for EU-wide roles.
- [ ] Day 30: Plan the next 30 days; keep the routine, drop what did not work.

**The checklist that matters**

- [ ] You can run one free CLI agent and one free web chat.
- [ ] Your profile is honest and complete.
- [ ] Your CV passes a free ATS read and is readable by a human.
- [ ] You apply to fewer jobs, better, rather than 50 generic ones.
- [ ] You never fabricate experience.
- [ ] You keep a low, respectful scraping volume.
- [ ] You review your data-sharing settings.

## 11. Ethics and limits

**Never fabricate experience.** Not a skill, not a metric, not a date, not a language level. This repository's `/apply` refuses to invent claims, and you should too: a fabricated CV is grounds for instant dismissal even years later, and it destroys the reference you will need next time. If you did not do it, it does not go in the document.

**Respect the portals' terms of service.** The Spanish portal skills in this repository are for **personal, low-volume use**. Read each portal's terms. Do not scrape at scale, do not hammer endpoints, do not bypass login walls, and do not use mass auto-apply tools that violate a site's rules. Getting your account banned loses you the network you need.

**Keep your scraping volume low.** A few searches a day, spaced out, is plenty. If you automate this repository's `/scrape`, leave the polite delays in place and never run it on a schedule tight enough to look like a bot.

**Protect your privacy.** A job search generates sensitive data: your address, phone, ID, salary history, sometimes health or family details. Before you paste anything into a cloud model, ask whether you would be comfortable with it appearing in a training set. Prefer local models (section 5) for anything genuinely private. Review the data-sharing settings of every tool you register for, and remember that several free tiers state they may use your input to improve their models. Share your **own** data only; never upload someone else's CV or personal data.

**The scam warning.** This project has **no affiliated cryptocurrency, token, or paid sponsorship programme.** Anything claiming otherwise is unauthorised and should be treated as a scam. Be equally sceptical of "guaranteed job" services, paid "AI recruiter" access, and anyone who asks you to pay to apply. The only legitimate ways to support this project are contributing on GitHub or the Ko-fi link in the README.

**Honesty about the tooling.** Free tiers change, local models are slow, and no AI will get you a job by itself. This guide is a way to do more with less — not a promise. Read the limits, verify the turns of phrase marked *"verify"*, and keep your own judgement in the loop.
EOF
