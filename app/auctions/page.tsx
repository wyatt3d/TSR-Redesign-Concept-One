"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ArrowUpDown, ChevronDown, X, Filter, Save, Settings, MapPin, List, Calendar, Clock, Gavel } from "lucide-react"

// ─── Tab types ──────────────────────────────────────────────────
type AuctionTab = "upcoming" | "historical" | "otc"

// ─── Mock data ──────────────────────────────────────────────────
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

const upcomingAuctions: AuctionRow[] = [
  { jurisdiction: "Washington County", state: "Mississippi", saleDate: "04/06/2026", postDate: "03/23/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Up or Premium", parcels: 5316, aggregateSaleAmount: "$5,702,315.61" },
  { jurisdiction: "Camden City (Camden)", state: "New Jersey", saleDate: "04/06/2026", postDate: "03/10/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Down", parcels: 4899, aggregateSaleAmount: "$5,736,500.91" },
  { jurisdiction: "Coahoma County", state: "Mississippi", saleDate: "04/06/2026", postDate: "03/24/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Up or Premium", parcels: 2659, aggregateSaleAmount: "$2,359,637.96" },
  { jurisdiction: "Sunflower County", state: "Mississippi", saleDate: "04/06/2026", postDate: "03/24/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Up or Premium", parcels: 2441, aggregateSaleAmount: "$2,305,248.98" },
  { jurisdiction: "Bolivar County", state: "Mississippi", saleDate: "04/06/2026", postDate: "03/24/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Up or Premium", parcels: 2054, aggregateSaleAmount: "$2,347,668.95" },
  { jurisdiction: "West Point City (Clay)", state: "Mississippi", saleDate: "04/06/2026", postDate: "03/23/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Up or Premium", parcels: 1581, aggregateSaleAmount: "$975,124.24" },
  { jurisdiction: "Broward County", state: "Florida", saleDate: "04/08/2026", postDate: "03/15/2026", auctionType: "Deed", saleVenue: "Online", biddingProcedures: "Bid Up", parcels: 3412, aggregateSaleAmount: "$12,450,881.30" },
  { jurisdiction: "Cook County", state: "Illinois", saleDate: "04/10/2026", postDate: "03/20/2026", auctionType: "Lien", saleVenue: "In Person", biddingProcedures: "Bid Down", parcels: 8923, aggregateSaleAmount: "$45,200,110.00" },
  { jurisdiction: "Mecklenburg County", state: "North Carolina", saleDate: "04/12/2026", postDate: "03/18/2026", auctionType: "Deed", saleVenue: "Online", biddingProcedures: "Bid Up", parcels: 1245, aggregateSaleAmount: "$8,750,000.00" },
  { jurisdiction: "Harris County", state: "Texas", saleDate: "04/14/2026", postDate: "03/22/2026", auctionType: "Deed", saleVenue: "In Person", biddingProcedures: "Bid Up", parcels: 2180, aggregateSaleAmount: "$15,340,200.00" },
  { jurisdiction: "Maricopa County", state: "Arizona", saleDate: "04/15/2026", postDate: "03/25/2026", auctionType: "Lien", saleVenue: "Online", biddingProcedures: "Bid Down", parcels: 6750, aggregateSaleAmount: "$22,100,500.00" },
  { jurisdiction: "Richland County", state: "South Carolina", saleDate: "04/18/2026", postDate: "03/28/2026", auctionType: "Deed", saleVenue: "Online", biddingProcedures: "Bid Up or Premium", parcels: 980, aggregateSaleAmount: "$4,200,000.00" },
]

interface HistoricalRow {
  jurisdiction: string
  state: string
  saleDate: string
  auctionType: string
  saleVenue: string
  parcelsOffered: number
  parcelsSold: number
  totalCollected: string
  avgPremium: string
}

const historicalAuctions: HistoricalRow[] = [
  { jurisdiction: "Miami-Dade County", state: "Florida", saleDate: "03/15/2026", auctionType: "Deed", saleVenue: "Online", parcelsOffered: 4200, parcelsSold: 3180, totalCollected: "$18,450,200.00", avgPremium: "12.4%" },
  { jurisdiction: "Philadelphia County", state: "Pennsylvania", saleDate: "03/12/2026", auctionType: "Lien", saleVenue: "Online", parcelsOffered: 6800, parcelsSold: 5100, totalCollected: "$32,100,000.00", avgPremium: "8.2%" },
  { jurisdiction: "Wayne County", state: "Michigan", saleDate: "03/10/2026", auctionType: "Deed", saleVenue: "Online", parcelsOffered: 3500, parcelsSold: 2800, totalCollected: "$9,200,000.00", avgPremium: "15.1%" },
  { jurisdiction: "Shelby County", state: "Tennessee", saleDate: "03/08/2026", auctionType: "Lien", saleVenue: "In Person", parcelsOffered: 2100, parcelsSold: 1680, totalCollected: "$7,800,000.00", avgPremium: "6.8%" },
  { jurisdiction: "Cuyahoga County", state: "Ohio", saleDate: "03/05/2026", auctionType: "Deed", saleVenue: "Online", parcelsOffered: 1800, parcelsSold: 1200, totalCollected: "$5,400,000.00", avgPremium: "18.3%" },
  { jurisdiction: "Jefferson County", state: "Alabama", saleDate: "03/02/2026", auctionType: "Lien", saleVenue: "In Person", parcelsOffered: 1500, parcelsSold: 1100, totalCollected: "$3,200,000.00", avgPremium: "9.5%" },
  { jurisdiction: "Duval County", state: "Florida", saleDate: "02/28/2026", auctionType: "Deed", saleVenue: "Online", parcelsOffered: 2900, parcelsSold: 2300, totalCollected: "$14,800,000.00", avgPremium: "11.7%" },
  { jurisdiction: "Orleans Parish", state: "Louisiana", saleDate: "02/25/2026", auctionType: "Lien", saleVenue: "In Person", parcelsOffered: 3800, parcelsSold: 2900, totalCollected: "$8,100,000.00", avgPremium: "7.2%" },
]

interface OTCRow {
  jurisdiction: string
  state: string
  availableDate: string
  propertyType: string
  parcelsAvailable: number
  priceRange: string
  listType: string
}

const otcListings: OTCRow[] = [
  { jurisdiction: "Wayne County", state: "Michigan", availableDate: "Ongoing", propertyType: "Mixed", parcelsAvailable: 1240, priceRange: "$500 - $25,000", listType: "Tax Reverted" },
  { jurisdiction: "St. Louis City", state: "Missouri", availableDate: "Ongoing", propertyType: "Residential", parcelsAvailable: 890, priceRange: "$200 - $15,000", listType: "Land Bank" },
  { jurisdiction: "Baltimore City", state: "Maryland", availableDate: "Ongoing", propertyType: "Mixed", parcelsAvailable: 2100, priceRange: "$1,000 - $50,000", listType: "Tax Sale Leftovers" },
  { jurisdiction: "Shelby County", state: "Tennessee", availableDate: "Ongoing", propertyType: "Residential", parcelsAvailable: 560, priceRange: "$500 - $20,000", listType: "Surplus" },
  { jurisdiction: "Cuyahoga County", state: "Ohio", availableDate: "Ongoing", propertyType: "Mixed", parcelsAvailable: 780, priceRange: "$100 - $10,000", listType: "Land Bank" },
  { jurisdiction: "Cook County", state: "Illinois", availableDate: "Q2 2026", propertyType: "Mixed", parcelsAvailable: 3200, priceRange: "$1,500 - $75,000", listType: "Scavenger Sale" },
  { jurisdiction: "Orleans Parish", state: "Louisiana", availableDate: "Ongoing", propertyType: "Mixed", parcelsAvailable: 420, priceRange: "$500 - $30,000", listType: "Adjudicated" },
  { jurisdiction: "Jefferson County", state: "Alabama", availableDate: "Ongoing", propertyType: "Residential", parcelsAvailable: 340, priceRange: "$250 - $8,000", listType: "Surplus" },
]

const TAB_CONFIG: { id: AuctionTab; label: string; icon: React.ReactNode }[] = [
  { id: "upcoming", label: "Upcoming Auctions", icon: <Calendar className="w-4 h-4" /> },
  { id: "historical", label: "Prior Sale Results", icon: <Clock className="w-4 h-4" /> },
  { id: "otc", label: "Over-The-Counter", icon: <Gavel className="w-4 h-4" /> },
]

export default function AuctionsPage() {
  const [activeTab, setActiveTab] = useState<AuctionTab>("upcoming")
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex items-center gap-6">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1) }}
              className={`flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#2a7de1] text-[#2a7de1]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between py-3 px-6 border-b border-gray-200">
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
            <input type="text" placeholder="Min Sale Date" className="px-3 py-1.5 text-sm border border-gray-300 rounded w-28" />
            <button className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-1">
            <input type="text" placeholder="Max Sale Date" className="px-3 py-1.5 text-sm border border-gray-300 rounded w-28" />
            <button className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"><Filter className="w-4 h-4" /></button>
          <button className="p-2 bg-[#2a7de1] text-white rounded"><Save className="w-4 h-4" /></button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"><Settings className="w-4 h-4" /></button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"><List className="w-4 h-4" /></button>
          <button className="p-2 bg-[#2a7de1] text-white rounded"><MapPin className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Table Content */}
      <div className="px-6 pb-8">
        {/* ─── Upcoming Auctions ──────────────────────────────── */}
        {activeTab === "upcoming" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Jurisdiction <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">State <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Sale Date <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Post Date <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Auction Type <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Sale Venue <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Bidding Procedures <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1"># of Parcels <span className="text-[#2a7de1]">▲</span></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Aggregate Sale Amount <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAuctions.map((row, idx) => (
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
            <Pagination total={810} currentPage={currentPage} onPageChange={setCurrentPage} label="auctions" />
          </div>
        )}

        {/* ─── Historical Results ─────────────────────────────── */}
        {activeTab === "historical" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Jurisdiction <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">State <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Sale Date <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Type <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Venue <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Parcels Offered <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Parcels Sold <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Total Collected <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Avg Premium <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historicalAuctions.map((row, idx) => {
                    const sellThrough = ((row.parcelsSold / row.parcelsOffered) * 100).toFixed(0)
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-[#2a7de1]">{row.jurisdiction}</td>
                        <td className="py-3 px-4 text-gray-600">{row.state}</td>
                        <td className="py-3 px-4 text-gray-600">{row.saleDate}</td>
                        <td className="py-3 px-4 text-gray-600">{row.auctionType}</td>
                        <td className="py-3 px-4 text-gray-600">{row.saleVenue}</td>
                        <td className="py-3 px-4 text-gray-600">{row.parcelsOffered.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="text-[#2a7de1]">{row.parcelsSold.toLocaleString()}</span>
                          <span className="text-gray-400 text-xs ml-1">({sellThrough}%)</span>
                        </td>
                        <td className="py-3 px-4 text-[#2a7de1]">{row.totalCollected}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${parseFloat(row.avgPremium) > 10 ? "text-green-600" : "text-[#2a7de1]"}`}>
                            {row.avgPremium}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination total={248} currentPage={currentPage} onPageChange={setCurrentPage} label="results" />
          </div>
        )}

        {/* ─── Over-The-Counter ───────────────────────────────── */}
        {activeTab === "otc" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Jurisdiction <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">State <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Available <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Property Type <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Parcels Available <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">Price Range <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">List Type <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {otcListings.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-[#2a7de1]">{row.jurisdiction}</td>
                      <td className="py-3 px-4 text-gray-600">{row.state}</td>
                      <td className="py-3 px-4 text-gray-600">{row.availableDate}</td>
                      <td className="py-3 px-4 text-gray-600">{row.propertyType}</td>
                      <td className="py-3 px-4 text-[#2a7de1]">{row.parcelsAvailable.toLocaleString()}</td>
                      <td className="py-3 px-4 text-[#2a7de1]">{row.priceRange}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                          {row.listType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={52} currentPage={currentPage} onPageChange={setCurrentPage} label="lists" />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared pagination (matches original TSR style) ─────────────
function Pagination({
  total,
  currentPage,
  onPageChange,
  label,
}: {
  total: number
  currentPage: number
  onPageChange: (p: number) => void
  label: string
}) {
  const perPage = 100
  const totalPages = Math.ceil(total / perPage)
  const pages = Array.from({ length: Math.min(9, totalPages) }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between mt-4 px-4">
      <div className="text-sm text-gray-600">
        Displaying {label}{" "}
        <span className="font-medium">
          {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, total)}
        </span>{" "}
        of <span className="font-medium">{total.toLocaleString()}</span> in total
      </div>
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
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
  )
}
