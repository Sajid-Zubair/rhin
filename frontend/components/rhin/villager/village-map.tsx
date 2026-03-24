// "use client"

// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
// import L from "leaflet"
// import { useEffect } from "react"

// // ✅ Fix marker icon issue (Next.js + Leaflet)
// delete (L.Icon.Default.prototype as any)._getIconUrl

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// })

// export interface MapMarker {
//   id: string
//   lat: number
//   lng: number
//   type: string
//   name: string
//   details?: string
// }

// interface LeafletMapProps {
//   center: [number, number]
//   zoom: number
//   markers: MapMarker[]
//   selectedMarkerId?: string
//   onMarkerClick?: (marker: MapMarker) => void
//   showUserLocation?: boolean

//   // ✅ FIX: add route support
//   route?: [number, number][]
// }

// // 📍 Move map to new center
// function ChangeView({ center }: { center: [number, number] }) {
//   const map = useMap()
//   useEffect(() => {
//     map.setView(center)
//   }, [center])
//   return null
// }

// export function VillageMap({
//   center,
//   zoom,
//   markers,
//   selectedMarkerId,
//   onMarkerClick,
//   showUserLocation = false,
//   route = [],
// }: LeafletMapProps) {
//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       scrollWheelZoom={true}
//       className="w-full h-full"
//     >
//       <ChangeView center={center} />

//       {/* 🌍 Map tiles */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* 📍 User location */}
//       {showUserLocation && (
//         <Marker position={center}>
//           <Popup>You are here</Popup>
//         </Marker>
//       )}

//       {/* 📍 Facility markers */}
//       {markers.map((marker) => (
//         <Marker
//           key={marker.id}
//           position={[marker.lat, marker.lng]}
//           eventHandlers={{
//             click: () => {
//               onMarkerClick?.(marker)
//             },
//           }}
//         >
//           <Popup>
//             <strong>{marker.name}</strong>
//             <br />
//             {marker.details}
//           </Popup>
//         </Marker>
//       ))}

//       {/* 🧭 ROUTE LINE */}
//       {route && route.length > 0 && (
//         <Polyline
//           positions={route}
//           pathOptions={{
//             color: "#2563eb",
//             weight: 5,
//             opacity: 0.8,
//           }}
//         />
//       )}
//     </MapContainer>
//   )
// }

"use client"

import React, { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import axios from "axios"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import { Language } from "@/app/page"

interface VillageMapProps {
  language: Language
  isOnline: boolean
}

// 👤 USER ICON
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// 💊 PHARMACY ICON
const pharmacyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2966/2966480.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// 🏥 PHC ICON
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/1484/1484823.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

function VillageMap({ language, isOnline }: VillageMapProps) {
  const [loc, setLocation] = useState<any>(null)
  const [places, setPlaces] = useState<any[]>([])
  const [route, setRoute] = useState<any>(null)
  const [show, setShow] = useState(false)

  const mapRef = useRef<any>(null)

  const API_KEY = "YOUR_TOMTOM_API_KEY" // 🔥 replace

  // 📍 GET LOCATION + FETCH PLACES
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lon: longitude })

        try {
          // 🔥 PHARMACIES + PHC
          const res = await axios.get(
            `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${latitude}&lon=${longitude}&categorySet=7321,7320&key=${API_KEY}`
          )

          const results = res.data.results.map((r: any) => ({
            lat: r.position.lat,
            lon: r.position.lon,
            name: r.poi.name,
            address: r.address.freeformAddress,
            category: r.poi.categories[0],
          }))

          setPlaces(results)

        } catch (err) {
          console.error("Fetch failed", err)
        }
      },
      () => alert("Location access denied")
    )
  }, [])

  // 🚗 ROUTE FUNCTION
  const getRoute = async (lat: number, lon: number) => {
    if (!loc) return

    try {
      const res = await axios.get(
        `https://api.tomtom.com/routing/1/calculateRoute/${loc.lat},${loc.lon}:${lat},${lon}/json?key=${API_KEY}`
      )

      const routeData = res.data.routes[0]

      const points = routeData.legs[0].points.map((p: any) => [
        p.latitude,
        p.longitude,
      ])

      setRoute({
        points,
        length: routeData.summary.lengthInMeters,
        travelTime: routeData.summary.travelTimeInSeconds,
      })

      setShow(true)

    } catch {
      alert("Route fetch failed")
    }
  }

  // 📍 FIT BOUNDS
  function FitBounds({ points }: any) {
    const map = useMap()

    useEffect(() => {
      if (points?.length) {
        map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
      }
    }, [points])

    return null
  }

  return (
    <div className="flex h-screen w-screen flex-col lg:flex-row">

      {/* 🗺️ MAP */}
      {loc ? (
        <div className={`${show ? "lg:w-[80%]" : "w-full"} h-full`}>
          <MapContainer center={[loc.lat, loc.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {route && <FitBounds points={route.points} />}

            {/* USER */}
            <Marker position={[loc.lat, loc.lon]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {/* 💊 + 🏥 PLACES */}
            {places.map((p, i) => (
              <Marker
                key={i}
                position={[p.lat, p.lon]}
                icon={p.category === "pharmacy" ? pharmacyIcon : hospitalIcon}
                eventHandlers={{
                  click: () => getRoute(p.lat, p.lon),
                }}
              >
                <Popup>
                  <strong>{p.name}</strong><br />
                  {p.address}<br />
                  <em>Click to navigate</em>
                </Popup>
              </Marker>
            ))}

            {/* ROUTE */}
            {route && (
              <Polyline
                positions={route.points}
                color="blue"
                weight={5}
              />
            )}
          </MapContainer>
        </div>
      ) : (
        <p className="text-center mt-10">Getting your location...</p>
      )}

      {/* 📊 SIDE PANEL */}
      {route && (
        <div className="lg:w-[20%] p-4 bg-white shadow-lg overflow-y-auto">
          <button
            className="mb-4 px-3 py-2 bg-red-500 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Exit Navigation
          </button>

          <h3 className="font-bold text-lg mb-2">Route Info</h3>

          <p>
            Distance: {(route.length / 1000).toFixed(1)} km <br />
            Time: {Math.round(route.travelTime / 60)} min
          </p>
        </div>
      )}
    </div>
  )
}

export default VillageMap