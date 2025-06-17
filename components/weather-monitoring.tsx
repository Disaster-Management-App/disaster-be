"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cloud, Droplets, Eye, Gauge, Thermometer, Wind } from "lucide-react"

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

interface WeatherMonitoringProps {
  sensors: Sensor[]
}

export function WeatherMonitoring({ sensors }: WeatherMonitoringProps) {
  // Filter weather sensors
  const weatherSensors = sensors.filter((sensor) => sensor.type === "weather")

  // Mock weather data (in real app, this would come from latest sensor readings)
  const weatherData = [
    {
      label: "Temperature",
      value: "24°C",
      status: "normal",
      icon: Thermometer,
      trend: "+2°C from yesterday",
    },
    {
      label: "Humidity",
      value: "65%",
      status: "normal",
      icon: Droplets,
      trend: "Stable",
    },
    {
      label: "Wind Speed",
      value: "15 km/h",
      status: "normal",
      icon: Wind,
      trend: "Light breeze",
    },
    {
      label: "Pressure",
      value: "1013 hPa",
      status: "normal",
      icon: Gauge,
      trend: "Steady",
    },
    {
      label: "Visibility",
      value: "10 km",
      status: "good",
      icon: Eye,
      trend: "Clear conditions",
    },
    {
      label: "Cloud Cover",
      value: "30%",
      status: "normal",
      icon: Cloud,
      trend: "Partly cloudy",
    },
  ]

  const riskLevels = [
    { label: "Flood Risk", level: 25, color: "bg-blue-500" },
    { label: "Fire Risk", level: 15, color: "bg-orange-500" },
    { label: "Storm Risk", level: 40, color: "bg-purple-500" },
    { label: "Seismic Risk", level: 10, color: "bg-yellow-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather Monitoring</span>
          <Badge variant="outline" className="text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {weatherSensors.length} Sensors Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sensor Status */}
        {weatherSensors.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Weather Stations</h4>
            <div className="space-y-2">
              {weatherSensors.slice(0, 2).map((sensor) => (
                <div key={sensor.id} className="flex items-center justify-between text-sm">
                  <span>{sensor.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={sensor.status === "active" ? "secondary" : "destructive"} className="text-xs">
                      {sensor.status}
                    </Badge>
                    <span className="text-muted-foreground">{sensor.battery_level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather Conditions */}
        <div className="grid grid-cols-2 gap-3">
          {weatherData.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.trend}</p>
              </div>
            )
          })}
        </div>

        {/* Risk Assessment */}
        <div>
          <h4 className="font-medium mb-3">Risk Assessment</h4>
          <div className="space-y-3">
            {riskLevels.map((risk, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{risk.label}</span>
                  <span className="font-medium">{risk.level}%</span>
                </div>
                <Progress value={risk.level} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Forecast */}
        <div>
          <h4 className="font-medium mb-3">24-Hour Forecast</h4>
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">6 AM</p>
              <Cloud className="h-4 w-4 mx-auto my-1" />
              <p className="font-medium">22°C</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">12 PM</p>
              <Cloud className="h-4 w-4 mx-auto my-1" />
              <p className="font-medium">26°C</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">6 PM</p>
              <Droplets className="h-4 w-4 mx-auto my-1" />
              <p className="font-medium">23°C</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">12 AM</p>
              <Cloud className="h-4 w-4 mx-auto my-1" />
              <p className="font-medium">20°C</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
