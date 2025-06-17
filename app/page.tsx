import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { AlertsOverview } from "@/components/alerts-overview";
import { RealTimeMap } from "@/components/real-time-map";
import { WeatherMonitoring } from "@/components/weather-monitoring";
import { ResourceStatus } from "@/components/resource-status";
import { EvacuationStatus } from "@/components/evacuation-status";
import { RecentActivity } from "@/components/recent-activity";
import { getActiveAlerts } from "@/lib/actions/alerts";
import { getResourceStatus } from "@/lib/actions/resources";
import { getEvacuationStatus } from "@/lib/actions/evacuation";
import { getSensorStatus } from "@/lib/actions/sensors";

export default async function DashboardPage() {
  // Fetch real data from database - no fallbacks
  const [alertsResult, resourcesResult, evacuationResult, sensorsResult] =
    await Promise.all([
      getActiveAlerts(),
      getResourceStatus(),
      getEvacuationStatus(),
      getSensorStatus(),
    ]);

  const alerts = alertsResult.success ? alertsResult.alerts || [] : [];
  const resources = resourcesResult.success
    ? resourcesResult.resources || []
    : [];
  const zones = evacuationResult.success ? evacuationResult.zones || [] : [];
  const sensors = sensorsResult.success ? sensorsResult.sensors || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Data Source Indicator */}
        <div className="flex justify-end">
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            🗄️ Live Database
          </div>
        </div>

        {/* Critical Alerts Section */}
        <Suspense fallback={<div>Loading alerts...</div>}>
          <AlertsOverview alerts={alerts} />
        </Suspense>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Map - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <RealTimeMap sensors={sensors} />
          </div>

          {/* Weather Monitoring */}
          <div className="space-y-6">
            <WeatherMonitoring sensors={sensors} />
            <ResourceStatus resources={resources} />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EvacuationStatus zones={zones} />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
