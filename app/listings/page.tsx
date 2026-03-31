"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { SourceBadge } from "@/components/source-badge"
import { MOCK_LISTINGS } from "@/lib/mock-listings"
import { SOURCES, PROPERTY_TYPES, type SourceId, type Listing } from "@/lib/types"
import { usePreferences } from "@/hooks/use-preferences"
import {
  ArrowUpDown,
  ChevronDown,
  Grid3X3,
  List,
  MapPin,
  Building2,
  Calendar,
  TrendingUp,
  Layers,
  ExternalLink,
} from "lucide-react"

type SortKey = "price" | "daysOnMarket" | "capRate" | "sqft" | "city"
type ViewMode = "table" | "grid"

export default function ListingsPage() {
  const { preferences, loaded } = usePreferences()
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortKey, setSortKey] = useState<SortKey>("daysOnMarket")
  const [sortAsc, setSortAsc] = useState(true)
  const [sourceFilter, setSourceFilter] = useState<SourceId | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 50

  const filteredListings = useMemo(() => {
    let items = [...MOCK_LISTINGS]
    if (sourceFilter !== "all") {
      items = items.filter((l) => l.source === sourceFilter)
    }
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
  }, [sourceFilter, sortKey, sortAsc])

  const totalPages = Math.ceil(filteredListings.length / perPage)
  const paged = filteredListings.slice((currentPage - 1) * perPage, currentPage * perPage)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ field }: { field: SortKey }) => (
    <button onClick={() => toggleSort(field)} className="ml-1 text-gray-400 hover:text-gray-600">
      <ArrowUpDown className="w-3 h-3" />
    </button>
  )

  const dealLabel: Record<string, { text: string; cls: string }> = {
    for_sale: { text: "For Sale", cls: "bg-blue-50 text-blue-700" },
    for_lease: { text: "Lease", cls: "bg-purple-50 text-purple-700" },
    auction: { text: "Auction", cls: "bg-red-50 text-red-700" },
    foreclosure: { text: "Foreclosure", cls: "bg-red-50 text-red-700" },
    reo: { text: "REO", cls: "bg-orange-50 text-orange-700" },
  }

  if (!loaded) return null

  // Count by source
  const sourceCounts: Partial<Record<SourceId, number>> = {}
  MOCK_LISTINGS.forEach((l) => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1 })

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Source filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value as SourceId | "all"); setCurrentPage(1) }}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-[#2a7de1] focus:outline-none"
            >
              <option value="all">All Sources ({MOCK_LISTINGS.length})</option>
              {SOURCES.filter((s) => sourceCounts[s.id]).map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({sourceCounts[s.id]})</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("table")} className={`p-2 ${viewMode === "table" ? "bg-[#2a7de1] text-white" : "text-gray-500 hover:text-gray-700"}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-[#2a7de1] text-white" : "text-gray-500 hover:text-gray-700"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Map link */}
          <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Layers className="w-3.5 h-3.5" />
            Map View
          </a>
        </div>

        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-900">{filteredListings.length.toLocaleString()}</span> listings
        </div>
      </div>

      {/* Source pills */}
      <div className="border-b border-gray-100 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide flex-shrink-0">Active:</span>
        {SOURCES.filter((s) => sourceCounts[s.id]).slice(0, 15).map((source) => (
          <button
            key={source.id}
            onClick={() => { setSourceFilter(sourceFilter === source.id ? "all" : source.id); setCurrentPage(1) }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border flex-shrink-0 transition-all ${
              sourceFilter === source.id
                ? "text-white border-transparent"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            style={sourceFilter === source.id ? { backgroundColor: source.color } : {}}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sourceFilter === source.id ? "rgba(255,255,255,0.5)" : source.color }} />
            {source.shortName}
            <span className={sourceFilter === source.id ? "text-white/70" : "text-gray-400"}>{sourceCounts[source.id]}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wide">Source</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Property <SortIcon field="city" />
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wide">Deal</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Price <SortIcon field="price" />
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Cap Rate <SortIcon field="capRate" />
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 text-xs uppercase tracking-wide">
                    SF <SortIcon field="sqft" />
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 text-xs uppercase tracking-wide">
                    DOM <SortIcon field="daysOnMarket" />
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-500 text-xs uppercase tracking-wide w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((listing) => {
                  const pt = PROPERTY_TYPES.find((p) => p.id === listing.propertyType)
                  const dl = dealLabel[listing.dealType]
                  return (
                    <tr key={listing.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <SourceBadge sourceId={listing.source} size="xs" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 text-sm">{listing.address}</div>
                        <div className="text-xs text-gray-500">{listing.city}, {listing.state} {listing.zip}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">{pt?.label}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${dl.cls}`}>{dl.text}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">{listing.priceLabel}</td>
                      <td className="py-3 px-4 text-right">
                        {listing.capRate ? (
                          <span className="text-green-600 font-medium">{listing.capRate}%</span>
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {listing.sqft ? listing.sqft.toLocaleString() : <span className="text-gray-300">&mdash;</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={listing.daysOnMarket < 7 ? "text-green-600 font-medium" : "text-gray-500"}>
                          {listing.daysOnMarket}d
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="p-1 text-gray-400 hover:text-[#2a7de1]">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid view */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paged.map((listing) => {
              const source = SOURCES.find((s) => s.id === listing.source)
              const pt = PROPERTY_TYPES.find((p) => p.id === listing.propertyType)
              const dl = dealLabel[listing.dealType]
              return (
                <div key={listing.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-200" />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <SourceBadge sourceId={listing.source} size="xs" />
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${dl.cls}`}>{dl.text}</span>
                    </div>
                    {listing.tags.includes("new") && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{listing.priceLabel}</div>
                    <div className="text-xs text-gray-600 mb-1">{listing.address}</div>
                    <div className="text-[11px] text-gray-400 mb-2">{listing.city}, {listing.state} &middot; {pt?.label}</div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                      <span>{listing.daysOnMarket}d &middot; {source?.shortName}</span>
                      {listing.capRate && <span className="text-green-600 font-medium">{listing.capRate}% cap</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredListings.length)}</span> of{" "}
            <span className="font-medium text-gray-900">{filteredListings.length.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 text-sm text-[#2a7de1] hover:bg-gray-50 rounded disabled:opacity-30"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                  currentPage === page ? "bg-[#2a7de1] text-white" : "text-[#2a7de1] hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 7 && <span className="px-1 text-gray-400">...</span>}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 text-sm text-[#2a7de1] hover:bg-gray-50 rounded disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
