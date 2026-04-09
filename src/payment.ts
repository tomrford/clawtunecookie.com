import { HTTPFacilitatorClient, type FacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import type { MiddlewareHandler } from "hono";

const NETWORK = "eip155:8453";
const PRICE = "$0.01";
const FACILITATOR_URL = "https://x402.org/facilitator";

export interface PaymentOptions {
  facilitatorFactory?: () => FacilitatorClient;
}

export function createCookiePaymentMiddleware(
  payTo: string,
  options: PaymentOptions = {},
): MiddlewareHandler {
  const facilitator =
    options.facilitatorFactory?.() ??
    new HTTPFacilitatorClient({ url: FACILITATOR_URL });

  const server = new x402ResourceServer(facilitator).register(
    NETWORK,
    new ExactEvmScheme(),
  );

  return paymentMiddleware(
    {
      "/cookie": {
        accepts: [{ scheme: "exact", price: PRICE, network: NETWORK, payTo }],
        description: "One random fortune cookie.",
        mimeType: "application/json",
        unpaidResponseBody: () => ({
          contentType: "application/json",
          body: { error: "Payment required.", hint: "Pay 1 cent via x402, then retry GET /cookie." },
        }),
      },
    },
    server,
    { appName: "clawtunecookie.com", testnet: false },
    undefined,
    true,
  );
}
