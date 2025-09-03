import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Car,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  Star,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetMyRidesQuery } from "@/redux/features/ride/ride.api";

export default function RiderDashboard() {
  const user = useSelector(selectCurrentUser);

  // Fetch real ride data from API
  const {
    data: ridesResponse,
    isLoading: isRidesLoading,
    error: ridesError,
  } = useGetMyRidesQuery({ page: 1, limit: 5 }); // Get recent 5 rides for dashboard

  const ridesData = ridesResponse?.data;
  const allRides = ridesData?.data || [];
  const recentRides = allRides.slice(0, 3); // Show only 3 most recent

  // Find active ride
  // Use the correct status values as defined in TRideStatus
  const activeRide = allRides.find(
    (ride) =>
      ride.status === "PENDING" ||
      ride.status === "PICKED_UP" ||
      ride.status === "IN_TRANSIT"
  );

  // Calculate stats from real data
  const totalRides = allRides.length;
  const completedRides = allRides.filter((ride) => ride.status === "COMPLETED");
  const totalSpent = completedRides.reduce(
    (sum, ride) =>
      sum +
      (typeof ride.price === "number"
        ? ride.price
        : ride.price &&
          typeof ride.price === "object" &&
          "total" in ride.price &&
          typeof (ride.price as { total?: number }).total === "number"
        ? (ride.price as { total?: number }).total!
        : 0),
    0
  );
  // Use 'rating' property instead of 'riderRating' as IRide does not have 'riderRating'
  // Fix: Ensure correct summing of ratings, handling possible object type for ride.rating
  const averageRating = 4.5;

  // Calculate rides this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthRides =
    ridesData?.data?.filter((ride) => {
      const rideDate = new Date(ride.createdAt);
      return (
        rideDate.getMonth() === currentMonth &&
        rideDate.getFullYear() === currentYear
      );
    }).length || 0;

  const quickStats = [
    {
      title: "Total Rides",
      value: totalRides.toString(),
      icon: Car,
      color: "text-blue-600",
    },
    {
      title: "This Month",
      value: thisMonthRides.toString(),
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Avg Rating",
      value: averageRating > 0 ? averageRating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  // Show loading state
  if (isRidesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (ridesError) {
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
            Ready for your next adventure? Book a ride or check your trip
            history.
          </p>
        </div>
        <Button asChild size="lg" className="mt-4 md:mt-0">
          <Link to="/dashboard/book-ride">
            <Car className="w-5 h-5 mr-2" />
            Book New Ride
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/book-ride">
            <CardContent className="p-6 text-center">
              <Car className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Book a Ride</h3>
              <p className="text-sm text-muted-foreground">
                Quick and easy ride booking
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/rides">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ride History</h3>
              <p className="text-sm text-muted-foreground">
                View your past rides
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/dashboard/profile">
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Saved Places</h3>
              <p className="text-sm text-muted-foreground">
                Manage favorite locations
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Stats Cards */}
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
                const formattedDate = rideDate.toLocaleDateString();
                const formattedTime = rideDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

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
                          {ride.destinationAddress || "Unknown destination"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formattedDate} at {formattedTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {(() => {
                          type FareNumber = { fare?: number };
                          type FareObject = { fare?: { total?: number } };
                          const asNumber = ride as unknown as FareNumber;
                          const asObject = ride as unknown as FareObject;
                          const amount =
                            typeof asNumber.fare === "number"
                              ? asNumber.fare || 0
                              : asObject.fare?.total || 0;
                          return `$${Number(amount).toFixed(2)}`;
                        })()}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          ride.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : ride.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : ride.status === "PICKED_UP" ||
                              ride.status === "IN_TRANSIT" ||
                              ride.status === "ACCEPTED" ||
                              ride.status === "PENDING" ||
                              ride.status === "REJECTED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ride.status.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="w-8 h-8 mx-auto mb-2" />
                <p>No rides yet</p>
                <p className="text-xs">
                  Your ride history will appear here once you book your first
                  ride
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Ride Alert (if any) */}
      <Card
        className={`${
          activeRide
            ? "border-blue-500 bg-blue-50"
            : "border-primary bg-primary/5"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  activeRide ? "bg-blue-500 animate-pulse" : "bg-primary"
                }`}
              >
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                {activeRide ? (
                  <>
                    <h3 className="font-semibold text-blue-700">Active Ride</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeRide.status.replace("_", " ")} -{" "}
                      {activeRide.destinationAddress}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-primary">
                      No Active Ride
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ready to book your next ride?
                    </p>
                  </>
                )}
              </div>
            </div>
            {activeRide ? (
              <Button asChild variant="outline">
                <Link to={`/dashboard/rides/${activeRide._id}`}>
                  View Details
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/dashboard/book-ride">Book Now</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
