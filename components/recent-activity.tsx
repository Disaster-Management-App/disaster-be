"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, MapPin, Users, Truck, Radio, Shield } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "alert",
      title: "Flood warning issued for Downtown District",
      description: "Water levels rising rapidly. Evacuation order activated.",
      timestamp: "2 minutes ago",
      priority: "high",
      icon: AlertTriangle,
      user: "Emergency Coordinator",
    },
    {
      id: 2,
      type: "evacuation",
      title: "Evacuation route updated",
      description: "Route A-3 blocked due to debris. Alternative route activated.",
      timestamp: "8 minutes ago",
      priority: "medium",
      icon: MapPin,
      user: "Route Manager",
    },
    {
      id: 3,
      type: "resource",
      title: "Medical supplies deployed",
      description: "500 units of medical supplies sent to Shelter B.",
      timestamp: "15 minutes ago",
      priority: "normal",
      icon: Truck,
      user: "Resource Manager",
    },
    {
      id: 4,
      type: "communication",
      title: "Emergency broadcast sent",
      description: "Alert message sent to 25,000 residents in affected areas.",
      timestamp: "22 minutes ago",
      priority: "normal",
      icon: Radio,
      user: "Communications Team",
    },
    {
      id: 5,
      type: "personnel",
      title: "Rescue team dispatched",
      description: "Team Alpha deployed to assist with evacuations in Zone A.",
      timestamp: "35 minutes ago",
      priority: "high",
      icon: Users,
      user: "Operations Chief",
    },
    {
      id: 6,
      type: "system",
      title: "Sensor network status update",
      description: "All weather monitoring stations reporting normal operation.",
      timestamp: "1 hour ago",
      priority: "normal",
      icon: CheckCircle,
      user: "System Monitor",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "text-red-500"
      case "evacuation":
        return "text-orange-500"
      case "resource":
        return "text-purple-500"
      case "communication":
        return "text-blue-500"
      case "personnel":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Activity</span>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/30">
                <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      {activity.user}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Activity Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">24</p>
              <p className="text-xs text-muted-foreground">Actions Today</p>
            </div>
            <div>
              <p className="text-lg font-bold">3</p>
              <p className="text-xs text-muted-foreground">Active Alerts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
