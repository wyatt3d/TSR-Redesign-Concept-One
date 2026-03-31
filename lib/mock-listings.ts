import { Listing, SourceId, PropertyType, DealType } from "./types"

// Cities with real county names for every state
const CITIES: { city: string; state: string; lat: number; lng: number; county: string; zip: string }[] = [
  // Alabama
  { city: "Birmingham", state: "AL", lat: 33.5186, lng: -86.8104, county: "Jefferson", zip: "35203" },
  { city: "Mobile", state: "AL", lat: 30.6954, lng: -88.0399, county: "Mobile", zip: "36602" },
  { city: "Huntsville", state: "AL", lat: 34.7304, lng: -86.5861, county: "Madison", zip: "35801" },
  { city: "Montgomery", state: "AL", lat: 32.3668, lng: -86.3, county: "Montgomery", zip: "36104" },
  // Alaska
  { city: "Anchorage", state: "AK", lat: 61.2181, lng: -149.9003, county: "Anchorage", zip: "99501" },
  { city: "Fairbanks", state: "AK", lat: 64.8378, lng: -147.7164, county: "Fairbanks North Star", zip: "99701" },
  // Arizona
  { city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074, county: "Maricopa", zip: "85004" },
  { city: "Tucson", state: "AZ", lat: 32.2226, lng: -110.9747, county: "Pima", zip: "85701" },
  { city: "Mesa", state: "AZ", lat: 33.4152, lng: -111.8315, county: "Maricopa", zip: "85201" },
  { city: "Scottsdale", state: "AZ", lat: 33.4942, lng: -111.9261, county: "Maricopa", zip: "85251" },
  // Arkansas
  { city: "Little Rock", state: "AR", lat: 34.7465, lng: -92.2896, county: "Pulaski", zip: "72201" },
  { city: "Fayetteville", state: "AR", lat: 36.0822, lng: -94.1719, county: "Washington", zip: "72701" },
  { city: "Fort Smith", state: "AR", lat: 35.3859, lng: -94.3985, county: "Sebastian", zip: "72901" },
  // California
  { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, county: "Los Angeles", zip: "90012" },
  { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, county: "San Francisco", zip: "94102" },
  { city: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611, county: "San Diego", zip: "92101" },
  { city: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863, county: "Santa Clara", zip: "95110" },
  { city: "Sacramento", state: "CA", lat: 38.5816, lng: -121.4944, county: "Sacramento", zip: "95814" },
  { city: "Riverside", state: "CA", lat: 33.9533, lng: -117.3962, county: "Riverside", zip: "92501" },
  { city: "Oakland", state: "CA", lat: 37.8044, lng: -122.2712, county: "Alameda", zip: "94612" },
  { city: "Fresno", state: "CA", lat: 36.7378, lng: -119.7871, county: "Fresno", zip: "93721" },
  // Colorado
  { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903, county: "Denver", zip: "80202" },
  { city: "Colorado Springs", state: "CO", lat: 38.8339, lng: -104.8214, county: "El Paso", zip: "80903" },
  { city: "Aurora", state: "CO", lat: 39.7294, lng: -104.8319, county: "Arapahoe", zip: "80012" },
  { city: "Fort Collins", state: "CO", lat: 40.5853, lng: -105.0844, county: "Larimer", zip: "80524" },
  // Connecticut
  { city: "Hartford", state: "CT", lat: 41.7658, lng: -72.6734, county: "Hartford", zip: "06103" },
  { city: "Stamford", state: "CT", lat: 41.0534, lng: -73.5387, county: "Fairfield", zip: "06901" },
  { city: "New Haven", state: "CT", lat: 41.3083, lng: -72.9279, county: "New Haven", zip: "06510" },
  // Delaware
  { city: "Wilmington", state: "DE", lat: 39.7391, lng: -75.5398, county: "New Castle", zip: "19801" },
  { city: "Dover", state: "DE", lat: 39.1582, lng: -75.5244, county: "Kent", zip: "19901" },
  // Florida
  { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918, county: "Miami-Dade", zip: "33131" },
  { city: "Fort Lauderdale", state: "FL", lat: 26.1224, lng: -80.1373, county: "Broward", zip: "33301" },
  { city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792, county: "Orange", zip: "32801" },
  { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572, county: "Hillsborough", zip: "33602" },
  { city: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557, county: "Duval", zip: "32202" },
  { city: "West Palm Beach", state: "FL", lat: 26.7153, lng: -80.0534, county: "Palm Beach", zip: "33401" },
  { city: "St. Petersburg", state: "FL", lat: 27.7676, lng: -82.6403, county: "Pinellas", zip: "33701" },
  { city: "Sarasota", state: "FL", lat: 27.3364, lng: -82.5307, county: "Sarasota", zip: "34236" },
  // Georgia
  { city: "Atlanta", state: "GA", lat: 33.749, lng: -84.388, county: "Fulton", zip: "30303" },
  { city: "Savannah", state: "GA", lat: 32.0809, lng: -81.0912, county: "Chatham", zip: "31401" },
  { city: "Augusta", state: "GA", lat: 33.4735, lng: -81.9748, county: "Richmond", zip: "30901" },
  { city: "Marietta", state: "GA", lat: 33.9526, lng: -84.5499, county: "Cobb", zip: "30060" },
  // Hawaii
  { city: "Honolulu", state: "HI", lat: 21.3069, lng: -157.8583, county: "Honolulu", zip: "96813" },
  // Idaho
  { city: "Boise", state: "ID", lat: 43.615, lng: -116.2023, county: "Ada", zip: "83702" },
  { city: "Nampa", state: "ID", lat: 43.5407, lng: -116.5635, county: "Canyon", zip: "83651" },
  // Illinois
  { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298, county: "Cook", zip: "60601" },
  { city: "Aurora", state: "IL", lat: 41.7606, lng: -88.3201, county: "Kane", zip: "60506" },
  { city: "Naperville", state: "IL", lat: 41.7508, lng: -88.1535, county: "DuPage", zip: "60540" },
  { city: "Rockford", state: "IL", lat: 42.2711, lng: -89.094, county: "Winnebago", zip: "61101" },
  { city: "Springfield", state: "IL", lat: 39.7817, lng: -89.6501, county: "Sangamon", zip: "62701" },
  // Indiana
  { city: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581, county: "Marion", zip: "46204" },
  { city: "Fort Wayne", state: "IN", lat: 41.0793, lng: -85.1394, county: "Allen", zip: "46802" },
  { city: "Evansville", state: "IN", lat: 37.9716, lng: -87.5711, county: "Vanderburgh", zip: "47708" },
  // Iowa
  { city: "Des Moines", state: "IA", lat: 41.5868, lng: -93.625, county: "Polk", zip: "50309" },
  { city: "Cedar Rapids", state: "IA", lat: 41.9779, lng: -91.6656, county: "Linn", zip: "52401" },
  // Kansas
  { city: "Wichita", state: "KS", lat: 37.6872, lng: -97.3301, county: "Sedgwick", zip: "67202" },
  { city: "Overland Park", state: "KS", lat: 38.9822, lng: -94.6708, county: "Johnson", zip: "66204" },
  // Kentucky
  { city: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585, county: "Jefferson", zip: "40202" },
  { city: "Lexington", state: "KY", lat: 38.0406, lng: -84.5037, county: "Fayette", zip: "40507" },
  // Louisiana
  { city: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715, county: "Orleans", zip: "70112" },
  { city: "Baton Rouge", state: "LA", lat: 30.4515, lng: -91.1871, county: "East Baton Rouge", zip: "70801" },
  { city: "Shreveport", state: "LA", lat: 32.5252, lng: -93.7502, county: "Caddo", zip: "71101" },
  // Maine
  { city: "Portland", state: "ME", lat: 43.6591, lng: -70.2568, county: "Cumberland", zip: "04101" },
  // Maryland
  { city: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122, county: "Baltimore City", zip: "21201" },
  { city: "Silver Spring", state: "MD", lat: 38.991, lng: -77.0261, county: "Montgomery", zip: "20910" },
  // Massachusetts
  { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589, county: "Suffolk", zip: "02108" },
  { city: "Worcester", state: "MA", lat: 42.2626, lng: -71.8023, county: "Worcester", zip: "01608" },
  { city: "Cambridge", state: "MA", lat: 42.3736, lng: -71.1097, county: "Middlesex", zip: "02139" },
  // Michigan
  { city: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458, county: "Wayne", zip: "48226" },
  { city: "Grand Rapids", state: "MI", lat: 42.9634, lng: -85.6681, county: "Kent", zip: "49503" },
  { city: "Ann Arbor", state: "MI", lat: 42.2808, lng: -83.743, county: "Washtenaw", zip: "48104" },
  // Minnesota
  { city: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.265, county: "Hennepin", zip: "55401" },
  { city: "St. Paul", state: "MN", lat: 44.9537, lng: -93.09, county: "Ramsey", zip: "55101" },
  // Mississippi
  { city: "Jackson", state: "MS", lat: 32.2988, lng: -90.1848, county: "Hinds", zip: "39201" },
  { city: "Gulfport", state: "MS", lat: 30.3674, lng: -89.0928, county: "Harrison", zip: "39501" },
  // Missouri
  { city: "Kansas City", state: "MO", lat: 39.0997, lng: -94.5786, county: "Jackson", zip: "64106" },
  { city: "St. Louis", state: "MO", lat: 38.627, lng: -90.1994, county: "St. Louis City", zip: "63101" },
  { city: "Springfield", state: "MO", lat: 37.2089, lng: -93.2923, county: "Greene", zip: "65806" },
  // Montana
  { city: "Billings", state: "MT", lat: 45.7833, lng: -108.5007, county: "Yellowstone", zip: "59101" },
  { city: "Missoula", state: "MT", lat: 46.8721, lng: -113.994, county: "Missoula", zip: "59801" },
  // Nebraska
  { city: "Omaha", state: "NE", lat: 41.2565, lng: -95.9345, county: "Douglas", zip: "68102" },
  { city: "Lincoln", state: "NE", lat: 40.8136, lng: -96.7026, county: "Lancaster", zip: "68508" },
  // Nevada
  { city: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398, county: "Clark", zip: "89101" },
  { city: "Reno", state: "NV", lat: 39.5296, lng: -119.8138, county: "Washoe", zip: "89501" },
  // New Hampshire
  { city: "Manchester", state: "NH", lat: 42.9956, lng: -71.4548, county: "Hillsborough", zip: "03101" },
  // New Jersey
  { city: "Newark", state: "NJ", lat: 40.7357, lng: -74.1724, county: "Essex", zip: "07102" },
  { city: "Jersey City", state: "NJ", lat: 40.7178, lng: -74.0431, county: "Hudson", zip: "07302" },
  { city: "Trenton", state: "NJ", lat: 40.2206, lng: -74.7597, county: "Mercer", zip: "08608" },
  // New Mexico
  { city: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504, county: "Bernalillo", zip: "87102" },
  { city: "Santa Fe", state: "NM", lat: 35.687, lng: -105.9378, county: "Santa Fe", zip: "87501" },
  // New York
  { city: "New York", state: "NY", lat: 40.7128, lng: -74.006, county: "New York City", zip: "10001" },
  { city: "Buffalo", state: "NY", lat: 42.8864, lng: -78.8784, county: "Erie", zip: "14202" },
  { city: "Rochester", state: "NY", lat: 43.1566, lng: -77.6088, county: "Monroe", zip: "14604" },
  { city: "Syracuse", state: "NY", lat: 43.0481, lng: -76.1474, county: "Onondaga", zip: "13202" },
  { city: "Albany", state: "NY", lat: 42.6526, lng: -73.7562, county: "Albany", zip: "12207" },
  // North Carolina
  { city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, county: "Mecklenburg", zip: "28202" },
  { city: "Raleigh", state: "NC", lat: 35.7796, lng: -78.6382, county: "Wake", zip: "27601" },
  { city: "Durham", state: "NC", lat: 35.994, lng: -78.8986, county: "Durham", zip: "27701" },
  { city: "Greensboro", state: "NC", lat: 36.0726, lng: -79.792, county: "Guilford", zip: "27401" },
  { city: "Asheville", state: "NC", lat: 35.5951, lng: -82.5515, county: "Buncombe", zip: "28801" },
  // North Dakota
  { city: "Fargo", state: "ND", lat: 46.8772, lng: -96.7898, county: "Cass", zip: "58102" },
  { city: "Bismarck", state: "ND", lat: 46.8083, lng: -100.7837, county: "Burleigh", zip: "58501" },
  // Ohio
  { city: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988, county: "Franklin", zip: "43215" },
  { city: "Cleveland", state: "OH", lat: 41.4993, lng: -81.6944, county: "Cuyahoga", zip: "44113" },
  { city: "Cincinnati", state: "OH", lat: 39.1031, lng: -84.512, county: "Hamilton", zip: "45202" },
  { city: "Toledo", state: "OH", lat: 41.6528, lng: -83.5379, county: "Lucas", zip: "43604" },
  { city: "Akron", state: "OH", lat: 41.0814, lng: -81.519, county: "Summit", zip: "44308" },
  // Oklahoma
  { city: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164, county: "Oklahoma", zip: "73102" },
  { city: "Tulsa", state: "OK", lat: 36.154, lng: -95.9928, county: "Tulsa", zip: "74103" },
  // Oregon
  { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784, county: "Multnomah", zip: "97201" },
  { city: "Eugene", state: "OR", lat: 44.0521, lng: -123.0868, county: "Lane", zip: "97401" },
  { city: "Salem", state: "OR", lat: 44.9429, lng: -123.0351, county: "Marion", zip: "97301" },
  { city: "Bend", state: "OR", lat: 44.0582, lng: -121.3153, county: "Deschutes", zip: "97701" },
  // Pennsylvania
  { city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652, county: "Philadelphia", zip: "19102" },
  { city: "Pittsburgh", state: "PA", lat: 40.4406, lng: -79.9959, county: "Allegheny", zip: "15222" },
  { city: "Allentown", state: "PA", lat: 40.6084, lng: -75.4902, county: "Lehigh", zip: "18101" },
  { city: "Lancaster", state: "PA", lat: 40.0379, lng: -76.3055, county: "Lancaster", zip: "17602" },
  // Rhode Island
  { city: "Providence", state: "RI", lat: 41.824, lng: -71.4128, county: "Providence", zip: "02903" },
  // South Carolina
  { city: "Columbia", state: "SC", lat: 34.0007, lng: -81.0348, county: "Richland", zip: "29201" },
  { city: "Charleston", state: "SC", lat: 32.7765, lng: -79.9311, county: "Charleston", zip: "29401" },
  { city: "Greenville", state: "SC", lat: 34.8526, lng: -82.394, county: "Greenville", zip: "29601" },
  { city: "Myrtle Beach", state: "SC", lat: 33.6891, lng: -78.8867, county: "Horry", zip: "29577" },
  // South Dakota
  { city: "Sioux Falls", state: "SD", lat: 43.5446, lng: -96.7311, county: "Minnehaha", zip: "57104" },
  { city: "Rapid City", state: "SD", lat: 44.0805, lng: -103.2310, county: "Pennington", zip: "57701" },
  // Tennessee
  { city: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816, county: "Davidson", zip: "37203" },
  { city: "Memphis", state: "TN", lat: 35.1495, lng: -90.049, county: "Shelby", zip: "38103" },
  { city: "Knoxville", state: "TN", lat: 35.9606, lng: -83.9207, county: "Knox", zip: "37902" },
  { city: "Chattanooga", state: "TN", lat: 35.0456, lng: -85.3097, county: "Hamilton", zip: "37402" },
  // Texas
  { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, county: "Harris", zip: "77002" },
  { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.797, county: "Dallas", zip: "75201" },
  { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, county: "Travis", zip: "78701" },
  { city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936, county: "Bexar", zip: "78205" },
  { city: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308, county: "Tarrant", zip: "76102" },
  { city: "El Paso", state: "TX", lat: 31.7619, lng: -106.485, county: "El Paso", zip: "79901" },
  { city: "Plano", state: "TX", lat: 33.0198, lng: -96.6989, county: "Collin", zip: "75024" },
  // Utah
  { city: "Salt Lake City", state: "UT", lat: 40.7608, lng: -111.891, county: "Salt Lake", zip: "84101" },
  { city: "Provo", state: "UT", lat: 40.2338, lng: -111.6585, county: "Utah", zip: "84601" },
  { city: "Ogden", state: "UT", lat: 41.223, lng: -111.9738, county: "Weber", zip: "84401" },
  // Vermont
  { city: "Burlington", state: "VT", lat: 44.4759, lng: -73.2121, county: "Chittenden", zip: "05401" },
  // Virginia
  { city: "Virginia Beach", state: "VA", lat: 36.8529, lng: -75.978, county: "Virginia Beach", zip: "23451" },
  { city: "Richmond", state: "VA", lat: 37.5407, lng: -77.436, county: "Richmond City", zip: "23219" },
  { city: "Arlington", state: "VA", lat: 38.8799, lng: -77.1068, county: "Arlington", zip: "22201" },
  { city: "Norfolk", state: "VA", lat: 36.8508, lng: -76.2859, county: "Norfolk", zip: "23510" },
  // Washington
  { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, county: "King", zip: "98101" },
  { city: "Tacoma", state: "WA", lat: 47.2529, lng: -122.4443, county: "Pierce", zip: "98402" },
  { city: "Spokane", state: "WA", lat: 47.6588, lng: -117.426, county: "Spokane", zip: "99201" },
  // West Virginia
  { city: "Charleston", state: "WV", lat: 38.3498, lng: -81.6326, county: "Kanawha", zip: "25301" },
  { city: "Huntington", state: "WV", lat: 38.4192, lng: -82.4452, county: "Cabell", zip: "25701" },
  // Wisconsin
  { city: "Milwaukee", state: "WI", lat: 43.0389, lng: -87.9065, county: "Milwaukee", zip: "53202" },
  { city: "Madison", state: "WI", lat: 43.0731, lng: -89.4012, county: "Dane", zip: "53703" },
  { city: "Green Bay", state: "WI", lat: 44.5133, lng: -88.0133, county: "Brown", zip: "54301" },
  // Wyoming
  { city: "Cheyenne", state: "WY", lat: 41.14, lng: -104.8202, county: "Laramie", zip: "82001" },
  { city: "Casper", state: "WY", lat: 42.8501, lng: -106.3252, county: "Natrona", zip: "82601" },
  { city: "Jackson", state: "WY", lat: 43.4799, lng: -110.7624, county: "Teton", zip: "83001" },
]

const STREET_NAMES = [
  "Main St", "Commerce Blvd", "Industrial Dr", "Market St", "Park Ave",
  "Oak Lane", "Warehouse Way", "Business Park Dr", "Technology Blvd", "Enterprise Ave",
  "Capital Blvd", "Trade Center Dr", "Gateway Pkwy", "Airport Rd", "Harbor Dr",
  "Victory Ln", "Franklin Ave", "Madison St", "Washington Blvd", "Lincoln Rd",
  "Elm St", "Cedar Rd", "Maple Ave", "Pine St", "1st Ave",
  "2nd St", "3rd Ave", "Broadway", "Church St", "Center St",
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

  // Generate ~2000 listings, cycling through all cities multiple times
  for (let i = 0; i < 2000; i++) {
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
      ? Math.floor(seededRandom(seed + 10) * 250) + 4 : null
    const capRate = dealType === "for_sale" && !isForeclosure && seededRandom(seed + 11) > 0.3
      ? Math.round((seededRandom(seed + 12) * 8 + 3) * 10) / 10 : null
    const acres = propertyType === "land" || propertyType === "agricultural"
      ? Math.round(seededRandom(seed + 13) * 500 * 10) / 10
      : sqft ? Math.round((sqft / 43560) * 100) / 100 : null

    const daysOnMarket = Math.floor(seededRandom(seed + 14) * 180)
    const listedDate = new Date(2026, 2, 31 - daysOnMarket).toISOString().split("T")[0]
    const auctionDate = isForeclosure
      ? new Date(2026, 3, Math.floor(seededRandom(seed + 15) * 28) + 1).toISOString().split("T")[0] : null

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
