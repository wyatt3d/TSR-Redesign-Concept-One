"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { MapSidebar } from "@/components/map-sidebar"
import { ListingCard } from "@/components/listing-card"
import { SourceBadge } from "@/components/source-badge"
import { ChatPanel } from "@/components/chat-panel"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { MOCK_LISTINGS } from "@/lib/mock-listings"
import { STATE_LISTINGS, NATIONAL_TOTAL, getCountiesForState, formatCount, getDensityColor, STATE_FIPS, matchCountyName, type CountyData } from "@/lib/geo-data"
import { SOURCES, PROPERTY_TYPES, type SourceId, type PropertyType, type DealType, type Listing } from "@/lib/types"
import { usePreferences } from "@/hooks/use-preferences"
import { type ChatAction } from "@/lib/chat-types"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import {
  SlidersHorizontal, List, Layers, ZoomIn, ZoomOut, LocateFixed,
  MessageSquare, ArrowUpDown, ExternalLink, Building2, ChevronRight, X,
} from "lucide-react"

const statesGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
const countiesGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"

type ViewMode = "map" | "list"
type MapLevel = "national" | "state" | "county"
type SortKey = "price" | "daysOnMarket" | "capRate" | "sqft" | "city"

const DEAL_LABEL: Record<string, { text: string; cls: string }> = {
  for_sale: { text: "For Sale", cls: "bg-blue-50 text-blue-700" },
  for_lease: { text: "Lease", cls: "bg-purple-50 text-purple-700" },
  auction: { text: "Auction", cls: "bg-red-50 text-red-700" },
  foreclosure: { text: "Foreclosure", cls: "bg-red-50 text-red-700" },
  reo: { text: "REO", cls: "bg-orange-50 text-orange-700" },
}

export default function SearchPage() {
  const { preferences, loaded } = usePreferences()

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false)
  useEffect(() => {
    if (loaded) {
      const seen = localStorage.getItem("tsr_tutorial_seen")
      if (!seen) setShowTutorial(true)
    }
  }, [loaded])
  const completeTutorial = useCallback(() => {
    setShowTutorial(false)
    localStorage.setItem("tsr_tutorial_seen", "1")
  }, [])

  // View + panel state
  const [viewMode, setViewMode] = useState<ViewMode>("map")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  // Map drill-down state
  const [mapLevel, setMapLevel] = useState<MapLevel>("national")
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)
  const [hoveredCounty, setHoveredCounty] = useState<{ name: string; listings: number } | null>(null)

  // Zoom/pan state for the map
  const [mapPosition, setMapPosition] = useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [0, 0], zoom: 1 })

  const handleZoomIn = () => setMapPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 20) }))
  const handleZoomOut = () => setMapPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 0.5) }))
  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => setMapPosition(pos)

  // Reset zoom when map level changes
  useEffect(() => { setMapPosition({ coordinates: [0, 0], zoom: 1 }) }, [mapLevel, selectedState, selectedCounty])

  // Only allow right-click drag for panning (button=2), scroll wheel for zoom
  // Left click (button=0) passes through for clicking states/counties/pins
  const filterZoom = useCallback((evt: any) => {
    if (!evt) return true
    // Always allow wheel events (zoom)
    if (evt.type === "wheel") return true
    // For mouse events, only allow right button (2) for pan
    if (evt.type === "mousedown") return evt.button === 2
    return true
  }, [])

  // List view state
  const [sortKey, setSortKey] = useState<SortKey>("daysOnMarket")
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 50

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
  const [prevFilters, setPrevFilters] = useState<{
    sources: SourceId[]; propertyTypes: PropertyType[]; dealTypes: DealType[]
    mapLevel: MapLevel; selectedState: string | null; selectedCounty: string | null
  } | null>(null)

  const toggleSource = (id: SourceId) => { setSelectedSources((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]); setCurrentPage(1) }
  const togglePropertyType = (id: PropertyType) => { setSelectedPropertyTypes((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]); setCurrentPage(1) }
  const toggleDealType = (id: DealType) => { setSelectedDealTypes((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]); setCurrentPage(1) }

  const handleChatAction = useCallback((action: ChatAction) => {
    switch (action.type) {
      case "APPLY_FILTERS": {
        setPrevFilters({
          sources: selectedSources,
          propertyTypes: selectedPropertyTypes,
          dealTypes: selectedDealTypes,
          mapLevel,
          selectedState,
          selectedCounty,
        })
        const f = action.filters
        if (f.sources) setSelectedSources(f.sources)
        if (f.propertyTypes) setSelectedPropertyTypes(f.propertyTypes)
        if (f.dealTypes) setSelectedDealTypes(f.dealTypes)
        // If a state filter is specified, drill into that state on the map
        if (f.states && f.states.length === 1) {
          const stateInfo = STATE_LISTINGS.find((s) => s.abbr === f.states![0])
          if (stateInfo) {
            setSelectedState(stateInfo.abbr)
            setMapLevel("state")
            setSelectedCounty(null)
            setSelectedListing(null)
          }
        }
        setCurrentPage(1)
        break
      }
      case "UNDO_FILTERS": {
        if (prevFilters) {
          setSelectedSources(prevFilters.sources)
          setSelectedPropertyTypes(prevFilters.propertyTypes)
          setSelectedDealTypes(prevFilters.dealTypes)
          setMapLevel(prevFilters.mapLevel)
          setSelectedState(prevFilters.selectedState)
          setSelectedCounty(prevFilters.selectedCounty)
          setSelectedListing(null)
          setPrevFilters(null)
          setCurrentPage(1)
        }
        break
      }
    }
  }, [selectedSources, selectedPropertyTypes, selectedDealTypes, prevFilters])

  // ─── Map drill-down handlers ────────────────────────────────
  const handleStateClick = (stateName: string) => {
    const stateInfo = STATE_LISTINGS.find((s) => s.name === stateName)
    if (stateInfo) {
      setSelectedState(stateInfo.abbr)
      setMapLevel("state")
      setSelectedCounty(null)
      setSelectedListing(null)
    }
  }

  const handleCountyClick = (county: CountyData) => {
    setSelectedCounty(county.name)
    setMapLevel("county")
    setSelectedListing(null)
  }

  const handleBackToNational = () => {
    setMapLevel("national")
    setSelectedState(null)
    setSelectedCounty(null)
    setSelectedListing(null)
  }

  const handleBackToState = () => {
    setMapLevel("state")
    setSelectedCounty(null)
    setSelectedListing(null)
  }

  // County data for current state
  const countyData = useMemo(() => {
    if (!selectedState) return []
    const stateInfo = STATE_LISTINGS.find((s) => s.abbr === selectedState)
    if (!stateInfo) return []
    return getCountiesForState(selectedState, stateInfo.totalListings)
  }, [selectedState])

  // ─── Filtered listings (for list view + county drill-down) ──
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      if (!selectedSources.includes(l.source)) return false
      if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes(l.propertyType)) return false
      if (!selectedDealTypes.includes(l.dealType)) return false
      if (selectedState && l.state !== selectedState) return false
      if (selectedCounty && l.county !== selectedCounty) return false
      return true
    })
  }, [selectedSources, selectedPropertyTypes, selectedDealTypes, selectedState, selectedCounty])

  const sortedListings = useMemo(() => {
    const items = [...filteredListings]
    items.sort((a, b) => {
      let av: number, bv: number
      switch (sortKey) {
        case "price": av = a.price ?? 0; bv = b.price ?? 0; break
        case "daysOnMarket": av = a.daysOnMarket; bv = b.daysOnMarket; break
        case "capRate": av = a.capRate ?? 0; bv = b.capRate ?? 0; break
        case "sqft": av = a.sqft ?? 0; bv = b.sqft ?? 0; break
        case "city": return sortAsc ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city)
        default: av = 0; bv = 0
      }
      return sortAsc ? av - bv : bv - av
    })
    return items
  }, [filteredListings, sortKey, sortAsc])

  const totalPages = Math.ceil(sortedListings.length / perPage)
  const pagedListings = sortedListings.slice((currentPage - 1) * perPage, currentPage * perPage)

  const sourceCounts = useMemo(() => {
    const counts: Partial<Record<SourceId, number>> = {}
    filteredListings.forEach((l) => { counts[l.source] = (counts[l.source] || 0) + 1 })
    return counts
  }, [filteredListings])
  const activeSourceIds = Object.keys(sourceCounts) as SourceId[]

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
    setCurrentPage(1)
  }

  // ─── Filter-reactive heatmap counts ──────────────────────────
  // Compute a filter multiplier: what fraction of all possible listings
  // pass the current source + property type + deal type filters.
  // This scales the static state/county counts proportionally.
  const filterMultiplier = useMemo(() => {
    const totalSources = SOURCES.length
    const activeSources = selectedSources.length
    const sourceRatio = activeSources / totalSources

    // Deal type ratio (5 total deal types)
    const totalDeals = 5
    const activeDeals = selectedDealTypes.length
    const dealRatio = activeDeals / totalDeals

    // Property type ratio — if none selected, means "all"
    const ptRatio = selectedPropertyTypes.length === 0 ? 1 : selectedPropertyTypes.length / 14

    return sourceRatio * dealRatio * ptRatio
  }, [selectedSources, selectedDealTypes, selectedPropertyTypes])

  // Adjusted state/county data
  const adjustedStates = useMemo(() =>
    STATE_LISTINGS.map((s) => ({
      ...s,
      adjustedListings: Math.round(s.totalListings * filterMultiplier),
    })),
    [filterMultiplier]
  )

  const adjustedCounties = useMemo(() =>
    countyData.map((c) => ({
      ...c,
      adjustedListings: Math.round(c.listings * filterMultiplier),
    })),
    [countyData, filterMultiplier]
  )

  const maxStateListings = Math.max(...adjustedStates.map((s) => s.adjustedListings), 1)
  const maxCountyListings = adjustedCounties.length > 0 ? Math.max(...adjustedCounties.map((c) => c.adjustedListings), 1) : 1

  const adjustedNationalTotal = Math.round(NATIONAL_TOTAL * filterMultiplier)

  // Display count depends on level
  const displayCount = mapLevel === "national"
    ? adjustedNationalTotal
    : mapLevel === "state"
    ? adjustedStates.find((s) => s.abbr === selectedState)?.adjustedListings ?? 0
    : filteredListings.length

  if (!loaded) return null

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {sidebarOpen && (
          <div data-tutorial="sidebar">
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
          </div>
        )}

        {/* Center Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-[#f0f4f8]">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 z-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                </button>
              )}

              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden" data-tutorial="view-toggle">
                <button onClick={() => setViewMode("map")} className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "map" ? "bg-[#2a7de1] text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  <Layers className="w-3.5 h-3.5" /> Map
                </button>
                <button onClick={() => { setViewMode("list"); setCurrentPage(1) }} className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-[#2a7de1] text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>

              {/* Breadcrumb (map drill-down) */}
              {viewMode === "map" && (
                <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                  <button onClick={handleBackToNational} className={`hover:text-[#2a7de1] ${mapLevel === "national" ? "font-semibold text-gray-700" : ""}`}>
                    United States
                  </button>
                  {selectedState && (
                    <>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <button onClick={handleBackToState} className={`hover:text-[#2a7de1] ${mapLevel === "state" ? "font-semibold text-gray-700" : ""}`}>
                        {selectedState}
                      </button>
                    </>
                  )}
                  {selectedCounty && (
                    <>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span className="font-semibold text-gray-700">{selectedCounty}</span>
                    </>
                  )}
                </div>
              )}

              {/* Count */}
              <span className="text-xs text-gray-500 ml-1">
                <span className="font-semibold text-gray-700">{formatCount(displayCount)}</span> listings
              </span>
            </div>

            {/* Source dots */}
            <div className="flex items-center gap-2.5 overflow-x-auto">
              {activeSourceIds.slice(0, 8).map((sid) => {
                const src = SOURCES.find((s) => s.id === sid)
                if (!src) return null
                return (
                  <div key={sid} className="flex items-center gap-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color }} />
                    <span className="text-[10px] text-gray-500 font-medium">{src.shortName}</span>
                  </div>
                )
              })}
              {activeSourceIds.length > 8 && (
                <span className="text-[10px] text-gray-400">+{activeSourceIds.length - 8}</span>
              )}
            </div>
          </div>

          {/* ─── MAP VIEW ──────────────────────────────────── */}
          {viewMode === "map" && (
            <div className="flex-1 relative" data-tutorial="map-area" onContextMenu={(e) => e.preventDefault()}>
              {/* National level: AlbersUsa choropleth */}
              {mapLevel === "national" && (
                <div className="w-full h-full">
                  <ComposableMap
                    projection="geoAlbersUsa"
                    projectionConfig={{ scale: 1100 }}
                    width={960}
                    height={600}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <ZoomableGroup
                      center={mapPosition.coordinates}
                      zoom={mapPosition.zoom}
                      onMoveEnd={handleMoveEnd}
                      minZoom={0.5}
                      maxZoom={20}
                    >
                    <Geographies geography={statesGeoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const stateName = geo.properties.name
                          const adj = adjustedStates.find((s) => s.name === stateName)
                          const count = adj?.adjustedListings ?? 0
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={getDensityColor(count, maxStateListings)}
                              stroke="#fff"
                              strokeWidth={0.75}
                              onClick={() => handleStateClick(stateName)}
                              style={{
                                default: { outline: "none", cursor: "pointer" },
                                hover: { outline: "none", fill: "#1e40af", cursor: "pointer" },
                                pressed: { outline: "none" },
                              }}
                            />
                          )
                        })
                      }
                    </Geographies>
                    {adjustedStates.filter((s) => s.adjustedListings > 5000).map((si) => (
                      <Marker key={si.abbr} coordinates={si.coords}>
                        <text textAnchor="middle" dominantBaseline="middle" style={{
                          fontFamily: "system-ui",
                          fill: "#fff",
                          fontSize: "9px",
                          fontWeight: "bold",
                          textShadow: "0 1px 3px rgba(0,0,0,0.6), 0 0px 1px rgba(0,0,0,0.4)",
                          pointerEvents: "none",
                        }}>
                          {formatCount(si.adjustedListings)}
                        </text>
                      </Marker>
                    ))}
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
              )}

              {/* State level: county boundary polygons from census data */}
              {mapLevel === "state" && (() => {
                const si = STATE_LISTINGS.find((s) => s.abbr === selectedState)
                if (!si) return null
                const fips = STATE_FIPS[si.abbr]
                return (
                  <div className="w-full h-full">
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{ center: si.center, scale: si.scale }}
                      width={960}
                      height={600}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <ZoomableGroup
                        filterZoomEvent={filterZoom}
                        minZoom={0.5}
                        maxZoom={20}
                      >
                      {/* County boundaries */}
                      <Geographies geography={countiesGeoUrl}>
                        {({ geographies }) => {
                          // Filter to counties in this state (FIPS prefix)
                          const stateCounties = geographies.filter(
                            (geo) => String(geo.id).padStart(5, "0").startsWith(fips)
                          )
                          return stateCounties.map((geo) => {
                            const countyName = geo.properties.name
                            const matched = matchCountyName(countyName, adjustedCounties)
                            const listings = matched?.adjustedListings ?? 0
                            // Unmatched counties get a share of "Other Counties"
                            const otherCounty = adjustedCounties.find((c) =>
                              c.name.startsWith("Other")
                            )
                            const displayCount = listings > 0 ? listings : Math.round((otherCounty?.adjustedListings ?? 0) / 20)
                            const fillColor = displayCount > 0 ? getDensityColor(displayCount, maxCountyListings) : "#e5e7eb"

                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={fillColor}
                                stroke="#fff"
                                strokeWidth={0.5}
                                onClick={() => {
                                  const cd: CountyData = matched ?? {
                                    name: countyName,
                                    state: si.abbr,
                                    listings: displayCount,
                                    coords: si.center,
                                  }
                                  handleCountyClick(cd)
                                }}
                                onMouseEnter={() => setHoveredCounty({ name: countyName, listings: displayCount })}
                                onMouseLeave={() => setHoveredCounty(null)}
                                style={{
                                  default: { outline: "none", cursor: "pointer" },
                                  hover: { outline: "none", fill: "#1e40af", cursor: "pointer" },
                                  pressed: { outline: "none" },
                                }}
                              />
                            )
                          })
                        }}
                      </Geographies>

                      {/* County count labels for major counties */}
                      {adjustedCounties
                        .filter((c) => !c.name.startsWith("Other") && c.adjustedListings > 0)
                        .map((county) => (
                          <Marker key={county.name} coordinates={county.coords}>
                            <text textAnchor="middle" dominantBaseline="middle" dy={-1} style={{
                              fontFamily: "system-ui", fill: "#fff", fontSize: "8px", fontWeight: "bold",
                              pointerEvents: "none",
                              textShadow: "0 1px 3px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.6)",
                            }}>
                              {formatCount(county.adjustedListings)}
                            </text>
                          </Marker>
                        ))
                      }
                      </ZoomableGroup>
                    </ComposableMap>

                    {/* Hover tooltip */}
                    {hoveredCounty && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-2 pointer-events-none">
                        <span className="text-sm font-semibold text-gray-900">{hoveredCounty.name} County</span>
                        <span className="text-sm text-gray-500 ml-2">{hoveredCounty.listings.toLocaleString()} listings</span>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* County level: zoomed to county, individual pins */}
              {mapLevel === "county" && (() => {
                const si = STATE_LISTINGS.find((s) => s.abbr === selectedState)
                const ci = countyData.find((c) => c.name === selectedCounty)
                if (!si) return null
                const countyCenter: [number, number] = ci ? ci.coords : si.center
                const countyScale = si.scale * 2.5
                const fips = STATE_FIPS[si.abbr]
                return (
                  <div className="w-full h-full">
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{ center: countyCenter, scale: countyScale }}
                      width={960}
                      height={600}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <ZoomableGroup
                        filterZoomEvent={filterZoom}
                        minZoom={0.5}
                        maxZoom={20}
                      >
                      {/* County boundaries as context */}
                      <Geographies geography={countiesGeoUrl}>
                        {({ geographies }) => {
                          const stateCounties = geographies.filter(
                            (geo) => String(geo.id).padStart(5, "0").startsWith(fips)
                          )
                          return stateCounties.map((geo) => {
                            const isTarget = geo.properties.name === selectedCounty
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={isTarget ? "#dbeafe" : "#f3f4f6"}
                                stroke={isTarget ? "#93c5fd" : "#d1d5db"}
                                strokeWidth={isTarget ? 1.5 : 0.5}
                                style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                              />
                            )
                          })
                        }}
                      </Geographies>
                      {filteredListings.map((listing) => {
                        const source = SOURCES.find((s) => s.id === listing.source)
                        if (!source) return null
                        return (
                          <Marker key={listing.id} coordinates={[listing.lng, listing.lat]} onClick={() => setSelectedListing(listing)}>
                            <circle r={5} fill={source.color} stroke="#fff" strokeWidth={1.5} style={{ cursor: "pointer" }} opacity={0.9} />
                          </Marker>
                        )
                      })}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                )
              })()}

              {/* Back button (state/county levels) */}
              {mapLevel !== "national" && (
                <button
                  onClick={mapLevel === "county" ? handleBackToState : handleBackToNational}
                  className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  Back to {mapLevel === "county" ? selectedState : "US"}
                </button>
              )}

              {/* Map controls */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                <button onClick={handleZoomIn} className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleZoomOut} className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selected listing card (county level only) */}
              {selectedListing && mapLevel === "county" && (
                <div className="absolute top-16 right-14 z-20">
                  <ListingCard listing={selectedListing} onClose={() => setSelectedListing(null)} />
                </div>
              )}

              {/* Level hint */}
              {mapLevel === "national" && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow border border-gray-200 px-4 py-2 text-xs text-gray-500">
                  Click a state to drill down &middot; <span className="font-semibold text-gray-700">{formatCount(adjustedNationalTotal)}</span> listings match your filters
                </div>
              )}
              {mapLevel === "state" && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow border border-gray-200 px-4 py-2 text-xs text-gray-500">
                  Click a county to see individual listings
                </div>
              )}
            </div>
          )}

          {/* ─── LIST VIEW ─────────────────────────────────── */}
          {viewMode === "list" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                      <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        <button onClick={() => toggleSort("city")} className="flex items-center gap-1 hover:text-gray-700">Property <ArrowUpDown className="w-3 h-3" /></button>
                      </th>
                      <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                      <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Deal</th>
                      <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        <button onClick={() => toggleSort("price")} className="flex items-center gap-1 ml-auto hover:text-gray-700">Price <ArrowUpDown className="w-3 h-3" /></button>
                      </th>
                      <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        <button onClick={() => toggleSort("capRate")} className="flex items-center gap-1 ml-auto hover:text-gray-700">Cap <ArrowUpDown className="w-3 h-3" /></button>
                      </th>
                      <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        <button onClick={() => toggleSort("sqft")} className="flex items-center gap-1 ml-auto hover:text-gray-700">SF <ArrowUpDown className="w-3 h-3" /></button>
                      </th>
                      <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        <button onClick={() => toggleSort("daysOnMarket")} className="flex items-center gap-1 ml-auto hover:text-gray-700">DOM <ArrowUpDown className="w-3 h-3" /></button>
                      </th>
                      <th className="py-2.5 px-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedListings.map((listing) => {
                      const pt = PROPERTY_TYPES.find((p) => p.id === listing.propertyType)
                      const dl = DEAL_LABEL[listing.dealType]
                      return (
                        <tr key={listing.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                          <td className="py-2.5 px-4"><SourceBadge sourceId={listing.source} size="xs" /></td>
                          <td className="py-2.5 px-4">
                            <div className="font-medium text-gray-900 text-sm leading-tight">{listing.address}</div>
                            <div className="text-[11px] text-gray-500">{listing.city}, {listing.state} {listing.zip}</div>
                          </td>
                          <td className="py-2.5 px-4 text-xs text-gray-600">{pt?.label}</td>
                          <td className="py-2.5 px-4"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${dl.cls}`}>{dl.text}</span></td>
                          <td className="py-2.5 px-4 text-right font-semibold text-gray-900 text-sm">{listing.priceLabel}</td>
                          <td className="py-2.5 px-4 text-right">
                            {listing.capRate ? <span className="text-green-600 font-medium text-sm">{listing.capRate}%</span> : <span className="text-gray-300">&mdash;</span>}
                          </td>
                          <td className="py-2.5 px-4 text-right text-sm text-gray-600">
                            {listing.sqft ? listing.sqft.toLocaleString() : <span className="text-gray-300">&mdash;</span>}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span className={`text-sm ${listing.daysOnMarket < 7 ? "text-green-600 font-medium" : "text-gray-500"}`}>{listing.daysOnMarket}d</span>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button className="p-1 text-gray-400 hover:text-[#2a7de1]"><ExternalLink className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{(currentPage - 1) * perPage + 1}&ndash;{Math.min(currentPage * perPage, sortedListings.length)}</span> of{" "}
                  <span className="font-medium text-gray-700">{sortedListings.length.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-2.5 py-1 text-xs text-[#2a7de1] hover:bg-gray-50 rounded disabled:opacity-30">Prev</button>
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 flex items-center justify-center rounded text-xs ${currentPage === page ? "bg-[#2a7de1] text-white" : "text-[#2a7de1] hover:bg-gray-50"}`}>{page}</button>
                  ))}
                  {totalPages > 7 && <span className="px-1 text-gray-400 text-xs">...</span>}
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-2.5 py-1 text-xs text-[#2a7de1] hover:bg-gray-50 rounded disabled:opacity-30">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Chat FAB */}
          {!chatOpen && (
            <button onClick={() => setChatOpen(true)} className="absolute bottom-6 right-4 z-10 w-12 h-12 bg-[#2a7de1] text-white rounded-full shadow-lg hover:bg-[#2268c4] flex items-center justify-center transition-all hover:scale-105">
              <MessageSquare className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Chat Panel */}
        {chatOpen && (
          <div data-tutorial="chat">
          <ChatPanel onAction={handleChatAction} filteredCount={filteredListings.length} totalCount={MOCK_LISTINGS.length} onClose={() => setChatOpen(false)} />
          </div>
        )}
      </div>

      {/* Tutorial overlay */}
      {showTutorial && <TutorialOverlay onComplete={completeTutorial} />}
    </div>
  )
}
