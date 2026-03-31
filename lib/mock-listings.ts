import { Listing, SourceId, PropertyType, DealType } from "./types"

// Generate realistic mock listings across all sources
const CITIES: { city: string; state: string; lat: number; lng: number; county: string; zip: string }[] = [
  { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918, county: "Miami-Dade", zip: "33131" },
  { city: "Fort Lauderdale", state: "FL", lat: 26.1224, lng: -80.1373, county: "Broward", zip: "33301" },
  { city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792, county: "Orange", zip: "32801" },
  { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572, county: "Hillsborough", zip: "33602" },
  { city: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557, county: "Duval", zip: "32202" },
  { city: "Atlanta", state: "GA", lat: 33.749, lng: -84.388, county: "Fulton", zip: "30303" },
  { city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, county: "Mecklenburg", zip: "28202" },
  { city: "Raleigh", state: "NC", lat: 35.7796, lng: -78.6382, county: "Wake", zip: "27601" },
  { city: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816, county: "Davidson", zip: "37203" },
  { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.797, county: "Dallas", zip: "75201" },
  { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, county: "Harris", zip: "77002" },
  { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, county: "Travis", zip: "78701" },
  { city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936, county: "Bexar", zip: "78205" },
  { city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074, county: "Maricopa", zip: "85004" },
  { city: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398, county: "Clark", zip: "89101" },
  { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903, county: "Denver", zip: "80202" },
  { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298, county: "Cook", zip: "60601" },
  { city: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458, county: "Wayne", zip: "48226" },
  { city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652, county: "Philadelphia", zip: "19102" },
  { city: "New York", state: "NY", lat: 40.7128, lng: -74.006, county: "New York", zip: "10001" },
  { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, county: "Los Angeles", zip: "90012" },
  { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, county: "San Francisco", zip: "94102" },
  { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, county: "King", zip: "98101" },
  { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784, county: "Multnomah", zip: "97201" },
  { city: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.265, county: "Hennepin", zip: "55401" },
  { city: "Kansas City", state: "MO", lat: 39.0997, lng: -94.5786, county: "Jackson", zip: "64106" },
  { city: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715, county: "Orleans", zip: "70112" },
  { city: "Birmingham", state: "AL", lat: 33.5186, lng: -86.8104, county: "Jefferson", zip: "35203" },
  { city: "Columbia", state: "SC", lat: 34.0007, lng: -81.0348, county: "Richland", zip: "29201" },
  { city: "Richmond", state: "VA", lat: 37.5407, lng: -77.436, county: "Richmond City", zip: "23219" },
  { city: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122, county: "Baltimore City", zip: "21201" },
  { city: "Pittsburgh", state: "PA", lat: 40.4406, lng: -79.9959, county: "Allegheny", zip: "15222" },
  { city: "Cleveland", state: "OH", lat: 41.4993, lng: -81.6944, county: "Cuyahoga", zip: "44113" },
  { city: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581, county: "Marion", zip: "46204" },
  { city: "Memphis", state: "TN", lat: 35.1495, lng: -90.049, county: "Shelby", zip: "38103" },
  { city: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164, county: "Oklahoma", zip: "73102" },
  { city: "Boise", state: "ID", lat: 43.615, lng: -116.2023, county: "Ada", zip: "83702" },
  { city: "Salt Lake City", state: "UT", lat: 40.7608, lng: -111.891, county: "Salt Lake", zip: "84101" },
  { city: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504, county: "Bernalillo", zip: "87102" },
  { city: "Tucson", state: "AZ", lat: 32.2226, lng: -110.9747, county: "Pima", zip: "85701" },
]

const STREET_NAMES = [
  "Main St", "Commerce Blvd", "Industrial Dr", "Market St", "Park Ave",
  "Oak Lane", "Warehouse Way", "Business Park Dr", "Technology Blvd", "Enterprise Ave",
  "Capital Blvd", "Trade Center Dr", "Gateway Pkwy", "Airport Rd", "Harbor Dr",
  "Victory Ln", "Franklin Ave", "Madison St", "Washington Blvd", "Lincoln Rd",
]

const SOURCE_DEAL_MAP: Record<SourceId, DealType[]> = {
  crexi: ["for_sale", "for_lease"],
  loopnet: ["for_sale", "for_lease"],
  zillow: ["for_sale"],
  redfin: ["for_sale"],
  realtor: ["for_sale"],
  tax_foreclosure: ["foreclosure", "auction"],
  mortgage_foreclosure: ["foreclosure", "auction"],
  hud: ["reo"],
  auction_com: ["auction"],
  ten_x: ["auction"],
  hubzu: ["auction"],
  homepath: ["reo"],
  costar: ["for_sale", "for_lease"],
  cbre: ["for_sale", "for_lease"],
  marcus_millichap: ["for_sale"],
  cushman_wakefield: ["for_sale", "for_lease"],
  jll: ["for_sale", "for_lease"],
  berkadia: ["for_sale"],
  reonomy: ["for_sale"],
  land_com: ["for_sale"],
  landwatch: ["for_sale"],
  lands_of_america: ["for_sale"],
  biproxi: ["for_sale"],
  cre_exchange: ["for_sale"],
  treasury_gov: ["auction"],
  usda: ["for_sale"],
  gsa_auctions: ["auction"],
}

const SOURCE_PROPERTY_MAP: Partial<Record<SourceId, PropertyType[]>> = {
  crexi: ["multifamily", "office", "retail", "industrial", "warehouse", "mixed_use", "land", "hospitality", "self_storage"],
  loopnet: ["multifamily", "office", "retail", "industrial", "warehouse", "mixed_use", "land"],
  zillow: ["single_family", "multifamily"],
  redfin: ["single_family", "multifamily"],
  realtor: ["single_family", "multifamily"],
  tax_foreclosure: ["single_family", "multifamily", "land", "retail", "industrial"],
  mortgage_foreclosure: ["single_family", "multifamily", "retail"],
  land_com: ["land", "agricultural"],
  landwatch: ["land", "agricultural"],
  lands_of_america: ["land", "agricultural"],
  cbre: ["office", "retail", "industrial", "multifamily", "hospitality"],
  marcus_millichap: ["multifamily", "retail", "office", "self_storage", "mobile_home_park"],
  berkadia: ["multifamily"],
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateListings(): Listing[] {
  const listings: Listing[] = []
  let id = 1

  const sourceIds = Object.keys(SOURCE_DEAL_MAP) as SourceId[]

  for (let i = 0; i < 300; i++) {
    const seed = i * 7 + 13
    const cityIdx = Math.floor(seededRandom(seed) * CITIES.length)
    const city = CITIES[cityIdx]
    const sourceIdx = Math.floor(seededRandom(seed + 1) * sourceIds.length)
    const source = sourceIds[sourceIdx]
    const dealTypes = SOURCE_DEAL_MAP[source]
    const dealType = dealTypes[Math.floor(seededRandom(seed + 2) * dealTypes.length)]

    const propTypes = SOURCE_PROPERTY_MAP[source] || ["office", "retail", "industrial", "multifamily"]
    const propertyType = propTypes[Math.floor(seededRandom(seed + 3) * propTypes.length)]

    const streetNum = Math.floor(seededRandom(seed + 4) * 9000) + 100
    const streetIdx = Math.floor(seededRandom(seed + 5) * STREET_NAMES.length)
    const address = `${streetNum} ${STREET_NAMES[streetIdx]}`

    const latJitter = (seededRandom(seed + 6) - 0.5) * 0.15
    const lngJitter = (seededRandom(seed + 7) - 0.5) * 0.15

    const isForeclosure = dealType === "foreclosure" || dealType === "auction" || dealType === "reo"
    const basePrice = isForeclosure
      ? seededRandom(seed + 8) * 500000 + 25000
      : seededRandom(seed + 8) * 15000000 + 200000

    const price = Math.round(basePrice / 1000) * 1000
    const sqft = propertyType === "land" ? null : Math.round((seededRandom(seed + 9) * 200000 + 1000) / 100) * 100
    const units = ["multifamily", "mobile_home_park"].includes(propertyType)
      ? Math.floor(seededRandom(seed + 10) * 250) + 4
      : null
    const capRate = dealType === "for_sale" && !isForeclosure && seededRandom(seed + 11) > 0.3
      ? Math.round((seededRandom(seed + 12) * 8 + 3) * 10) / 10
      : null
    const acres = propertyType === "land" || propertyType === "agricultural"
      ? Math.round(seededRandom(seed + 13) * 500 * 10) / 10
      : sqft ? Math.round((sqft / 43560) * 100) / 100 : null

    const daysOnMarket = Math.floor(seededRandom(seed + 14) * 180)
    const listedDate = new Date(2026, 2, 31 - daysOnMarket).toISOString().split("T")[0]
    const auctionDate = isForeclosure
      ? new Date(2026, 3, Math.floor(seededRandom(seed + 15) * 28) + 1).toISOString().split("T")[0]
      : null

    const priceLabel = dealType === "for_lease"
      ? `$${(Math.round(seededRandom(seed + 16) * 40 + 8) * 100) / 100}/SF/YR`
      : price ? `$${price.toLocaleString()}` : "Contact for Price"

    const labels: string[] = []
    if (isForeclosure) labels.push("distressed")
    if (daysOnMarket < 7) labels.push("new")
    if (capRate && capRate > 8) labels.push("high-yield")
    if (price && price > 5000000) labels.push("institutional")

    listings.push({
      id: `listing-${id++}`,
      source,
      title: `${address}, ${city.city}`,
      address,
      city: city.city,
      state: city.state,
      zip: city.zip,
      county: city.county,
      lat: city.lat + latJitter,
      lng: city.lng + lngJitter,
      propertyType,
      dealType,
      price,
      priceLabel,
      sqft,
      units,
      capRate,
      lotAcres: acres,
      yearBuilt: propertyType !== "land" ? Math.floor(seededRandom(seed + 17) * 60) + 1965 : null,
      daysOnMarket,
      listedDate,
      auctionDate,
      imageUrl: null,
      sourceUrl: "#",
      tags: labels,
    })
  }

  return listings
}

export const MOCK_LISTINGS = generateListings()
