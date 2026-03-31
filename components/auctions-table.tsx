"use client"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"

interface AuctionRow {
  jurisdiction: string
  state: string
  saleDate: string
  postDate: string
  auctionType: string
  saleVenue: string
  biddingProcedures: string
  parcels: number
  aggregateSaleAmount: string
}

const auctionData: AuctionRow[] = [
  {
    jurisdiction: "Washington County",
    state: "Mississippi",
    saleDate: "04/06/2026",
    postDate: "03/23/2026",
    auctionType: "Lien",
    saleVenue: "Online",
    biddingProcedures: "Bid Up or Premium",
    parcels: 5316,
    aggregateSaleAmount: "$5,702,315.61",
  },
  {
    jurisdiction: "Camden City (Camden)",
    state: "New Jersey",
    saleDate: "04/06/2026",
    postDate: "03/10/2026",
    auctionType: "Lien",
    saleVenue: "Online",
    biddingProcedures: "Bid Down",
    parcels: 4899,
    aggregateSaleAmount: "$5,736,500.91",
  },
  {
    jurisdiction: "Coahoma County",
    state: "Mississippi",
    saleDate: "04/06/2026",
    postDate: "03/24/2026",
    auctionType: "Lien",
    saleVenue: "Online",
    biddingProcedures: "Bid Up or Premium",
    parcels: 2659,
    aggregateSaleAmount: "$2,359,637.96",
  },
  {
    jurisdiction: "Sunflower County",
    state: "Mississippi",
    saleDate: "04/06/2026",
    postDate: "03/24/2026",
    auctionType: "Lien",
    saleVenue: "Online",
    biddingProcedures: "Bid Up or Premium",
    parcels: 2441,
    aggregateSaleAmount: "$2,305,248.98",
  },
  {
    jurisdiction: "Bolivar County",
    state: "Mississippi",
    saleDate: "04/06/2026",
    postDate: "03/24/2026",
    auctionType: "Lien",
    saleVenue: "Online",
    biddingProcedures: "Bid Up or Premium",
    parcels: 2054,
    aggregateSaleAmount: "$2,347,668.95",
  },
  {
    jurisdiction: "West Point City (Clay)",
    state: "Mississippi",
    saleDate: "04/06/2026",
    postDate: "03/23/2026",
    auctionType: "Lien",
    saleVenue: "Online",
    biddingProcedures: "Bid Up or Premium",
    parcels: 1581,
    aggregateSaleAmount: "$975,124.24",
  },
]

export function AuctionsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalItems = 810
  const itemsPerPage = 100

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Jurisdiction
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  State
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Sale Date
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Post Date
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Auction Type
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Sale Venue
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Bidding Procedures
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  # of Parcels
                  <span className="text-[#2a7de1]">▲</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Aggregate Sale Amount
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {auctionData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-[#2a7de1]">{row.jurisdiction}</td>
                <td className="py-3 px-4 text-gray-600">{row.state}</td>
                <td className="py-3 px-4 text-gray-600">{row.saleDate}</td>
                <td className="py-3 px-4 text-gray-600">{row.postDate}</td>
                <td className="py-3 px-4 text-gray-600">{row.auctionType}</td>
                <td className="py-3 px-4 text-gray-600">{row.saleVenue}</td>
                <td className="py-3 px-4 text-[#2a7de1]">{row.biddingProcedures}</td>
                <td className="py-3 px-4 text-[#2a7de1]">{row.parcels.toLocaleString()}</td>
                <td className="py-3 px-4 text-[#2a7de1]">{row.aggregateSaleAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-4">
        <div className="text-sm text-gray-600">
          Displaying auctions <span className="font-medium">1 - 100</span> of <span className="font-medium">810</span> in total
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                currentPage === page
                  ? "bg-[#2a7de1] text-white"
                  : "text-[#2a7de1] hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 text-[#2a7de1] text-sm hover:bg-gray-100 rounded">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
