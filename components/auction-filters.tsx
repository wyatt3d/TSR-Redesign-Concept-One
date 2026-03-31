"use client"

import { ChevronDown, X, Filter, Save, Settings, List, MapPin } from "lucide-react"

export function AuctionFilters() {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-[#2a7de1] text-[#2a7de1] rounded bg-blue-50">
          Auction Status
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
          State
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
          Jurisdiction
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
          Sale Venue
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
          Auction Type
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Min Sale Date"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded w-28"
          />
          <button className="p-1.5 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Max Sale Date"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded w-28"
          />
          <button className="p-1.5 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <Filter className="w-4 h-4" />
        </button>
        <button className="p-2 bg-[#2a7de1] text-white rounded">
          <Save className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <Settings className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <List className="w-4 h-4" />
        </button>
        <button className="p-2 bg-[#2a7de1] text-white rounded">
          <MapPin className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
