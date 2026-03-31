"use client"

import { ComposableMap, Geographies, Geography, Marker, Annotation } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

// State auction counts data based on the screenshot
const stateData: Record<string, { count: number; coords: [number, number] }> = {
  "Washington": { count: 8, coords: [-120.5, 47.4] },
  "Oregon": { count: 1, coords: [-120.5, 44.0] },
  "Montana": { count: 1, coords: [-110.0, 47.0] },
  "North Dakota": { count: 0, coords: [-100.5, 47.5] },
  "Minnesota": { count: 7, coords: [-94.5, 46.0] },
  "Wisconsin": { count: 1, coords: [-89.5, 44.5] },
  "Michigan": { count: 16, coords: [-85.5, 44.0] },
  "Maine": { count: 3, coords: [-69.0, 45.5] },
  "New Hampshire": { count: 0, coords: [-71.5, 44.0] },
  "Vermont": { count: 0, coords: [-72.7, 44.0] },
  "Massachusetts": { count: 9, coords: [-71.8, 42.3] },
  "Rhode Island": { count: 2, coords: [-71.5, 41.7] },
  "Connecticut": { count: 0, coords: [-72.7, 41.6] },
  "New York": { count: 1, coords: [-75.5, 43.0] },
  "New Jersey": { count: 7, coords: [-74.5, 40.2] },
  "Pennsylvania": { count: 117, coords: [-77.5, 41.0] },
  "Delaware": { count: 0, coords: [-75.5, 39.0] },
  "Maryland": { count: 11, coords: [-76.7, 39.2] },
  "Virginia": { count: 29, coords: [-79.0, 37.5] },
  "West Virginia": { count: 3, coords: [-80.5, 38.8] },
  "Ohio": { count: 14, coords: [-82.8, 40.3] },
  "Indiana": { count: 2, coords: [-86.2, 40.0] },
  "Illinois": { count: 44, coords: [-89.2, 40.0] },
  "Iowa": { count: 0, coords: [-93.5, 42.0] },
  "Nebraska": { count: 0, coords: [-99.8, 41.5] },
  "South Dakota": { count: 0, coords: [-100.3, 44.5] },
  "Wyoming": { count: 0, coords: [-107.5, 43.0] },
  "Idaho": { count: 1, coords: [-114.5, 44.5] },
  "Nevada": { count: 0, coords: [-117.0, 39.5] },
  "Utah": { count: 0, coords: [-111.5, 39.5] },
  "Colorado": { count: 0, coords: [-105.5, 39.0] },
  "Kansas": { count: 0, coords: [-98.5, 38.5] },
  "Missouri": { count: 13, coords: [-92.5, 38.5] },
  "Arkansas": { count: 0, coords: [-92.5, 35.0] },
  "Oklahoma": { count: 4, coords: [-97.5, 35.5] },
  "Texas": { count: 33, coords: [-99.5, 31.5] },
  "New Mexico": { count: 2, coords: [-106.0, 34.5] },
  "Arizona": { count: 0, coords: [-111.5, 34.2] },
  "California": { count: 0, coords: [-119.5, 37.0] },
  "Louisiana": { count: 72, coords: [-92.0, 31.0] },
  "Mississippi": { count: 0, coords: [-89.7, 32.8] },
  "Alabama": { count: 14, coords: [-86.8, 32.8] },
  "Tennessee": { count: 18, coords: [-86.0, 36.0] },
  "Kentucky": { count: 10, coords: [-85.5, 37.8] },
  "North Carolina": { count: 147, coords: [-79.5, 35.5] },
  "South Carolina": { count: 195, coords: [-80.5, 34.0] },
  "Georgia": { count: 0, coords: [-83.5, 32.8] },
  "Florida": { count: 13, coords: [-81.5, 28.5] },
  "Alaska": { count: 1, coords: [-153.0, 64.0] },
  "Hawaii": { count: 0, coords: [-155.5, 20.0] },
}

// Get color based on count
const getStateColor = (count: number) => {
  if (count === 0) return "#e5e7eb" // gray-200
  if (count < 5) return "#93c5fd" // blue-300
  if (count < 15) return "#60a5fa" // blue-400
  if (count < 30) return "#3b82f6" // blue-500
  if (count < 50) return "#2563eb" // blue-600
  if (count < 100) return "#1d4ed8" // blue-700
  return "#1e40af" // blue-800
}

export function USMap() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
        width={800}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name
              const stateInfo = stateData[stateName]
              const count = stateInfo?.count || 0
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getStateColor(count)}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#1e40af", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>
        
        {/* State labels with counts */}
        {Object.entries(stateData).map(([name, data]) => {
          if (data.count === 0) return null
          return (
            <Marker key={name} coordinates={data.coords}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: "system-ui",
                  fill: "#fff",
                  fontSize: data.count >= 100 ? "10px" : "11px",
                  fontWeight: "bold",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {data.count}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}
