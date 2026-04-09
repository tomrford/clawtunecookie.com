import type { FacilitatorClient } from "@x402/core/server";
import { describe, expect, it } from "vitest";
import { createApp, type EnvBindings } from "../src/app";

function makeEnv(overrides: Partial<EnvBindings> = {}): EnvBindings {
  return { ...overrides };
}

const fakeFacilitator: FacilitatorClient = {
  async getSupported() {
    return {
      kinds: [{ x402Version: 2, network: "eip155:8453", scheme: "exact" }],
    } as never;
  },
  async settle() {
    throw new Error("settle should not run in the unpaid route test");
  },
  async verify() {
    throw new Error("verify should not run in the unpaid route test");
  },
};

describe("clawtunecookie worker", () => {
  it("serves the home page", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("https://example.com/"), makeEnv());

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("clawtunecookie.com");
  });

  it("redirects /source with a 303", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("https://example.com/source"), makeEnv());

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://github.com/tomrford/clawtunecookie.com",
    );
  });

  it("returns 503 when /cookie is not configured", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("https://example.com/cookie"), makeEnv());

    expect(res.status).toBe(503);
    expect(await res.json<{ error: string }>()).toMatchObject({
      error: expect.stringContaining("not configured"),
    });
  });

  it("returns 402 when /cookie is configured but unpaid", async () => {
    const app = createApp({ facilitatorFactory: () => fakeFacilitator });
    const res = await app.fetch(
      new Request("https://example.com/cookie"),
      makeEnv({ X402_PAY_TO: "0x000000000000000000000000000000000000dEaD" }),
    );

    expect(res.status).toBe(402);
    expect(await res.json<{ error: string }>()).toMatchObject({
      error: expect.stringContaining("Payment required"),
    });
  });
});
