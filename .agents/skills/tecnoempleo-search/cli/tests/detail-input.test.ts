import { afterEach, describe, expect, test } from "bun:test";
import { runDetail, buildUrl } from "../src/commands/detail";
import { runCLI } from "./helpers";
import { detailPage } from "./fixtures";

// The real command path, not the parser in isolation: `detail` must never send
// a request for a URL that is not a tecnoempleo.com job page. Before the host
// check, a foreign apply link could be fetched as if it were a posting. fetch is
// stubbed throughout; no test here touches the network.

const originalFetch = globalThis.fetch;
const originalStderrWrite = process.stderr.write;

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stderr.write = originalStderrWrite;
});

function recordingFetch(html = ""): string[] {
  const requested: string[] = [];
  globalThis.fetch = (async (input: string | URL | Request) => {
    requested.push(String(input));
    return new Response(html, { status: 200 });
  }) as unknown as typeof fetch;
  return requested;
}

function captureStderr(): { get: () => string } {
  let buf = "";
  process.stderr.write = ((chunk: string | Uint8Array) => {
    buf += chunk.toString();
    return true;
  }) as typeof process.stderr.write;
  return { get: () => buf };
}

function captureStdout(): { get: () => string } {
  let buf = "";
  process.stdout.write = ((chunk: string | Uint8Array) => {
    buf += chunk.toString();
    return true;
  }) as typeof process.stdout.write;
  return { get: () => buf };
}

describe("buildUrl", () => {
  test("accepts a canonical path id", () => {
    const parsed = buildUrl("data-engineer-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f");
    expect(parsed).toEqual({
      url: "https://www.tecnoempleo.com/data-engineer-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f",
      id: "data-engineer-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f",
    });
  });

  test("accepts a full tecnoempleo.com URL, stripping query and fragment", () => {
    const parsed = buildUrl(
      "https://www.tecnoempleo.com/data-engineer-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f?x=1",
    );
    expect(parsed?.id).toBe("data-engineer-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f");
  });

  test("rejects a foreign host", () => {
    expect(buildUrl("https://boards.greenhouse.io/acme/jobs/12345")).toBeNull();
    expect(buildUrl("https://jobs.lever.co/acme/1234567")).toBeNull();
  });

  test("rejects a tecnoempleo.com.evil.io look-alike", () => {
    expect(buildUrl("https://www.tecnoempleo.com.evil.io/x/rf-123abc")).toBeNull();
  });

  test("rejects a bare rf-<hash> with no slug", () => {
    expect(buildUrl("rf-478e15e942b7f396ba44")).toBeNull();
  });

  test("rejects a non-job page on the right host", () => {
    expect(buildUrl("https://www.tecnoempleo.com/ofertas-trabajo/")).toBeNull();
  });
});

describe("runDetail (mocked fetch)", () => {
  test("builds the fetch URL from the id and prints the parsed job", async () => {
    const requested = recordingFetch(detailPage({ title: "Analista", company: "Acme", description: "x" }));
    const out = captureStdout();

    const code = await runDetail({ id: "analista/rf-123abc", format: "json" });
    expect(code).toBe(0);
    expect(requested).toEqual(["https://www.tecnoempleo.com/analista/rf-123abc"]);
    expect(JSON.parse(out.get()).title).toBe("Analista");
  });

  test("404 exits 1 with NOT_FOUND", async () => {
    globalThis.fetch = (async () => new Response("", { status: 404 })) as unknown as typeof fetch;
    const err = captureStderr();

    const code = await runDetail({ id: "nope/rf-123abc", format: "json" });
    expect(code).toBe(1);
    expect(JSON.parse(err.get()).code).toBe("NOT_FOUND");
  });

  test("a foreign host is rejected with BAD_ID before any request", async () => {
    const requested = recordingFetch();
    const err = captureStderr();

    const code = await runDetail({ id: "https://jobs.lever.co/acme/1234567", format: "json" });
    expect(code).toBe(1);
    expect(requested).toEqual([]);
    expect(JSON.parse(err.get()).code).toBe("BAD_ID");
  });
});

describe("detail input through the CLI", () => {
  test("exits 1 with the stderr-JSON BAD_ID contract for a foreign URL", async () => {
    const result = await runCLI(["detail", "https://jobs.lever.co/acme/1234567"]);
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stderr)).toMatchObject({ code: "BAD_ID" });
  });
});
