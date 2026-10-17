import { fetchDetail, normalizeId } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  if (!normalizeId(opts.id)) {
    process.stderr.write(
      JSON.stringify({ error: "Could not parse an offer ID from input", code: "BAD_ID" }) + "\n",
    )
    return 1
  }
  try {
    const job = await fetchDetail(opts.id)
    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"} · ${job.date || "—"}`,
        job.salary ? `Salary: ${job.salary}` : "",
        job.employmentType ? `Contract: ${job.employmentType}` : "",
        job.remote ? "Remote: yes" : "",
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
