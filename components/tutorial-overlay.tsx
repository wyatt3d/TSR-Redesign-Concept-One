"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react"

interface TutorialStep {
  target: string // CSS selector or data-tutorial attribute
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "[data-tutorial='nav']",
    title: "Navigation",
    description: "Switch between Search (map & list view), Auctions (tax sales, foreclosures, OTC), Dashboard (analytics), and Alerts (saved searches).",
    position: "bottom",
  },
  {
    target: "[data-tutorial='sidebar']",
    title: "Filter Sidebar",
    description: "Narrow listings by source (Crexi, Zillow, tax foreclosures, etc.), property type, and deal type. The map heatmap updates in real-time as you toggle filters.",
    position: "right",
  },
  {
    target: "[data-tutorial='view-toggle']",
    title: "Map / List Toggle",
    description: "Switch between the interactive map and a sortable data table. Both views share the same filters and respond to the AI assistant.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='map-area']",
    title: "Drill-Down Map",
    description: "Click a state to zoom in and see county-level data. Click a county to see individual listings. Numbers reflect your active filters.",
    position: "left",
  },
  {
    target: "[data-tutorial='chat']",
    title: "AI Analyst",
    description: "Your co-pilot. Ask it to filter listings, set up email alerts, analyze county risk, compare properties, or score deals against your criteria.",
    position: "left",
  },
  {
    target: "[data-tutorial='settings']",
    title: "Preferences",
    description: "Configure your investor profile, preferred property types, sources, and target markets. The platform tailors itself to your workflow.",
    position: "bottom",
  },
]

interface TutorialOverlayProps {
  onComplete: () => void
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [step, setStep] = useState(0)
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentStep = TUTORIAL_STEPS[step]

  const updateSpotlight = useCallback(() => {
    const el = document.querySelector(currentStep.target)
    if (el) {
      const rect = el.getBoundingClientRect()
      setSpotlightRect(rect)
    } else {
      setSpotlightRect(null)
    }
  }, [currentStep])

  useEffect(() => {
    updateSpotlight()
    window.addEventListener("resize", updateSpotlight)
    return () => window.removeEventListener("resize", updateSpotlight)
  }, [updateSpotlight])

  const next = () => {
    if (step < TUTORIAL_STEPS.length - 1) setStep(step + 1)
    else onComplete()
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  // Compute tooltip position relative to the spotlight
  const getTooltipStyle = (): React.CSSProperties => {
    if (!spotlightRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }

    const pad = 16
    const pos = currentStep.position

    switch (pos) {
      case "bottom":
        return {
          top: spotlightRect.bottom + pad,
          left: spotlightRect.left + spotlightRect.width / 2,
          transform: "translateX(-50%)",
        }
      case "top":
        return {
          bottom: window.innerHeight - spotlightRect.top + pad,
          left: spotlightRect.left + spotlightRect.width / 2,
          transform: "translateX(-50%)",
        }
      case "right":
        return {
          top: spotlightRect.top + spotlightRect.height / 2,
          left: spotlightRect.right + pad,
          transform: "translateY(-50%)",
        }
      case "left":
        return {
          top: spotlightRect.top + spotlightRect.height / 2,
          right: window.innerWidth - spotlightRect.left + pad,
          transform: "translateY(-50%)",
        }
    }
  }

  // SVG mask: full overlay with a cutout rectangle over the target
  const renderMask = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const p = 8 // padding around spotlight
    const r = 12 // border radius

    if (!spotlightRect) {
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 50 }}>
          <rect width={w} height={h} fill="rgba(0,0,0,0.6)" />
        </svg>
      )
    }

    const x = spotlightRect.left - p
    const y = spotlightRect.top - p
    const sw = spotlightRect.width + p * 2
    const sh = spotlightRect.height + p * 2

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 50 }}>
        <defs>
          <mask id="tutorial-mask">
            <rect width={w} height={h} fill="white" />
            <rect x={x} y={y} width={sw} height={sh} rx={r} ry={r} fill="black" />
          </mask>
        </defs>
        <rect width={w} height={h} fill="rgba(0,0,0,0.55)" mask="url(#tutorial-mask)" />
        {/* Spotlight border */}
        <rect
          x={x}
          y={y}
          width={sw}
          height={sh}
          rx={r}
          ry={r}
          fill="none"
          stroke="#2a7de1"
          strokeWidth={2}
          opacity={0.8}
        />
      </svg>
    )
  }

  return (
    <div ref={overlayRef} className="fixed inset-0" style={{ zIndex: 9999 }}>
      {/* Mask overlay with spotlight cutout */}
      {renderMask()}

      {/* Click blocker (transparent, behind tooltip) */}
      <div className="absolute inset-0" style={{ zIndex: 51 }} onClick={(e) => e.stopPropagation()} />

      {/* Tooltip */}
      <div
        className="absolute w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{ zIndex: 52, ...getTooltipStyle() }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#2a7de1] to-[#1a5fb4]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/80" />
            <span className="text-sm font-semibold text-white">{currentStep.title}</span>
          </div>
          <button onClick={onComplete} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600 leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === step ? "bg-[#2a7de1]" : i < step ? "bg-blue-300" : "bg-gray-300"
                }`}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1.5">{step + 1}/{TUTORIAL_STEPS.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={prev} className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium">
                <ChevronLeft className="w-3 h-3" /> Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#2a7de1] text-white text-xs font-medium rounded-lg hover:bg-[#2268c4] transition-colors"
            >
              {step < TUTORIAL_STEPS.length - 1 ? (
                <>Next <ChevronRight className="w-3 h-3" /></>
              ) : (
                "Get Started"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
