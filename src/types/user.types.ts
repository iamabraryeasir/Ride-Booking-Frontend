import type { TUserRole, TUserStatus, TDriverStatus } from '@/constants/role';

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

export interface IDriver extends Omit<IUser, 'role'> {
  role: 'DRIVER';
  driverStatus: TDriverStatus;
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    type: 'CAR' | 'MOTORCYCLE' | 'BICYCLE';
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

export interface IRider extends Omit<IUser, 'role'> {
  role: 'RIDER';
  paymentMethods: Array<{
    id: string;
    type: 'CASH' | 'CARD' | 'WALLET';
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

export interface IAdmin extends Omit<IUser, 'role'> {
  role: 'ADMIN';
  permissions: string[];
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
  role: 'RIDER' | 'DRIVER';
  // Driver-specific fields (optional for riders)
  vehicle?: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    type: 'CAR' | 'MOTORCYCLE' | 'BICYCLE';
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
  token: string;
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
