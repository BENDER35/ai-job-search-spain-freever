import { afterEach, describe, expect, test } from "bun:test";
import { runSearch, buildUrl, filterByJobage, resolveLocation, type SearchOpts } from "../src/commands/search";
import { parseJobCards } from "../src/helpers";
import { searchCard, searchPage } from "./fixtures";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdoutWrite;
});

function captureStdout(): { get: () => string } {
  let buf = "";
  process.stdout.write = ((chunk: string | Uint8Array) => {
    buf += chunk.toString();
    return true;
  }) as typeof process.stdout.write;
  return { get: () => buf };
}

/** Stub fetch and expose the URL it was called with. */
function mockFetch(html: string): { url: () => string } {
  let requested = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requested = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    return new Response(html, { status: 200, headers: { "content-type": "text/html" } });
  }) as unknown as typeof fetch;
  return { url: () => requested };
}

const baseOpts: SearchOpts = {
  jobage: 9999,
  page: 1,
  format: "json",
};

const twoCards = searchPage([
  searchCard({
    hash: "rf-111aaa",
    path: "backend/rf-111aaa",
    title: "Backend Engineer",
    company: "Acme",
    location: "Madrid",
    date: "16/10/2026",
    category: "Analista",
  }),
  searchCard({
    hash: "rf-222bbb",
    path: "frontend/rf-222bbb",
    title: "Frontend Engineer",
    company: "Beta",
    location: "Barcelona",
    date: "01/10/2026",
    category: "Analista",
  }),
], 42);

describe("buildUrl", () => {
  test("carries the keyword, province, work mode, 24h and page params", () => {
    const url = new URL(
      buildUrl({ ...baseOpts, query: "desarrollador python", province: 263, remote: "remote", jobage: 1, page: 2 }),
    );
    expect(url.pathname).toBe("/ofertas-trabajo/");
    expect(url.searchParams.get("te")).toBe("desarrollador python");
    expect(url.searchParams.get("pr")).toBe(",263,");
    expect(url.searchParams.get("en_remoto")).toBe(",1,");
    expect(url.searchParams.get("ult_24h")).toBe("1");
    expect(url.searchParams.get("pagina")).toBe("2");
  });

  test("omits params that are unset — a bare search hits the root listing", () => {
    expect(buildUrl(baseOpts)).toBe("https://www.tecnoempleo.com/ofertas-trabajo/");
  });

  test("does not set ult_24h for a jobage window longer than a day", () => {
    const url = new URL(buildUrl({ ...baseOpts, query: "python", jobage: 7 }));
    expect(url.searchParams.get("ult_24h")).toBeNull();
  });
});

describe("filterByJobage", () => {
  test("keeps dated postings within the window and undated ones", () => {
    const now = new Date("2026-10-16T12:00:00Z");
    const cards = parseJobCards(twoCards);
    cards.push({ ...cards[0], id: "undated/rf-333ccc", date: null });

    const kept = filterByJobage(cards, 7, now);
    const ids = kept.map((c) => c.id);
    expect(ids).toContain("backend/rf-111aaa"); // 2026-10-16
    expect(ids).toContain("undated/rf-333ccc"); // no date -> kept
    expect(ids).not.toContain("frontend/rf-222bbb"); // 2026-10-01 is outside a 7-day window
  });

  test("jobage 9999 (no window) keeps everything", () => {
    const cards = parseJobCards(twoCards);
    expect(filterByJobage(cards, 9999, new Date()).length).toBe(2);
  });
});

describe("resolveLocation", () => {
  test("resolves a province name and code", () => {
    expect(resolveLocation("Madrid")).toBe(263);
    expect(resolveLocation("263")).toBe(263);
  });
});

describe("runSearch (mocked fetch)", () => {
  test("emits the contract envelope with meta.count/page/total", async () => {
    mockFetch(twoCards);
    const out = captureStdout();

    const code = await runSearch({ ...baseOpts, query: "engineer" });
    expect(code).toBe(0);

    const parsed = JSON.parse(out.get());
    expect(parsed.meta.count).toBe(2);
    expect(parsed.meta.page).toBe(1);
    expect(parsed.meta.total).toBe(42);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0].id).toBe("backend/rf-111aaa");
    expect(parsed.results[0].title).toBe("Backend Engineer");
    expect(parsed.results[0].company).toBe("Acme");
    expect(parsed.results[0].location).toBe("Madrid");
    expect(parsed.results[0].date).toBe("2026-10-16");
    expect(parsed.results[0].url).toContain("backend/rf-111aaa");
  });

  test("--limit caps the emitted results client-side", async () => {
    mockFetch(twoCards);
    const out = captureStdout();

    await runSearch({ ...baseOpts, query: "engineer", limit: 1 });
    expect(JSON.parse(out.get()).results).toHaveLength(1);
  });

  test("--jobage filters client-side on the posting date", async () => {
    mockFetch(twoCards);
    const out = captureStdout();

    const code = await runSearch({ ...baseOpts, query: "engineer", jobage: 7 });
    expect(code).toBe(0);
    const parsed = JSON.parse(out.get());
    expect(parsed.results.map((r: { id: string }) => r.id)).toEqual(["backend/rf-111aaa"]);
  });

  test("table format renders a header row", async () => {
    mockFetch(twoCards);
    const out = captureStdout();

    await runSearch({ ...baseOpts, query: "engineer", format: "table" });
    expect(out.get()).toContain("TITLE");
    expect(out.get()).toContain("Backend Engineer");
  });

  test("a network failure exits 1 with SEARCH_FAILED", async () => {
    globalThis.fetch = (async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    let err = "";
    const origErr = process.stderr.write;
    process.stderr.write = ((chunk: string | Uint8Array) => {
      err += chunk.toString();
      return true;
    }) as typeof process.stderr.write;

    const code = await runSearch({ ...baseOpts, query: "engineer" });
    process.stderr.write = origErr;

    expect(code).toBe(1);
    expect(JSON.parse(err).code).toBe("SEARCH_FAILED");
  });
});
