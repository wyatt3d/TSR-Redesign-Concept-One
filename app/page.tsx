"use client"

import { useState, useMemo, useCallback } from "react"
import { Header } from "@/components/header"
import { MapSidebar } from "@/components/map-sidebar"
import { ListingCard } from "@/components/listing-card"
import { ChatPanel } from "@/components/chat-panel"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { MOCK_LISTINGS } from "@/lib/mock-listings"
import { SOURCES, type SourceId, type PropertyType, type DealType, type Listing } from "@/lib/types"
import { usePreferences } from "@/hooks/use-preferences"
import { type ChatAction } from "@/lib/chat-types"
import { SlidersHorizontal, List, Layers, ZoomIn, ZoomOut, LocateFixed, Sparkles, MessageSquare } from "lucide-react"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

export default function MapPortalPage() {
  const { preferences, loaded } = usePreferences()

  // Panel visibility
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  // Filter state
  const [selectedSources, setSelectedSources] = useState<SourceId[]>(
    () => preferences.sources.length > 0 ? preferences.sources : SOURCES.map((s) => s.id)
  )
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>(
    () => preferences.propertyTypes.length > 0 ? preferences.propertyTypes : []
  )
  const [selectedDealTypes, setSelectedDealTypes] = useState<DealType[]>(
    () => preferences.dealTypes.length > 0 ? preferences.dealTypes : ["for_sale", "for_lease", "auction", "foreclosure", "reo"]
  )

  // Previous filter state for undo
  const [prevFilters, setPrevFilters] = useState<{
    sources: SourceId[]
    propertyTypes: PropertyType[]
    dealTypes: DealType[]
  } | null>(null)

  const toggleSource = (id: SourceId) => {
    setSelectedSources((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }
  const togglePropertyType = (id: PropertyType) => {
    setSelectedPropertyTypes((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }
  const toggleDealType = (id: DealType) => {
    setSelectedDealTypes((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])
  }

  // Chat action handler — applies filter changes from chat
  const handleChatAction = useCallback((action: ChatAction) => {
    switch (action.type) {
      case "APPLY_FILTERS": {
        // Save current state for undo
        setPrevFilters({
          sources: selectedSources,
          propertyTypes: selectedPropertyTypes,
          dealTypes: selectedDealTypes,
        })
        const f = action.filters
        if (f.sources) setSelectedSources(f.sources)
        if (f.propertyTypes) setSelectedPropertyTypes(f.propertyTypes)
        if (f.dealTypes) setSelectedDealTypes(f.dealTypes)
        if (f.states) {
          // Filter sources to only those with listings in the specified states
          // For prototype, we filter the listing results rather than modifying sources
        }
        break
      }
      case "UNDO_FILTERS": {
        if (prevFilters) {
          setSelectedSources(prevFilters.sources)
          setSelectedPropertyTypes(prevFilters.propertyTypes)
          setSelectedDealTypes(prevFilters.dealTypes)
          setPrevFilters(null)
        }
        break
      }
    }
  }, [selectedSources, selectedPropertyTypes, selectedDealTypes, prevFilters])

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      if (!selectedSources.includes(l.source)) return false
      if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes(l.propertyType)) return false
      if (!selectedDealTypes.includes(l.dealType)) return false
      return true
    })
  }, [selectedSources, selectedPropertyTypes, selectedDealTypes])

  const sourceCounts = useMemo(() => {
    const counts: Partial<Record<SourceId, number>> = {}
    filteredListings.forEach((l) => {
      counts[l.source] = (counts[l.source] || 0) + 1
    })
    return counts
  }, [filteredListings])

  const activeSourceIds = Object.keys(sourceCounts) as SourceId[]

  if (!loaded) return null

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters */}
        {sidebarOpen && (
          <MapSidebar
            selectedSources={selectedSources}
            onToggleSource={toggleSource}
            selectedPropertyTypes={selectedPropertyTypes}
            onTogglePropertyType={togglePropertyType}
            selectedDealTypes={selectedDealTypes}
            onToggleDealType={toggleDealType}
            totalListings={MOCK_LISTINGS.length}
            filteredCount={filteredListings.length}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Map Area */}
        <div className="flex-1 relative bg-[#f0f4f8]">
          {/* Toggle sidebar button */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              <span className="text-xs text-gray-400 ml-1">{filteredListings.length}</span>
            </button>
          )}

          {/* Map controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            <button className="w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <LocateFixed className="w-4 h-4" />
            </button>
          </div>

          {/* View toggle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#2a7de1] text-white">
              <Layers className="w-3.5 h-3.5" />
              Map
            </button>
            <a href="/listings" className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
              <List className="w-3.5 h-3.5" />
              List
            </a>
          </div>

          {/* The Map */}
          <div className="w-full h-full">
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{ scale: 1100 }}
              width={960}
              height={600}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#e8ecf1"
                      stroke="#fff"
                      strokeWidth={0.75}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#dde3eb" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Listing markers */}
              {filteredListings.map((listing) => {
                const source = SOURCES.find((s) => s.id === listing.source)
                if (!source) return null
                return (
                  <Marker
                    key={listing.id}
                    coordinates={[listing.lng, listing.lat]}
                    onClick={() => setSelectedListing(listing)}
                  >
                    <circle
                      r={3.5}
                      fill={source.color}
                      stroke="#fff"
                      strokeWidth={1}
                      style={{ cursor: "pointer" }}
                      opacity={0.85}
                    />
                  </Marker>
                )
              })}
            </ComposableMap>
          </div>

          {/* Source legend bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 px-4 py-2.5 flex items-center gap-4 overflow-x-auto">
              <span className="text-xs font-semibold text-gray-500 flex-shrink-0 uppercase tracking-wide">
                {filteredListings.length.toLocaleString()} listings
              </span>
              <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
              <div className="flex items-center gap-3 overflow-x-auto">
                {activeSourceIds.slice(0, 12).map((sourceId) => {
                  const source = SOURCES.find((s) => s.id === sourceId)
                  if (!source) return null
                  return (
                    <div key={sourceId} className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-[11px] text-gray-600 font-medium">{source.shortName}</span>
                      <span className="text-[11px] text-gray-400">{sourceCounts[sourceId]}</span>
                    </div>
                  )
                })}
                {activeSourceIds.length > 12 && (
                  <span className="text-[11px] text-gray-400 flex-shrink-0">+{activeSourceIds.length - 12} more</span>
                )}
              </div>
            </div>
          </div>

          {/* Selected listing card */}
          {selectedListing && (
            <div className="absolute top-20 right-16 z-20">
              <ListingCard listing={selectedListing} onClose={() => setSelectedListing(null)} />
            </div>
          )}

          {/* Chat toggle FAB (when chat is closed) */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="absolute bottom-20 right-4 z-10 w-12 h-12 bg-[#2a7de1] text-white rounded-full shadow-lg hover:bg-[#2268c4] flex items-center justify-center transition-all hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Side - Chat Panel */}
        {chatOpen && (
          <ChatPanel
            onAction={handleChatAction}
            filteredCount={filteredListings.length}
            totalCount={MOCK_LISTINGS.length}
            onClose={() => setChatOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
