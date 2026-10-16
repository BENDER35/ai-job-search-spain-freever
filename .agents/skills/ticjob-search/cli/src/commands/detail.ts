import { htmlFetch, parseJobDetail, UA, DETAIL_URL } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

function normalizeId(input: string): string | null {
  const trimmed = input.trim()
  if (/^\d{6,}$/.test(trimmed)) return trimmed
  const urlMatch = trimmed.match(/\/oferta(?:s)?\/(\d+)/i)
  if (urlMatch) return urlMatch[1]
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const offerId = normalizeId(opts.id)
  if (!offerId) {
    process.stderr.write(JSON.stringify({ error: "Could not parse an offer ID from input", code: "BAD_ID" }) + "\n")
    return 1
  }
  try {
    const url = `${DETAIL_URL}/${offerId}`
    const html = await htmlFetch(url)
    if (!html) {
      process.stderr.write(JSON.stringify({ error: "Offer not found", code: "NOT_FOUND" }) + "\n")
      return 1
    }
    const job = parseJobDetail(html, offerId)

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"}`,
        "",
        job.seniority ? `Seniority: ${job.seniority}` : "",
        job.employmentType ? `Employment: ${job.employmentType}` : "",
        job.jobFunction ? `Function: ${job.jobFunction}` : "",
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
