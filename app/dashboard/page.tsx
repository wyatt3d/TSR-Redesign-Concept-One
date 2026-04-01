"use client"

import { useMemo } from "react"
import { Header } from "@/components/header"
import { SourceBadge } from "@/components/source-badge"
import { MOCK_LISTINGS } from "@/lib/mock-listings"
import {
  SOURCES,
  PROPERTY_TYPES,
  SOURCE_CATEGORIES,
  type SourceId,
  type PropertyType,
  type SourceCategory,
} from "@/lib/types"
import {
  TrendingUp,
  ArrowRight,
} from "lucide-react"

export default function DashboardPage() {
  const stats = useMemo(() => {
    const bySource: Record<string, number> = {}
    const byProperty: Record<string, number> = {}
    const byState: Record<string, number> = {}
    const byDeal: Record<string, number> = {}
    let totalValue = 0
    let withCap = 0
    let capSum = 0
    let newCount = 0

    MOCK_LISTINGS.forEach((l) => {
      bySource[l.source] = (bySource[l.source] || 0) + 1
      byProperty[l.propertyType] = (byProperty[l.propertyType] || 0) + 1
      byState[l.state] = (byState[l.state] || 0) + 1
      byDeal[l.dealType] = (byDeal[l.dealType] || 0) + 1
      if (l.price) totalValue += l.price
      if (l.capRate) { withCap++; capSum += l.capRate }
      if (l.daysOnMarket < 7) newCount++
    })

    const avgCap = withCap > 0 ? (capSum / withCap).toFixed(1) : "N/A"

    const topSources = Object.entries(bySource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ source: SOURCES.find((s) => s.id === id)!, count }))

    const topStates = Object.entries(byState)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    const propertyBreakdown = Object.entries(byProperty)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({ type: PROPERTY_TYPES.find((p) => p.id === id)!, count }))

    const dealBreakdown = Object.entries(byDeal)
      .sort((a, b) => b[1] - a[1])

    return { totalValue, avgCap, newCount, topSources, topStates, propertyBreakdown, dealBreakdown, bySource }
  }, [])

  const dealLabel: Record<string, string> = {
    for_sale: "For Sale",
    for_lease: "For Lease",
    auction: "Auction",
    foreclosure: "Foreclosure",
    reo: "REO",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Total Listings</div>
            <div className="text-2xl font-bold text-gray-900">{MOCK_LISTINGS.length.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>{stats.newCount} new this week</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Active Sources</div>
            <div className="text-2xl font-bold text-gray-900">{Object.keys(stats.bySource).length}</div>
            <div className="text-xs text-gray-400 mt-1.5">of {SOURCES.length} configured</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Aggregate Value</div>
            <div className="text-2xl font-bold text-gray-900">${(stats.totalValue / 1e6).toFixed(0)}M</div>
            <div className="text-xs text-gray-400 mt-1.5">across all listings</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Avg Cap Rate</div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgCap}%</div>
            <div className="text-xs text-gray-400 mt-1.5">for sale listings</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Sources breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">By Source</h3>
              <a href="/listings" className="text-xs text-[#2a7de1] flex items-center gap-0.5 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-2.5">
              {stats.topSources.map(({ source, count }) => {
                const pct = (count / MOCK_LISTINGS.length) * 100
                return (
                  <div key={source.id} className="flex items-center gap-3">
                    <div className="w-16 flex-shrink-0">
                      <SourceBadge sourceId={source.id as SourceId} size="xs" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: source.color }} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium w-8 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Property type breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">By Property Type</h3>
            <div className="space-y-2.5">
              {stats.propertyBreakdown.slice(0, 10).map(({ type, count }) => {
                const pct = (count / MOCK_LISTINGS.length) * 100
                return (
                  <div key={type.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-28 flex-shrink-0 truncate">{type.label}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#2a7de1]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium w-8 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Markets + Deal breakdown */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Markets</h3>
              <div className="space-y-2">
                {stats.topStates.map(([state, count]) => (
                  <div key={state} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{state}</span>
                    <span className="text-xs font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Deal Types</h3>
              <div className="flex flex-wrap gap-2">
                {stats.dealBreakdown.map(([deal, count]) => (
                  <div key={deal} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">{dealLabel[deal] || deal}</span>
                    <span className="text-xs font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Source Category Table */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Source Coverage Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-2.5 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="py-2.5 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Sources</th>
                  <th className="py-2.5 px-5 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Listings</th>
                  <th className="py-2.5 px-5 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(SOURCE_CATEGORIES) as SourceCategory[]).map((cat) => {
                  const catSources = SOURCES.filter((s) => s.category === cat)
                  const catCount = catSources.reduce((sum, s) => sum + (stats.bySource[s.id] || 0), 0)
                  const pct = ((catCount / MOCK_LISTINGS.length) * 100).toFixed(1)
                  return (
                    <tr key={cat} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-5 font-medium text-gray-900">{SOURCE_CATEGORIES[cat].label}</td>
                      <td className="py-3 px-5">
                        <div className="flex flex-wrap gap-1">
                          {catSources.filter((s) => stats.bySource[s.id]).map((s) => (
                            <SourceBadge key={s.id} sourceId={s.id} size="xs" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right font-medium text-gray-900">{catCount}</td>
                      <td className="py-3 px-5 text-right text-gray-500">{pct}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
