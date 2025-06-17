"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Settings,
  Bell,
  Shield,
  Database,
  Users,
  Globe,
  Radio,
  Zap,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
} from "lucide-react"

export default function SettingsPage() {
  const [systemSettings, setSystemSettings] = useState([
    {
      category: "Alert System",
      icon: Bell,
      settings: [
        {
          name: "Emergency Alert Threshold",
          description: "Minimum severity level for automatic alerts",
          type: "select",
          value: "Medium",
          options: ["Low", "Medium", "High", "Critical"],
        },
        {
          name: "Auto-broadcast Alerts",
          description: "Automatically broadcast critical alerts to all channels",
          type: "toggle",
          value: true,
        },
        {
          name: "Alert Retry Attempts",
          description: "Number of retry attempts for failed alert deliveries",
          type: "number",
          value: 3,
        },
      ],
    },
    {
      category: "Monitoring",
      icon: Zap,
      settings: [
        {
          name: "Sensor Data Frequency",
          description: "How often to collect sensor data",
          type: "select",
          value: "30 seconds",
          options: ["15 seconds", "30 seconds", "1 minute", "5 minutes"],
        },
        {
          name: "Data Retention Period",
          description: "How long to keep historical sensor data",
          type: "select",
          value: "2 years",
          options: ["6 months", "1 year", "2 years", "5 years"],
        },
        {
          name: "Real-time Monitoring",
          description: "Enable continuous real-time data monitoring",
          type: "toggle",
          value: true,
        },
      ],
    },
    {
      category: "Communication",
      icon: Radio,
      settings: [
        {
          name: "Primary Communication Channel",
          description: "Default channel for emergency communications",
          type: "select",
          value: "Mobile Alerts",
          options: ["Mobile Alerts", "Radio", "TV Broadcast", "Social Media"],
        },
        {
          name: "Message Encryption",
          description: "Encrypt all emergency communications",
          type: "toggle",
          value: true,
        },
        {
          name: "Broadcast Delay",
          description: "Delay before broadcasting alerts (seconds)",
          type: "number",
          value: 5,
        },
      ],
    },
    {
      category: "Security",
      icon: Shield,
      settings: [
        {
          name: "Two-Factor Authentication",
          description: "Require 2FA for all system access",
          type: "toggle",
          value: true,
        },
        {
          name: "Session Timeout",
          description: "Automatic logout after inactivity (minutes)",
          type: "number",
          value: 30,
        },
        {
          name: "Access Logging",
          description: "Log all system access and actions",
          type: "toggle",
          value: true,
        },
      ],
    },
  ])

  const [integrations, setIntegrations] = useState({
    weatherServices: {
      nationalWeatherService: true,
      localWeatherStations: true,
    },
    communicationChannels: {
      emergencyBroadcast: true,
      socialMedia: false,
    },
    governmentSystems: {
      femaIntegration: true,
      stateEmergencyServices: true,
    },
    thirdPartyServices: {
      satelliteImagery: true,
      trafficManagement: false,
    },
  })

  const [backupSettings, setBackupSettings] = useState({
    automaticBackups: true,
    cloudBackup: true,
  })

  // Handler for toggle inputs
  const handleToggleChange = (sectionIndex: number, settingIndex: number, checked: boolean) => {
    const newSettings = [...systemSettings]
    newSettings[sectionIndex].settings[settingIndex].value = checked
    setSystemSettings(newSettings)
  }

  // Handler for select inputs
  const handleSelectChange = (sectionIndex: number, settingIndex: number, value: string) => {
    const newSettings = [...systemSettings]
    newSettings[sectionIndex].settings[settingIndex].value = value
    setSystemSettings(newSettings)
  }

  // Handler for number inputs
  const handleNumberChange = (sectionIndex: number, settingIndex: number, value: string) => {
    const newSettings = [...systemSettings]
    newSettings[sectionIndex].settings[settingIndex].value = Number.parseInt(value) || 0
    setSystemSettings(newSettings)
  }

  const handleIntegrationChange = (category: string, setting: string, checked: boolean) => {
    setIntegrations((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: checked,
      },
    }))
  }

  const handleBackupSettingChange = (setting: string, checked: boolean) => {
    setBackupSettings((prev) => ({
      ...prev,
      [setting]: checked,
    }))
  }

  const userManagement = [
    {
      role: "System Administrator",
      users: 2,
      permissions: ["Full Access", "User Management", "System Configuration"],
      status: "active",
    },
    {
      role: "Emergency Coordinator",
      users: 5,
      permissions: ["Alert Management", "Resource Allocation", "Evacuation Planning"],
      status: "active",
    },
    {
      role: "Field Operator",
      users: 12,
      permissions: ["Data Entry", "Status Updates", "Communication"],
      status: "active",
    },
    {
      role: "Observer",
      users: 8,
      permissions: ["View Only", "Reports"],
      status: "active",
    },
  ]

  const systemStatus = [
    {
      component: "Database Server",
      status: "operational",
      uptime: "99.8%",
      lastCheck: "2 minutes ago",
    },
    {
      component: "Alert System",
      status: "operational",
      uptime: "99.9%",
      lastCheck: "1 minute ago",
    },
    {
      component: "Sensor Network",
      status: "operational",
      uptime: "98.5%",
      lastCheck: "30 seconds ago",
    },
    {
      component: "Communication Hub",
      status: "warning",
      uptime: "97.2%",
      lastCheck: "5 minutes ago",
    },
    {
      component: "Backup Systems",
      status: "operational",
      uptime: "100%",
      lastCheck: "10 minutes ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and manage user access</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {systemStatus.map((component, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    {getStatusIcon(component.status)}
                    <Badge className={getStatusColor(component.status)}>
                      {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{component.component}</h4>
                  <div className="text-xs text-muted-foreground">
                    <p>Uptime: {component.uptime}</p>
                    <p>Last check: {component.lastCheck}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <div className="space-y-6">
          {systemSettings.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <Card key={sectionIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.settings.map((setting, settingIndex) => (
                    <div
                      key={settingIndex}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{setting.name}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="ml-4">
                        {setting.type === "toggle" && (
                          <Switch
                            checked={setting.value as boolean}
                            onCheckedChange={(checked) => handleToggleChange(sectionIndex, settingIndex, checked)}
                          />
                        )}
                        {setting.type === "select" && (
                          <select
                            className="p-2 border rounded-md min-w-[120px]"
                            value={setting.value as string}
                            onChange={(e) => handleSelectChange(sectionIndex, settingIndex, e.target.value)}
                          >
                            {setting.options?.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                        {setting.type === "number" && (
                          <Input
                            type="number"
                            value={setting.value as number}
                            className="w-20"
                            onChange={(e) => handleNumberChange(sectionIndex, settingIndex, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </span>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userManagement.map((role, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{role.role}</h4>
                      <p className="text-sm text-muted-foreground">{role.users} active users</p>
                    </div>
                    <Badge className={getStatusColor(role.status)}>
                      {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, permIndex) => (
                        <Badge key={permIndex} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Edit Permissions
                    </Button>
                    <Button variant="outline" size="sm">
                      View Users
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              External Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Weather Services</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>National Weather Service API</span>
                    <Switch
                      checked={integrations.weatherServices.nationalWeatherService}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("weatherServices", "nationalWeatherService", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Local Weather Stations</span>
                    <Switch
                      checked={integrations.weatherServices.localWeatherStations}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("weatherServices", "localWeatherStations", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Communication Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Emergency Broadcast System</span>
                    <Switch
                      checked={integrations.communicationChannels.emergencyBroadcast}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("communicationChannels", "emergencyBroadcast", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Social Media Integration</span>
                    <Switch
                      checked={integrations.communicationChannels.socialMedia}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("communicationChannels", "socialMedia", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Government Systems</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>FEMA Integration</span>
                    <Switch
                      checked={integrations.governmentSystems.femaIntegration}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("governmentSystems", "femaIntegration", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>State Emergency Services</span>
                    <Switch
                      checked={integrations.governmentSystems.stateEmergencyServices}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("governmentSystems", "stateEmergencyServices", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Third-party Services</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Satellite Imagery</span>
                    <Switch
                      checked={integrations.thirdPartyServices.satelliteImagery}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("thirdPartyServices", "satelliteImagery", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Traffic Management</span>
                    <Switch
                      checked={integrations.thirdPartyServices.trafficManagement}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange("thirdPartyServices", "trafficManagement", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup and Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Backup & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Backup Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Automatic Backups</p>
                      <p className="text-sm text-muted-foreground">Daily system backups</p>
                    </div>
                    <Switch
                      checked={backupSettings.automaticBackups}
                      onCheckedChange={(checked) => handleBackupSettingChange("automaticBackups", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Cloud Backup</p>
                      <p className="text-sm text-muted-foreground">Offsite backup storage</p>
                    </div>
                    <Switch
                      checked={backupSettings.cloudBackup}
                      onCheckedChange={(checked) => handleBackupSettingChange("cloudBackup", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Maintenance Windows</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium">System Maintenance</p>
                    <p className="text-sm text-muted-foreground">Sundays 2:00 AM - 4:00 AM</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium">Database Optimization</p>
                    <p className="text-sm text-muted-foreground">Monthly, first Sunday</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
