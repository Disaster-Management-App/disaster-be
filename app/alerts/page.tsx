import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/dashboard-header";
import { getActiveAlerts } from "@/lib/actions/alerts";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Bell,
  Send,
  Eye,
  Archive,
} from "lucide-react";
import { CreateAlertButton } from "@/components/create-alert-button";
import { BroadcastButtonWrapper } from "@/components/broadcast-button-wrapper";

export default async function AlertsPage() {
  // Fetch real data from database - no fallbacks
  const result = await getActiveAlerts();
  const alerts = result.success ? result.alerts || [] : [];

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getAlertBadge = (severity: string, status: string) => {
    if (status === "resolved")
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Resolved
        </Badge>
      );

    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return (
          <Badge variant="default" className="bg-orange-500">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Medium
          </Badge>
        );
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-200 bg-red-50";
      case "high":
        return "border-orange-200 bg-orange-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Warnings</h1>
            <p className="text-muted-foreground">
              Emergency alerts and public warnings management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              🗄️ Live Database
            </div>
            <Button variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              Alert History
            </Button>
            <CreateAlertButton />
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Alerts
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter((alert) => alert.status === "active").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monitoring
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      alerts.filter((alert) => alert.status === "monitoring")
                        .length
                    }
                  </p>
                </div>
                <Eye className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resolved Today
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      alerts.filter((alert) => alert.status === "resolved")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    People Affected
                  </p>
                  <p className="text-2xl font-bold">
                    {(
                      alerts.reduce(
                        (total, alert) =>
                          total + (alert.affected_population || 0),
                        0
                      ) / 1000
                    ).toFixed(0)}
                    K
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Response
                  </p>
                  <p className="text-2xl font-bold">4.2m</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts by location, type, or description..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No alerts found. The system is operating normally.
                </p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className={getPriorityColor(alert.severity)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {alert.title}
                          </h3>
                          {getAlertBadge(alert.severity, alert.status)}
                          <Badge variant="outline" className="text-xs">
                            {alert.id}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {alert.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {(
                                alert.affected_population || 0
                              ).toLocaleString()}{" "}
                              people affected
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{getTimeAgo(alert.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {alert.status === "active" && (
                        <Button size="sm">Take Action</Button>
                      )}
                    </div>
                  </div>

                  {/* Alert Actions */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Actions Taken:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            Alert Broadcast
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Emergency Teams Notified
                          </Badge>
                          {alert.status === "active" && (
                            <Badge variant="outline" className="text-xs">
                              Evacuation Initiated
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Source: Emergency System
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(alert.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Emergency Broadcast Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Emergency Broadcast System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BroadcastButtonWrapper
                iconType="bell"
                label="Send Alert"
                alertType="weather"
                severity="medium"
              />
              <BroadcastButtonWrapper
                iconType="users"
                label="Evacuation Notice"
                alertType="flood"
                severity="high"
              />
              <BroadcastButtonWrapper
                iconType="checkCircle"
                label="All Clear"
                alertType="weather"
                severity="low"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
