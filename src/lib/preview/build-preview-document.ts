function sanitizePreviewMarkup(markup: string) {
  return markup
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

export function buildPreviewDocument(markup: string) {
  const safeMarkup = sanitizePreviewMarkup(markup);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: light;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fafc;
        color: #0f172a;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top, rgba(29, 78, 216, 0.08), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #f3f6fb 100%);
        padding: 20px;
      }

      .preview-shell {
        min-height: calc(100vh - 40px);
        border-radius: 20px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 36px rgba(15, 23, 42, 0.06);
        padding: 24px;
      }
    </style>
  </head>
  <body>
    <div class="preview-shell">${safeMarkup}</div>
  </body>
</html>`;
}
