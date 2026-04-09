import type { FacilitatorClient } from "@x402/core/server";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

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
    const res = await app.fetch(new Request("https://example.com/"));

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("clawtunecookie.com");
  });

  it("redirects /source with a 303", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("https://example.com/source"));

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://github.com/tomrford/clawtunecookie.com",
    );
  });

  it("returns 402 when /cookie is unpaid", async () => {
    const app = createApp({ facilitatorFactory: () => fakeFacilitator });
    const res = await app.fetch(new Request("https://example.com/cookie"));

    expect(res.status).toBe(402);
    expect(await res.json<{ error: string }>()).toMatchObject({
      error: expect.stringContaining("Payment required"),
    });
  });

  it("returns 404 for unknown routes", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("https://example.com/nope"));

    expect(res.status).toBe(404);
    expect(await res.text()).toContain("No fortune here");
  });
});
