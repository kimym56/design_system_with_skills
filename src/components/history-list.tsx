"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  componentType: string;
  createdAt: string;
  selectedSkills: Array<{
    skill: {
      id: string;
      name: string;
    };
  }>;
};

export function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/history")
      .then(async (response) => {
        const payload = await response.json();

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(payload.error ?? "Unable to load history.");
          return;
        }

        setItems(payload.generations);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load history.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-5 py-6 text-sm leading-6 text-stone-400">
        Saved components reopen here after the first successful generation.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/history/${item.id}`}
          className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5 transition hover:border-amber-300/40 hover:bg-white/8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              {item.componentType}
            </h3>
            <span className="text-xs uppercase tracking-[0.2em] text-stone-400">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            {item.selectedSkills.map(({ skill }) => skill.name).join(", ")}
          </p>
        </Link>
      ))}
    </div>
  );
}
