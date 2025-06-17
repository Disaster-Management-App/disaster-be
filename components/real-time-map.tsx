"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Layers, Zap, Droplets, Wind, Thermometer, Users, Truck } from "lucide-react"

interface Sensor {
  id: string
  sensor_id: string
  name: string
  type: string
  location: string
  status: string
  battery_level: number
  last_reading_at: string
}

interface RealTimeMapProps {
  sensors: Sensor[]
}

export function RealTimeMap({ sensors }: RealTimeMapProps) {
  const [selectedLayer, setSelectedLayer] = useState("all")

  const mapLayers = [
    { id: "all", label: "All Layers", icon: Layers },
    { id: "weather", label: "Weather", icon: Wind },
    { id: "seismic", label: "Seismic", icon: Zap },
    { id: "flood", label: "Flood Risk", icon: Droplets },
    { id: "evacuation", label: "Evacuation", icon: Users },
    { id: "resources", label: "Resources", icon: Truck },
  ]

  // Convert sensors to map markers
  const mapMarkers = sensors.map((sensor, index) => ({
    id: sensor.id,
    type: sensor.type,
    x: 35 + index * 15, // Distribute across map
    y: 40 + index * 10,
    severity: sensor.status === "active" ? "normal" : "warning",
    label: sensor.name,
    status: sensor.status,
    battery: sensor.battery_level,
  }))

  // Add some static markers for demo
  const staticMarkers = [
    { id: "shelter1", type: "shelter", x: 60, y: 30, severity: "normal", label: "Emergency Shelter" },
    { id: "resource1", type: "resource", x: 70, y: 70, severity: "normal", label: "Medical Supplies" },
    { id: "evacuation1", type: "evacuation", x: 45, y: 55, severity: "normal", label: "Evacuation Route" },
  ]

  const allMarkers = [...mapMarkers, ...staticMarkers]

  const getMarkerColor = (type: string, status?: string) => {
    if (status === "warning" || status === "critical") return "bg-red-500 animate-pulse"

    switch (type) {
      case "weather":
      case "flood":
      case "seismic":
      case "air_quality":
        return "bg-green-500"
      case "shelter":
        return "bg-blue-500"
      case "resource":
        return "bg-purple-500"
      case "evacuation":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-Time Monitoring Map</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {sensors.filter((s) => s.status === "active").length} Active Sensors
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[500px]">
          {/* Map Layers Panel */}
          <div className="w-48 border-r bg-muted/30 p-4">
            <h4 className="font-semibold mb-3">Map Layers</h4>
            <div className="space-y-2">
              {mapLayers.map((layer) => {
                const Icon = layer.icon
                return (
                  <Button
                    key={layer.id}
                    variant={selectedLayer === layer.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {layer.label}
                  </Button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6">
              <h5 className="font-medium mb-2">Legend</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Critical Alert
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Emergency Shelter
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Active Sensor
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Resources
                </div>
              </div>
            </div>

            {/* Sensor Status */}
            {sensors.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium mb-2">Sensors</h5>
                <div className="space-y-1 text-xs">
                  {sensors.slice(0, 3).map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between">
                      <span className="truncate">{sensor.name.split(" ")[0]}</span>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${sensor.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span>{sensor.battery_level}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-muted-foreground">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map Markers */}
            {allMarkers.map((marker) => (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getMarkerColor(marker.type, marker.status)}`}
                ></div>

                {/* Tooltip */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {marker.label}
                  {marker.battery && <div className="text-xs">Battery: {marker.battery}%</div>}
                </div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="outline" className="bg-white">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white">
                +
              </Button>
              <Button size="sm" variant="outline" className="bg-white">
                -
              </Button>
            </div>

            {/* Current Conditions Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
              <h5 className="font-medium mb-2">Current Conditions</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-1 text-orange-500" />
                  <span>24°C</span>
                </div>
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-1 text-blue-500" />
                  <span>15 km/h</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-1 text-blue-600" />
                  <span>65% Humidity</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>Low Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
