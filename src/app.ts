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

  app.notFound((c) =>
    c.html(
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>404 — claw-tune cookie</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥠</text></svg>" />
    <style>
      body { background: #1f1e20; color: #f0f0f0; font-family: Georgia, serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
      main { text-align: center; }
      a { color: #d65d0e; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <main>
      <p style="font-size:4em;margin-bottom:16px">🥠</p>
      <p>No fortune here. Try <a href="/">the front door</a>.</p>
    </main>
  </body>
</html>`,
      404,
    ),
  );

  return app;
}
