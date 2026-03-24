"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export interface MapMarker {
  id: string
  lat: number
  lng: number
  type: "pharmacy" | "phc" | "hospital" | "user" | "village" | "alert"
  name: string
  details?: string
  riskScore?: number
  caseCount?: number
  onClick?: () => void
}

interface LeafletMapProps {
  center: [number, number]
  zoom: number
  markers: MapMarker[]
  selectedMarkerId?: string | null
  onMarkerClick?: (marker: MapMarker) => void
  showUserLocation?: boolean
  className?: string
  isOffline?: boolean
}

// Custom marker icons using CSS
const createMarkerIcon = (type: MapMarker["type"], riskScore?: number) => {
  let color = "#1a8a7a" // primary teal
  let size = 32
  let pulseClass = ""

  switch (type) {
    case "pharmacy":
      color = "#22c55e" // green
      break
    case "phc":
      color = "#3b82f6" // blue
      break
    case "hospital":
      color = "#ef4444" // red
      break
    case "user":
      color = "#1a8a7a" // teal primary
      size = 16
      pulseClass = "user-pulse"
      break
    case "village":
      if (riskScore !== undefined) {
        if (riskScore >= 70) color = "#ef4444"
        else if (riskScore >= 50) color = "#f97316"
        else if (riskScore >= 30) color = "#eab308"
        else color = "#22c55e"
      }
      break
    case "alert":
      color = "#ef4444"
      pulseClass = "alert-pulse"
      break
  }

  const iconSize = type === "user" ? 16 : (riskScore && riskScore >= 70 ? 40 : 32)

  return L.divIcon({
    className: `custom-marker ${pulseClass}`,
    html: `
      <div style="
        width: ${iconSize}px;
        height: ${iconSize}px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        ${type === "user" ? `
          <div style="
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: ${color};
            opacity: 0.3;
            animation: pulse 2s infinite;
          "></div>
        ` : ""}
        ${type === "alert" || (riskScore && riskScore >= 70) ? `
          <div style="
            position: absolute;
            width: 150%;
            height: 150%;
            border-radius: 50%;
            background: ${color};
            opacity: 0.3;
            animation: pulse 1.5s infinite;
          "></div>
        ` : ""}
      </div>
    `,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  })
}

export function LeafletMap({
  center,
  zoom,
  markers,
  selectedMarkerId,
  onMarkerClick,
  showUserLocation = true,
  className = "",
  isOffline = false,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const [mapReady, setMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    })

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control to top right
    L.control.zoom({ position: "topright" }).addTo(map)

    // Add attribution
    L.control.attribution({ position: "bottomright" }).addAttribution(
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    )

    mapRef.current = map
    setMapReady(true)

    return () => {
      map.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  // Update center when it changes
  useEffect(() => {
    if (mapRef.current && mapReady) {
      mapRef.current.setView(center, zoom)
    }
  }, [center, zoom, mapReady])

  // Handle markers
  useEffect(() => {
    if (!mapRef.current || !mapReady) return

    const map = mapRef.current
    const currentMarkers = markersRef.current

    // Remove old markers that are no longer in the list
    currentMarkers.forEach((marker, id) => {
      if (!markers.find((m) => m.id === id)) {
        marker.remove()
        currentMarkers.delete(id)
      }
    })

    // Add or update markers
    markers.forEach((markerData) => {
      let marker = currentMarkers.get(markerData.id)

      if (marker) {
        // Update existing marker position
        marker.setLatLng([markerData.lat, markerData.lng])
        marker.setIcon(createMarkerIcon(markerData.type, markerData.riskScore))
      } else {
        // Create new marker
        marker = L.marker([markerData.lat, markerData.lng], {
          icon: createMarkerIcon(markerData.type, markerData.riskScore),
        })

        // Add popup
        if (markerData.name) {
          const popupContent = `
            <div style="padding: 4px 0; min-width: 120px;">
              <strong style="font-size: 14px;">${markerData.name}</strong>
              ${markerData.details ? `<p style="margin: 4px 0 0; font-size: 12px; color: #666;">${markerData.details}</p>` : ""}
              ${markerData.riskScore !== undefined ? `<p style="margin: 4px 0 0; font-size: 12px; font-weight: 600; color: ${markerData.riskScore >= 70 ? "#ef4444" : markerData.riskScore >= 50 ? "#f97316" : "#22c55e"};">Risk: ${markerData.riskScore}%</p>` : ""}
              ${markerData.caseCount !== undefined ? `<p style="margin: 4px 0 0; font-size: 12px;">Cases: ${markerData.caseCount}</p>` : ""}
            </div>
          `
          marker.bindPopup(popupContent)
        }

        // Add click handler
        marker.on("click", () => {
          if (onMarkerClick) {
            onMarkerClick(markerData)
          }
          if (markerData.onClick) {
            markerData.onClick()
          }
        })

        marker.addTo(map)
        currentMarkers.set(markerData.id, marker)
      }

      // Highlight selected marker
      if (selectedMarkerId === markerData.id) {
        marker.openPopup()
      }
    })
  }, [markers, selectedMarkerId, onMarkerClick, mapReady])

  // Add user location marker
  useEffect(() => {
    if (!mapRef.current || !mapReady || !showUserLocation) return

    // Simulated user location for demo
    const userLat = center[0]
    const userLng = center[1]

    let userMarker = markersRef.current.get("user-location")
    if (userMarker) {
      userMarker.setLatLng([userLat, userLng])
    } else {
      userMarker = L.marker([userLat, userLng], {
        icon: createMarkerIcon("user"),
        zIndexOffset: 1000,
      })
      userMarker.bindPopup("<strong>Your Location</strong>")
      userMarker.addTo(mapRef.current)
      markersRef.current.set("user-location", userMarker)
    }
  }, [center, showUserLocation, mapReady])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .leaflet-popup-content {
          margin: 12px 16px;
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
      
      {/* Offline indicator overlay */}
      {isOffline && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
          Offline - Cached Map
        </div>
      )}
    </div>
  )
}
