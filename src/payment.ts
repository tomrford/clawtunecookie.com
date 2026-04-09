import { HTTPFacilitatorClient, type FacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import type { MiddlewareHandler } from "hono";

const NETWORK = "eip155:8453";
const PRICE = "$0.01";
const FACILITATOR_URL = "https://facilitator.xpay.sh";
const PAY_TO = "0x36df55e13520FA5607DAB4F43c0EfF7b9715Ef9A";

export interface PaymentOptions {
  facilitatorFactory?: () => FacilitatorClient;
}

export function createCookiePaymentMiddleware(
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
        accepts: [{ scheme: "exact", price: PRICE, network: NETWORK, payTo: PAY_TO }],
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
