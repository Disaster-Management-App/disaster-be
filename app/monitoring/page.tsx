import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard-header";
import { getSensorReadings } from "@/lib/actions/sensors";
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Eye,
  Gauge,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";

const getSensorStatus = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSensorIcon = (sensorType: string) => {
  switch (sensorType.toLowerCase()) {
    case "weather":
      return <Wind className="h-4 w-4" />;
    case "flood":
      return <Droplets className="h-4 w-4" />;
    case "seismic":
      return <Zap className="h-4 w-4" />;
    case "air_quality":
      return <Activity className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getSensorStatusComponent = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Active
        </Badge>
      );
    case "warning":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Warning
        </Badge>
      );
    case "critical":
      return <Badge variant="destructive">Critical</Badge>;
    default:
      return <Badge variant="secondary">Offline</Badge>;
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

export default async function MonitoringPage() {
  // Fetch sensor readings
  const readingsResult = await getSensorReadings();
  const readings = readingsResult.success ? readingsResult.readings || [] : [];

  // Extract unique sensors from readings
  const sensorsMap = new Map();

  readings.forEach((reading) => {
    if (!reading.sensor_id) return;

    if (!sensorsMap.has(reading.sensor_id)) {
      sensorsMap.set(reading.sensor_id, {
        id: reading.sensor_id,
        sensor_id: reading.sensor_id,
        name: reading.sensor_name || `Sensor ${reading.sensor_id}`,
        type: reading.reading_type || "unknown",
        location: reading.location || "Unknown Location",
        status: reading.status || "unknown",
        battery_level: reading.battery_level || 50,
        last_reading_at: reading.recorded_at,
        updated_at: reading.recorded_at,
      });
    }
  });

  const sensors = Array.from(sensorsMap.values());

  // Group sensors by type
  const sensorsByType = sensors.reduce((acc, sensor) => {
    const type = sensor.type || "unknown";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(sensor);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
            <p className="text-muted-foreground">
              Environmental sensors and monitoring stations
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              🗄️ Live Database
            </div>
            <Badge variant="outline" className="text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Data
            </Badge>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Sensors
                  </p>
                  <p className="text-2xl font-bold">
                    {sensors.filter((s) => s.status === "active").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Warning Alerts
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {sensors.filter((s) => s.status === "warning").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Critical Alerts
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {sensors.filter((s) => s.status === "critical").length}
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
                    System Uptime
                  </p>
                  <p className="text-2xl font-bold">99.8%</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sensors.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No sensors found. Please check your database connection.
                </p>
              </CardContent>
            </Card>
          ) : (
            sensors.map((sensor) => (
              <Card key={sensor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sensor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {sensor.location} • {sensor.sensor_id}
                      </p>
                    </div>
                    <div className="text-right">
                      {getSensorStatusComponent(sensor.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated{" "}
                        {getTimeAgo(
                          sensor.last_reading_at || sensor.updated_at
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sensor readings would come from the readings data */}
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getSensorIcon(sensor.type)}
                          <span className="text-sm font-medium">Status</span>
                        </div>
                        {getSensorStatusComponent(sensor.status)}
                      </div>
                      <p className="text-lg font-bold">
                        {sensor.battery_level || "N/A"}%
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4" />
                          <span className="text-sm font-medium">Type</span>
                        </div>
                        <Badge variant="outline">{sensor.type}</Badge>
                      </div>
                      <p className="text-lg font-bold capitalize">
                        {sensor.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Network Health */}
        <Card>
          <CardHeader>
            <CardTitle>Network Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Data Transmission</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-medium">
                      {sensors.length > 0
                        ? (
                            (sensors.filter((s) => s.status === "active")
                              .length /
                              sensors.length) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      sensors.length > 0
                        ? (sensors.filter((s) => s.status === "active").length /
                            sensors.length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Response Time</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Latency</span>
                    <span className="font-medium">45ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Battery Levels</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Battery</span>
                    <span className="font-medium">
                      {sensors.length > 0
                        ? Math.round(
                            sensors.reduce(
                              (acc, s) => acc + (s.battery_level || 0),
                              0
                            ) / sensors.length
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      sensors.length > 0
                        ? sensors.reduce(
                            (acc, s) => acc + (s.battery_level || 0),
                            0
                          ) / sensors.length
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
