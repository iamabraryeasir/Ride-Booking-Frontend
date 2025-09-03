import { type ComponentType } from "react";

// Legacy auth types
export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";

// Role and status types
export type TUserRole = "ADMIN" | "RIDER" | "DRIVER";
export type TUserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED" | "PENDING";
export type TDriverStatus = "ONLINE" | "OFFLINE" | "BUSY";
export type TRideStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";
export type TPaymentMethod = "CASH" | "CARD" | "WALLET";

// Basic user interface
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: TUserRole;
  status: TUserStatus;
  profileImage?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Admin interface
export interface IAdmin extends Omit<IUser, "role"> {
  role: "ADMIN";
  permissions: string[];
}

// Driver interface
export interface IDriver extends Omit<IUser, "role"> {
  role: "DRIVER";
  driverStatus: TDriverStatus;
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
  isApproved: boolean;
  rejectionReason?: string;
  earnings: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  rating: number;
  totalRides: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Rider interface
export interface IRider extends Omit<IUser, "role"> {
  role: "RIDER";
  paymentMethods: Array<{
    id: string;
    type: "CASH" | "CARD" | "WALLET";
    isDefault: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
  }>;
  rating: number;
  totalRides: number;
  favoriteLocations: Array<{
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }>;
}

// Auth related types
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: "RIDER" | "DRIVER";
  vehicle?: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    type: "CAR" | "MOTORCYCLE" | "BICYCLE";
  };
  documents?: {
    licenseNumber: string;
    licenseExpiry: string;
    vehicleRegistration: string;
    insurance: string;
  };
}

export interface IAuthResponse {
  user: IUser | IDriver | IRider | IAdmin;
  accessToken: string;
  refreshToken: string;
}

export interface IUpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Ride related types
export type * from "./ride.types";

// Admin and analytics types
export type * from "./admin.types";

// Payment method types
export type * from "./payment.types";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}

// Form validation schemas will be defined with Zod
export interface IFormErrors {
  [key: string]: string[];
}

// Emergency/SOS related types
export interface IEmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isActive: boolean;
}

export interface ISOSAlert {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: "POLICE" | "EMERGENCY_CONTACT" | "LOCATION_SHARE";
  status: "PENDING" | "SENT" | "FAILED";
  createdAt: string;
}
