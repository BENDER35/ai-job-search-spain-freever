import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  runSearch,
  buildQuery,
  clampLimit,
  filterByJobage,
  normalizeLocation,
  sinceDateFor,
  teleworkingFor,
  type SearchOpts,
} from "../src/commands/search";
import { authHeader, resetAuthCache, toResult } from "../src/helpers";
import { offer, searchResponse } from "./fixtures";
import { captureStderr, captureStdout, jsonResponse, stubFetch } from "./helpers";

const ID = "test-client-id";
const SECRET = "test-client-secret";
const originalFetch = globalThis.fetch;
const originalStdout = process.stdout.write;

// Prime the auth cache before each test so a test's fetch stub only ever sees
// the search request, not the one-off token exchange.
beforeEach(async () => {
  process.env.INFOJOBS_CLIENT_ID = ID;
  process.env.INFOJOBS_CLIENT_SECRET = SECRET;
  resetAuthCache();
  stubFetch(() => jsonResponse({ access_token: "tok", token_type: "bearer" }));
  await authHeader();
  globalThis.fetch = originalFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdout;
  delete process.env.INFOJOBS_CLIENT_ID;
  delete process.env.INFOJOBS_CLIENT_SECRET;
  resetAuthCache();
});

const baseOpts: SearchOpts = { jobage: 9999, page: 1, limit: 20, format: "json" };

describe("buildQuery", () => {
  test("carries keyword, province, teleworking, sinceDate, page and maxResults", () => {
    const q = new URLSearchParams(
      buildQuery({ ...baseOpts, query: "desarrollador python", location: "Madrid", remote: "remote", jobage: 7, page: 2, limit: 30 }),
    );
    expect(q.get("q")).toBe("desarrollador python");
    expect(q.get("province")).toBe("madrid");
    expect(q.get("teleworking")).toBe("solo-teletrabajo");
    expect(q.get("sinceDate")).toBe("_7_DAYS");
    expect(q.get("page")).toBe("2");
    expect(q.get("maxResults")).toBe("30");
  });

  test("omits filters that are unset and keeps only paging", () => {
    const q = new URLSearchParams(buildQuery(baseOpts));
    expect(q.get("q")).toBeNull();
    expect(q.get("province")).toBeNull();
    expect(q.get("teleworking")).toBeNull();
    expect(q.get("sinceDate")).toBeNull();
    expect(q.get("page")).toBe("1");
    expect(q.get("maxResults")).toBe("20");
  });

  test("clamps --limit into the API's 1..50 window", () => {
    expect(new URLSearchParams(buildQuery({ ...baseOpts, limit: 999 })).get("maxResults")).toBe("50");
  });
});

describe("normalizeLocation", () => {
  test("folds accents and multi-word provinces to the dictionary key", () => {
    expect(normalizeLocation("Madrid")).toBe("madrid");
    expect(normalizeLocation("Málaga")).toBe("malaga");
    expect(normalizeLocation("A Coruña")).toBe("a-coruna");
    expect(normalizeLocation("Santa Cruz de Tenerife")).toBe("santa-cruz-de-tenerife");
  });

  test("maps the bilingual and locally-named provinces", () => {
    expect(normalizeLocation("Alicante/Alacant")).toBe("alicante-alacant");
    expect(normalizeLocation("Castelló")).toBe("castellon-castello");
    expect(normalizeLocation("València")).toBe("valencia-valencia");
    expect(normalizeLocation("Islas Baleares")).toBe("illes-balears");
    expect(normalizeLocation("Bizkaia")).toBe("vizcaya");
    expect(normalizeLocation("Araba")).toBe("alava");
  });

  test("passes an unknown province through for the API to validate, and nulls blank", () => {
    expect(normalizeLocation("Atlantis")).toBe("atlantis");
    expect(normalizeLocation("   ")).toBeNull();
  });
});

describe("sinceDateFor", () => {
  test("maps day windows onto the three API buckets", () => {
    expect(sinceDateFor(1)).toBe("_24_HOURS");
    expect(sinceDateFor(7)).toBe("_7_DAYS");
    expect(sinceDateFor(15)).toBe("_15_DAYS");
    expect(sinceDateFor(16)).toBeNull();
    expect(sinceDateFor(9999)).toBeNull();
  });
});

describe("teleworkingFor", () => {
  test("maps the remote modes onto the dictionary keys", () => {
    expect(teleworkingFor("remote")).toBe("solo-teletrabajo");
    expect(teleworkingFor("hybrid")).toBe("teletrabajo-posible");
    expect(teleworkingFor("onsite")).toBe("trabajo-solo-presencial");
    expect(teleworkingFor(undefined)).toBeNull();
  });
});

describe("clampLimit", () => {
  test("keeps values in range and clamps the extremes", () => {
    expect(clampLimit(20)).toBe(20);
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(50)).toBe(50);
    expect(clampLimit(51)).toBe(50);
  });
});

describe("filterByJobage", () => {
  test("keeps recent and undated offers, drops older ones", () => {
    const now = new Date("2026-10-16T12:00:00Z");
    const base = toResult(offer());
    const rows = [
      { ...base, id: "recent", date: "2026-10-15T00:00:00.000Z" },
      { ...base, id: "old", date: "2026-09-01T00:00:00.000Z" },
      { ...base, id: "undated", date: null },
    ];
    const kept = filterByJobage(rows, 7, now).map((r) => r.id);
    expect(kept).toEqual(["recent", "undated"]);
  });

  test("no window keeps everything", () => {
    const rows = [{ ...toResult(offer()), id: "a", date: "2000-01-01T00:00:00.000Z" }];
    expect(filterByJobage(rows, 9999, new Date())).toHaveLength(1);
  });
});

describe("runSearch (mocked fetch)", () => {
  test("emits the contract envelope and reshaped fields", async () => {
    stubFetch(() => jsonResponse(searchResponse([offer()], { totalResults: 42 })));
    const out = captureStdout();

    const code = await runSearch({ ...baseOpts, query: "camarero" });
    expect(code).toBe(0);

    const parsed = JSON.parse(out.get());
    expect(parsed.meta).toEqual({ count: 1, page: 1, total: 42 });
    expect(parsed.results).toHaveLength(1);
    expect(parsed.results[0].id).toBe("258eae420249ffa67cf64681a2ef80");
    expect(parsed.results[0].title).toContain("Camareros");
    expect(parsed.results[0].company).toBe("ADECCO");
    expect(parsed.results[0].location).toBe("Vilafranca del Penedès");
    expect(parsed.results[0].date).toBe("2023-05-09T14:04:02.000Z");
    expect(parsed.results[0].url).toContain("of-i258eae420249ffa67cf64681a2ef80");
  });

  test("queries the v9 search resource and sends the province key", async () => {
    const mock = stubFetch(() => jsonResponse(searchResponse([offer()])));
    captureStdout();

    await runSearch({ ...baseOpts, query: "python", location: "Madrid" });

    const u = new URL(mock.calls[0].url);
    expect(u.pathname).toBe("/api/9/offer");
    expect(u.searchParams.get("province")).toBe("madrid");
  });

  test("--jobage narrows the API's coarse bucket client-side", async () => {
    const now = Date.now();
    const recent = offer({ id: "recent", published: new Date(now - 2 * 86400000).toISOString() });
    const old = offer({ id: "old", published: new Date(now - 30 * 86400000).toISOString() });
    stubFetch(() => jsonResponse(searchResponse([old, recent])));
    const out = captureStdout();

    await runSearch({ ...baseOpts, query: "x", jobage: 7 });

    expect(JSON.parse(out.get()).results.map((r: { id: string }) => r.id)).toEqual(["recent"]);
  });

  test("table format renders a header row", async () => {
    stubFetch(() => jsonResponse(searchResponse([offer()])));
    const out = captureStdout();

    await runSearch({ ...baseOpts, query: "x", format: "table" });
    expect(out.get()).toContain("TITLE");
    expect(out.get()).toContain("Camareros");
  });

  test("a 404 from the search endpoint is an error, not an empty result set", async () => {
    stubFetch(() => new Response("", { status: 404 }));
    const err = captureStderr();
    const out = captureStdout();

    const code = await runSearch({ ...baseOpts, query: "x" });
    err.restore();

    expect(code).toBe(1);
    expect(out.get()).toBe("");
    expect(JSON.parse(err.get()).code).toBe("SEARCH_FAILED");
  });

  test("network failure exits 1 with SEARCH_FAILED", async () => {
    globalThis.fetch = (async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    const err = captureStderr();

    const code = await runSearch({ ...baseOpts, query: "x" });
    err.restore();

    expect(code).toBe(1);
    expect(JSON.parse(err.get()).code).toBe("SEARCH_FAILED");
  });
});
