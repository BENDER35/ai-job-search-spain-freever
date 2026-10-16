import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

// Every case here fails validation BEFORE dispatch, so no test touches the
// network. The /add-portal contract requires a bogus flag or missing arg to
// exit 1 with a JSON error on stderr, never a silently-different search.

function parsedStderr(stderr: string): { error?: string; code?: string } {
  try {
    return JSON.parse(stderr);
  } catch {
    return {};
  }
}

describe("unknown flag rejection", () => {
  test("a bogus --flag exits 1 with UNKNOWN_FLAG and empty stdout", async () => {
    const result = await runCLI(["search", "-q", "python", "--bogus-flag", "xyz"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("UNKNOWN_FLAG");
    expect(err.error).toContain("--bogus-flag");
  });
});

describe("--format validation", () => {
  test("search rejects an unsupported format with BAD_ARG", async () => {
    const result = await runCLI(["search", "-q", "python", "--format", "xml"]);
    expect(result.exitCode).toBe(1);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("BAD_ARG");
    expect(err.error).toMatch(/format/);
  });

  test("detail rejects 'table' (unsupported there) with BAD_ARG", async () => {
    const result = await runCLI(["detail", "slug/rf-abc123", "--format", "table"]);
    expect(result.exitCode).toBe(1);
    expect(parsedStderr(result.stderr).code).toBe("BAD_ARG");
  });
});

describe("numeric flag validation", () => {
  for (const name of ["jobage", "page", "limit"]) {
    test(`--${name} non-numeric exits 1 with BAD_ARG`, async () => {
      const result = await runCLI(["search", "-q", "python", `--${name}`, "foo"]);
      expect(result.exitCode).toBe(1);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("BAD_ARG");
      expect(err.error).toMatch(new RegExp(name));
    });

    test(`--${name} 0 exits 1 with BAD_ARG`, async () => {
      const result = await runCLI(["search", "-q", "python", `--${name}`, "0"]);
      expect(result.exitCode).toBe(1);
      expect(parsedStderr(result.stderr).code).toBe("BAD_ARG");
    });

    test(`--${name} fractional exits 1 with BAD_ARG instead of truncating`, async () => {
      const result = await runCLI(["search", "-q", "python", `--${name}`, "1.5"]);
      expect(result.exitCode).toBe(1);
      expect(parsedStderr(result.stderr).code).toBe("BAD_ARG");
    });
  }
});

describe("--location validation", () => {
  test("an unknown province exits 1 with BAD_ARG naming the province", async () => {
    const result = await runCLI(["search", "-q", "python", "-l", "Atlantis"]);
    expect(result.exitCode).toBe(1);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("BAD_ARG");
    expect(err.error).toContain("Atlantis");
  });
});

describe("--remote validation", () => {
  test("an unsupported mode exits 1 with BAD_ARG", async () => {
    const result = await runCLI(["search", "-q", "python", "--remote", "bogus"]);
    expect(result.exitCode).toBe(1);
    expect(parsedStderr(result.stderr).code).toBe("BAD_ARG");
  });
});

describe("detail argument validation", () => {
  test("no argument exits 1 with NO_ID", async () => {
    const result = await runCLI(["detail"]);
    expect(result.exitCode).toBe(1);
    expect(parsedStderr(result.stderr).code).toBe("NO_ID");
  });

  test("a foreign host is rejected with BAD_ID and no request", async () => {
    const result = await runCLI(["detail", "https://boards.greenhouse.io/acme/jobs/12345"]);
    expect(result.exitCode).toBe(1);
    expect(parsedStderr(result.stderr).code).toBe("BAD_ID");
  });

  test("a bare rf-<hash> (no slug) is rejected with BAD_ID", async () => {
    const result = await runCLI(["detail", "rf-478e15e942b7f396ba44"]);
    expect(result.exitCode).toBe(1);
    expect(parsedStderr(result.stderr).code).toBe("BAD_ID");
  });
});

describe("no command", () => {
  test("prints usage and exits 1", async () => {
    const result = await runCLI([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain("USAGE");
  });
});
