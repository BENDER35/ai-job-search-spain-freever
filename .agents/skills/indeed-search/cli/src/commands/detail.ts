import { htmlFetch, parseJobDetail, UA, DETAIL_URL } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

/** Normalize the job key: Indeed uses alphanumeric jobKeys like "0e8jk1b00000000001" */
function normalizeJobKey(input: string): string | null {
  const trimmed = input.trim()
  // Indeed jobKeys are 18-20 chars, alphanumeric
  if (/^[A-Za-z0-9]{12,20}$/.test(trimmed)) return trimmed
  // Also accept a full URL and extract the jk parameter
  const urlMatch = trimmed.match(/[?&]jk=([A-Za-z0-9]+)/i)
  if (urlMatch) return urlMatch[1]
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const jobKey = normalizeJobKey(opts.id)
  if (!jobKey) {
    process.stderr.write(JSON.stringify({ error: "Could not parse a job key from input", code: "BAD_ID" }) + "\n")
    return 1
  }
  try {
    const url = `${DETAIL_URL}?jk=${jobKey}`
    const html = await htmlFetch(url)
    if (!html) {
      process.stderr.write(JSON.stringify({ error: "Job not found", code: "NOT_FOUND" }) + "\n")
      return 1
    }
    const job = parseJobDetail(html, jobKey)

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
