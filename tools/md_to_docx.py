#!/usr/bin/env python3
import argparse
import html
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path


def markdown_to_html(md_path: Path, html_path: Path) -> None:
    with md_path.open("r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    lines = content.splitlines()
    i = 0
    out = []
    out.append('<!DOCTYPE html>')
    out.append('<html lang="es">')
    out.append('<head>')
    out.append('  <meta charset="UTF-8">')
    out.append('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    out.append('  <title>' + html.escape(md_path.stem) + '</title>')
    out.append('  <style>')
    out.append('    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; }')
    out.append('    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }')
    out.append('    code { background: #f4f4f4; padding: 2px 4px; font-family: "Courier New", monospace; }')
    out.append('    pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }')
    out.append('    pre code { background: none; padding: 0; }')
    out.append('    blockquote { border-left: 3px solid #ccc; margin: 1em 0; padding-left: 10px; color: #555; }')
    out.append('    table { border-collapse: collapse; width: 100%; margin: 1em 0; }')
    out.append('    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }')
    out.append('    th { background: #f4f4f4; }')
    out.append('    ul, ol { padding-left: 2em; }')
    out.append('    hr { border: none; border-top: 1px solid #ddd; margin: 1em 0; }')
    out.append('    a { color: #0366d6; }')
    out.append('    @media print { body { margin: 0; padding: 15px; max-width: 100%; } pre { background: #fff; } code { background: #f4f4f4; } }')
    out.append('  </style>')
    out.append('</head>')
    out.append('<body>')

    in_code = False
    code_lang = ''
    while i < len(lines):
        line = lines[i]
        # Check fenced code block
        m_fence = re.match(r'^```(\w*)$', line)
        if m_fence:
            if in_code:
                out.append('    </code></pre>')
                in_code = False
                code_lang = ''
            else:
                code_lang = m_fence.group(1) or ''
                out.append(f'    <pre><code class="language-{code_lang}">')
                in_code = True
            i += 1
            continue
        if in_code:
            out.append(html.escape(line))
            out.append('\n')
            i += 1
            continue
        # Check table
        if i + 1 < len(lines) and '|' in line and '---' in lines[i+1] and '|' in lines[i+1]:
            # Parse table header
            header_cells = [cell.strip() for cell in line.split('|') if cell.strip() != '' or len([c for c in line.split('|')])>1]
            # Fix split
            header_parts = [p.strip() for p in line.split('|')]
            if header_parts and header_parts[0] == '':
                header_parts = header_parts[1:]
            if header_parts and header_parts[-1] == '':
                header_parts = header_parts[:-1]
            out.append('    <table>')
            out.append('      <thead><tr>')
            for hp in header_parts:
                out.append(f'        <th>{html.escape(hp)}</th>')
            out.append('      </tr></thead>')
            out.append('      <tbody>')
            i += 2
            while i < len(lines):
                tl = lines[i].strip()
                if tl == '' or tl.startswith('#') or tl.startswith('```') or re.match(r'^[-*+]\s', tl) or re.match(r'^\d+\.', tl):
                    break
                if tl.startswith('|'):
                    parts = [p.strip() for p in tl.split('|')]
                    if parts and parts[0] == '':
                        parts = parts[1:]
                    if parts and parts[-1] == '':
                        parts = parts[:-1]
                else:
                    parts = [p.strip() for p in tl.split('|')]
                out.append('        <tr>')
                for p in parts:
                    out.append(f'          <td>{format_inline(p)}</td>')
                out.append('        </tr>')
                i += 1
            out.append('      </tbody></table>')
            continue
        # Check heading
        m_h = re.match(r'^(#{1,6})\s+(.+)$', line)
        if m_h:
            level = len(m_h.group(1))
            text = m_h.group(2).strip()
            out.append(f'    <h{level}>{format_inline(text)}</h{level}>')
            i += 1
            continue
        # Check horizontal rule
        if re.match(r'^[-*_]{3,}$', line.strip()):
            out.append('    <hr>')
            i += 1
            continue
        # Check blockquote
        if re.match(r'^>\s*(.+)$', line.strip()):
            bq_lines = []
            while i < len(lines) and re.match(r'^>\s*(.*)$', lines[i].strip()):
                bq_lines.append(re.sub(r'^>\s*', '', lines[i].rstrip()))
                i += 1
            out.append('    <blockquote>')
            for bl in bq_lines:
                if bl.strip() == '':
                    out.append('    <br>')
                else:
                    out.append(f'    <p>{format_inline(bl)}</p>')
            out.append('    </blockquote>')
            continue
        # Check unordered list
        if re.match(r'^[-*+]\s+(.+)$', line.strip()):
            out.append('    <ul>')
            while i < len(lines):
                m_ul = re.match(r'^[-*+]\s+(.+)$', lines[i].strip())
                if not m_ul:
                    break
                out.append(f'      <li>{format_inline(m_ul.group(1))}</li>')
                i += 1
            out.append('    </ul>')
            continue
        # Check ordered list
        if re.match(r'^\d+\.\s+(.+)$', line.strip()):
            out.append('    <ol>')
            while i < len(lines):
                m_ol = re.match(r'^\d+\.\s+(.+)$', lines[i].strip())
                if not m_ol:
                    break
                out.append(f'      <li>{format_inline(m_ol.group(1))}</li>')
                i += 1
            out.append('    </ol>')
            continue
        # Empty line
        if line.strip() == '':
            out.append('    <br>')
            i += 1
            continue
        # Regular paragraph
        out.append(f'    <p>{format_inline(line)}</p>')
        i += 1

    out.append('</body>')
    out.append('</html>')
    with html_path.open("w", encoding="utf-8") as f:
        f.write('\n'.join(out))


def format_inline(text: str) -> str:
    # Escape first so no raw HTML leaks through.
    text = html.escape(text, quote=False)
    # Protect inline code with placeholders so emphasis rules never reach inside it.
    code_spans: list[str] = []

    def _stash_code(match: "re.Match[str]") -> str:
        code_spans.append(match.group(1))
        return f"\x00CODE{len(code_spans) - 1}\x00"

    text = re.sub(r'`([^`]+)`', _stash_code, text)
    # Links: protect the URL, then apply emphasis to the label.
    links: list[tuple[str, str]] = []

    def _stash_link(match: "re.Match[str]") -> str:
        links.append((match.group(1), match.group(2)))
        return f"\x00LINK{len(links) - 1}\x00"

    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', _stash_link, text)
    # Bold and italic.
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__([^_]+)__', r'<strong>\1</strong>', text)
    text = re.sub(r'(?<!\w)\*([^*\n]+)\*(?!\w)', r'<em>\1</em>', text)
    text = re.sub(r'(?<![\w_])_([^_\n]+)_(?![\w_])', r'<em>\1</em>', text)
    # Restore links.
    for idx, (label, url) in enumerate(links):
        label_html = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', label)
        placeholder = f"\x00LINK{idx}\x00"
        text = text.replace(placeholder, f'<a href="{html.escape(url, quote=True)}">{label_html}</a>')
    # Restore inline code.
    for idx, code in enumerate(code_spans):
        text = text.replace(f"\x00CODE{idx}\x00", f"<code>{code}</code>")
    return text


def main():
    parser = argparse.ArgumentParser(description="Convert Markdown to DOCX and PDF")
    parser.add_argument("file", help="Markdown file to convert")
    parser.add_argument("--outdir", default=".", help="Output directory")
    parser.add_argument("--formats", default="docx,pdf", help="Formats to generate")
    args = parser.parse_args()

    md_path = Path(args.file).resolve()
    if not md_path.exists():
        print(f"Error: {md_path} not found", file=sys.stderr)
        sys.exit(1)

    outdir = Path(args.outdir).resolve()
    outdir.mkdir(parents=True, exist_ok=True)

    tmpdir = Path(tempfile.mkdtemp(prefix="opencode_", dir="/tmp/opencode")) if os.path.exists("/tmp/opencode") else Path(tempfile.mkdtemp(prefix="opencode_"))
    html_path = tmpdir / f"{md_path.stem}.html"
    markdown_to_html(md_path, html_path)

    formats = [f.strip() for f in args.formats.split(",")]
    libreoffice = "/usr/bin/libreoffice"
    if not os.path.exists(libreoffice):
        print(f"Error: LibreOffice not found at {libreoffice}", file=sys.stderr)
        sys.exit(1)

    for fmt in formats:
        if fmt == "docx":
            cmd = [
                libreoffice, "--headless",
                "--convert-to", "docx:MS Word 2007 XML",
                "--outdir", str(outdir),
                str(html_path)
            ]
        elif fmt == "pdf":
            cmd = [
                libreoffice, "--headless",
                "--convert-to", "pdf",
                "--outdir", str(outdir),
                str(html_path)
            ]
        else:
            continue
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error converting to {fmt}:", file=sys.stderr)
            print(e.stderr, file=sys.stderr)
            sys.exit(1)
        # Verify output
        out_file = outdir / f"{md_path.stem}.{fmt}"
        if not out_file.exists():
            print(f"Error: expected output {out_file} not created", file=sys.stderr)
            sys.exit(1)
        size = out_file.stat().st_size
        if size < 1000:  # non-trivial threshold
            print(f"Warning: {out_file} is very small ({size} bytes)", file=sys.stderr)
        print(f"Generated {out_file} ({size} bytes)")

    # Clean up
    try:
        html_path.unlink()
        tmpdir.rmdir()
    except Exception:
        pass


if __name__ == "__main__":
    main()
