import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  MapPin,
  Settings,
  CheckCircle,
  Clock,
  Battery,
  Wifi,
  Gauge,
  Eye,
} from "lucide-react"

export default function SensorsPage() {
  const sensorTypes = [
    {
      type: "Weather Stations",
      icon: Wind,
      total: 15,
      active: 14,
      offline: 1,
      batteryAvg: 78,
      lastMaintenance: "2 days ago",
    },
    {
      type: "Flood Sensors",
      icon: Droplets,
      total: 12,
      active: 11,
      offline: 1,
      batteryAvg: 82,
      lastMaintenance: "1 week ago",
    },
    {
      type: "Seismic Monitors",
      icon: Zap,
      total: 8,
      active: 8,
      offline: 0,
      batteryAvg: 91,
      lastMaintenance: "3 days ago",
    },
    {
      type: "Air Quality",
      icon: Activity,
      total: 10,
      active: 9,
      offline: 1,
      batteryAvg: 65,
      lastMaintenance: "5 days ago",
    },
  ]

  const sensorDetails = [
    {
      id: "WS-001",
      name: "Downtown Weather Station",
      type: "Weather",
      location: "Central District",
      status: "active",
      battery: 85,
      signal: 92,
      lastReading: "30 seconds ago",
      readings: {
        temperature: { value: 24, unit: "°C", status: "normal" },
        humidity: { value: 65, unit: "%", status: "normal" },
        pressure: { value: 1013, unit: "hPa", status: "normal" },
        windSpeed: { value: 15, unit: "km/h", status: "normal" },
      },
    },
    {
      id: "FS-002",
      name: "River Level Monitor",
      type: "Flood",
      location: "Riverside Area",
      status: "warning",
      battery: 72,
      signal: 88,
      lastReading: "1 minute ago",
      readings: {
        waterLevel: { value: 4.2, unit: "m", status: "warning" },
        flowRate: { value: 850, unit: "L/s", status: "warning" },
        turbidity: { value: 12, unit: "NTU", status: "normal" },
      },
    },
    {
      id: "SS-003",
      name: "Seismic Monitor Alpha",
      type: "Seismic",
      location: "Northern Hills",
      status: "active",
      battery: 94,
      signal: 96,
      lastReading: "15 seconds ago",
      readings: {
        magnitude: { value: 0.8, unit: "Richter", status: "normal" },
        frequency: { value: 2.1, unit: "Hz", status: "normal" },
        acceleration: { value: 0.02, unit: "g", status: "normal" },
      },
    },
    {
      id: "AQ-004",
      name: "Industrial Air Monitor",
      type: "Air Quality",
      location: "Industrial Zone",
      status: "critical",
      battery: 45,
      signal: 78,
      lastReading: "45 seconds ago",
      readings: {
        pm25: { value: 85, unit: "μg/m³", status: "critical" },
        pm10: { value: 120, unit: "μg/m³", status: "warning" },
        co2: { value: 420, unit: "ppm", status: "normal" },
        visibility: { value: 3.2, unit: "km", status: "warning" },
      },
    },
  ]

  const maintenanceSchedule = [
    {
      id: "MAINT-001",
      sensor: "WS-005",
      name: "Coastal Weather Station",
      type: "Battery Replacement",
      scheduled: "Tomorrow",
      priority: "high",
      technician: "Tech Team A",
    },
    {
      id: "MAINT-002",
      sensor: "FS-008",
      name: "Bridge Flood Sensor",
      type: "Calibration",
      scheduled: "Next Week",
      priority: "medium",
      technician: "Tech Team B",
    },
    {
      id: "MAINT-003",
      sensor: "AQ-004",
      name: "Industrial Air Monitor",
      type: "Emergency Repair",
      scheduled: "Today",
      priority: "critical",
      technician: "Tech Team A",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "Weather":
        return <Wind className="h-5 w-5" />
      case "Flood":
        return <Droplets className="h-5 w-5" />
      case "Seismic":
        return <Zap className="h-5 w-5" />
      case "Air Quality":
        return <Activity className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getReadingIcon = (readingType: string) => {
    switch (readingType) {
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      case "humidity":
        return <Droplets className="h-4 w-4" />
      case "pressure":
        return <Gauge className="h-4 w-4" />
      case "windSpeed":
        return <Wind className="h-4 w-4" />
      case "waterLevel":
      case "flowRate":
      case "turbidity":
        return <Droplets className="h-4 w-4" />
      case "magnitude":
      case "frequency":
      case "acceleration":
        return <Zap className="h-4 w-4" />
      case "pm25":
      case "pm10":
      case "co2":
        return <Activity className="h-4 w-4" />
      case "visibility":
        return <Eye className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getReadingStatus = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Normal
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        )
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
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
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sensor Network</h1>
            <p className="text-muted-foreground">Environmental monitoring and sensor management</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Network Map
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sensorTypes.map((sensorType, index) => {
            const Icon = sensorType.icon
            const activePercentage = (sensorType.active / sensorType.total) * 100

            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-blue-500" />
                    <Badge variant="outline">
                      {sensorType.active}/{sensorType.total}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{sensorType.type}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active</span>
                      <span className="font-medium">{activePercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={activePercentage} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <Battery className="h-3 w-3 inline mr-1" />
                        {sensorType.batteryAvg}%
                      </div>
                      <div>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {sensorType.lastMaintenance}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sensor Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sensorDetails.map((sensor) => (
            <Card key={sensor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSensorIcon(sensor.type)}
                    <div>
                      <CardTitle className="text-lg">{sensor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {sensor.location} • {sensor.id}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(sensor.status)}>
                    {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Status */}
                <div className="grid grid-cols-3 gap-4 p-3 rounded-lg border bg-muted/30">
                  <div className="text-center">
                    <Battery className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{sensor.battery}%</p>
                    <p className="text-xs text-muted-foreground">Battery</p>
                  </div>
                  <div className="text-center">
                    <Wifi className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{sensor.signal}%</p>
                    <p className="text-xs text-muted-foreground">Signal</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{sensor.lastReading}</p>
                    <p className="text-xs text-muted-foreground">Last Reading</p>
                  </div>
                </div>

                {/* Sensor Readings */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(sensor.readings).map(([readingType, data]) => (
                    <div key={readingType} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getReadingIcon(readingType)}
                          <span className="text-sm font-medium capitalize">
                            {readingType.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                        {getReadingStatus(data.status)}
                      </div>
                      <p className="text-lg font-bold">
                        {data.value} {data.unit}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Maintenance Schedule</span>
              <Button variant="outline" size="sm">
                Schedule Maintenance
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceSchedule.map((maintenance) => (
              <div key={maintenance.id} className={`p-4 rounded-lg border ${getPriorityColor(maintenance.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{maintenance.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {maintenance.sensor} • {maintenance.type}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {maintenance.priority}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Scheduled</p>
                    <p className="font-medium">{maintenance.scheduled}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned to</p>
                    <p className="font-medium">{maintenance.technician}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">{maintenance.id}</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Network Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Network Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">99.2%</p>
                <p className="text-sm text-muted-foreground mb-4">Last 30 days</p>
                <Progress value={99.2} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">42 of 45 sensors active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Battery className="h-5 w-5 mr-2" />
                Average Battery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">79%</p>
                <p className="text-sm text-muted-foreground mb-4">Network average</p>
                <Progress value={79} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">3 sensors need attention</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="h-5 w-5 mr-2" />
                Signal Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">88%</p>
                <p className="text-sm text-muted-foreground mb-4">Average signal strength</p>
                <Progress value={88} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">Excellent connectivity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
