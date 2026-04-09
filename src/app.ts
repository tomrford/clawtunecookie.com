import type { MiddlewareHandler } from "hono";
import { Hono } from "hono";
import { fortunes, pickRandomFortune } from "./fortunes";
import { renderHomePage } from "./home-page";
import { createCookiePaymentMiddleware, type PaymentOptions } from "./payment";

export interface EnvBindings {
  X402_PAY_TO?: string;
}

export function createApp(options: PaymentOptions = {}) {
  const app = new Hono<{ Bindings: EnvBindings }>();
  let middleware: MiddlewareHandler | null = null;

  app.get("/", (c) => {
    const payTo = c.env.X402_PAY_TO?.trim();
    return c.html(renderHomePage({ cookieCount: fortunes.length, paywallEnabled: !!payTo }));
  });

  app.get("/source", (c) =>
    c.redirect("https://github.com/tomrford/clawtunecookie.com", 303),
  );

  app.use("/cookie", async (c, next) => {
    const payTo = c.env.X402_PAY_TO?.trim();
    if (!payTo) {
      return c.json({ error: "Cookie payments are not configured yet." }, 503);
    }

    if (!middleware) {
      middleware = createCookiePaymentMiddleware(payTo, options);
    }

    return middleware(c, next);
  });

  app.get("/cookie", (c) => c.json({ fortune: pickRandomFortune() }));

  return app;
}
