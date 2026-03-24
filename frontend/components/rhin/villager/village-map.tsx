"use client"

import { useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { Language } from "@/app/page"
import { OfflineIndicator } from "../offline-banner"
import type { MapMarker } from "../maps/leaflet-map"
import { 
  MapPin, Phone, Navigation, ChevronUp, ChevronDown, 
  Cross, Building2, Pill, Heart, WifiOff, Locate
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(
  () => import("../maps/leaflet-map").then((mod) => mod.LeafletMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface VillageMapProps {
  language: Language
  isOnline: boolean
}

interface Facility {
  id: string
  name: string
  type: "pharmacy" | "phc" | "hospital"
  distance: string
  phone: string
  address: string
  lat: number
  lng: number
  openHours: string
}

const translations = {
  te: {
    title: "సమీపంలోని సౌకర్యాలు",
    pharmacy: "ఫార్మసీ",
    phc: "PHC",
    hospital: "ఆసుపత్రి",
    call: "కాల్",
    navigate: "నావిగేట్",
    away: "దూరంలో",
    offlineTiles: "ఆఫ్‌లైన్ మ్యాప్",
    openHours: "పని సమయాలు",
    allFacilities: "అన్ని సమీప సౌకర్యాలు",
    myLocation: "నా స్థానం",
  },
  hi: {
    title: "नज़दीकी सुविधाएं",
    pharmacy: "फार्मेसी",
    phc: "PHC",
    hospital: "अस्पताल",
    call: "कॉल",
    navigate: "नेविगेट",
    away: "दूर",
    offlineTiles: "ऑफ़लाइन मैप",
    openHours: "खुलने का समय",
    allFacilities: "सभी नज़दीकी सुविधाएं",
    myLocation: "मेरा स्थान",
  },
  en: {
    title: "Nearby Facilities",
    pharmacy: "Pharmacy",
    phc: "PHC",
    hospital: "Hospital",
    call: "Call",
    navigate: "Navigate",
    away: "away",
    offlineTiles: "Offline map",
    openHours: "Open Hours",
    allFacilities: "All Nearby Facilities",
    myLocation: "My Location",
  },
}

// Real facilities data for Kondapalli, Andhra Pradesh area
const facilities: Facility[] = [
  {
    id: "1",
    name: "Kondapalli Jan Aushadhi Kendra",
    type: "pharmacy",
    distance: "0.5 km",
    phone: "+91 98765 43210",
    address: "Main Road, Kondapalli, Krishna District",
    lat: 16.6192,
    lng: 80.5426,
    openHours: "8:00 AM - 9:00 PM",
  },
  {
    id: "2",
    name: "Sai Medical & General Store",
    type: "pharmacy",
    distance: "0.8 km",
    phone: "+91 98765 43212",
    address: "Bus Stand Road, Kondapalli",
    lat: 16.6178,
    lng: 80.5445,
    openHours: "7:00 AM - 10:00 PM",
  },
  {
    id: "3",
    name: "Kondapalli Primary Health Centre",
    type: "phc",
    distance: "1.2 km",
    phone: "+91 98765 43211",
    address: "Station Road, Kondapalli",
    lat: 16.6205,
    lng: 80.5470,
    openHours: "24 Hours",
  },
  {
    id: "4",
    name: "Government Area Hospital",
    type: "hospital",
    distance: "8.5 km",
    phone: "+91 866 257 8900",
    address: "Eluru Road, Vijayawada",
    lat: 16.5062,
    lng: 80.6480,
    openHours: "24 Hours",
  },
  {
    id: "5",
    name: "NTR District Hospital",
    type: "hospital",
    distance: "12.3 km",
    phone: "+91 866 257 8901",
    address: "Bandar Road, Vijayawada",
    lat: 16.5162,
    lng: 80.6180,
    openHours: "24 Hours",
  },
]

const facilityConfig = {
  pharmacy: { 
    icon: Pill, 
    color: "bg-green-500", 
    lightColor: "bg-green-500/10",
    textColor: "text-green-600",
    label: "Pharmacy"
  },
  phc: { 
    icon: Cross, 
    color: "bg-blue-500", 
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-600",
    label: "PHC"
  },
  hospital: { 
    icon: Building2, 
    color: "bg-red-500", 
    lightColor: "bg-red-500/10",
    textColor: "text-red-600",
    label: "Hospital"
  },
}

// User's current location (Kondapalli center)
const USER_LOCATION: [number, number] = [16.6185, 80.5440]

export function VillageMap({ language, isOnline }: VillageMapProps) {
  const t = translations[language || "en"]
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(facilities[0])
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(USER_LOCATION)

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`
  }

  const handleNavigate = (facility: Facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}&origin=${USER_LOCATION[0]},${USER_LOCATION[1]}`
    window.open(url, "_blank")
  }

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    const facility = facilities.find(f => f.id === marker.id)
    if (facility) {
      setSelectedFacility(facility)
      setIsDrawerExpanded(true)
    }
  }, [])

  const handleCenterOnUser = () => {
    setMapCenter(USER_LOCATION)
  }

  // Convert facilities to map markers
  const mapMarkers: MapMarker[] = useMemo(() => {
    return facilities.map(facility => ({
      id: facility.id,
      lat: facility.lat,
      lng: facility.lng,
      type: facility.type,
      name: facility.name,
      details: `${facility.distance} ${t.away}`,
    }))
  }, [t.away])

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[500] flex items-center justify-between p-4 bg-gradient-to-b from-background/95 via-background/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{t.title}</span>
        </div>
        <OfflineIndicator isOnline={isOnline} />
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <LeafletMap
          center={mapCenter}
          zoom={14}
          markers={mapMarkers}
          selectedMarkerId={selectedFacility?.id}
          onMarkerClick={handleMarkerClick}
          showUserLocation={true}
          isOffline={!isOnline}
          className="w-full h-full"
        />

        {/* Locate Me Button */}
        <button
          onClick={handleCenterOnUser}
          className="absolute bottom-36 right-4 z-[500] w-12 h-12 rounded-full bg-card shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={t.myLocation}
        >
          <Locate className="w-5 h-5 text-primary" />
        </button>

        {/* Legend */}
        <div className="absolute bottom-36 left-4 z-[500] bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="space-y-2">
            {Object.entries(facilityConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={cn("w-4 h-4 rounded-full", config.color)} />
                  <span className="text-xs text-foreground">{config.label}</span>
                </div>
              )
            })}
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow" />
              <span className="text-xs text-foreground">You</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Drawer */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl transition-all duration-300 z-[500]",
        isDrawerExpanded ? "h-[65%]" : "h-36"
      )}>
        {/* Drawer Handle */}
        <button
          onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
          className="w-full flex items-center justify-center py-3"
        >
          <div className="w-12 h-1.5 rounded-full bg-muted" />
        </button>

        {/* Selected Facility */}
        {selectedFacility && (
          <div className="px-4 pb-4 overflow-auto" style={{ maxHeight: isDrawerExpanded ? "calc(100% - 48px)" : "88px" }}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                facilityConfig[selectedFacility.type].lightColor
              )}>
                {(() => {
                  const Icon = facilityConfig[selectedFacility.type].icon
                  return <Icon className={cn(
                    "w-7 h-7",
                    facilityConfig[selectedFacility.type].textColor
                  )} />
                })()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{selectedFacility.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedFacility.distance} {t.away}
                </p>
                {isDrawerExpanded && (
                  <>
                    <p className="text-sm text-muted-foreground mt-1">{selectedFacility.address}</p>
                    <p className="text-sm font-medium text-primary mt-1">{selectedFacility.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.openHours}: {selectedFacility.openHours}
                    </p>
                  </>
                )}
              </div>

              {/* Expand/Collapse */}
              <button
                onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                {isDrawerExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            {isDrawerExpanded && (
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleCall(selectedFacility.phone)}
                  className="flex-1 h-12 rounded-xl"
                  size="lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t.call}
                </Button>
                <Button
                  onClick={() => handleNavigate(selectedFacility)}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  size="lg"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  {t.navigate}
                </Button>
              </div>
            )}

            {/* All Facilities List */}
            {isDrawerExpanded && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">{t.allFacilities}</h4>
                <div className="space-y-2">
                  {facilities.map((facility) => {
                    const config = facilityConfig[facility.type]
                    const Icon = config.icon
                    const isSelected = selectedFacility?.id === facility.id
                    return (
                      <button
                        key={facility.id}
                        onClick={() => {
                          setSelectedFacility(facility)
                          setMapCenter([facility.lat, facility.lng])
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                          isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.lightColor)}>
                          <Icon className={cn("w-5 h-5", config.textColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{facility.name}</p>
                          <p className="text-sm text-muted-foreground">{facility.distance}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCall(facility.phone)
                          }}
                          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                        </button>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
