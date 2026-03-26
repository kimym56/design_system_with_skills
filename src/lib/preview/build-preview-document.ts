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
        background: #f7f4ec;
        color: #171717;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(245, 158, 11, 0.22), transparent 30%),
          linear-gradient(180deg, #f9f5ee 0%, #efe8dc 100%);
        padding: 24px;
      }

      .preview-shell {
        min-height: calc(100vh - 48px);
        border-radius: 28px;
        border: 1px solid rgba(23, 23, 23, 0.08);
        background: rgba(255, 255, 255, 0.78);
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
        padding: 24px;
      }
    </style>
  </head>
  <body>
    <div class="preview-shell">${safeMarkup}</div>
  </body>
</html>`;
}
