"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react"
import {
  SOURCES,
  PROPERTY_TYPES,
  SOURCE_CATEGORIES,
  type SourceId,
  type PropertyType,
  type DealType,
  type SourceCategory,
} from "@/lib/types"

const DEAL_TYPES: { id: DealType; label: string }[] = [
  { id: "for_sale", label: "For Sale" },
  { id: "for_lease", label: "For Lease" },
  { id: "auction", label: "Auction" },
  { id: "foreclosure", label: "Foreclosure" },
  { id: "reo", label: "REO" },
]

interface MapSidebarProps {
  selectedSources: SourceId[]
  onToggleSource: (id: SourceId) => void
  selectedPropertyTypes: PropertyType[]
  onTogglePropertyType: (id: PropertyType) => void
  selectedDealTypes: DealType[]
  onToggleDealType: (id: DealType) => void
  totalListings: number
  filteredCount: number
  onClose: () => void
}

export function MapSidebar({
  selectedSources,
  onToggleSource,
  selectedPropertyTypes,
  onTogglePropertyType,
  selectedDealTypes,
  onToggleDealType,
  totalListings,
  filteredCount,
  onClose,
}: MapSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sources: true,
    propertyTypes: true,
    dealTypes: true,
  })
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const toggleAllSources = () => {
    if (selectedSources.length === SOURCES.length) {
      // deselect all
      SOURCES.forEach((s) => {
        if (selectedSources.includes(s.id)) onToggleSource(s.id)
      })
    } else {
      SOURCES.forEach((s) => {
        if (!selectedSources.includes(s.id)) onToggleSource(s.id)
      })
    }
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{filteredCount.toLocaleString()} of {totalListings.toLocaleString()}</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Sources */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection("sources")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Sources</span>
            {expandedSections.sources ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {expandedSections.sources && (
            <div className="px-4 pb-3">
              <button onClick={toggleAllSources} className="text-[11px] text-[#2a7de1] hover:underline mb-2 block">
                {selectedSources.length === SOURCES.length ? "Deselect all" : "Select all"}
              </button>
              {(Object.keys(SOURCE_CATEGORIES) as SourceCategory[]).map((cat) => {
                const catSources = SOURCES.filter((s) => s.category === cat)
                const selectedCount = catSources.filter((s) => selectedSources.includes(s.id)).length
                const isExpanded = expandedCategories[cat] ?? false
                return (
                  <div key={cat} className="mb-1.5">
                    <button
                      onClick={() => toggleCategoryExpand(cat)}
                      className="w-full flex items-center justify-between py-1.5 text-left"
                    >
                      <span className="text-xs font-medium text-gray-600">{SOURCE_CATEGORIES[cat].label}</span>
                      <span className="text-[10px] text-gray-400">{selectedCount}/{catSources.length}</span>
                    </button>
                    {isExpanded && (
                      <div className="ml-1 space-y-0.5 mb-2">
                        {catSources.map((source) => (
                          <button
                            key={source.id}
                            onClick={() => onToggleSource(source.id)}
                            className="w-full flex items-center gap-2 py-1 px-1.5 rounded hover:bg-gray-50 text-left"
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: source.color, opacity: selectedSources.includes(source.id) ? 1 : 0.25 }}
                            />
                            <span className={`text-xs ${selectedSources.includes(source.id) ? "text-gray-700" : "text-gray-400"}`}>
                              {source.name}
                            </span>
                            {selectedSources.includes(source.id) && (
                              <Check className="w-3 h-3 text-[#2a7de1] ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Property Types */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection("propertyTypes")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Property Type</span>
            {expandedSections.propertyTypes ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {expandedSections.propertyTypes && (
            <div className="px-4 pb-3 space-y-0.5">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => onTogglePropertyType(pt.id)}
                  className="w-full flex items-center gap-2 py-1.5 px-1.5 rounded hover:bg-gray-50 text-left"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    selectedPropertyTypes.includes(pt.id) ? "bg-[#2a7de1] border-[#2a7de1]" : "border-gray-300"
                  }`}>
                    {selectedPropertyTypes.includes(pt.id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={`text-xs ${selectedPropertyTypes.includes(pt.id) ? "text-gray-700" : "text-gray-400"}`}>
                    {pt.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Deal Types */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection("dealTypes")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Deal Type</span>
            {expandedSections.dealTypes ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {expandedSections.dealTypes && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {DEAL_TYPES.map((dt) => (
                <button
                  key={dt.id}
                  onClick={() => onToggleDealType(dt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedDealTypes.includes(dt.id)
                      ? "border-[#2a7de1] bg-blue-50 text-[#2a7de1]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {dt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
