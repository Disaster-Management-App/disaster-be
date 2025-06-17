import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  getResourceStatus,
  getResourceAllocations,
} from "@/lib/actions/resources";
import {
  Package,
  Truck,
  Users,
  Heart,
  Home,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  CheckCircle,
  ArrowUpDown,
  Send,
} from "lucide-react";

export default async function ResourcesPage() {
  // Fetch real data from database
  const [resourcesResult, allocationsResult] = await Promise.all([
    getResourceStatus(),
    getResourceAllocations(),
  ]);

  const resources = resourcesResult.success
    ? resourcesResult.resources || []
    : [];
  const allocations = allocationsResult.success
    ? allocationsResult.allocations || []
    : [];

  // Group resources by type
  const resourcesByType = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, any[]>);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "medical":
        return Heart;
      case "food":
        return Package;
      case "shelter":
        return Home;
      case "vehicle":
        return Truck;
      case "personnel":
        return Users;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAllocationStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        );
      case "in_transit":
        return (
          <Badge variant="default" className="bg-blue-500">
            In Transit
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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
            <h1 className="text-3xl font-bold">Resource Management</h1>
            <p className="text-muted-foreground">
              Emergency resource allocation and inventory tracking
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              🗄️ Live Database
            </div>
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Transfer Resources
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Resources
            </Button>
          </div>
        </div>

        {/* Resource Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(resourcesByType).map(([type, typeResources]) => {
            const Icon = getResourceIcon(type);
            const totalQuantity = typeResources.reduce(
              (sum, r) => sum + r.total_quantity,
              0
            );
            const availableQuantity = typeResources.reduce(
              (sum, r) => sum + r.available_quantity,
              0
            );
            const availabilityPercentage =
              totalQuantity > 0 ? (availableQuantity / totalQuantity) * 100 : 0;
            const isLowStock = availabilityPercentage < 30;

            return (
              <Card key={type} className={isLowStock ? "border-red-200" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon
                      className={`h-8 w-8 ${
                        isLowStock ? "text-red-500" : "text-blue-500"
                      }`}
                    />
                    {isLowStock && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 capitalize">
                    {type.replace("_", " ")}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Available</span>
                      <span className="font-medium">
                        {availableQuantity.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={availabilityPercentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {typeResources.length} locations • Total:{" "}
                      {totalQuantity.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources, locations, or allocations..."
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resource Inventory</span>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No resources found in database.
                </p>
              ) : (
                resources.slice(0, 5).map((resource) => {
                  const Icon = getResourceIcon(resource.type);
                  const availabilityPercentage =
                    resource.total_quantity > 0
                      ? (resource.available_quantity /
                          resource.total_quantity) *
                        100
                      : 0;

                  return (
                    <div
                      key={resource.id}
                      className="p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="font-semibold">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.location}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(resource.status)}>
                          {resource.status.charAt(0).toUpperCase() +
                            resource.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available</span>
                          <span>
                            {resource.available_quantity} /{" "}
                            {resource.total_quantity} {resource.unit}
                          </span>
                        </div>
                        <Progress
                          value={availabilityPercentage}
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span>Updated {getTimeAgo(resource.updated_at)}</span>
                        <span>{resource.type.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Allocations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Allocations</span>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allocations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent allocations found.
                </p>
              ) : (
                allocations.slice(0, 5).map((allocation) => (
                  <div
                    key={allocation.id}
                    className="p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {allocation.resource_name || "Resource"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {allocation.quantity} {allocation.unit} →{" "}
                          {allocation.destination}
                        </p>
                      </div>
                      {getAllocationStatusBadge(allocation.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Requested by</p>
                        <p className="font-medium">
                          {allocation.requested_by || "System"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Allocated</p>
                        <p className="font-medium">
                          {getTimeAgo(allocation.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>ID: {allocation.id}</span>
                      <span>{allocation.priority || "Normal"} Priority</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Send className="h-6 w-6 mb-2" />
                <span>Deploy Resources</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Plus className="h-6 w-6 mb-2" />
                <span>Request Supplies</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <ArrowUpDown className="h-6 w-6 mb-2" />
                <span>Transfer Stock</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <CheckCircle className="h-6 w-6 mb-2" />
                <span>Update Inventory</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
