import { htmlFetch, parseJobDetail, DETAIL_BASE } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

function normalizeId(input: string): string | null {
  const trimmed = input.trim()
  if (/^\d+$/.test(trimmed)) return trimmed
  const urlMatch = trimmed.match(/\/empleo\/(\d+)/i)
  if (urlMatch) return urlMatch[1]
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    process.stderr.write(JSON.stringify({ error: "Could not parse an offer ID from input", code: "BAD_ID" }) + "\n")
    return 1
  }
  try {
    const url = `${DETAIL_BASE}/${id}`
    const html = await htmlFetch(url)
    if (!html) {
      process.stderr.write(JSON.stringify({ error: "Offer not found", code: "NOT_FOUND" }) + "\n")
      return 1
    }
    const job = parseJobDetail(html, id)
    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "España"}`,
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    process.stderr.write(JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "DETAIL_FAILED" }) + "\n")
    return 1
  }
}
