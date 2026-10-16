import { afterEach, describe, expect, test } from "bun:test";
import { htmlFetch } from "../src/helpers";

// A stalled upstream connection (accepted socket, no response) would otherwise
// hang the CLI forever - fetch has no default timeout. Assert the request
// wrapper carries an AbortSignal timeout.
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("htmlFetch request timeout", () => {
  test("passes an AbortSignal timeout to fetch", async () => {
    let init: RequestInit | undefined;
    globalThis.fetch = (async (_url: string | URL | Request, i?: RequestInit) => {
      init = i;
      return new Response("<html></html>", { status: 200 });
    }) as unknown as typeof fetch;

    await htmlFetch("https://www.tecnoempleo.com/ofertas-trabajo/");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  test("sends the honest, portal-naming user-agent", async () => {
    let headers: HeadersInit | undefined;
    globalThis.fetch = (async (_url: string | URL | Request, i?: RequestInit) => {
      headers = i?.headers;
      return new Response("<html></html>", { status: 200 });
    }) as unknown as typeof fetch;

    await htmlFetch("https://www.tecnoempleo.com/ofertas-trabajo/");
    const ua = new Headers(headers).get("User-Agent");
    expect(ua).toBe("Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)");
  });
});
