import { fetchDetail, normalizeDetail } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  if (!normalizeDetail(opts.id)) {
    process.stderr.write(
      JSON.stringify({
        error: "Could not parse a Turijobs offer id or URL from input",
        code: "BAD_ID",
      }) + "\n",
    )
    return 1
  }
  try {
    const job = await fetchDetail(opts.id)
    if (opts.format === "plain") {
      const lines = [
        job.title || "(untitled)",
        `${job.company || "-"} · ${job.location || "-"} · ${job.date || "-"}`,
        job.salary ? `Salary: ${job.salary}` : "",
        job.employmentType ? `Contract: ${job.employmentType}` : "",
        job.deadline ? `Deadline: ${job.deadline}` : "",
        job.remote ? "Remote: yes" : "",
        job.isActive ? "" : "Status: no longer available",
        job.requirements.length ? `Requirements:\n- ${job.requirements.join("\n- ")}` : "",
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
        `Apply: ${job.applyUrl}`,
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
