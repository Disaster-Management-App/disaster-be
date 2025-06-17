import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard-header";
import { getActiveAlerts } from "@/lib/actions/alerts";
import { getSensorStatus } from "@/lib/actions/sensors";
import { getResourceStatus } from "@/lib/actions/resources";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Zap,
} from "lucide-react";

export default async function AnalyticsPage() {
  // Fetch real data from database
  const [alertsResult, sensorsResult, resourcesResult] = await Promise.all([
    getActiveAlerts(),
    getSensorStatus(),
    getResourceStatus(),
  ]);

  const alerts = alertsResult.success ? alertsResult.alerts || [] : [];
  const sensors = sensorsResult.success ? sensorsResult.sensors || [] : [];
  const resources = resourcesResult.success
    ? resourcesResult.resources || []
    : [];

  // Calculate analytics from real data
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
  const activeSensors = sensors.filter((s) => s.status === "active").length;
  const totalSensors = sensors.length;
  const avgBattery =
    sensors.length > 0
      ? Math.round(
          sensors.reduce((sum, s) => sum + (s.battery_level || 0), 0) /
            sensors.length
        )
      : 0;

  const kpiMetrics = [
    {
      title: "Response Time",
      value: "4.2 min",
      change: "-15%",
      trend: "down",
      description: "Average emergency response time",
      target: "< 5 min",
      status: "good",
    },
    {
      title: "Alert Delivery Rate",
      value: "96.8%",
      change: "+2.1%",
      trend: "up",
      description: "Successful alert deliveries",
      target: "> 95%",
      status: "good",
    },
    {
      title: "Sensor Uptime",
      value: `${
        totalSensors > 0 ? ((activeSensors / totalSensors) * 100).toFixed(1) : 0
      }%`,
      change: "+5%",
      trend: "up",
      description: "Active sensors vs total sensors",
      target: "> 95%",
      status: activeSensors / totalSensors > 0.95 ? "good" : "warning",
    },
    {
      title: "System Efficiency",
      value: "84%",
      change: "-3%",
      trend: "down",
      description: "Overall system performance",
      target: "70-90%",
      status: "good",
    },
  ];

  const disasterStats = [
    {
      type: "Critical Alerts",
      incidents: criticalAlerts,
      affected: alerts.reduce(
        (sum, a) => sum + (a.affected_population || 0),
        0
      ),
      responseTime: "3.8 min",
      severity: "high",
      trend: "+25%",
    },
    {
      type: "Sensor Issues",
      incidents: sensors.filter((s) => s.status !== "active").length,
      affected: 0,
      responseTime: "2.1 min",
      severity: "medium",
      trend: "-10%",
    },
    {
      type: "Resource Shortages",
      incidents: resources.filter(
        (r) => r.status === "low" || r.status === "critical"
      ).length,
      affected: 0,
      responseTime: "5.2 min",
      severity:
        resources.filter((r) => r.status === "critical").length > 0
          ? "high"
          : "low",
      trend: "+15%",
    },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "needs-improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Performance metrics and disaster management insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              🗄️ Live Database
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpiMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </h3>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {metric.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Target: {metric.target}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-time Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Alerts</span>
                    <span className="font-medium">{totalAlerts}</span>
                  </div>
                  <Progress
                    value={Math.min((totalAlerts / 10) * 100, 100)}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {criticalAlerts} critical, {totalAlerts - criticalAlerts}{" "}
                    others
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sensor Network</span>
                    <span className="font-medium">
                      {activeSensors}/{totalSensors}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalSensors > 0
                        ? (activeSensors / totalSensors) * 100
                        : 0
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalSensors - activeSensors} sensors offline
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Resource Availability</span>
                    <span className="font-medium">
                      {resources.filter((r) => r.status === "available").length}
                      /{resources.length}
                    </span>
                  </div>
                  <Progress
                    value={
                      resources.length > 0
                        ? (resources.filter((r) => r.status === "available")
                            .length /
                            resources.length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {
                      resources.filter(
                        (r) => r.status === "low" || r.status === "critical"
                      ).length
                    }{" "}
                    resources need attention
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Battery Level</span>
                    <span className="font-medium">{avgBattery}%</span>
                  </div>
                  <Progress value={avgBattery} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {sensors.filter((s) => (s.battery_level || 0) < 30).length}{" "}
                    sensors need battery replacement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issue Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Current Issues Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {disasterStats.map((stat, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{stat.type}</h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${getSeverityColor(
                          stat.severity
                        )}`}
                      >
                        {stat.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.trend}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Count</p>
                      <p className="font-bold text-lg">{stat.incidents}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Affected</p>
                      <p className="font-bold text-lg">
                        {stat.affected > 0
                          ? (stat.affected / 1000).toFixed(0) + "K"
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Response</p>
                      <p className="font-bold text-lg">{stat.responseTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                System Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">99.8%</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Last 30 days
                </p>
                <Progress value={99.8} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Target: 99.5%</span>
                  <span>Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Response Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">87%</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Average response efficiency
                </p>
                <Progress value={87} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Target: 85%</span>
                  <span>Above Target</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">94.2%</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Successful operations
                </p>
                <Progress value={94.2} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Target: 90%</span>
                  <span>Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations based on real data */}
        <Card>
          <CardHeader>
            <CardTitle>System Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensors.filter((s) => (s.battery_level || 0) < 30).length >
                0 && (
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">
                        Battery Maintenance Required
                      </h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        {
                          sensors.filter((s) => (s.battery_level || 0) < 30)
                            .length
                        }{" "}
                        sensors have low battery levels and need immediate
                        attention.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {criticalAlerts > 0 && (
                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">
                        Critical Alerts Active
                      </h4>
                      <p className="text-sm text-red-800 mt-1">
                        {criticalAlerts} critical alerts are currently active
                        and require immediate response.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSensors / totalSensors > 0.95 && (
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">
                        Excellent Sensor Network Performance
                      </h4>
                      <p className="text-sm text-green-800 mt-1">
                        {((activeSensors / totalSensors) * 100).toFixed(1)}% of
                        sensors are active and functioning properly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
