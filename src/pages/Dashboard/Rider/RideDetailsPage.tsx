/**
 * Node Modules
 */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";

/**
 * UI Components
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

/**
 * Icons
 */
import {
  ArrowLeft,
  Clock,
  Car,
  Star,
  CreditCard,
  Download,
  MessageCircle,
  DollarSign,
  Route,
  User,
  Phone,
} from "lucide-react";
import { useRateRideMutation } from "@/redux/features/ride/ride.api";
import { useGetEmergencyContactsQuery } from "@/redux/features/emergency/emergency.api";

/**
 * Types
 */
interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  totalRides: number;
  vehicleDetails: {
    make: string;
    model: string;
    color: string;
    plateNumber: string;
  };
  phone: string;
}

interface RideDetails {
  id: string;
  status: "completed" | "cancelled" | "in_progress";
  driver: Driver;
  pickup: {
    address: string;
    coordinates: [number, number];
    timestamp: string;
  };
  destination: {
    address: string;
    coordinates: [number, number];
    timestamp: string;
  };
  bookingTime: string;
  startTime: string;
  endTime: string;
  duration: string;
  distance: string;
  fare: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    serviceFee: number;
    tip: number;
    total: number;
  };
  paymentMethod: {
    type: "card" | "cash" | "digital_wallet";
    last4?: string;
    brand?: string;
  };
  rideType: "standard" | "premium" | "shared";
  rating?: number;
  feedback?: string;
  receiptUrl?: string;
}

const RideDetailsPage: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<RideDetails | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [rateRide] = useRateRideMutation();
  const { data: contactsResponse } = useGetEmergencyContactsQuery();
  const emergencyContacts = contactsResponse?.data || [];
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // Mock ride data
  const mockRide: RideDetails = useMemo(
    () => ({
      id: rideId || "ride-123",
      status: "completed",
      driver: {
        id: "driver-456",
        name: "John Smith",
        photo: "/api/placeholder/120/120",
        rating: 4.8,
        totalRides: 1247,
        vehicleDetails: {
          make: "Toyota",
          model: "Camry",
          color: "Silver",
          plateNumber: "ABC-1234",
        },
        phone: "+1-555-0123",
      },
      pickup: {
        address: "123 Main St, Downtown, NY 10001",
        coordinates: [40.7128, -74.006],
        timestamp: "2024-01-15T14:30:00Z",
      },
      destination: {
        address: "456 Oak Ave, Uptown, NY 10002",
        coordinates: [40.7589, -73.9851],
        timestamp: "2024-01-15T15:15:00Z",
      },
      bookingTime: "2024-01-15T14:25:00Z",
      startTime: "2024-01-15T14:35:00Z",
      endTime: "2024-01-15T15:15:00Z",
      duration: "40 minutes",
      distance: "12.5 km",
      fare: {
        baseFare: 8.0,
        distanceFare: 12.5,
        timeFare: 3.2,
        serviceFee: 2.3,
        tip: 5.0,
        total: 31.0,
      },
      paymentMethod: {
        type: "card",
        last4: "1234",
        brand: "Visa",
      },
      rideType: "standard",
      rating: 5,
      feedback: "Great driver, very professional and safe!",
    }),
    [rideId]
  );

  useEffect(() => {
    // In real app, fetch ride details by ID
    setRide(mockRide);
  }, [mockRide]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setCoords(null);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    }
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        label: "Completed",
        variant: "secondary" as const,
        color: "bg-green-100 text-green-800",
      },
      cancelled: {
        label: "Cancelled",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      in_progress: {
        label: "In Progress",
        variant: "default" as const,
        color: "bg-blue-100 text-blue-800",
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.completed
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRatingSubmit = async () => {
    if (!ride) return;
    setIsSubmittingRating(true);
    try {
      await rateRide({ rideId: ride.id, rating, comment: feedback }).unwrap();
      setRide({ ...ride, rating, feedback });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // optionally show toast
    } finally {
      setIsSubmittingRating(false);
      setShowRatingDialog(false);
    }
  };

  const handleDownloadReceipt = () => {
    // In real app, this would download the receipt
    console.log("Downloading receipt...");
  };

  const StarRating: React.FC<{
    rating: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
  }> = ({ rating, onChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => !readonly && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  if (!ride) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Ride Not Found</h2>
            <p className="text-gray-600 mb-4">
              The ride you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/dashboard/rides")}>
              Back to Ride History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(ride.status);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Ride Details</h1>
          <p className="text-gray-600">Ride ID: {ride.id}</p>
        </div>
        <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Route */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Trip Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pickup */}
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="font-medium">Pickup</p>
                  <p className="text-sm text-gray-600">{ride.pickup.address}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(ride.pickup.timestamp)}
                  </p>
                </div>
              </div>

              {/* Route line */}
              <div className="flex items-center gap-3">
                <div className="w-4 flex justify-center">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>
                <div className="flex-1 text-sm text-gray-500">
                  {ride.distance} • {ride.duration}
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="font-medium">Destination</p>
                  <p className="text-sm text-gray-600">
                    {ride.destination.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(ride.destination.timestamp)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={ride.driver.photo} />
                  <AvatarFallback>
                    {ride.driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{ride.driver.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{ride.driver.rating}</span>
                    <span className="text-gray-500 text-sm">
                      ({ride.driver.totalRides} rides)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="h-4 w-4" />
                    <span>
                      {ride.driver.vehicleDetails.color}{" "}
                      {ride.driver.vehicleDetails.make}{" "}
                      {ride.driver.vehicleDetails.model}
                    </span>
                    <span>• {ride.driver.vehicleDetails.plateNumber}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>

              {/* Rating Section */}
              {ride.status === "completed" && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Your Rating</h4>
                    {!ride.rating && (
                      <Dialog
                        open={showRatingDialog}
                        onOpenChange={setShowRatingDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Rate Driver
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rate Your Driver</DialogTitle>
                            <DialogDescription>
                              How was your ride with {ride.driver.name}?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-center">
                              <StarRating
                                rating={rating}
                                onChange={setRating}
                              />
                            </div>
                            <Textarea
                              placeholder="Share your feedback (optional)"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                            <DialogFooter>
                              <div className="flex gap-2 w-full">
                                <Button
                                  onClick={handleRatingSubmit}
                                  disabled={rating === 0 || isSubmittingRating}
                                  className="flex-1"
                                >
                                  {isSubmittingRating
                                    ? "Submitting..."
                                    : "Submit Rating"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowRatingDialog(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {ride.rating && (
                    <div className="space-y-2">
                      <StarRating rating={ride.rating} readonly />
                      {ride.feedback && (
                        <p className="text-sm text-gray-600 italic">
                          "{ride.feedback}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ride Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Ride Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ride Requested</span>
                <span className="text-sm text-gray-600">
                  {formatDateTime(ride.bookingTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Driver Arrived</span>
                <span className="text-sm text-gray-600">
                  {formatDateTime(ride.startTime)}
                </span>
              </div>
              {ride.status === "completed" && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Trip Completed</span>
                  <span className="text-sm text-gray-600">
                    {formatDateTime(ride.endTime)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fare Breakdown */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Fare Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Base Fare</span>
                <span className="text-sm">
                  ${ride.fare.baseFare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Distance ({ride.distance})</span>
                <span className="text-sm">
                  ${ride.fare.distanceFare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Time ({ride.duration})</span>
                <span className="text-sm">
                  ${ride.fare.timeFare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Service Fee</span>
                <span className="text-sm">
                  ${ride.fare.serviceFee.toFixed(2)}
                </span>
              </div>
              {ride.fare.tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Tip</span>
                  <span className="text-sm">${ride.fare.tip.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${ride.fare.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm capitalize">
                  {ride.paymentMethod.type === "card"
                    ? `${ride.paymentMethod.brand} •••• ${ride.paymentMethod.last4}`
                    : ride.paymentMethod.type.replace("_", " ")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadReceipt}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>

              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Floating SOS Button (visible during in-progress rides) */}
      {ride.status === "in_progress" && (
        <div className="fixed bottom-6 right-6">
          <div className="relative group">
            <Button className="rounded-full h-14 w-14 shadow-lg bg-red-600 hover:bg-red-700">
              SOS
            </Button>
            <div className="absolute bottom-16 right-0 bg-white border rounded-md shadow-lg p-3 w-64 hidden group-hover:block">
              <p className="text-sm font-medium mb-2">Emergency Actions</p>
              <div className="space-y-2">
                <a
                  href="tel:911"
                  className="block text-sm text-red-600 hover:underline"
                >
                  Call Police
                </a>
                {(() => {
                  const contactPhone = emergencyContacts[0]?.phone || "";
                  const mapsUrl = coords
                    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
                    : "";
                  const smsText = encodeURIComponent(
                    `Emergency! I need help. My live location: ${mapsUrl}`
                  );
                  const waText = encodeURIComponent(
                    `Emergency! I need help. My live location: ${mapsUrl}`
                  );
                  const smsHref = contactPhone
                    ? `sms:${contactPhone}?&body=${smsText}`
                    : undefined;
                  const waHref = contactPhone
                    ? `https://wa.me/${contactPhone.replace(
                        /[^\\d]/g,
                        ""
                      )}?text=${waText}`
                    : undefined;
                  return (
                    <>
                      <a
                        href={smsHref || "#"}
                        aria-disabled={!smsHref}
                        className={`block text-sm hover:underline ${
                          smsHref ? "" : "pointer-events-none opacity-50"
                        }`}
                      >
                        Notify Emergency Contact (SMS)
                      </a>
                      <a
                        href={waHref || "#"}
                        aria-disabled={!waHref}
                        className={`block text-sm hover:underline ${
                          waHref ? "" : "pointer-events-none opacity-50"
                        }`}
                      >
                        Notify Emergency Contact (WhatsApp)
                      </a>
                      <a
                        href={mapsUrl || "#"}
                        aria-disabled={!mapsUrl}
                        target={mapsUrl ? "_blank" : undefined}
                        className={`block text-sm hover:underline ${
                          mapsUrl ? "" : "pointer-events-none opacity-50"
                        }`}
                      >
                        Share Live Location Link
                      </a>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideDetailsPage;
