import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['RIDER', 'DRIVER'], {
    required_error: 'Please select a role',
  }),
  // Driver-specific fields (conditional)
  vehicle: z.object({
    make: z.string().min(1, 'Vehicle make is required'),
    model: z.string().min(1, 'Vehicle model is required'),
    year: z.number().min(1900).max(new Date().getFullYear()),
    color: z.string().min(1, 'Vehicle color is required'),
    plateNumber: z.string().min(1, 'Plate number is required'),
    type: z.enum(['CAR', 'MOTORCYCLE', 'BICYCLE']),
  }).optional(),
  documents: z.object({
    licenseNumber: z.string().min(1, 'License number is required'),
    licenseExpiry: z.string().min(1, 'License expiry is required'),
    vehicleRegistration: z.string().min(1, 'Vehicle registration is required'),
    insurance: z.string().min(1, 'Insurance details are required'),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'DRIVER') {
    return data.vehicle && data.documents;
  }
  return true;
}, {
  message: "Vehicle and document information is required for drivers",
  path: ["role"],
});

// Profile update schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

// Ride request schema
export const rideRequestSchema = z.object({
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().min(1, 'Pickup address is required'),
    landmark: z.string().optional(),
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().min(1, 'Destination address is required'),
    landmark: z.string().optional(),
  }),
  paymentMethod: z.enum(['CASH', 'CARD', 'WALLET']),
  notes: z.string().optional(),
  scheduleFor: z.string().optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Driver application schema
export const driverApplicationSchema = z.object({
  vehicle: z.object({
    make: z.string().min(1, 'Vehicle make is required'),
    model: z.string().min(1, 'Vehicle model is required'),
    year: z.number().min(1900).max(new Date().getFullYear()),
    color: z.string().min(1, 'Vehicle color is required'),
    plateNumber: z.string().min(1, 'Plate number is required'),
    type: z.enum(['CAR', 'MOTORCYCLE', 'BICYCLE']),
  }),
  documents: z.object({
    licenseNumber: z.string().min(1, 'License number is required'),
    licenseExpiry: z.string().min(1, 'License expiry is required'),
    vehicleRegistration: z.string().min(1, 'Vehicle registration is required'),
    insurance: z.string().min(1, 'Insurance details are required'),
  }),
});

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  relationship: z.string().min(1, 'Relationship is required'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type RideRequestFormData = z.infer<typeof rideRequestSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type DriverApplicationFormData = z.infer<typeof driverApplicationSchema>;
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;
