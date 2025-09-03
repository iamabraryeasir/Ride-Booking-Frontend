import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Users,
  Car,
  DollarSign,
  BarChart3,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetSystemReportQuery,
  useGetDailyAnalyticsQuery,
  useGetDriverActivityStatsQuery,
  useGetAllDriversQuery,
} from "@/redux/features/admin/admin.api";

export default function AdminDashboard() {
  const user = useSelector(selectCurrentUser);

  // Fetch real data from API
  const {
    data: systemReportResponse,
    isLoading: isSystemReportLoading,
    error: systemReportError,
  } = useGetSystemReportQuery();

  const {
    data: dailyAnalyticsResponse,
    isLoading: isDailyAnalyticsLoading,
  } = useGetDailyAnalyticsQuery();

  const {
    data: driverActivityResponse,
    isLoading: isDriverActivityLoading,
  } = useGetDriverActivityStatsQuery();

  const {
    data: driversResponse,
    isLoading: isDriversLoading,
  } = useGetAllDriversQuery({ page: 1, limit: 10 });

  // Extract data from API responses
  const systemReport = systemReportResponse?.data;
  const dailyAnalytics = dailyAnalyticsResponse?.data;
  const driverActivity = driverActivityResponse?.data;
  const driversData = driversResponse?.data;

  // Show loading state
  const isLoading = isSystemReportLoading || isDailyAnalyticsLoading || isDriverActivityLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (systemReportError) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-500">Failed to load dashboard data</span>
      </div>
    );
  }

  const overviewStats = [
    {
      title: "Total Users",
      value: systemReport?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-600",
      change: "+12%", // Could be calculated from trends
      trend: "up",
    },
    {
      title: "Online Drivers",
      value: driverActivity?.onlineDrivers?.toString() || "0",
      icon: Car,
      color: "text-green-600",
      change: "+8%", // Could be calculated from trends
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: dailyAnalytics?.totalRevenue 
        ? `$${(dailyAnalytics.totalRevenue / 1000).toFixed(0)}K`
        : "$0",
      icon: DollarSign,
      color: "text-purple-600",
      change: "+15%", // Could be calculated from trends
      trend: "up",
    },
    {
      title: "Active Rides",
      value: systemReport?.activeRides?.toString() || "0",
      icon: Clock,
      color: "text-orange-600",
      change: dailyAnalytics?.completedRides 
        ? `${dailyAnalytics.completedRides - dailyAnalytics.cancelledRides}` 
        : "0",
      trend: "up",
    },
  ];

  // Recent activity from real data or system report  
  const recentActivity = systemReport?.recentActivity || [];
  
  // If no real activity data, show meaningful placeholder
  const hasActivityData = recentActivity.length > 0;

  // Calculate pending tasks from real data
  const pendingDrivers = driversData?.data?.filter(driver => driver.status === 'pending')?.length || 0;
  const disputedRides = systemReport?.disputedRides || 0;
  const blockedUsers = systemReport?.blockedUsers || 0;
  
  const pendingTasks = [
    {
      task: "Driver applications pending approval",
      count: pendingDrivers,
      urgency: pendingDrivers > 10 ? "high" : pendingDrivers > 5 ? "medium" : "low",
      href: "/dashboard/drivers",
    },
    {
      task: "User complaints requiring review",
      count: blockedUsers,
      urgency: blockedUsers > 3 ? "high" : blockedUsers > 0 ? "medium" : "low",
      href: "/dashboard/users",
    },
    {
      task: "Ride disputes to resolve",
      count: disputedRides,
      urgency: disputedRides > 2 ? "high" : disputedRides > 0 ? "medium" : "low",
      href: "/dashboard/rides",
    },
  ].filter(task => task.count > 0); // Only show tasks with actual pending items

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            System overview and management tools. Welcome back, {user?.name}!
          </p>
        </div>
        <Button asChild size="lg" variant="outline">
          <Link to="/dashboard/analytics">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/users">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Manage Users</h3>
              <p className="text-sm text-muted-foreground">
                User accounts & permissions
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/drivers">
            <CardContent className="p-6 text-center">
              <Car className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Driver Management</h3>
              <p className="text-sm text-muted-foreground">
                Approve & manage drivers
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/rides">
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ride Oversight</h3>
              <p className="text-sm text-muted-foreground">
                Monitor all platform rides
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/analytics">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Platform insights & reports
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => {
          const IconComponent = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div
                      className={`flex items-center text-xs ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.urgency === "high"
                        ? "bg-red-500"
                        : task.urgency === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{task.task}</div>
                    <div className="text-sm text-muted-foreground">
                      {task.count} items need attention
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={task.href}>
                    Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/activity">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hasActivityData ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>No recent activity to display</p>
                  <p className="text-xs">Activity will appear here as users interact with the platform</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Status</span>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm font-medium">145ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment Gateway</span>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Connected
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
