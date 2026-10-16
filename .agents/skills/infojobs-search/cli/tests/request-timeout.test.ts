import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apiGet, authHeader, resetAuthCache } from "../src/helpers";
import { jsonResponse, stubFetch } from "./helpers";

// A stalled upstream connection (accepted socket, no response) would otherwise
// hang the CLI forever - fetch has no default timeout. Assert the request
// wrapper carries an AbortSignal timeout, the honest UA, and the auth header.

const originalFetch = globalThis.fetch;

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
  delete process.env.INFOJOBS_CLIENT_ID;
  delete process.env.INFOJOBS_CLIENT_SECRET;
  resetAuthCache();
});

describe("apiGet request options", () => {
  test("passes an AbortSignal timeout, the honest UA and the auth header", async () => {
    let init: RequestInit | undefined;
    globalThis.fetch = (async (_url: string | URL | Request, i?: RequestInit) => {
      init = i;
      return jsonResponse({ offers: [] });
    }) as unknown as typeof fetch;

    await apiGet("/api/9/offer");

    expect(init?.signal).toBeInstanceOf(AbortSignal);
    const headers = new Headers(init?.headers);
    expect(headers.get("User-Agent")).toBe("Mozilla/5.0 (compatible; infojobs-cli/1.0)");
    expect(headers.get("Authorization")).toMatch(/^Basic /);
  });
});
