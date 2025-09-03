import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Eye,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router";
import { useGetMyRidesQuery } from "@/redux/features/ride/ride.api";
import type { IRide, IRideFilters, TRideStatus } from "@/types";

export default function RideHistoryPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    dateFrom: "",
    dateTo: "",
    fareMin: "",
    fareMax: "",
    search: "",
  });

  const queryFilters: IRideFilters = {
    page: filters.page,
    limit: filters.limit,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    fareMin: filters.fareMin ? Number(filters.fareMin) : undefined,
    fareMax: filters.fareMax ? Number(filters.fareMax) : undefined,
    ...(filters.status && filters.status !== "ALL"
      ? { status: [filters.status as TRideStatus] }
      : {}),
  };

  const { data: ridesData, isLoading } = useGetMyRidesQuery(queryFilters);

  const rides: IRide[] = Array.isArray(ridesData?.data) ? ridesData.data : [];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ride History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your previous rides
          </p>
        </div>
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search destinations..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>

            {/* Fare Range */}
            <div className="space-y-2">
              <Label htmlFor="fareMin">Min Fare</Label>
              <Input
                id="fareMin"
                type="number"
                placeholder="$0"
                value={filters.fareMin}
                onChange={(e) => handleFilterChange("fareMin", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fareMax">Max Fare</Label>
              <Input
                id="fareMax"
                type="number"
                placeholder="$100"
                value={filters.fareMax}
                onChange={(e) => handleFilterChange("fareMax", e.target.value)}
              />
            </div>

            {/* Reset Filters Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    page: 1,
                    limit: 10,
                    status: "",
                    dateFrom: "",
                    dateTo: "",
                    fareMin: "",
                    fareMax: "",
                    search: "",
                  })
                }
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rides List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Rides ({rides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rides.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rides found</h3>
              <p className="text-muted-foreground mb-4">
                No rides match your current filters. Try adjusting your search
                criteria.
              </p>
              <Button asChild>
                <Link to="/dashboard/book-ride">Book Your First Ride</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <Card
                  key={ride._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Trip Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>

                          <div className="flex-1">
                            <div className="mb-3">
                              <div className="font-medium text-sm text-gray-900">
                                {ride.pickupAddress}
                              </div>
                              {/* No landmark in new API response */}
                            </div>

                            <div>
                              <div className="font-medium text-sm text-gray-900">
                                {ride.destinationAddress}
                              </div>
                              {/* No landmark in new API response */}
                            </div>
                          </div>
                        </div>

                        {/* Trip Info */}
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {ride.timestamps?.requestedAt
                              ? formatDate(ride.timestamps.requestedAt)
                              : "N/A"}
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col md:items-end gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                ride.status
                              )}`}
                            >
                              {ride.status}
                            </span>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                ${ride.price}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {/* No currency in new API response */}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/dashboard/rides/${ride._id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                  {Math.min(filters.page * filters.limit, rides.length)} of{" "}
                  {rides.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page <= 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm">Page {filters.page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={rides.length < filters.limit}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats (from API) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{rides.length}</div>
            <div className="text-sm text-muted-foreground">Total Rides</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              $
              {rides
                .reduce((sum, ride) => sum + (ride.price || 0), 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {/* Example: total time saved, you may want to replace with actual API value or calculation */}
              {rides.length > 0 ? `${(rides.length * 0.5).toFixed(1)}h` : "0h"}
            </div>
            <div className="text-sm text-muted-foreground">Time Saved</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
