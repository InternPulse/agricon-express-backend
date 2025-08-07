import { FacilityType, Prisma, booking_status } from "@prisma/client";
import { prisma } from "../../config/config.db";
import { BadRequestError, NotFoundError } from "../../errors/errors";
import {
  FacilityFilterOptions,
  FacilitySearchFilters,
  FacilityUpdateData,
  GetByOperatorOptions,
  UserRole,
} from "../../types/types";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const createFacility = async (data: Prisma.FacilityCreateInput) => {
  try {
    const facility = await prisma.facility.create({
      data,
    });
    return facility;
  } catch (error) {
    throw new BadRequestError({
      message: `Error creating facility`,
      from: "addFacility()",
      cause: error,
    });
  }
};

export const getFacilityById = async (facilityId: bigint) => {
  const facility = await prisma.facility.findUnique({
    where: {
      id: facilityId,
    },
  });

  if (!facility) {
    throw new NotFoundError({
      message: "Facility not found",
      from: "getFacilityById",
    });
  }

  return facility;
};

export const updateFacilityById = async (
  facilityId: bigint,
  data: FacilityUpdateData
) => {
  try {
    const updateData = { ...data } as any;
    if (updateData.type !== undefined) {
      updateData.type = { set: updateData.type };
    }

    const updatedFacility = await prisma.facility.update({
      where: {
        id: facilityId,
      },
      data: updateData,
    });

    return updatedFacility;
  } catch (error) {
    throw new BadRequestError({
      message: `Error updating facility with ID ${facilityId}`,
      from: "updateFacilityById()",
      cause: error,
    });
  }
};

export const deleteFacilityById = async (facilityId: bigint) => {
  try {
    const deleted = await prisma.facility.delete({
      where: {
        id: facilityId,
      },
    });

    return deleted;
  } catch (error) {
    throw new BadRequestError({
      message: `Error deleting facility with ID ${facilityId}`,
      from: "deleteFacilityById()",
      cause: error,
    });
  }
};

export const getAllFacility_ByFiltering = async (
  filters: FacilityFilterOptions,
  role: UserRole,
  operatorId?: bigint
) => {
  try {
    const { page, limit, location, type, available, minPrice, maxPrice } =
      filters;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (role === UserRole.OPERATOR && operatorId) {
      where.operatorId = operatorId;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (type) where.type = type.toUpperCase();
    if (available !== undefined) where.available = available;
    if (minPrice !== undefined) where.pricePerDay = { gte: minPrice };
    if (maxPrice !== undefined) {
      where.pricePerDay = {
        ...(where.pricePerDay || {}),
        lte: maxPrice,
      };
    }

    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.facility.count({ where }),
    ]);

    return {
      facilities,
      pagination: {
        page,
        limit,
        total,
      },
      filtersApplied: { location, type, available, minPrice, maxPrice },
    };
  } catch (error) {
    throw new BadRequestError({
      message: `Error fetching all facilities`,
      from: "getAllFacilities()",
      cause: error,
    });
  }
};

export const getFacilitiesByOperator = async (
  options: GetByOperatorOptions
) => {
  const { operatorId, page, limit } = options;
  const offset = (page - 1) * limit;

  try {
    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where: { operatorId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.facility.count({ where: { operatorId } }),
    ]);

    return {
      facilities,
      pagination: {
        page,
        limit,
        total,
      },
    };
  } catch (error) {
    throw new BadRequestError({
      message: `Error fetching all facilities by operator`,
      from: "getAllFacilitiesByOperator()",
      cause: error,
    });
  }
};

export const updateFacilityImage = async (
  facilityId: bigint,
  facilityImage: string
) => {
  try {
    const facility = await prisma.facility.update({
      where: { id: facilityId },
      data: {
        facilityImage: {
          push: [facilityImage],
        },
      },
    });
    return facility;
  } catch (error) {
    throw new BadRequestError({
      message: "Error updating facility image",
      from: "updateFacilityImage()",
      cause: error,
    });
  }
};

export const updateFacilityCapacity = async (
  facilityId: bigint,
  newCapacity: number
) => {
  const updatedFacility = await prisma.facility.update({
    where: { id: facilityId },
    data: { capacity: newCapacity },
  });
  return updatedFacility;
};


export const searchEverythingGlobally = async (
  term: string, 
  userId: string,
  userRole: string,
  page: number = 1, 
  limit: number = 10
) => {
  
  const skip = (page - 1) * limit;
  const numericTerm = !isNaN(Number(term)) ? Number(term) : null;
  
      if (!term.trim() || /^[@#\$%\^&\*\(\)_\+\-=\[\]\{\}\|;':\",./<>\?~`!]+$/.test(term)) {
        return {
          farmers: [],
          operators: [],
          facilities: [],
          bookings: [],
          transactions: [],
          notifications: [],
        };
      }

      try {
        const [farmers, operators, facilities, bookings, transactions, notifications] = await Promise.all([

      // FARMERS SEARCH (Admin only)
      userRole === 'ADMIN' ? (async () => {        
        const result = await prisma.farmer.findMany({
          where: {
            OR: [
              { firstName: { contains: term, mode: "insensitive" } },
              { lastName: { contains: term, mode: "insensitive" } },
              { phone: { contains: term, mode: "insensitive" } },
              { address: { contains: term, mode: "insensitive" } },
              ...(numericTerm ? [{ id: numericTerm }] : [])
            ]
          },
          skip,
          take: limit,
          orderBy: [
            { firstName: 'asc' },
            { lastName: 'asc' }
          ]
        });
        return result;
      })() : [],

      // OPERATORS SEARCH (Admin only)
      userRole === 'ADMIN' ? (async () => {
        const result = await prisma.operator.findMany({
          where: {
            OR: [
              { firstName: { contains: term, mode: "insensitive" } },
              { lastName: { contains: term, mode: "insensitive" } },
              { phone: { contains: term, mode: "insensitive" } },
              { businessName: { contains: term, mode: "insensitive" } },
              { address: { contains: term, mode: "insensitive" } },
              ...(numericTerm ? [{ id: numericTerm }] : [])
            ]
          },
          skip,
          take: limit,
          orderBy: [
            { businessName: 'asc' },
            { firstName: 'asc' }
          ]
        });
        
        console.log(`Found ${result.length} operators`);
        return result;
      })() : [],

      (async () => {
        console.log('🔍 Facilities search - GLOBAL for farmers...');
        const facilitySearchConditions: any[] = [
          { name: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { location: { contains: term, mode: "insensitive" } },
          { capacity: { contains: term, mode: "insensitive" } },
        ];

        // Enhanced facility type matching
        const facilityTypeMapping = {
          'STORAGE': ['store', 'storage', 'warehouse', 'depot'],
          'DRYER': ['dry', 'dryer', 'drying', 'dehydrate'],
          'PROCESSING': ['process', 'processing', 'manufacture', 'production'],
          'COLDROOM': ['coldroom', 'cold', 'decay', 'preserve', 'cooling', 'cool'],
          'OTHER': ['other', 'misc', 'miscellaneous']
        };

        // Check if search term matches any facility type
        Object.entries(facilityTypeMapping).forEach(([type, keywords]) => {
          keywords.forEach(keyword => {
            if (term.toLowerCase().includes(keyword.toLowerCase()) || 
                keyword.toLowerCase().includes(term.toLowerCase())) {
              facilitySearchConditions.push({ type: { equals: type as FacilityType } });
            }
          });
        });

        const statusKeywordMap = {
        'RESERVED': ['reserved', 'pending', 'wait', 'waiting', 'review'],
        'CONFIRMED': ['confirmed', 'approved', 'accept', 'accepted', 'completed', 'done', 'finished'],
        'CANCELLED': ['cancelled', 'canceled', 'reject', 'rejected'],
};

        Object.entries(statusKeywordMap).forEach(([status, keywords]) => {
          keywords.forEach(keyword => {
            if (
              term.toLowerCase().includes(keyword.toLowerCase()) || 
              keyword.toLowerCase().includes(term.toLowerCase())
            ) {
              facilitySearchConditions.push({
                bookings: {
                  some: {
                    status: status
                  }
                }
              });
            }
          });
        });
        // Direct facility type match
        const upperTerm = term.toUpperCase();
        if (Object.values(FacilityType).includes(upperTerm as FacilityType)) {
          facilitySearchConditions.push({ type: { equals: upperTerm as FacilityType } });
        }

        // Numeric price search
        if (numericTerm !== null) {
          facilitySearchConditions.push(
            { pricePerDay: { equals: numericTerm } },
            { pricePerDay: { lte: numericTerm * 1.1, gte: numericTerm * 0.9 } } // ±10% range
          );
        }

        // Search in operator details
        facilitySearchConditions.push(
          { operator: { firstName: { contains: term, mode: "insensitive" } } },
          { operator: { lastName: { contains: term, mode: "insensitive" } } },
          { operator: { businessName: { contains: term, mode: "insensitive" } } }
        );

        let whereClause: any = {};
        // Only show facilities managed by the logged-in operator
        if (userRole === 'OPERATOR') {
          whereClause = {
            AND: [
              { operator: { user_id: userId } },
              { OR: facilitySearchConditions }
            ]
          };
        } else {
          // FARMER and ADMIN can see ALL facilities
          whereClause = { OR: facilitySearchConditions };
        }
        
        const result = await prisma.facility.findMany({
          where: whereClause,
          include: { 
            operator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                businessName: true,
                address: true,
                createdAt: true,
                updatedAt: true,
                user_id: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: [
            { available: 'desc' },
            { name: 'asc' }
          ]
        });
        
        console.log(`Found ${result.length} facilities`);
        return result;
      })(),
      
      // BOOKINGS SEARCH
      (async () => {
        const bookingSearchConditions: any[] = [
          { facility: { name: { contains: term, mode: "insensitive" } } },
          { facility: { location: { contains: term, mode: "insensitive" } } },
          { facility: { type: { contains: term, mode: "insensitive" } } },
          { farmer: { firstName: { contains: term, mode: "insensitive" } } },
          { farmer: { lastName: { contains: term, mode: "insensitive" } } },
          { farmer: { phone: { contains: term, mode: "insensitive" } } }
        ];

        const statusMapping = {
          'RESERVED': ['reserved', 'pending', 'wait', 'waiting', 'review'],
          'CONFIRMED': ['confirmed', 'approved', 'accept', 'accepted'],
          'CANCELLED': ['cancelled', 'canceled', 'reject', 'rejected'],
        };

        Object.entries(statusMapping).forEach(([status, keywords]) => {
          keywords.forEach(keyword => {
            if (term.toLowerCase().includes(keyword.toLowerCase()) || 
                keyword.toLowerCase().includes(term.toLowerCase())) {
              if (term.toLowerCase() === keyword.toLowerCase()) {
        bookingSearchConditions.push({ status: { equals: status } });
      }
            }
          });
        });

        const upperTerm = term.toUpperCase();
        const validStatuses = ['RESERVED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (validStatuses.includes(upperTerm)) {
          bookingSearchConditions.push({ status: { equals: upperTerm } });
        }

        if (numericTerm !== null) {
          bookingSearchConditions.push(
            { amount: { equals: numericTerm } },
            { amount: { lte: numericTerm * 1.1, gte: numericTerm * 0.9 } }
          );
        }

        let whereClause: any = {};
        
        if (userRole === 'FARMER') {
          console.log('🔒 Filtering bookings by farmer user_id:', userId);
          whereClause = {
            AND: [
              { farmer: { user_id: userId } },
              { OR: bookingSearchConditions }
            ]
          };
        } else if (userRole === 'OPERATOR') {
          console.log('🔒 Filtering bookings by facility operator user_id:', userId);
          whereClause = {
            AND: [
              { facility: { operator: { user_id: userId } } },
              { OR: bookingSearchConditions }
            ]
          };
        } else if (userRole === 'ADMIN') {
          whereClause = { OR: bookingSearchConditions };
        } else {
          return [];
        }
        
        const result = await prisma.booking.findMany({
          where: whereClause,
          include: {
            facility: {
              select: {
                id: true,
                name: true,
                type: true,
                location: true,
                pricePerDay: true
              }
            },
            farmer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        console.log(`Found ${result.length} bookings`);
        return result;
      })(),

      // TRANSACTIONS SEARCH
      (async () => {
        console.log('🔍 Transactions search...');
        
        const transactionSearchConditions: any[] = [
          { description: { contains: term, mode: "insensitive" } },
          { status: { contains: term, mode: "insensitive" } },
          { ref: { contains: term, mode: "insensitive" } },
          { booking: { facility: { name: { contains: term, mode: "insensitive" } } } },
          { booking: { farmer: { firstName: { contains: term, mode: "insensitive" } } } },
          { booking: { farmer: { lastName: { contains: term, mode: "insensitive" } } } }
        ];

        if (numericTerm !== null) {
          transactionSearchConditions.push(
            { amount: { equals: numericTerm } },
            { amount: { lte: numericTerm * 1.1, gte: numericTerm * 0.9 } }
          );
        }
        
        let whereClause: any = {};
        
        if (userRole === 'FARMER') {
          whereClause = {
            AND: [
              { booking: { farmer: { user_id: userId } } },
              { OR: transactionSearchConditions }
            ]
          };
        } else if (userRole === 'OPERATOR') {
          whereClause = {
            AND: [
              { booking: { facility: { operator: { user_id: userId } } } },
              { OR: transactionSearchConditions }
            ]
          };
        } else if (userRole === 'ADMIN') {
          whereClause = { OR: transactionSearchConditions };
        } else {
          return [];
        }
        
        const result = await prisma.transaction.findMany({
          where: whereClause,
          include: {
            booking: {
              include: {
                facility: { select: { name: true, type: true, location: true } },
                farmer: { select: { firstName: true, lastName: true, phone: true } }
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        console.log(`Found ${result.length} transactions`);
        return result;
      })(),

      // NOTIFICATIONS SEARCH
      (async () => {
        console.log('🔍 Notifications search...');
        
        const result = await prisma.notification.findMany({
          where: {
            AND: [
              { userId: userId },
              {
                OR: [
                  { title: { contains: term, mode: "insensitive" } },
                  { message: { contains: term, mode: "insensitive" } },
                  { type: { contains: term, mode: "insensitive" } }
                ]
              }
            ]
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        return result;
      })()
    ]);

    return {
      farmers,
      operators,
      facilities,
      bookings,
      transactions,
      notifications,
    };
    
  } catch (error) {
    throw error;
  }
};


export const searchFacilitiesWithFilters = async (
  term: string,
  filters: FacilitySearchFilters,
  userId: string,
  userRole: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;
  const numericTerm = !isNaN(Number(term)) ? Number(term) : null;

  const searchConditions: any[] = [];
  if (term.trim()) {
    searchConditions.push(
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
      { operator: { firstName: { contains: term, mode: "insensitive" } } },
      { operator: { lastName: { contains: term, mode: "insensitive" } } },
      { operator: { businessName: { contains: term, mode: "insensitive" } } }
    );

    // Facility type search
    const facilityTypeMapping = {
      'STORAGE': ['store', 'storage', 'warehouse', 'depot'],
      'DRYER': ['dry', 'dryer', 'drying', 'dehydrate'],
      'PROCESSING': ['process', 'processing', 'manufacture', 'production'],
      'OTHER': ['other', 'misc', 'miscellaneous']
    };

    Object.entries(facilityTypeMapping).forEach(([type, keywords]) => {
      keywords.forEach(keyword => {
        if (term.toLowerCase().includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(term.toLowerCase())) {
          searchConditions.push({ type: { equals: type as FacilityType } });
        }
      });
    });

    // Direct type match
    const upperTerm = term.toUpperCase();
    if (Object.values(FacilityType).includes(upperTerm as FacilityType)) {
      searchConditions.push({ type: { equals: upperTerm as FacilityType } });
    }

    // Price search
    if (numericTerm !== null) {
      searchConditions.push(
        { pricePerDay: { equals: numericTerm } },
        { pricePerDay: { lte: numericTerm * 1.1, gte: numericTerm * 0.9 } }
      );
    }
  }

  // Build filter conditions
  const filterConditions: any = {};

  if (filters.location) {
    filterConditions.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.type) {
    filterConditions.type = { equals: filters.type };
  }

  if (filters.available !== undefined) {
    filterConditions.available = { equals: filters.available };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filterConditions.pricePerDay = {};
    if (filters.minPrice !== undefined) {
      filterConditions.pricePerDay.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      filterConditions.pricePerDay.lte = filters.maxPrice;
    }
  }

  if (filters.minCapacity !== undefined || filters.maxCapacity !== undefined) {
    filterConditions.capacity = {};
    if (filters.minCapacity !== undefined) {
      filterConditions.capacity.gte = filters.minCapacity;
    }
    if (filters.maxCapacity !== undefined) {
      filterConditions.capacity.lte = filters.maxCapacity;
    }
  }

  let whereClause: any = {};
  
  const conditions = [];
  
  if (searchConditions.length > 0) {
    conditions.push({ OR: searchConditions });
  }
  
  if (Object.keys(filterConditions).length > 0) {
    conditions.push(filterConditions);
  }

  if (userRole === 'OPERATOR') {
    conditions.push({ operator: { user_id: userId } });
  }

  whereClause = conditions.length > 0 ? { AND: conditions } : {};

  try {
    const [facilities, totalCount] = await Promise.all([
      prisma.facility.findMany({
        where: whereClause,
        include: {
          operator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              businessName: true,
              address: true,
              user_id: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { available: 'desc' },
          { name: 'asc' }
        ]
      }),
      prisma.facility.count({ where: whereClause })
    ]);

    console.log(`Found ${facilities.length} facilities out of ${totalCount} total`);

    return {
      facilities,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1
    };

  } catch (error) {
    throw error;
  }
};

