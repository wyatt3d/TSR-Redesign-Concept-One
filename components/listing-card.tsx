"use client"

import { SourceBadge } from "./source-badge"
import { SOURCES, PROPERTY_TYPES, type Listing } from "@/lib/types"
import { MapPin, Calendar, Ruler, Building2, TrendingUp, X } from "lucide-react"

interface ListingCardProps {
  listing: Listing
  onClose?: () => void
}

export function ListingCard({ listing, onClose }: ListingCardProps) {
  const source = SOURCES.find((s) => s.id === listing.source)
  const propType = PROPERTY_TYPES.find((p) => p.id === listing.propertyType)

  const dealLabel: Record<string, string> = {
    for_sale: "For Sale",
    for_lease: "For Lease",
    auction: "Auction",
    foreclosure: "Foreclosure",
    reo: "REO",
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-80">
      {/* Image placeholder */}
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="w-10 h-10 text-gray-300" />
        </div>
        {/* Source + Deal type badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <SourceBadge sourceId={listing.source} />
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            listing.dealType === "foreclosure" || listing.dealType === "auction"
              ? "bg-red-500 text-white"
              : listing.dealType === "reo"
              ? "bg-orange-500 text-white"
              : "bg-white/90 text-gray-700 border border-gray-200"
          }`}>
            {dealLabel[listing.dealType]}
          </span>
        </div>
        {listing.tags.includes("new") && (
          <span className="absolute top-2.5 right-2.5 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            NEW
          </span>
        )}
        {onClose && (
          <button onClick={onClose} className="absolute top-2.5 right-2.5 p-1 bg-black/30 rounded-full hover:bg-black/50">
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        {/* Price */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-lg font-bold text-gray-900">{listing.priceLabel}</span>
          {listing.capRate && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" />
              {listing.capRate}% cap
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm text-gray-900 font-medium leading-tight">{listing.address}</div>
            <div className="text-xs text-gray-500">{listing.city}, {listing.state} {listing.zip} &middot; {listing.county} County</div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {propType && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {propType.label}
            </span>
          )}
          {listing.sqft && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {listing.sqft.toLocaleString()} SF
            </span>
          )}
          {listing.units && (
            <span>{listing.units} units</span>
          )}
          {listing.lotAcres && listing.lotAcres > 1 && (
            <span>{listing.lotAcres} acres</span>
          )}
        </div>

        {/* Auction date if applicable */}
        {listing.auctionDate && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 px-2.5 py-1.5 rounded-lg mb-3">
            <Calendar className="w-3 h-3" />
            Auction: {new Date(listing.auctionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">{listing.daysOnMarket}d on market &middot; {source?.name}</span>
          <button className="text-xs font-semibold text-[#2a7de1] hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
