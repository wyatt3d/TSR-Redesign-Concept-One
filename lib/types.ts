// ─── Listing Sources ─────────────────────────────────────────────
export type SourceId =
  | "crexi"
  | "loopnet"
  | "zillow"
  | "redfin"
  | "realtor"
  | "tax_foreclosure"
  | "mortgage_foreclosure"
  | "hud"
  | "auction_com"
  | "ten_x"
  | "hubzu"
  | "homepath"
  | "costar"
  | "cbre"
  | "marcus_millichap"
  | "cushman_wakefield"
  | "jll"
  | "berkadia"
  | "reonomy"
  | "land_com"
  | "landwatch"
  | "lands_of_america"
  | "biproxi"
  | "cre_exchange"
  | "treasury_gov"
  | "usda"
  | "gsa_auctions"

export interface ListingSource {
  id: SourceId
  name: string
  shortName: string
  color: string
  category: SourceCategory
  description: string
  icon: string // lucide icon name
}

export type SourceCategory =
  | "commercial"
  | "residential"
  | "foreclosure"
  | "government"
  | "land"
  | "brokerage"

export const SOURCE_CATEGORIES: Record<SourceCategory, { label: string; description: string }> = {
  commercial: { label: "Commercial Marketplaces", description: "CRE listing platforms" },
  residential: { label: "Residential Marketplaces", description: "Consumer listing sites" },
  foreclosure: { label: "Foreclosure & Auction", description: "Distressed property auctions" },
  government: { label: "Government Sales", description: "Federal, state, and local government" },
  land: { label: "Land & Rural", description: "Land and agricultural listings" },
  brokerage: { label: "Institutional Brokerage", description: "Institutional CRE firms" },
}

export const SOURCES: ListingSource[] = [
  // Commercial Marketplaces
  { id: "crexi", name: "Crexi", shortName: "CRX", color: "#1B6FF0", category: "commercial", description: "Commercial real estate marketplace", icon: "Building2" },
  { id: "loopnet", name: "LoopNet", shortName: "LN", color: "#E8380D", category: "commercial", description: "CoStar commercial listings", icon: "Building2" },
  { id: "costar", name: "CoStar", shortName: "CS", color: "#003B5C", category: "commercial", description: "Commercial data & analytics", icon: "BarChart3" },
  { id: "biproxi", name: "BiProxi", shortName: "BP", color: "#6B46C1", category: "commercial", description: "CRE investment marketplace", icon: "Building2" },
  { id: "cre_exchange", name: "CRE Exchange", shortName: "CREX", color: "#059669", category: "commercial", description: "Commercial property exchange", icon: "ArrowLeftRight" },

  // Residential
  { id: "zillow", name: "Zillow", shortName: "ZLW", color: "#006AFF", category: "residential", description: "Residential listings & Zestimates", icon: "Home" },
  { id: "redfin", name: "Redfin", shortName: "RF", color: "#A02021", category: "residential", description: "Residential brokerage listings", icon: "Home" },
  { id: "realtor", name: "Realtor.com", shortName: "RDC", color: "#D92228", category: "residential", description: "NAR-affiliated listings", icon: "Home" },

  // Foreclosure & Auction
  { id: "tax_foreclosure", name: "Tax Foreclosure", shortName: "TAX", color: "#DC2626", category: "foreclosure", description: "County tax lien & deed auctions", icon: "Gavel" },
  { id: "mortgage_foreclosure", name: "Mortgage Foreclosure", shortName: "MTG", color: "#EA580C", category: "foreclosure", description: "Bank-owned foreclosure sales", icon: "Gavel" },
  { id: "auction_com", name: "Auction.com", shortName: "AUC", color: "#1E3A5F", category: "foreclosure", description: "Online foreclosure auctions", icon: "Gavel" },
  { id: "ten_x", name: "Ten-X", shortName: "10X", color: "#00A3E0", category: "foreclosure", description: "Commercial auction platform", icon: "Gavel" },
  { id: "hubzu", name: "Hubzu", shortName: "HBZ", color: "#34D399", category: "foreclosure", description: "Online real estate auctions", icon: "Gavel" },
  { id: "homepath", name: "HomePath (Fannie Mae)", shortName: "FNM", color: "#00539B", category: "foreclosure", description: "Fannie Mae REO properties", icon: "Landmark" },

  // Government
  { id: "hud", name: "HUD Homes", shortName: "HUD", color: "#1B4D7A", category: "government", description: "HUD foreclosed properties", icon: "Landmark" },
  { id: "treasury_gov", name: "Treasury.gov", shortName: "UST", color: "#112E51", category: "government", description: "US Treasury seized assets", icon: "Landmark" },
  { id: "usda", name: "USDA Properties", shortName: "USDA", color: "#4D7C0F", category: "government", description: "USDA rural development properties", icon: "Landmark" },
  { id: "gsa_auctions", name: "GSA Auctions", shortName: "GSA", color: "#374151", category: "government", description: "Federal surplus properties", icon: "Landmark" },

  // Land
  { id: "land_com", name: "Land.com", shortName: "LND", color: "#65A30D", category: "land", description: "Land marketplace", icon: "Trees" },
  { id: "landwatch", name: "LandWatch", shortName: "LW", color: "#15803D", category: "land", description: "Rural property & land", icon: "Trees" },
  { id: "lands_of_america", name: "Lands of America", shortName: "LOA", color: "#166534", category: "land", description: "Farms, ranches, rural land", icon: "Trees" },

  // Institutional Brokerage
  { id: "cbre", name: "CBRE", shortName: "CBRE", color: "#003F2D", category: "brokerage", description: "Global CRE services", icon: "Building" },
  { id: "marcus_millichap", name: "Marcus & Millichap", shortName: "MM", color: "#1E3A5F", category: "brokerage", description: "CRE investment brokerage", icon: "Building" },
  { id: "cushman_wakefield", name: "Cushman & Wakefield", shortName: "CW", color: "#C41230", category: "brokerage", description: "Global CRE services", icon: "Building" },
  { id: "jll", name: "JLL", shortName: "JLL", color: "#E4002B", category: "brokerage", description: "Jones Lang LaSalle", icon: "Building" },
  { id: "berkadia", name: "Berkadia", shortName: "BRK", color: "#00263E", category: "brokerage", description: "Multifamily & CRE finance", icon: "Building" },
  { id: "reonomy", name: "Reonomy", shortName: "REO", color: "#5046E5", category: "brokerage", description: "CRE data platform", icon: "Database" },
]

// ─── Property Types ──────────────────────────────────────────────
export type PropertyType =
  | "multifamily"
  | "office"
  | "retail"
  | "industrial"
  | "warehouse"
  | "mixed_use"
  | "land"
  | "hospitality"
  | "medical"
  | "self_storage"
  | "mobile_home_park"
  | "single_family"
  | "special_purpose"
  | "agricultural"

export interface PropertyTypeInfo {
  id: PropertyType
  label: string
  icon: string
}

export const PROPERTY_TYPES: PropertyTypeInfo[] = [
  { id: "multifamily", label: "Multifamily", icon: "Building2" },
  { id: "office", label: "Office", icon: "Briefcase" },
  { id: "retail", label: "Retail", icon: "ShoppingBag" },
  { id: "industrial", label: "Industrial", icon: "Factory" },
  { id: "warehouse", label: "Warehouse / Distribution", icon: "Warehouse" },
  { id: "mixed_use", label: "Mixed Use", icon: "LayoutGrid" },
  { id: "land", label: "Land / Development", icon: "Trees" },
  { id: "hospitality", label: "Hospitality", icon: "Hotel" },
  { id: "medical", label: "Medical / Healthcare", icon: "Heart" },
  { id: "self_storage", label: "Self Storage", icon: "Archive" },
  { id: "mobile_home_park", label: "Mobile Home Park", icon: "Tent" },
  { id: "single_family", label: "Single Family", icon: "Home" },
  { id: "special_purpose", label: "Special Purpose", icon: "Star" },
  { id: "agricultural", label: "Agricultural", icon: "Wheat" },
]

// ─── Listings ────────────────────────────────────────────────────
export type DealType = "for_sale" | "for_lease" | "auction" | "foreclosure" | "reo"

export interface Listing {
  id: string
  source: SourceId
  title: string
  address: string
  city: string
  state: string
  zip: string
  county: string
  lat: number
  lng: number
  propertyType: PropertyType
  dealType: DealType
  price: number | null
  priceLabel: string
  sqft: number | null
  units: number | null
  capRate: number | null
  lotAcres: number | null
  yearBuilt: number | null
  daysOnMarket: number
  listedDate: string
  auctionDate: string | null
  imageUrl: string | null
  sourceUrl: string
  tags: string[]
}

// ─── User Preferences (Onboarding) ──────────────────────────────
export type InvestorProfile =
  | "institutional_fund"
  | "family_office"
  | "private_equity"
  | "reit"
  | "syndicator"
  | "individual_investor"
  | "developer"
  | "1031_exchange"
  | "other"

export interface UserPreferences {
  completedOnboarding: boolean
  investorProfile: InvestorProfile | null
  propertyTypes: PropertyType[]
  sources: SourceId[]
  dealTypes: DealType[]
  states: string[]
  priceRange: { min: number | null; max: number | null }
  capRateRange: { min: number | null; max: number | null }
  sqftRange: { min: number | null; max: number | null }
  unitsRange: { min: number | null; max: number | null }
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  completedOnboarding: false,
  investorProfile: null,
  propertyTypes: [],
  sources: [],
  dealTypes: [],
  states: [],
  priceRange: { min: null, max: null },
  capRateRange: { min: null, max: null },
  sqftRange: { min: null, max: null },
  unitsRange: { min: null, max: null },
}
