// Realistic listing counts aggregated at state and county level.
// These represent ~1.74M total active listings across all sources nationwide.

export interface StateData {
  name: string
  abbr: string
  totalListings: number
  coords: [number, number] // label position
}

export const STATE_LISTINGS: StateData[] = [
  { name: "Alabama", abbr: "AL", totalListings: 24800, coords: [-86.8, 32.8] },
  { name: "Alaska", abbr: "AK", totalListings: 3200, coords: [-153.0, 64.0] },
  { name: "Arizona", abbr: "AZ", totalListings: 38500, coords: [-111.5, 34.2] },
  { name: "Arkansas", abbr: "AR", totalListings: 16200, coords: [-92.5, 35.0] },
  { name: "California", abbr: "CA", totalListings: 142000, coords: [-119.5, 37.0] },
  { name: "Colorado", abbr: "CO", totalListings: 34800, coords: [-105.5, 39.0] },
  { name: "Connecticut", abbr: "CT", totalListings: 12400, coords: [-72.7, 41.6] },
  { name: "Delaware", abbr: "DE", totalListings: 5100, coords: [-75.5, 39.0] },
  { name: "Florida", abbr: "FL", totalListings: 178000, coords: [-81.5, 28.5] },
  { name: "Georgia", abbr: "GA", totalListings: 58200, coords: [-83.5, 32.8] },
  { name: "Hawaii", abbr: "HI", totalListings: 6800, coords: [-155.5, 20.0] },
  { name: "Idaho", abbr: "ID", totalListings: 11200, coords: [-114.5, 44.5] },
  { name: "Illinois", abbr: "IL", totalListings: 52400, coords: [-89.2, 40.0] },
  { name: "Indiana", abbr: "IN", totalListings: 28600, coords: [-86.2, 40.0] },
  { name: "Iowa", abbr: "IA", totalListings: 14800, coords: [-93.5, 42.0] },
  { name: "Kansas", abbr: "KS", totalListings: 13200, coords: [-98.5, 38.5] },
  { name: "Kentucky", abbr: "KY", totalListings: 22400, coords: [-85.5, 37.8] },
  { name: "Louisiana", abbr: "LA", totalListings: 26800, coords: [-92.0, 31.0] },
  { name: "Maine", abbr: "ME", totalListings: 7600, coords: [-69.0, 45.5] },
  { name: "Maryland", abbr: "MD", totalListings: 21200, coords: [-76.7, 39.2] },
  { name: "Massachusetts", abbr: "MA", totalListings: 18600, coords: [-71.8, 42.3] },
  { name: "Michigan", abbr: "MI", totalListings: 42800, coords: [-85.5, 44.0] },
  { name: "Minnesota", abbr: "MN", totalListings: 24200, coords: [-94.5, 46.0] },
  { name: "Mississippi", abbr: "MS", totalListings: 18400, coords: [-89.7, 32.8] },
  { name: "Missouri", abbr: "MO", totalListings: 32600, coords: [-92.5, 38.5] },
  { name: "Montana", abbr: "MT", totalListings: 8400, coords: [-110.0, 47.0] },
  { name: "Nebraska", abbr: "NE", totalListings: 9800, coords: [-99.8, 41.5] },
  { name: "Nevada", abbr: "NV", totalListings: 22400, coords: [-117.0, 39.5] },
  { name: "New Hampshire", abbr: "NH", totalListings: 5200, coords: [-71.5, 44.0] },
  { name: "New Jersey", abbr: "NJ", totalListings: 28400, coords: [-74.5, 40.2] },
  { name: "New Mexico", abbr: "NM", totalListings: 12800, coords: [-106.0, 34.5] },
  { name: "New York", abbr: "NY", totalListings: 62400, coords: [-75.5, 43.0] },
  { name: "North Carolina", abbr: "NC", totalListings: 64800, coords: [-79.5, 35.5] },
  { name: "North Dakota", abbr: "ND", totalListings: 4600, coords: [-100.5, 47.5] },
  { name: "Ohio", abbr: "OH", totalListings: 46200, coords: [-82.8, 40.3] },
  { name: "Oklahoma", abbr: "OK", totalListings: 22600, coords: [-97.5, 35.5] },
  { name: "Oregon", abbr: "OR", totalListings: 21800, coords: [-120.5, 44.0] },
  { name: "Pennsylvania", abbr: "PA", totalListings: 48600, coords: [-77.5, 41.0] },
  { name: "Rhode Island", abbr: "RI", totalListings: 3400, coords: [-71.5, 41.7] },
  { name: "South Carolina", abbr: "SC", totalListings: 38200, coords: [-80.5, 34.0] },
  { name: "South Dakota", abbr: "SD", totalListings: 5800, coords: [-100.3, 44.5] },
  { name: "Tennessee", abbr: "TN", totalListings: 38400, coords: [-86.0, 36.0] },
  { name: "Texas", abbr: "TX", totalListings: 148000, coords: [-99.5, 31.5] },
  { name: "Utah", abbr: "UT", totalListings: 16400, coords: [-111.5, 39.5] },
  { name: "Vermont", abbr: "VT", totalListings: 3800, coords: [-72.7, 44.0] },
  { name: "Virginia", abbr: "VA", totalListings: 38600, coords: [-79.0, 37.5] },
  { name: "Washington", abbr: "WA", totalListings: 32400, coords: [-120.5, 47.4] },
  { name: "West Virginia", abbr: "WV", totalListings: 9200, coords: [-80.5, 38.8] },
  { name: "Wisconsin", abbr: "WI", totalListings: 22800, coords: [-89.5, 44.5] },
  { name: "Wyoming", abbr: "WY", totalListings: 5400, coords: [-107.5, 43.0] },
]

export const NATIONAL_TOTAL = STATE_LISTINGS.reduce((sum, s) => sum + s.totalListings, 0)

// ─── County data (generated per state on drill-down) ────────────
// In a real app this comes from an API. For the prototype, we
// generate plausible county-level breakdowns procedurally.

export interface CountyData {
  name: string
  state: string
  listings: number
  coords: [number, number]
}

// Seeded random for deterministic county generation
function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Top counties per state (the ones that matter for display)
const STATE_COUNTIES: Record<string, { name: string; coords: [number, number]; weight: number }[]> = {
  FL: [
    { name: "Miami-Dade", coords: [-80.3, 25.7], weight: 0.18 },
    { name: "Broward", coords: [-80.2, 26.1], weight: 0.12 },
    { name: "Palm Beach", coords: [-80.1, 26.7], weight: 0.10 },
    { name: "Hillsborough", coords: [-82.4, 28.0], weight: 0.08 },
    { name: "Orange", coords: [-81.4, 28.5], weight: 0.07 },
    { name: "Duval", coords: [-81.7, 30.3], weight: 0.06 },
    { name: "Pinellas", coords: [-82.7, 27.9], weight: 0.05 },
    { name: "Lee", coords: [-81.9, 26.6], weight: 0.04 },
    { name: "Polk", coords: [-81.7, 28.0], weight: 0.04 },
    { name: "Brevard", coords: [-80.7, 28.3], weight: 0.03 },
    { name: "Volusia", coords: [-81.1, 29.0], weight: 0.03 },
    { name: "Sarasota", coords: [-82.3, 27.3], weight: 0.03 },
    { name: "Seminole", coords: [-81.3, 28.7], weight: 0.02 },
    { name: "Osceola", coords: [-81.2, 28.1], weight: 0.02 },
    { name: "Other Counties", coords: [-82.5, 29.5], weight: 0.13 },
  ],
  TX: [
    { name: "Harris", coords: [-95.4, 29.8], weight: 0.16 },
    { name: "Dallas", coords: [-96.8, 32.8], weight: 0.12 },
    { name: "Tarrant", coords: [-97.3, 32.7], weight: 0.08 },
    { name: "Bexar", coords: [-98.5, 29.4], weight: 0.08 },
    { name: "Travis", coords: [-97.7, 30.3], weight: 0.07 },
    { name: "Collin", coords: [-96.6, 33.2], weight: 0.05 },
    { name: "Denton", coords: [-97.1, 33.2], weight: 0.04 },
    { name: "Fort Bend", coords: [-95.8, 29.5], weight: 0.04 },
    { name: "Williamson", coords: [-97.6, 30.6], weight: 0.03 },
    { name: "Montgomery", coords: [-95.5, 30.3], weight: 0.03 },
    { name: "El Paso", coords: [-106.4, 31.8], weight: 0.03 },
    { name: "Hidalgo", coords: [-98.2, 26.4], weight: 0.03 },
    { name: "Other Counties", coords: [-99.5, 33.5], weight: 0.24 },
  ],
  CA: [
    { name: "Los Angeles", coords: [-118.2, 34.1], weight: 0.18 },
    { name: "San Diego", coords: [-117.2, 32.7], weight: 0.08 },
    { name: "Orange", coords: [-117.8, 33.7], weight: 0.07 },
    { name: "Riverside", coords: [-116.5, 33.7], weight: 0.07 },
    { name: "San Bernardino", coords: [-116.5, 34.5], weight: 0.06 },
    { name: "Santa Clara", coords: [-121.7, 37.3], weight: 0.05 },
    { name: "Alameda", coords: [-122.0, 37.7], weight: 0.04 },
    { name: "Sacramento", coords: [-121.5, 38.6], weight: 0.04 },
    { name: "Contra Costa", coords: [-122.0, 37.9], weight: 0.03 },
    { name: "San Francisco", coords: [-122.4, 37.8], weight: 0.03 },
    { name: "Fresno", coords: [-119.8, 36.7], weight: 0.03 },
    { name: "San Mateo", coords: [-122.3, 37.5], weight: 0.02 },
    { name: "Other Counties", coords: [-120.0, 39.5], weight: 0.30 },
  ],
  NY: [
    { name: "New York City", coords: [-74.0, 40.7], weight: 0.25 },
    { name: "Suffolk", coords: [-72.8, 40.9], weight: 0.08 },
    { name: "Nassau", coords: [-73.6, 40.7], weight: 0.06 },
    { name: "Westchester", coords: [-73.8, 41.1], weight: 0.05 },
    { name: "Erie", coords: [-78.8, 42.9], weight: 0.04 },
    { name: "Monroe", coords: [-77.6, 43.2], weight: 0.03 },
    { name: "Onondaga", coords: [-76.2, 43.0], weight: 0.03 },
    { name: "Albany", coords: [-73.8, 42.7], weight: 0.02 },
    { name: "Dutchess", coords: [-73.7, 41.7], weight: 0.02 },
    { name: "Other Counties", coords: [-75.5, 44.0], weight: 0.42 },
  ],
  GA: [
    { name: "Fulton", coords: [-84.4, 33.8], weight: 0.15 },
    { name: "Gwinnett", coords: [-84.0, 33.9], weight: 0.08 },
    { name: "Cobb", coords: [-84.6, 33.9], weight: 0.06 },
    { name: "DeKalb", coords: [-84.2, 33.8], weight: 0.06 },
    { name: "Chatham", coords: [-81.1, 32.0], weight: 0.04 },
    { name: "Cherokee", coords: [-84.5, 34.2], weight: 0.03 },
    { name: "Clayton", coords: [-84.4, 33.5], weight: 0.03 },
    { name: "Forsyth", coords: [-84.1, 34.2], weight: 0.03 },
    { name: "Henry", coords: [-84.2, 33.4], weight: 0.02 },
    { name: "Other Counties", coords: [-83.5, 32.0], weight: 0.50 },
  ],
}

export function getCountiesForState(stateAbbr: string, totalListings: number): CountyData[] {
  const counties = STATE_COUNTIES[stateAbbr]
  if (counties) {
    return counties.map((c) => ({
      name: c.name,
      state: stateAbbr,
      listings: Math.round(totalListings * c.weight),
      coords: c.coords,
    }))
  }
  // Generic fallback: generate 8-12 plausible counties
  const seed = stateAbbr.charCodeAt(0) * 100 + stateAbbr.charCodeAt(1)
  const count = Math.floor(seeded(seed) * 5) + 8
  const stateInfo = STATE_LISTINGS.find((s) => s.abbr === stateAbbr)
  if (!stateInfo) return []

  const results: CountyData[] = []
  let remaining = totalListings
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1
    const share = isLast ? remaining : Math.round(remaining * (seeded(seed + i * 7) * 0.3 + 0.05))
    remaining -= share
    if (remaining < 0) remaining = 0
    const latJitter = (seeded(seed + i * 13) - 0.5) * 3
    const lngJitter = (seeded(seed + i * 17) - 0.5) * 3
    results.push({
      name: i === count - 1 ? "Other Counties" : `County ${i + 1}`,
      state: stateAbbr,
      listings: share,
      coords: [stateInfo.coords[0] + lngJitter, stateInfo.coords[1] + latJitter],
    })
  }
  return results.sort((a, b) => b.listings - a.listings)
}

// Format large numbers for map labels
export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return n.toString()
}

// Color scale for state/county fill based on listing density
export function getDensityColor(count: number, max: number): string {
  const ratio = count / max
  if (ratio < 0.05) return "#dbeafe"  // blue-100
  if (ratio < 0.1) return "#bfdbfe"   // blue-200
  if (ratio < 0.2) return "#93c5fd"   // blue-300
  if (ratio < 0.35) return "#60a5fa"  // blue-400
  if (ratio < 0.5) return "#3b82f6"   // blue-500
  if (ratio < 0.7) return "#2563eb"   // blue-600
  if (ratio < 0.85) return "#1d4ed8"  // blue-700
  return "#1e40af"                     // blue-800
}
