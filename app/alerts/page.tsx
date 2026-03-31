"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SourceBadge } from "@/components/source-badge"
import { SOURCES, PROPERTY_TYPES } from "@/lib/types"
import {
  Bell,
  Plus,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
} from "lucide-react"

interface SavedAlert {
  id: string
  name: string
  sources: string[]
  propertyTypes: string[]
  states: string[]
  priceRange: string
  frequency: string
  enabled: boolean
  lastTriggered: string
  matchCount: number
}

const MOCK_ALERTS: SavedAlert[] = [
  {
    id: "1",
    name: "FL Multifamily Under $5M",
    sources: ["crexi", "loopnet", "marcus_millichap"],
    propertyTypes: ["multifamily"],
    states: ["FL"],
    priceRange: "$500K - $5M",
    frequency: "Daily",
    enabled: true,
    lastTriggered: "2 hours ago",
    matchCount: 14,
  },
  {
    id: "2",
    name: "Tax Foreclosures - Southeast",
    sources: ["tax_foreclosure", "mortgage_foreclosure"],
    propertyTypes: ["single_family", "multifamily", "land"],
    states: ["FL", "GA", "NC", "SC", "TN", "AL"],
    priceRange: "Any",
    frequency: "Real-time",
    enabled: true,
    lastTriggered: "35 min ago",
    matchCount: 47,
  },
  {
    id: "3",
    name: "Industrial / Warehouse - TX",
    sources: ["crexi", "loopnet", "cbre", "cushman_wakefield"],
    propertyTypes: ["industrial", "warehouse"],
    states: ["TX"],
    priceRange: "$1M - $20M",
    frequency: "Weekly",
    enabled: false,
    lastTriggered: "3 days ago",
    matchCount: 8,
  },
  {
    id: "4",
    name: "High Cap Rate Retail",
    sources: ["crexi", "loopnet", "biproxi"],
    propertyTypes: ["retail"],
    states: [],
    priceRange: "$200K - $3M",
    frequency: "Daily",
    enabled: true,
    lastTriggered: "6 hours ago",
    matchCount: 22,
  },
  {
    id: "5",
    name: "Government Auctions - Nationwide",
    sources: ["hud", "treasury_gov", "gsa_auctions", "usda"],
    propertyTypes: [],
    states: [],
    priceRange: "Any",
    frequency: "Daily",
    enabled: true,
    lastTriggered: "1 day ago",
    matchCount: 5,
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)

  const toggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Saved Alerts</h1>
            <p className="text-sm text-gray-500 mt-0.5">Get notified when new listings match your criteria</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2a7de1] text-white text-sm font-medium rounded-lg hover:bg-[#2268c4] transition-colors">
            <Plus className="w-4 h-4" />
            New Alert
          </button>
        </div>

        {/* Alert Cards */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                alert.enabled ? "border-gray-200" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="px-5 py-4 flex items-start justify-between">
                <div className="flex-1">
                  {/* Title row */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-2 h-2 rounded-full ${alert.enabled ? "bg-green-500" : "bg-gray-300"}`} />
                    <h3 className="text-sm font-semibold text-gray-900">{alert.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                      {alert.frequency}
                    </span>
                    {alert.matchCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-[#2a7de1] rounded font-semibold">
                        {alert.matchCount} matches
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 ml-5">
                    {/* Sources */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">Sources:</span>
                      <div className="flex items-center gap-1">
                        {alert.sources.slice(0, 3).map((sid) => (
                          <SourceBadge key={sid} sourceId={sid as any} size="xs" />
                        ))}
                        {alert.sources.length > 3 && (
                          <span className="text-gray-400">+{alert.sources.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Property types */}
                    {alert.propertyTypes.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <span>{alert.propertyTypes.map((pt) => PROPERTY_TYPES.find((p) => p.id === pt)?.label).join(", ")}</span>
                      </div>
                    )}

                    {/* States */}
                    {alert.states.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{alert.states.join(", ")}</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span>{alert.priceRange}</span>
                    </div>

                    {/* Last triggered */}
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{alert.lastTriggered}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleAlert(alert.id)} className="text-gray-400 hover:text-[#2a7de1]">
                    {alert.enabled ? (
                      <ToggleRight className="w-7 h-7 text-[#2a7de1]" />
                    ) : (
                      <ToggleLeft className="w-7 h-7" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-lg">
            <Bell className="w-4 h-4 text-[#2a7de1]" />
            <span className="text-sm text-[#2a7de1]">
              Pro tip: Create alerts from the Map or Listings page by saving your current filters
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
