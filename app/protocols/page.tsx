import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  FileText,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  Edit,
  Download,
  Plus,
  Shield,
  Radio,
  Truck,
  Heart,
  Zap,
} from "lucide-react"

export default function ProtocolsPage() {
  const emergencyProtocols = [
    {
      id: "PROT-001",
      title: "Flood Emergency Response",
      category: "Natural Disaster",
      icon: AlertTriangle,
      priority: "critical",
      lastUpdated: "2024-01-10",
      version: "3.2",
      status: "active",
      steps: 12,
      estimatedTime: "45 minutes",
      responsibleTeam: "Emergency Response Team",
      description: "Comprehensive flood response protocol including evacuation procedures and resource allocation.",
    },
    {
      id: "PROT-002",
      title: "Earthquake Response Protocol",
      category: "Natural Disaster",
      icon: Zap,
      priority: "critical",
      lastUpdated: "2024-01-08",
      version: "2.8",
      status: "active",
      steps: 15,
      estimatedTime: "60 minutes",
      responsibleTeam: "Seismic Response Unit",
      description:
        "Immediate response procedures for seismic events including building assessments and rescue operations.",
    },
    {
      id: "PROT-003",
      title: "Mass Evacuation Procedures",
      category: "Evacuation",
      icon: Users,
      priority: "high",
      lastUpdated: "2024-01-05",
      version: "4.1",
      status: "active",
      steps: 18,
      estimatedTime: "90 minutes",
      responsibleTeam: "Evacuation Coordination",
      description: "Large-scale evacuation protocols for multiple zones with transportation and shelter coordination.",
    },
    {
      id: "PROT-004",
      title: "Emergency Communication Protocol",
      category: "Communication",
      icon: Radio,
      priority: "high",
      lastUpdated: "2024-01-12",
      version: "1.9",
      status: "active",
      steps: 8,
      estimatedTime: "15 minutes",
      responsibleTeam: "Communications Team",
      description: "Emergency broadcast and public alert procedures across all communication channels.",
    },
    {
      id: "PROT-005",
      title: "Medical Emergency Response",
      category: "Medical",
      icon: Heart,
      priority: "critical",
      lastUpdated: "2024-01-07",
      version: "2.3",
      status: "active",
      steps: 10,
      estimatedTime: "30 minutes",
      responsibleTeam: "Medical Response Unit",
      description: "Medical emergency protocols including triage procedures and resource deployment.",
    },
    {
      id: "PROT-006",
      title: "Resource Allocation Protocol",
      category: "Logistics",
      icon: Truck,
      priority: "medium",
      lastUpdated: "2024-01-03",
      version: "1.5",
      status: "review",
      steps: 14,
      estimatedTime: "40 minutes",
      responsibleTeam: "Logistics Team",
      description: "Emergency resource distribution and allocation procedures for disaster response.",
    },
  ]

  const protocolCategories = [
    {
      name: "Natural Disaster",
      count: 8,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Evacuation",
      count: 5,
      icon: Users,
      color: "bg-orange-100 text-orange-800",
    },
    {
      name: "Communication",
      count: 4,
      icon: Radio,
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Medical",
      count: 6,
      icon: Heart,
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Logistics",
      count: 3,
      icon: Truck,
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Security",
      count: 4,
      icon: Shield,
      color: "bg-yellow-100 text-yellow-800",
    },
  ]

  const recentUpdates = [
    {
      protocol: "Emergency Communication Protocol",
      change: "Updated mobile alert procedures",
      updatedBy: "Communications Manager",
      date: "2024-01-12",
      type: "revision",
    },
    {
      protocol: "Flood Emergency Response",
      change: "Added new evacuation routes",
      updatedBy: "Emergency Coordinator",
      date: "2024-01-10",
      type: "enhancement",
    },
    {
      protocol: "Earthquake Response Protocol",
      change: "Updated building assessment criteria",
      updatedBy: "Structural Engineer",
      date: "2024-01-08",
      type: "revision",
    },
    {
      protocol: "Medical Emergency Response",
      change: "Added COVID-19 safety measures",
      updatedBy: "Medical Director",
      date: "2024-01-07",
      type: "enhancement",
    },
  ]

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
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
        return <Badge variant="outline">Low</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "review":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Under Review
          </Badge>
        )
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case "enhancement":
        return "text-green-600"
      case "revision":
        return "text-blue-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Emergency Protocols</h1>
            <p className="text-muted-foreground">Standard operating procedures and emergency response protocols</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Protocol
            </Button>
          </div>
        </div>

        {/* Protocol Categories */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {protocolCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <Badge className={category.color}>{category.count} protocols</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Emergency Protocols */}
        <div className="space-y-4">
          {emergencyProtocols.map((protocol) => {
            const Icon = protocol.icon
            return (
              <Card key={protocol.id} className={getPriorityColor(protocol.priority)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <Icon className="h-6 w-6 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{protocol.title}</h3>
                          {getPriorityBadge(protocol.priority)}
                          {getStatusBadge(protocol.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{protocol.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-medium">{protocol.category}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Steps</p>
                            <p className="font-medium">{protocol.steps} procedures</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Est. Time</p>
                            <p className="font-medium">{protocol.estimatedTime}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Responsible Team</p>
                            <p className="font-medium">{protocol.responsibleTeam}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <span>{protocol.id}</span>
                      <span>Version {protocol.version}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Last updated: {protocol.lastUpdated}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Recent Protocol Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUpdates.map((update, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{update.protocol}</h4>
                    <Badge variant="outline" className={getUpdateTypeColor(update.type)}>
                      {update.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{update.change}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated by {update.updatedBy}</span>
                    <span>{update.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Protocol Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Protocol Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">30</p>
                  <p className="text-sm text-muted-foreground">Total Protocols</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">28</p>
                  <p className="text-sm text-muted-foreground">Active Protocols</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                  <p className="text-sm text-muted-foreground">Updated This Month</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protocol Compliance</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Staff Training Coverage</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protocol Updates (YTD)</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Protocol Management Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Plus className="h-6 w-6 mb-2" />
                <span>Create Protocol</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Edit className="h-6 w-6 mb-2" />
                <span>Review Protocols</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span>Training Schedule</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Download className="h-6 w-6 mb-2" />
                <span>Export Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
