/* eslint-disable */

export enum UserRole {
  FARMER,
  OPERATOR,
  ADMIN,
}

export enum FacilityType {
  DRYER,
  STORAGE,
  PROCESSING,
  OTHER,
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
  id: number;
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
  id: number;
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
  id: number;
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
  id: number;
  operatorId: number;
  location: string;
  address: string;
  cost: number;
  type: FacilityType;
  available: boolean;
  contact: string;
  description: string | null;
  capacity: number; // Optional field for capacity
  createdAt: Date;
  updatedAt: Date;

  operator: Operator;
  bookings: Booking[];
}

export interface FacilityUpdateData {
  location: string;
  address: string;
  cost: number;
  type: FacilityType;
  available: boolean;
  contact: string;
  description: string | null;
  capacity?: number; // Optional field for capacity
}

export interface Booking {
  id: number;
  facilityId: number;
  farmerId: number;
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
  id: string;
  bookingId: string;
  reason: TransactionReason;
  paymentMethod: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;

  booking: Booking;
}

