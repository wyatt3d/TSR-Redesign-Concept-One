"use client"

import { SOURCES, type SourceId } from "@/lib/types"

export function SourceBadge({ sourceId, size = "sm" }: { sourceId: SourceId; size?: "xs" | "sm" }) {
  const source = SOURCES.find((s) => s.id === sourceId)
  if (!source) return null

  const sizeClasses = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-semibold text-white ${sizeClasses}`}
      style={{ backgroundColor: source.color }}
    >
      {source.shortName}
    </span>
  )
}
