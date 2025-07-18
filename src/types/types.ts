/* eslint-disable */

export enum UserRole {
  FARMER = 'FARMER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
}
export enum FacilityType {
  DRYER,
  STORAGE,
  PROCESSING,
  COLDROOM,
  OTHERS,
}

export enum TransactionReason {
  BOOKING,
  EXTENSION,
  PENALTY,
  OTHER,
}

export enum TransactionStatus {
  PENDING,
  COMPLETED,
  FAILED,
  REFUNDED,
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  emailVerificationToken: string | null;
  emailVerified: boolean;
  emailTokenExpiresAt: Date | null;
  passwordResetToken: string | null;
  passwordTokenExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  farmer?: Farmer | null;
  operator?: Operator | null;
}

export interface Farmer {
  id: bigint;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;

  user: User;
  bookings: Booking[];
}

export interface Operator {
  id: bigint;
  userId: string;
  businessName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;

  user: User;
  facilities: Facility[];
}

export interface Facility {
  id: bigint;
  operatorId: bigint;
  location: string;
  pricePerDay: number;
  facilityImage?: String[] | string;
  type: FacilityType;
  available: boolean;
  contact: string;
  description: string | null;
  capacity?: number; 
  createdAt: Date;
  updatedAt: Date;

  operator: Operator;
  bookings?: Booking[];
}

export interface FacilityUpdateData {
  address: string;
  pricePerDay: number;
  type: FacilityType;
  available: boolean;
  contact: string;
  description: string | null;
  capacity?: number; // Optional field for capacity
}

export enum BookingStatus{
  ACTIVE,
  INACTIVE,
  PENDING,
  CANCELLED,
  COMPLETED,
}

export interface Booking {
  id: bigint;
  facilityId: bigint;
  farmerId: bigint;
  amount: number;
  paid: boolean;
  active: boolean;
  reservedAt: Date;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;

  facility: Facility;
  farmer: Farmer;
  transaction?: Transaction | null;
}

export interface Transaction {
  id: bigint;
  bookingId: bigint;
  reason: TransactionReason;
  paymentMethod: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;

  booking: Booking;
}

export interface CreateBookingParams {
  facilityId: bigint;
  farmerId: bigint;
  startDate: Date;
  endDate: Date;
}

export interface FacilityFilterOptions {
  page: number;
  limit: number | 10;
  location?: string;
  type?: 'DRYER' | 'STORAGE' | 'PROCESSING' | 'OTHER';
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export interface GetByOperatorOptions {
  operatorId: bigint;
  page: number;
  limit: number;
};