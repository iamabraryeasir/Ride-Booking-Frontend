export const ROLES = {
  ADMIN: "ADMIN",
  RIDER: "RIDER",
  DRIVER: "DRIVER",
} as const;

export type TUserRole = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING",
} as const;

export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const DRIVER_STATUS = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  BUSY: "BUSY",
} as const;

export type TDriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export const RIDE_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
} as const;

export type TRideStatus = (typeof RIDE_STATUS)[keyof typeof RIDE_STATUS];

export const PAYMENT_METHODS = {
  CASH: "CASH",
  CARD: "CARD",
  WALLET: "WALLET",
} as const;

export type TPaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
