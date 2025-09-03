import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequestRideMutation } from "@/redux/features/ride/ride.api";

type RideRequestFormData = {
  pickupAddress: string;
  destinationAddress: string;
  price: number;
};

export default function BookRidePage() {
  const [requestRide, { isLoading: isBooking }] = useRequestRideMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RideRequestFormData>({});

  const onSubmit = async (data: RideRequestFormData) => {
    try {
      // Ensure price is a number
      const response = await requestRide({
        pickupAddress: data.pickupAddress,
        destinationAddress: data.destinationAddress,
        price: Number(data.price),
      }).unwrap();
      if (response.success) {
        toast.success("Ride requested successfully! Finding a driver...");
        // Invalidate ride list cache so dashboard updates
        // @ts-expect-error: Accessing Redux DevTools extension property on window for cache invalidation
        if (window.__REDUX_DEVTOOLS_EXTENSION__) {
          // If using Redux DevTools, force a refresh
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error("Failed to request ride. Please try again.");
      console.log(error);
    }
  };
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Ride</h1>
        <p className="text-muted-foreground">
          Enter your pickup and destination to get started
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Input
                id="pickupAddress"
                {...register("pickupAddress", { required: true })}
                placeholder="Enter pickup address"
              />
              {errors.pickupAddress && (
                <p className="text-red-500 text-sm">
                  Pickup address is required
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationAddress">Destination Address *</Label>
              <Input
                id="destinationAddress"
                {...register("destinationAddress", { required: true })}
                placeholder="Enter destination address"
              />
              {errors.destinationAddress && (
                <p className="text-red-500 text-sm">
                  Destination address is required
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { required: true, min: 1 })}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">
                  Price is required and must be positive
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isBooking}
              className="w-full"
              size="lg"
            >
              {isBooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Booking Ride...
                </>
              ) : (
                <>
                  <Car className="w-4 h-4 mr-2" />
                  Book Ride Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
