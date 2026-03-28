import React from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { JSDOM } from "jsdom";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

import RootLayout from "@/app/layout";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalNavigator = globalThis.navigator;
const originalConsoleError = console.error;

afterEach(() => {
  if (originalWindow) {
    globalThis.window = originalWindow;
  } else {
    delete (globalThis as typeof globalThis & { window?: Window }).window;
  }

  if (originalDocument) {
    globalThis.document = originalDocument;
  } else {
    delete (globalThis as typeof globalThis & { document?: Document }).document;
  }

  if (originalNavigator) {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  }

  console.error = originalConsoleError;
});

test("root layout tolerates browser extensions mutating the html element before hydration", async () => {
  const app = (
    <RootLayout>
      <div>Workspace</div>
    </RootLayout>
  );
  const dom = new JSDOM(`<!DOCTYPE html>${renderToString(app)}`, {
    url: "http://localhost/workspace",
  });

  globalThis.window = dom.window as typeof globalThis.window;
  globalThis.document = dom.window.document;
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: dom.window.navigator,
  });

  document.documentElement.setAttribute("nighteye", "disabled");

  const hydrationErrors: string[] = [];

  console.error = (...args: unknown[]) => {
    hydrationErrors.push(args.join(" "));
  };

  hydrateRoot(document, app);

  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

  expect(hydrationErrors).toEqual([]);
});
