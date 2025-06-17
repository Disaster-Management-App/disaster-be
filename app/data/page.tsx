import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Database,
  HardDrive,
  Cloud,
  Download,
  Upload,
  Archive,
  Shield,
  Clock,
  Activity,
  BarChart3,
  FileText,
  Settings,
  RefreshCw,
} from "lucide-react"

export default function DataPage() {
  const storageMetrics = [
    {
      type: "Sensor Data",
      icon: Activity,
      used: 2.4,
      total: 5.0,
      unit: "TB",
      growth: "+12%",
      retention: "2 years",
    },
    {
      type: "Alert Logs",
      icon: FileText,
      used: 850,
      total: 1000,
      unit: "GB",
      growth: "+8%",
      retention: "5 years",
    },
    {
      type: "Media Files",
      icon: Archive,
      used: 1.8,
      total: 3.0,
      unit: "TB",
      growth: "+15%",
      retention: "1 year",
    },
    {
      type: "System Backups",
      icon: Shield,
      used: 3.2,
      total: 4.0,
      unit: "TB",
      growth: "+5%",
      retention: "6 months",
    },
  ]

  const dataStreams = [
    {
      id: "STREAM-001",
      name: "Weather Monitoring",
      source: "Weather Stations",
      frequency: "Every 30 seconds",
      volume: "2.4 MB/hour",
      status: "active",
      lastUpdate: "15 seconds ago",
      quality: 98.5,
    },
    {
      id: "STREAM-002",
      name: "Flood Detection",
      source: "Water Level Sensors",
      frequency: "Every 1 minute",
      volume: "1.8 MB/hour",
      status: "active",
      lastUpdate: "45 seconds ago",
      quality: 96.2,
    },
    {
      id: "STREAM-003",
      name: "Seismic Activity",
      source: "Seismic Monitors",
      frequency: "Continuous",
      volume: "5.2 MB/hour",
      status: "active",
      lastUpdate: "5 seconds ago",
      quality: 99.1,
    },
    {
      id: "STREAM-004",
      name: "Air Quality",
      source: "AQ Sensors",
      frequency: "Every 5 minutes",
      volume: "800 KB/hour",
      status: "warning",
      lastUpdate: "8 minutes ago",
      quality: 87.3,
    },
  ]

  const backupSchedule = [
    {
      type: "Incremental Backup",
      frequency: "Every 6 hours",
      lastRun: "2 hours ago",
      nextRun: "4 hours",
      status: "completed",
      size: "45 GB",
    },
    {
      type: "Full System Backup",
      frequency: "Daily",
      lastRun: "18 hours ago",
      nextRun: "6 hours",
      status: "completed",
      size: "2.1 TB",
    },
    {
      type: "Archive Backup",
      frequency: "Weekly",
      lastRun: "3 days ago",
      nextRun: "4 days",
      status: "completed",
      size: "850 GB",
    },
    {
      type: "Disaster Recovery",
      frequency: "Monthly",
      lastRun: "12 days ago",
      nextRun: "18 days",
      status: "scheduled",
      size: "5.2 TB",
    },
  ]

  const dataQualityMetrics = [
    {
      metric: "Completeness",
      value: 97.8,
      target: 95,
      status: "good",
      description: "Percentage of expected data received",
    },
    {
      metric: "Accuracy",
      value: 94.2,
      target: 90,
      status: "good",
      description: "Data validation success rate",
    },
    {
      metric: "Timeliness",
      value: 88.5,
      target: 85,
      status: "good",
      description: "Data received within expected timeframe",
    },
    {
      metric: "Consistency",
      value: 91.7,
      target: 90,
      status: "good",
      description: "Data format and structure compliance",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getQualityColor = (value: number, target: number) => {
    if (value >= target) return "text-green-600"
    if (value >= target * 0.9) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Management</h1>
            <p className="text-muted-foreground">Data storage, processing, and quality monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Data
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {storageMetrics.map((storage, index) => {
            const Icon = storage.icon
            const usagePercentage = (storage.used / storage.total) * 100

            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-blue-500" />
                    <Badge variant="outline" className="text-green-600">
                      {storage.growth}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{storage.type}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span className="font-medium">
                        {storage.used} / {storage.total} {storage.unit}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">Retention: {storage.retention}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Real-time Data Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataStreams.map((stream) => (
                <div key={stream.id} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{stream.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stream.source} • {stream.id}
                      </p>
                    </div>
                    <Badge className={getStatusColor(stream.status)}>
                      {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-medium">{stream.frequency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-medium">{stream.volume}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality</p>
                      <p className="font-medium">{stream.quality}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Update</p>
                      <p className="font-medium">{stream.lastUpdate}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Data Quality</span>
                      <span>{stream.quality}%</span>
                    </div>
                    <Progress value={stream.quality} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Backup Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {backupSchedule.map((backup, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{backup.type}</h4>
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-medium">{backup.frequency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-medium">{backup.size}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Run</p>
                      <p className="font-medium">{backup.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Run</p>
                      <p className="font-medium">{backup.nextRun}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Data Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataQualityMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{metric.metric}</span>
                    <span className={`font-bold ${getQualityColor(metric.value, metric.target)}`}>{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{metric.description}</span>
                    <span>Target: {metric.target}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Query Response Time</span>
                    <span className="font-medium">45ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Connection Pool</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cache Hit Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-5 w-5 mr-2" />
                Cloud Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">8.4 TB</p>
                <p className="text-sm text-muted-foreground mb-4">Used of 15 TB</p>
                <Progress value={56} className="h-3 mb-4" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Upload className="h-3 w-3 inline mr-1" />
                    2.1 GB/day
                  </div>
                  <div>
                    <Download className="h-3 w-3 inline mr-1" />
                    850 MB/day
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Local Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">12.8 TB</p>
                <p className="text-sm text-muted-foreground mb-4">Used of 20 TB</p>
                <Progress value={64} className="h-3 mb-4" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Clock className="h-3 w-3 inline mr-1" />
                    99.8% uptime
                  </div>
                  <div>
                    <Activity className="h-3 w-3 inline mr-1" />
                    1.2ms latency
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Archive className="h-6 w-6 mb-2" />
                <span>Archive Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Shield className="h-6 w-6 mb-2" />
                <span>Backup Now</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Settings className="h-6 w-6 mb-2" />
                <span>Configure</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
