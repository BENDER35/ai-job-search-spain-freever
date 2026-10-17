import { fetchDetail, normalizeDetail } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  if (!normalizeDetail(opts.id)) {
    process.stderr.write(
      JSON.stringify({ error: "Could not parse a Primerempleo offer id or URL from input", code: "BAD_ID" }) + "\n",
    )
    return 1
  }
  try {
    const job = await fetchDetail(opts.id)
    if (opts.format === "plain") {
      const lines: string[] = []
      lines.push(job.title || "(untitled)")
      const meta = [job.company || "-", job.location || "-", job.date || "-"]
      if (job.employmentType) meta.push(job.employmentType)
      if (job.remote) meta.push("teletrabajo")
      lines.push(meta.join(" · "))
      if (job.description) {
        lines.push("")
        lines.push(job.description)
      }
      if (job.applyUrl) {
        lines.push("")
        lines.push(`Apply: ${job.applyUrl}`)
      }
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
