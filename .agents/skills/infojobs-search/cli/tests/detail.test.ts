import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { runDetail, resolveId } from "../src/commands/detail";
import { authHeader, resetAuthCache } from "../src/helpers";
import { detailResponse } from "./fixtures";
import { captureStderr, captureStdout, jsonResponse, runCLI, stubFetch } from "./helpers";

const ID = "test-client-id";
const SECRET = "test-client-secret";
const originalFetch = globalThis.fetch;
const originalStdout = process.stdout.write;

const OFFER_ID = "8e55718e6d4282979b59a20017186d";

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

describe("resolveId", () => {
  test("accepts a bare offer id", () => {
    expect(resolveId(OFFER_ID)).toBe(OFFER_ID);
    expect(resolveId("258eae420249ffa67cf64681a2ef80")).toBe("258eae420249ffa67cf64681a2ef80");
  });

  test("extracts the id from an infojobs.net offer URL's /of-i<id> slug", () => {
    expect(
      resolveId("https://www.infojobs.net/fuenlabrada/oferta-multi-color-oculta/of-i8e55718e6d4282979b59a20017186d?x=1"),
    ).toBe(OFFER_ID);
  });

  test("rejects a foreign host and a look-alike host", () => {
    expect(resolveId("https://boards.greenhouse.io/acme/jobs/12345")).toBeNull();
    expect(resolveId("https://www.infojobs.net.evil.io/x/of-i8e55718e6d4282979b59a20017186d")).toBeNull();
  });

  test("rejects malformed and blank input", () => {
    expect(resolveId("not-a-valid-id")).toBeNull();
    expect(resolveId("  ")).toBeNull();
  });
});

describe("runDetail (mocked fetch)", () => {
  test("fetches the v7 detail resource and reshapes the offer", async () => {
    const mock = stubFetch(() => jsonResponse(detailResponse()));
    const out = captureStdout();

    const code = await runDetail({ id: OFFER_ID, format: "json" });
    expect(code).toBe(0);

    expect(new URL(mock.calls[0].url).pathname).toBe(`/api/7/offer/${OFFER_ID}`);

    const parsed = JSON.parse(out.get());
    expect(parsed.id).toBe(OFFER_ID);
    expect(parsed.title).toContain("Adjunto Responsable");
    expect(parsed.company).toBe("Empresa ejemplo");
    expect(parsed.location).toBe("Fuenlabrada");
    expect(parsed.date).toBe("2012-03-13T23:00:00.000+0000");
    expect(parsed.description).toContain("En dependencia");
    expect(parsed.deadline).toBeNull();
    expect(parsed.skills).toEqual(["Java", "JSP"]);
    expect(parsed.workDay).toBe("Completa");
    expect(parsed.study).toBe("Ingeniero Técnico");
    expect(parsed.salary).toBe("24.000 € - 27.000 € Bruto/año");
    expect(parsed.applyUrl).toContain("of-i8e55718e6d4282979b59a20017186d");
    expect(parsed.externalApply).toBe(false);
    expect(parsed.active).toBe(true);
  });

  test("an externalUrlForm becomes the apply target and marks the apply external", async () => {
    stubFetch(() => jsonResponse(detailResponse({ externalUrlForm: "https://apply.example.com/job/1" })));
    const out = captureStdout();

    await runDetail({ id: OFFER_ID, format: "json" });

    const parsed = JSON.parse(out.get());
    expect(parsed.applyUrl).toBe("https://apply.example.com/job/1");
    expect(parsed.externalApply).toBe(true);
  });

  test("404 exits 1 with NOT_FOUND", async () => {
    stubFetch(() => new Response("", { status: 404 }));
    const err = captureStderr();

    const code = await runDetail({ id: OFFER_ID, format: "json" });
    err.restore();

    expect(code).toBe(1);
    expect(JSON.parse(err.get()).code).toBe("NOT_FOUND");
  });

  test("a foreign host is rejected with BAD_ID before any request", async () => {
    const mock = stubFetch(() => jsonResponse(detailResponse()));
    const err = captureStderr();

    const code = await runDetail({ id: "https://jobs.lever.co/acme/1234567", format: "json" });
    err.restore();

    expect(code).toBe(1);
    expect(mock.calls).toHaveLength(0);
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
