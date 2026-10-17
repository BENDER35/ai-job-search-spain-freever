import { fetchDetail, slugOf } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  try {
    const job = await fetchDetail(opts.id)

    if (opts.format === "plain") {
      const lines = [
        job.title || "(untitled)",
        `${job.company || "—"} · ${job.location || "—"} · plazo: ${job.deadline || "—"}`,
        `sector: ${job.sector || "—"}`,
        `id: ${job.id}`,
        job.url,
        "",
        "(El portal no publica una página propia por convocatoria; abre la URL para ver las bases completas.)",
      ]
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(
        JSON.stringify({ ...job, slug: slugOf(job.url) }, null, 2) + "\n",
      )
    }
    return 0
  } catch (e) {
    process.stderr.write(
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
        code: "DETAIL_FAILED",
      }) + "\n",
    )
    return 1
  }
}
