import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types and Interfaces
interface CreateBookingRequest {
    facilityId: string;
    farmerId: string;
    startDate: Date;
    endDate: Date;
    amount?: number;
}

interface CreateBookingResponse {
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
    facility: {
        id: string;
        location: string;
        address: string;
        cost: number;
        type: string;
        available: boolean;
        contact: string;
        description: string | null;
        operator: {
            id: string;
        };
    };
    farmer: {
        id: string;
    }; 
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    errors?: ValidationError[];
}

interface ValidationError {
    field: string;
    message: string;
}

// Validation Service
class CreateBookingValidator {
    static validate(booking: CreateBookingRequest): ValidationError[] {
        const errors: ValidationError[] = [];
        
        if (!booking.facilityId?.trim()) {
            errors.push({ field: 'facilityId', message: 'Facility ID is required.' });
        }
        if (!booking.farmerId?.trim()) {
            errors.push({ field: 'farmerId', message: 'Farmer ID is required.' });
        }
        if (!booking.startDate) {
            errors.push({ field: 'startDate', message: 'Valid start date is required.' });
        }
        if (!booking.endDate) {
            errors.push({ field: 'endDate', message: 'Valid end date is required.' });
        }
        if (booking.startDate >= booking.endDate) {
            errors.push({ field: 'dateRange', message: 'Start date must be before end date.' });
        }

        // Date range validation
        if (booking.startDate >= booking.endDate) {
            errors.push({ field: 'dateRange', message: 'Start date must be before end date.' });
        }

        if (booking.startDate < new Date()) {
            errors.push({ field: 'startDate', message: 'Start date cannot be in the past.' });
        }

        // Amount validation (if provided)
        if (booking.amount !== undefined && booking.amount < 0) {
            errors.push({ field: 'amount', message: 'Amount cannot be negative.' });
        }

        return errors;
    }
}

class CreateBookingService {
    static async getFacilityDetails(facilityId: string) {
        try {
            const facility = await prisma.facility.findUnique({
                where: { id: facilityId },
                include: {
                    operator: true,
                },
            });
            return facility;
        } catch (error) {
            console.error('Error fetching facility details:', error);
            return null;
        }
    }

    static async farmerExists(farmerId: string): Promise<boolean> {
        try {
            const farmer = await prisma.farmer.findUnique({
                where: { id: farmerId },
            });
            return farmer !== null;
        } catch (error) {
            console.error('Error checking farmer existence:', error);
            return false;
        }
    }

    static async isFacilityAvailable(facilityId: string, startDate: Date, endDate: Date): Promise<boolean> {
        try {
            const overlappingBookings = await prisma.booking.findMany({
                where: {
                    facilityId,
                    active: true,
                    OR: [
                        {
                            // New booking starts before an existing booking ends
                            AND: [
                                {
                                    startDate: { lte: endDate },
                                },
                                {
                                    endDate: { gt: startDate } 
                                },
                      ]
              },
              {
                            // New booking ends after an existing booking starts
                            AND: [
                                {
                                    startDate: { lt: endDate },
                                },
                                {
                                    endDate: { gt: startDate } 
                                }
                            ]
                        },
                        {
                            // New booking starts and ends within an existing booking
                            startDate: { lte: startDate, gte: endDate },
                        }
                    ]
                },
            });

            return overlappingBookings.length === 0;
        } catch (error) {
            console.error('Error checking facility availability:', error);
            return false;
        }
    }

    static calculateBookingAmount(facilityCostPerDay: number, startDate: Date, endDate: Date): number {
        const timeDifference = endDate.getTime() - startDate.getTime();
        const durationInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
       
        const numberOfDays = Math.max(durationInDays, 1); // Ensure at least 1 day
        return facilityCostPerDay * numberOfDays;
    }
}

// Booking Controller
class CreateBookingController {
    static async createBooking(bookingData: CreateBookingRequest): Promise<ApiResponse<CreateBookingResponse>> {
        try {
            // Validate booking data
            const validationErrors = CreateBookingValidator.validate(bookingData);
            if (validationErrors.length > 0) {
                return {
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                };
            }

           // Check if facility exists and is available for booking
            const facility = await CreateBookingService.getFacilityDetails(bookingData.facilityId);
            if (!facility) {
                return {
                    success: false,
                    message: 'Facility not found.',
                    errors: [{ field: 'facilityId', message: 'Invalid or unavailable facility.' }]
                };
            }

            if (!facility.available) {
                return {
                    success: false,
                    message: 'Facility is not available for booking.',
                    errors: [{ field: 'facilityId', message: 'Facility is currently unavailable.' }]
                };
            }

            // Check if farmer exists
            const farmerExists = await CreateBookingService.farmerExists(bookingData.farmerId);
            if (!farmerExists) {
                return {
                    success: false,
                    message: 'Farmer not found.',
                    errors: [{ field: 'farmerId', message: 'Invalid farmer ID.' }]
                };
            }

            // Check faciltity availability for the booking dates
            const isAvailable = await CreateBookingService.isFacilityAvailable(
                bookingData.facilityId,
                bookingData.startDate,
                bookingData.endDate
            );

            if (!isAvailable) {
                return {
                    success: false,
                    message: 'Facility is not available for the selected dates.',
                    errors: [{ field: 'dateRange', message: 'Facility is already booked for the selected dates.' }]
                };
            }

            // Calculate amount if not provided
            const amount = bookingData.amount || CreateBookingService.calculateBookingAmount(
                facility.cost,
                bookingData.startDate,
                bookingData.endDate
            );

            // Create booking
            const newBooking = await prisma.booking.create({
                data: {
                    facilityId: bookingData.facilityId,
                    farmerId: bookingData.farmerId,
                    amount,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    reservedAt: new Date(),
                    paid: false,
                    active: false,
                },
                include: {
                    facility: {
                        include: {
                            operator: true,
                }
            },
            farmer: true,
                },
            });

            return {
                success: true,
                data: newBooking as CreateBookingResponse,
                message: 'Booking created successfully.'
            };

        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    message: 'An error occurred while creating the booking.',
                    errors: [{ field: 'general', message: error.message }]
                };
            }

            console.error('Error creating booking:', error);
            return {
                success: false,
                message: 'An unexpected error occurred.',
                errors: [{ field: 'general', message: 'Unexpected error occurred.' }]
            };
        }
    }

// Helper method to handle booking creation
static async handleCreateBooking(formData: CreateBookingRequest): Promise<void> {
    const result = await this.createBooking(formData);

    if (result.success) {
    console.log(result.message);
    console.log('Booking ID:', result.data?.id);
    console.log('Total Amount:', result.data?.amount);
    }
    else {
        console.error('Booking creation failed:', result.message);
        if (result.errors) {
            result.errors.forEach(error => {
                console.error(`Error in field ${error.field}: ${error.message}`);
            });
          }
        }
      }
    }

export { CreateBookingController, CreateBookingRequest, CreateBookingResponse, CreateBookingService, ApiResponse, ValidationError };

