import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  getCommunicationLogs,
  getBroadcastChannels,
} from "@/lib/actions/communication";
import {
  Radio,
  Send,
  Users,
  Phone,
  MessageSquare,
  Smartphone,
  Tv,
  Satellite,
  Clock,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Globe,
} from "lucide-react";

export default async function CommunicationPage() {
  // Fetch real data from database
  const [logsResult, channelsResult] = await Promise.all([
    getCommunicationLogs(),
    getBroadcastChannels(),
  ]);

  const messages = logsResult.success ? logsResult.logs || [] : [];
  const channels = channelsResult.success ? channelsResult.channels || [] : [];

  const getChannelIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "radio":
        return Radio;
      case "mobile":
        return Smartphone;
      case "tv":
        return Tv;
      case "satellite":
        return Satellite;
      case "social":
        return Globe;
      default:
        return Radio;
    }
  };

  const getChannelStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "standby":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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

  const getMessageTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "evacuation":
        return <Users className="h-4 w-4 text-orange-500" />;
      case "advisory":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
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
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Communication Center</h1>
            <p className="text-muted-foreground">
              Emergency communications and public alert management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              🗄️ Live Database
            </div>
            <Button variant="outline">
              <Volume2 className="h-4 w-4 mr-2" />
              Test Systems
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
          </div>
        </div>

        {/* Communication Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Channels
                  </p>
                  <p className="text-2xl font-bold">
                    {channels.filter((c) => c.status === "active").length}
                  </p>
                </div>
                <Radio className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Messages Sent
                  </p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
                <Send className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    People Reached
                  </p>
                  <p className="text-2xl font-bold">
                    {messages.length > 0
                      ? (
                          messages.reduce(
                            (sum, m) => sum + (m.recipients || 0),
                            0
                          ) / 1000
                        ).toFixed(1)
                      : 0}
                    K
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivery Rate
                  </p>
                  <p className="text-2xl font-bold">96.2%</p>
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
                    Response Time
                  </p>
                  <p className="text-2xl font-bold">45s</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Broadcast Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radio className="h-5 w-5 mr-2" />
                Broadcast Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {channels.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No broadcast channels configured.
                </p>
              ) : (
                channels.map((channel) => {
                  const Icon = getChannelIcon(channel.type);
                  return (
                    <div
                      key={channel.id}
                      className="p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="font-semibold">{channel.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Coverage: {channel.coverage || "N/A"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={getChannelStatusColor(channel.status)}
                        >
                          {channel.status.charAt(0).toUpperCase() +
                            channel.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">
                            {channel.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Used</p>
                          <p className="font-medium">
                            {getTimeAgo(channel.updated_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                        {channel.status === "active" && (
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Broadcast
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Recent Messages
                </span>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent messages found.
                </p>
              ) : (
                messages.slice(0, 5).map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(
                      message.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-2">
                        {getMessageTypeIcon(message.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {message.title || "Emergency Message"}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {message.content}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {message.priority || "normal"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-2">
                      <div>
                        <p>Channel: {message.channel || "Multiple"}</p>
                        <p>
                          Recipients:{" "}
                          {(message.recipients || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p>Status: {message.status || "Sent"}</p>
                        <p>Sent: {getTimeAgo(message.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>ID: {message.id}</span>
                      <span>{getTimeAgo(message.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Message Composer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Quick Message Composer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message Type
                </label>
                <select className="w-full p-2 border rounded-md">
                  <option>Emergency Alert</option>
                  <option>Evacuation Notice</option>
                  <option>Safety Advisory</option>
                  <option>Weather Warning</option>
                  <option>All Clear</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Priority Level
                </label>
                <select className="w-full p-2 border rounded-md">
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Message Title
              </label>
              <Input placeholder="Enter alert title..." />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Message Content
              </label>
              <Textarea
                placeholder="Enter detailed message content..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Broadcast Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <Badge
                    key={channel.id}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    {channel.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">Save Draft</Button>
              </div>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
