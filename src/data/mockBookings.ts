export interface MockBooking {
    id: string;
    farmerId: string;
    facilityId: string;
    facilityName: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    status: 'confirmed' | 'pending' | 'cancelled';
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export const mockBookings: MockBooking[] = [
    { 
      id: 'booking-1', 
      farmerId: 'owner-1', 
      facilityId: 'facility-1', 
      facilityName: 'Storage Warehouse A',
      amount: 150.00,
      startDate: new Date('2025-06-20T09:00:00Z'),
      endDate: new Date('2025-06-20T17:00:00Z'),
      status: 'confirmed',
      active: true,
      createdAt: new Date('2025-06-15T10:00:00Z'),
      updatedAt: new Date('2025-06-15T10:00:00Z')
    },
    { 
      id: 'booking-2', 
      farmerId: 'owner-1', 
      facilityId: 'facility-2', 
      facilityName: 'Cold Storage Unit B',
      amount: 200.50,
      startDate: new Date('2025-06-25T08:00:00Z'),
      endDate: new Date('2025-06-25T18:00:00Z'),
      status: 'pending',
      active: true,
      createdAt: new Date('2025-06-16T09:30:00Z'),
      updatedAt: new Date('2025-06-16T09:30:00Z')
    },
    { 
      id: 'booking-3', 
      farmerId: 'farmer-1', 
      facilityId: 'facility-3', 
      facilityName: 'Processing Center C',
      amount: 300.00,
      startDate: new Date('2025-07-01T07:00:00Z'),
      endDate: new Date('2025-07-01T19:00:00Z'),
      status: 'confirmed',
      active: true,
      createdAt: new Date('2025-06-14T14:20:00Z'),
      updatedAt: new Date('2025-06-14T14:20:00Z')
    },
    { 
      id: 'booking-4', 
      farmerId: 'owner-1', 
      facilityId: 'facility-1', 
      facilityName: 'Storage Warehouse A',
      amount: 175.25,
      startDate: new Date('2025-06-30T10:00:00Z'),
      endDate: new Date('2025-06-30T16:00:00Z'),
      status: 'cancelled',
      active: false,
      createdAt: new Date('2025-06-10T11:15:00Z'),
      updatedAt: new Date('2025-06-12T13:45:00Z')
    },
    { 
      id: 'booking-5', 
      farmerId: 'farmer-1', 
      facilityId: 'facility-5', 
      facilityName: 'Cold Storage Unit C',
      amount: 500.50,
      startDate: new Date('2025-07-01T07:00:00Z'),
      endDate: new Date('2025-07-01T19:00:00Z'),
      status: 'pending',
      active: true,
      createdAt: new Date('2025-06-14T14:20:00Z'),
      updatedAt: new Date('2025-06-14T14:20:00Z')
    }
  ];