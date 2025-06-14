export enum UserRole {
  FARMER,
  INFRA_OWNER,
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
  id: string;
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
  id: string;
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
  id: string;
  operatorId: string;
  location: string;
  address: string;
  cost: number;
  type: FacilityType;
  available: boolean;
  contact: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  operator: Operator;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  facilityId: string;
  farmerId: string;
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
