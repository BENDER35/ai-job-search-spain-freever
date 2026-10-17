import { fetchDetail } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

function normalizeId(input: string): string | null {
  const trimmed = input.trim()
  const urlMatch = trimmed.match(/jobs\.serveo\.com\/job\/[^/]+\/(\d+)/i)
  if (urlMatch) return urlMatch[1]
  if (/^\d{6,}$/.test(trimmed)) return trimmed
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    process.stderr.write(
      JSON.stringify({ error: "Could not parse an offer ID from input", code: "BAD_ID" }) + "\n",
    )
    return 1
  }
  try {
    const job = await fetchDetail(id)
    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"} · ${job.date || "—"}`,
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
    process.stderr.write(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "DETAIL_FAILED" }) + "\n",
    )
    return 1
  }
}
