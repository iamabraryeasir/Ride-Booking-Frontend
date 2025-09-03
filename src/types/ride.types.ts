import type { TRideStatus, TPaymentMethod } from "@/constants/role";
import type { IDriver, IRider } from "./user.types";

export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
}

export interface IRide {
  _id: string;
  rider: IRider;
  driver?: IDriver | null;
  pickupAddress: string;
  destinationAddress: string;
  status: TRideStatus;
  price: number;
  paymentMethod?: TPaymentMethod;
  rejectionDriverList?: string[];
  timestamps?: {
    requestedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IRideRequest {
  pickupAddress: string;
  destinationAddress: string;
  price: number;
}

export interface IFareEstimate {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  total: number;
  distance: number;
  estimatedDuration: number;
  currency: string;
}

export interface IRideUpdate {
  status: TRideStatus;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface IRideFilters {
  status?: TRideStatus[];
  dateFrom?: string;
  dateTo?: string;
  fareMin?: number;
  fareMax?: number;
  driverId?: string;
  riderId?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "fare.total" | "distance";
  sortOrder?: "asc" | "desc";
}

export interface IEarnings {
  daily: Array<{
    date: string;
    amount: number;
    rides: number;
  }>;
  weekly: Array<{
    week: string;
    amount: number;
    rides: number;
  }>;
  monthly: Array<{
    month: string;
    amount: number;
    rides: number;
  }>;
  total: {
    amount: number;
    rides: number;
  };
}

export interface IDriverApplication {
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    type: "CAR" | "MOTORCYCLE" | "BICYCLE";
  };
  documents: {
    licenseNumber: string;
    licenseExpiry: string;
    vehicleRegistration: string;
    insurance: string;
  };
}
