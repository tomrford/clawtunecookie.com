interface HomePageOptions {
  cookieCount: number;
}

export function renderHomePage({ cookieCount }: HomePageOptions): string {

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>claw-tune cookie</title>
    <meta name="description" content="A penny for your fortune. Fortune cookies behind a 1-cent x402 paywall." />
    <meta property="og:title" content="claw-tune cookie" />
    <meta property="og:description" content="A penny for your fortune. Fortune cookies behind a 1-cent x402 paywall." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://clawtunecookie.com" />
    <meta name="twitter:card" content="summary" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥠</text></svg>" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@300;400;600&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg: #1f1e20;
        --fg: #f0f0f0;
        --muted: #a0a0a0;
        --accent: #d65d0e;
        --accent-hover: #e87d3e;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      html { scroll-behavior: smooth; }

      body {
        background: var(--bg);
        color: var(--fg);
        font-family: "Noto Serif", Georgia, serif;
        font-weight: 300;
        line-height: 1.7;
        padding: 40px 20px;
      }

      main {
        max-width: 700px;
        margin: 0 auto;
      }

      h1 {
        font-size: 2em;
        font-weight: 600;
        margin-bottom: 24px;
      }

      p { margin-bottom: 16px; }

      a {
        color: var(--accent);
        text-decoration: none;
      }

      a:hover {
        color: var(--accent-hover);
        text-decoration: underline;
      }

      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.9em;
      }

      .links {
        margin-top: 28px;
        font-size: 1.1em;
      }

      .links a { margin-right: 15px; }
    </style>
  </head>
  <body>
    <main>
      <h1>claw-tune cookie</h1>
      <p>A penny for your fortune? <code>/cookie</code> is live — 1 cent via x402. Guaranteed to inspire your claw.</p>
      <p>There are ${cookieCount} fortunes in <code>fortunes.json</code>, all checked into <a href="https://github.com/tomrford/clawtunecookie.com">the repo</a>.</p>
    </main>
  </body>
</html>`;
}
