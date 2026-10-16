import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apiGet, authHeader, resetAuthCache } from "../src/helpers";
import { jsonResponse, stubFetch } from "./helpers";

// The portal contract requires backoff on 429/5xx. These tests pin the retry
// loop offline: a stubbed fetch counts attempts, and a stubbed setTimeout fires
// immediately so the exhaustion case does not sleep through the real
// 500ms -> 8s schedule. The auth cache is primed first so the token exchange is
// not counted among the retries.

const originalFetch = globalThis.fetch;
const originalSetTimeout = globalThis.setTimeout;

beforeEach(async () => {
  process.env.INFOJOBS_CLIENT_ID = "id";
  process.env.INFOJOBS_CLIENT_SECRET = "secret";
  resetAuthCache();
  stubFetch(() => jsonResponse({ access_token: "tok" }));
  await authHeader();
  globalThis.fetch = originalFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.setTimeout = originalSetTimeout;
  delete process.env.INFOJOBS_CLIENT_ID;
  delete process.env.INFOJOBS_CLIENT_SECRET;
  resetAuthCache();
});

function instantTimers() {
  globalThis.setTimeout = ((fn: () => void) => originalSetTimeout(fn, 0)) as unknown as typeof setTimeout;
}

function stubSequence(responses: Array<() => Response>): { calls: number } {
  const state = { calls: 0 };
  globalThis.fetch = (async () => {
    const i = Math.min(state.calls, responses.length - 1);
    state.calls++;
    return responses[i]();
  }) as unknown as typeof fetch;
  return state;
}

describe("apiGet retry/backoff", () => {
  test("retries a 429 and succeeds on the next attempt", async () => {
    instantTimers();
    const state = stubSequence([
      () => new Response("", { status: 429 }),
      () => jsonResponse({ offers: [] }),
    ]);

    const body = await apiGet<unknown>("/api/9/offer");
    expect(body).not.toBeNull();
    expect(state.calls).toBe(2);
  });

  test("returns the documented null on 404 without retrying", async () => {
    const state = stubSequence([() => new Response("", { status: 404 })]);

    const body = await apiGet("/api/7/offer/x");
    expect(body).toBeNull();
    expect(state.calls).toBe(1);
  });

  test("gives up after the initial attempt plus six retries on persistent 5xx", async () => {
    instantTimers();
    const state = stubSequence([() => new Response("", { status: 503 })]);

    await expect(apiGet("/api/9/offer")).rejects.toThrow(/503/);
    expect(state.calls).toBe(7);
  });

  test("a 401 is an AUTH_FAILED CliError, not a retry", async () => {
    const state = stubSequence([() => new Response('{"error_description":"bad creds"}', { status: 401 })]);

    await expect(apiGet("/api/9/offer")).rejects.toMatchObject({ code: "AUTH_FAILED" });
    expect(state.calls).toBe(1);
  });

  test("fails fast on a connection error - no retry", async () => {
    const state = { calls: 0 };
    globalThis.fetch = (async () => {
      state.calls++;
      throw new TypeError("Unable to connect");
    }) as unknown as typeof fetch;

    await expect(apiGet("/api/9/offer")).rejects.toThrow(/could not reach the InfoJobs API/);
    expect(state.calls).toBe(1);
  });
});
