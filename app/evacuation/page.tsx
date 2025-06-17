import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  getEvacuationStatus,
  getEvacuationRoutes,
} from "@/lib/actions/evacuation";
import {
  Users,
  MapPin,
  Route,
  Home,
  Clock,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Bus,
  Shield,
  Phone,
  Heart,
  Truck,
  Radio,
} from "lucide-react";

export default async function EvacuationPage() {
  // Fetch real data from database
  const [zonesResult, routesResult] = await Promise.all([
    getEvacuationStatus(),
    getEvacuationRoutes(),
  ]);

  const zones = zonesResult.success ? zonesResult.zones || [] : [];
  const routes = routesResult.success ? routesResult.routes || [] : [];

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-orange-200 bg-orange-50";
      case "completed":
        return "border-green-200 bg-green-50";
      case "pending":
        return "border-blue-200 bg-blue-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getZoneStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-orange-500">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "warning":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Warning
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-blue-600";
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

  // Calculate totals
  const totalPopulation = zones.reduce(
    (sum, zone) => sum + (zone.population || 0),
    0
  );
  const evacuatedCount = zones.reduce(
    (sum, zone) => sum + (zone.evacuated || 0),
    0
  );
  const inProgressCount = zones
    .filter((zone) => zone.status === "active")
    .reduce(
      (sum, zone) => sum + (zone.population || 0) - (zone.evacuated || 0),
      0
    );
  const pendingCount = zones
    .filter((zone) => zone.status === "pending")
    .reduce((sum, zone) => sum + (zone.population || 0), 0);
  const activeRoutes = routes.filter(
    (route) => route.status === "active"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Evacuation Management</h1>
            <p className="text-muted-foreground">
              Coordinate evacuations, routes, and emergency shelters
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              🗄️ Live Database
            </div>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              View Map
            </Button>
            <Button>
              <Navigation className="h-4 w-4 mr-2" />
              Plan Route
            </Button>
          </div>
        </div>

        {/* Evacuation Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Population
                  </p>
                  <p className="text-2xl font-bold">
                    {(totalPopulation / 1000).toFixed(1)}K
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
                    Evacuated
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {(evacuatedCount / 1000).toFixed(1)}K
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
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(inProgressCount / 1000).toFixed(1)}K
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(pendingCount / 1000).toFixed(1)}K
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Routes
                  </p>
                  <p className="text-2xl font-bold">{activeRoutes}</p>
                </div>
                <Route className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evacuation Zones */}
        <div className="space-y-6">
          {zones.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No evacuation zones found in database.
                </p>
              </CardContent>
            </Card>
          ) : (
            zones.map((zone) => {
              const evacuationProgress =
                zone.population > 0
                  ? ((zone.evacuated || 0) / zone.population) * 100
                  : 0;

              return (
                <Card key={zone.id} className={getZoneStatusColor(zone.status)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{zone.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {zone.zone_id}
                        </p>
                      </div>
                      <div className="text-right">
                        {getZoneStatusBadge(zone.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated {getTimeAgo(zone.updated_at)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Evacuation Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Evacuation Progress</span>
                        <span>
                          {(zone.evacuated || 0).toLocaleString()} /{" "}
                          {zone.population.toLocaleString()} people
                        </span>
                      </div>
                      <Progress value={evacuationProgress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{evacuationProgress.toFixed(1)}% evacuated</span>
                        <span className={getPriorityColor(zone.priority)}>
                          {zone.priority?.toUpperCase() || "NORMAL"} Priority
                        </span>
                      </div>
                    </div>

                    {/* Zone Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Population</p>
                        <p className="font-medium">
                          {zone.population.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{zone.status}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Priority</p>
                        <p
                          className={`font-medium ${getPriorityColor(
                            zone.priority
                          )}`}
                        >
                          {zone.priority?.toUpperCase() || "NORMAL"}
                        </p>
                      </div>
                    </div>

                    {/* Zone Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Teams
                        </Button>
                      </div>
                      {zone.status === "pending" && (
                        <Button size="sm">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Initiate Evacuation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Emergency Services Status */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Services Deployment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">12/20</span>
                </div>
                <h4 className="font-semibold mb-2">Rescue Teams</h4>
                <Progress value={60} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  <p>Available: 8</p>
                  <p>Locations: Zone A, Zone B, Standby</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <Heart className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">6/10</span>
                </div>
                <h4 className="font-semibold mb-2">Medical Units</h4>
                <Progress value={60} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  <p>Available: 4</p>
                  <p>Locations: Shelter A1, Mobile</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <Bus className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">25/40</span>
                </div>
                <h4 className="font-semibold mb-2">Transport Vehicles</h4>
                <Progress value={62.5} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  <p>Available: 15</p>
                  <p>Locations: Route A1, Route A3</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <Radio className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">8/12</span>
                </div>
                <h4 className="font-semibold mb-2">Communication Units</h4>
                <Progress value={66.7} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  <p>Available: 4</p>
                  <p>Locations: All Zones, Command Center</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span>Issue Evacuation</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Route className="h-6 w-6 mb-2" />
                <span>Update Routes</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Truck className="h-6 w-6 mb-2" />
                <span>Deploy Transport</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Radio className="h-6 w-6 mb-2" />
                <span>Broadcast Alert</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
