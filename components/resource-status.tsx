"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, Users, Heart, Home, AlertTriangle } from "lucide-react"

interface Resource {
  id: string
  type: string
  name: string
  total_quantity: number
  available_quantity: number
  unit: string
  location: string
  status: string
  updated_at: string
}

interface ResourceStatusProps {
  resources: Resource[]
}

export function ResourceStatus({ resources }: ResourceStatusProps) {
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "medical":
        return Heart
      case "food":
      case "supplies":
        return Package
      case "vehicles":
        return Truck
      case "personnel":
        return Users
      case "shelter":
        return Home
      default:
        return Package
    }
  }

  const getStatusBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100

    if (percentage >= 70) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Available
        </Badge>
      )
    } else if (percentage >= 40) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Limited
        </Badge>
      )
    } else {
      return <Badge variant="destructive">Critical</Badge>
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

  // Group resources by type
  const groupedResources = resources.reduce(
    (acc, resource) => {
      const type = resource.type
      if (!acc[type]) {
        acc[type] = {
          type,
          total_available: 0,
          total_quantity: 0,
          resources: [],
          icon: getResourceIcon(type),
        }
      }
      acc[type].total_available += resource.available_quantity
      acc[type].total_quantity += resource.total_quantity
      acc[type].resources.push(resource)
      return acc
    },
    {} as Record<string, any>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resource Status</span>
          <Button variant="outline" size="sm">
            Manage Resources
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(groupedResources).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p>No resources data available</p>
          </div>
        ) : (
          Object.values(groupedResources).map((group: any, index) => {
            const Icon = group.icon
            const percentage = (group.total_available / group.total_quantity) * 100

            return (
              <div key={index} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium capitalize">{group.type}</span>
                  </div>
                  {getStatusBadge(group.total_available, group.total_quantity)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available: {group.total_available.toLocaleString()}</span>
                    <span>Total: {group.total_quantity.toLocaleString()}</span>
                  </div>

                  <Progress value={percentage} className="h-2" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{group.resources.length} locations</span>
                    <span>Updated {getTimeAgo(group.resources[0]?.updated_at)}</span>
                  </div>
                </div>

                {percentage < 40 && (
                  <div className="mt-2 flex items-center text-xs text-yellow-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Resource levels below optimal threshold
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h5 className="font-medium mb-2">Quick Actions</h5>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Request Supplies
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Deploy Resources
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
