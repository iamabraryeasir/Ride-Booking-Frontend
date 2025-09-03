import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Car,
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  Star,
  BarChart3,
  MapPin,
  Power,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetEarningsQuery,
  useGetMyRidesQuery,
  useGetDriverStatsQuery,
  useToggleAvailabilityMutation,
  useGetDriverProfileQuery,
} from "@/redux/features/driver/driver.api";
import { useGetPendingRidesQuery } from "@/redux/features/ride/ride.api";

export default function DriverDashboard() {
  const user = useSelector(selectCurrentUser);

  // Fetch real data from API
  const { isLoading: isEarningsLoading } = useGetEarningsQuery({
    period: "daily",
  });

  const { data: ridesResponse, isLoading: isRidesLoading } = useGetMyRidesQuery(
    { page: 1, limit: 5 }
  );

  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    error: statsError,
  } = useGetDriverStatsQuery();

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetDriverProfileQuery();

  const { data: pendingRidesResponse } = useGetPendingRidesQuery();

  const [toggleAvailability, { isLoading: isTogglingAvailability }] =
    useToggleAvailabilityMutation();

  // Extract data from API responses
  // const earnings = earningsResponse?.data;
  const ridesData = ridesResponse?.data;
  const stats = statsResponse?.data;
  const profile = profileResponse?.data;
  const pendingRides = pendingRidesResponse?.data || [];
  const recentRides = ridesData?.rides?.slice(0, 2) || []; // Show only 2 most recent

  // Driver availability state
  const isOnline = profile?.driverStatus === "ONLINE";

  // Calculate today's rides
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRides =
    ridesData?.rides?.filter((ride) => {
      const rideDate = new Date(ride.createdAt);
      rideDate.setHours(0, 0, 0, 0);
      return rideDate.getTime() === today.getTime();
    }) || [];

  const quickStats = [
    {
      title: "Today's Earnings",
      value: `$${stats?.todayEarnings?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-green-600",
      change: "+12%",
    },
    {
      title: "Rides Today",
      value: todayRides.length.toString(),
      icon: Car,
      color: "text-blue-600",
      change: "+2",
    },
    {
      title: "Total Earnings",
      value: `$${stats?.totalEarnings?.toFixed(2) || "0.00"}`,
      icon: Clock,
      color: "text-purple-600",
      change: "",
    },
    {
      title: "Rating",
      value: stats?.rating?.toFixed(1) || "N/A",
      icon: Star,
      color: "text-yellow-600",
      change: "",
    },
  ];

  // Handle availability toggle
  const handleToggleAvailability = async () => {
    try {
      await toggleAvailability().unwrap();
      // The driver profile will be refetched automatically
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      // You could show a toast notification here
    }
  };

  // Show loading state
  const isLoading =
    isEarningsLoading || isRidesLoading || isStatsLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-500">Failed to load dashboard data</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {isOnline
              ? "You're online and ready to receive ride requests"
              : "You're offline - go online to start earning"}
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            onClick={handleToggleAvailability}
            variant={isOnline ? "destructive" : "default"}
            size="lg"
            className="min-w-32"
            disabled={isTogglingAvailability}
          >
            {isTogglingAvailability ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Power className="w-5 h-5 mr-2" />
            )}
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {/* Availability Status */}
      <Card
        className={`border-2 ${
          isOnline
            ? "border-green-500 bg-green-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              >
                <Power className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    isOnline ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  {isOnline ? "You're Online" : "You're Offline"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isOnline
                    ? "Available to receive ride requests"
                    : "Switch online to start receiving requests"}
                </p>
              </div>
            </div>
            {isOnline && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Pending Requests
                </div>
                <div className="text-2xl font-bold text-primary">
                  {pendingRides.length}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/rides">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ride Requests</h3>
              <p className="text-sm text-muted-foreground">
                View and manage ride requests
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/earnings">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Earnings</h3>
              <p className="text-sm text-muted-foreground">
                Track your income and analytics
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/profile">
            <CardContent className="p-6 text-center">
              <Car className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Vehicle Info</h3>
              <p className="text-sm text-muted-foreground">
                Update vehicle and documents
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Rides */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Rides</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/rides">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRides.length > 0 ? (
              recentRides.map((ride) => {
                const rideDate = new Date(ride.createdAt);
                const timeAgo = Math.floor(
                  (Date.now() - rideDate.getTime()) / (1000 * 60 * 60)
                ); // hours ago
                const formattedTime =
                  timeAgo < 1
                    ? "Less than an hour ago"
                    : `${timeAgo} hour${timeAgo > 1 ? "s" : ""} ago`;

                return (
                  <div
                    key={ride._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/dashboard/rides/${ride._id}`)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {ride.pickupAddress || "Unknown"} →{" "}
                          {ride.destinationAddress || "Unknown"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formattedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="w-8 h-8 mx-auto mb-2" />
                <p>No rides yet</p>
                <p className="text-xs">Your completed rides will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Chart Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>This Week's Performance</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/earnings">
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <p>Earnings chart will be displayed here</p>
              <p className="text-sm">Click "View Details" for full analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
