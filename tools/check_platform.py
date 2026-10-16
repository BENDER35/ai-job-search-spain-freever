#!/usr/bin/env python3
"""Report whether this machine can run the AI Job Search toolchain.

Run from anywhere:

    python3 tools/check_platform.py

The report answers four questions and exits 0 either way - it is a report, not
a gate, so a missing tool is diagnosed rather than treated as a failure:

  a. Python tools      - this repo's helpers need CPython 3.10+ (and nothing but
                         the standard library, which is why this script imports
                         no third-party package and runs on a bare interpreter).
  b. Bun portal CLIs   - the `.agents/skills/*/cli` TypeScript CLIs are built and
                         run with Bun. Bun publishes no ia32/armv7 builds, so a
                         32-bit host is honestly reported as unsupported.
  c. Node fallback     - where Bun is unavailable or unsupported, the CLIs run
                         under Node.js 22+ (`node --experimental-strip-types`) or
                         `npx tsx`.
  d. LaTeX             - `/apply` compiles the CV with lualatex and the cover
                         letter with xelatex.

See COMPATIBILITY.md for the full platform matrix and the runtime caveats.
"""

import platform
import shutil
import struct
import subprocess
import sys

MIN_PYTHON = (3, 10)
MIN_NODE = 22


def _force_utf8_output() -> None:
    """Write UTF-8 whatever the host's default encoding is (Windows cp1252)."""
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)  # absent on a StringIO under test
        if reconfigure:
            reconfigure(encoding="utf-8")


def _probe(name: str, *args: str) -> str | None:
    """Run `name args...` and return its first non-empty output line.

    Returns None when the binary is missing, errors, or times out - a probe
    must never turn a report into a crash.
    """
    exe = shutil.which(name)
    if not exe:
        return None
    try:
        res = subprocess.run(
            [exe, *args],
            capture_output=True,
            text=True,
            errors="replace",
            timeout=15,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    if res.returncode != 0:
        return None
    for line in res.stdout.splitlines():
        line = line.strip()
        if line:
            return line
    return None


def _major(version: str | None) -> int | None:
    """Parse the leading major version out of `v25.9.0` / `1.4.3`, else None."""
    if not version:
        return None
    token = version.lstrip("vV").split(".")[0]
    try:
        return int(token)
    except ValueError:
        return None


def _verdict(ok: bool, why: str) -> str:
    return f"supported ({why})" if ok else f"NOT supported ({why})"


def main() -> int:
    _force_utf8_output()

    system = platform.system() or "unknown"
    machine = platform.machine() or "unknown"
    bits = struct.calcsize("P") * 8
    is_64 = bits == 64

    py_version = platform.python_version()
    py_ok = sys.version_info[:2] >= MIN_PYTHON

    bun_version = _probe("bun", "--version")
    bun_ok = is_64 and bun_version is not None

    node_version = _probe("node", "--version")
    node_major = _major(node_version)
    node_ok = node_major is not None and node_major >= MIN_NODE

    lualatex = _probe("lualatex", "--version")
    xelatex = _probe("xelatex", "--version")
    latex_ok = lualatex is not None and xelatex is not None
    latex_partial = (lualatex is not None) ^ (xelatex is not None)

    print("AI Job Search - environment report")
    print("==================================")
    print(f"OS:            {system} {platform.release()}")
    print(f"Platform:      {platform.platform()}")
    print(f"Architecture:  {machine} ({bits}-bit)")
    print(f"Python:        {py_version} ({'64-bit' if is_64 else '32-bit'})")
    print()

    print("Toolchain support")
    print("-----------------")
    print(f"Python tools (>= {MIN_PYTHON[0]}.{MIN_PYTHON[1]}):      "
          f"{_verdict(py_ok, f'found {py_version}')}")

    if not is_64:
        bun_note = f"32-bit {machine}: Bun ships no ia32/armv7 builds - use the Node fallback"
    elif bun_version:
        bun_note = f"found bun {bun_version}"
    else:
        bun_note = "bun not on PATH - install from https://bun.sh (or use the Node fallback)"
    print(f"Bun portal CLIs:           {_verdict(bun_ok, bun_note)}")

    if node_version is None:
        node_note = "node not on PATH - install Node.js 22+ (or Bun)"
    elif node_ok:
        node_note = f"found node {node_version}"
    else:
        node_note = f"found node {node_version}, but 22+ is required for --experimental-strip-types"
    print(f"Node fallback (>= {MIN_NODE}):       {_verdict(node_ok, node_note)}")

    if latex_ok:
        latex_note = "lualatex and xelatex both present"
        latex_verdict = _verdict(True, latex_note)
    elif latex_partial:
        have = "lualatex" if lualatex else "xelatex"
        missing = "xelatex" if lualatex else "lualatex"
        latex_verdict = _verdict(False, f"only {have} found - the CV/cover letter needs both")
    else:
        latex_verdict = _verdict(False, "neither lualatex nor xelatex found")
    print(f"LaTeX (lualatex/xelatex):  {latex_verdict}")
    print()

    print("Detected runtimes")
    print("-----------------")
    print(f"Python:  {py_version}")
    print(f"Bun:     {bun_version or 'not found'}")
    print(f"Node:    {node_version or 'not found'}")
    print(f"lualatex: {lualatex or 'not found'}")
    print(f"xelatex:  {xelatex or 'not found'}")
    print()

    print("Next steps")
    print("----------")
    hints: list[str] = []
    if not py_ok:
        hints.append(f"Upgrade to CPython {MIN_PYTHON[0]}.{MIN_PYTHON[1]}+ - every tool under tools/ needs it.")
    if not bun_ok and not node_ok:
        hints.append("Install Bun (https://bun.sh) for the portal CLIs, or Node.js 22+ for the fallback path.")
    elif not bun_ok and node_ok:
        hints.append("No usable Bun: run the portal CLIs with Node instead "
                     "(node --experimental-strip-types src/cli.ts, or npx tsx src/cli.ts).")
    if bun_ok:
        hints.append("Install the portal CLIs: python3 tools/install_portal_clis.py")
    if not latex_ok:
        hints.append("Install a TeX distribution with lualatex and xelatex "
                     "(TeX Live, MiKTeX or MacTeX) for /apply.")
    if not hints:
        hints.append("Everything the full workflow needs is present - you are ready to run /setup.")
    for hint in hints:
        print(f"- {hint}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
