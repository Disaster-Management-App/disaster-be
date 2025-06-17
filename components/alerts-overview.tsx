"use client"

import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Alert {
  id: string
  type: string
  severity: string
  title: string
  description: string
  location: string
  affected_population: number
  status: string
  created_at: string
}

interface AlertsOverviewProps {
  alerts: Alert[]
}

export function AlertsOverview({ alerts }: AlertsOverviewProps) {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getAlertBadge = (severity: string, status: string) => {
    if (status === "resolved") return <Badge variant="secondary">Resolved</Badge>

    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return (
          <Badge variant="default" className="bg-orange-500">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Medium
          </Badge>
        )
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Alerts & Warnings</span>
          <Button variant="outline" size="sm">
            View All Alerts
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active alerts at this time</p>
            </div>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50"
                    : alert.severity === "high"
                      ? "border-orange-200 bg-orange-50"
                      : alert.severity === "medium"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        {getAlertBadge(alert.severity, alert.status)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {alert.location}
                        <span className="mx-2">•</span>
                        <span>{getTimeAgo(alert.created_at)}</span>
                      </div>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Affected Population: {alert.affected_population.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                    {alert.status === "active" && <Button size="sm">Respond</Button>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
