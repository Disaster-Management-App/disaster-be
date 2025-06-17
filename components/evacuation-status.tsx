"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Clock, Route, CheckCircle, AlertCircle, Navigation } from "lucide-react"

interface EvacuationZone {
  id: string
  zone_id: string
  name: string
  population: number
  status: string
  priority: string
  updated_at: string
}

interface EvacuationStatusProps {
  zones: EvacuationZone[]
}

export function EvacuationStatus({ zones }: EvacuationStatusProps) {
  const getZoneStatusIcon = (status: string) => {
    switch (status) {
      case "evacuating":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "evacuated":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getZoneStatusBadge = (status: string) => {
    switch (status) {
      case "evacuating":
        return (
          <Badge variant="default" className="bg-orange-500">
            In Progress
          </Badge>
        )
      case "evacuated":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Warning
          </Badge>
        )
      default:
        return <Badge variant="outline">Safe</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "high":
        return "border-orange-200 bg-orange-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-green-200 bg-green-50"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  // Filter zones that need attention (not safe)
  const activeZones = zones.filter((zone) => zone.status !== "safe").slice(0, 3)

  // Calculate totals
  const totalPopulation = zones.reduce((sum, zone) => sum + zone.population, 0)
  const evacuatingPopulation = zones
    .filter((zone) => zone.status === "evacuating")
    .reduce((sum, zone) => sum + zone.population, 0)
  const evacuatedPopulation = zones
    .filter((zone) => zone.status === "evacuated")
    .reduce((sum, zone) => sum + zone.population, 0)
  const warningPopulation = zones
    .filter((zone) => zone.status === "warning")
    .reduce((sum, zone) => sum + zone.population, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Evacuation Status</span>
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Route Planner
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeZones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>All zones are safe</p>
            <p className="text-sm">No active evacuations</p>
          </div>
        ) : (
          activeZones.map((zone) => (
            <div key={zone.id} className={`p-4 rounded-lg border ${getPriorityColor(zone.priority)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getZoneStatusIcon(zone.status)}
                  <div>
                    <h4 className="font-semibold">{zone.name}</h4>
                    <p className="text-sm text-muted-foreground">{zone.zone_id}</p>
                  </div>
                </div>
                {getZoneStatusBadge(zone.status)}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{zone.population.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Population</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Route className="h-4 w-4 mr-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">3</p>
                    <p className="text-xs text-muted-foreground">Routes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">2</p>
                    <p className="text-xs text-muted-foreground">Shelters</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated {getTimeAgo(zone.updated_at)}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {zone.status === "warning" && <Button size="sm">Initiate</Button>}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Summary Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{(evacuatedPopulation / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground">Evacuated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{(evacuatingPopulation / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{(warningPopulation / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground">Warning</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
