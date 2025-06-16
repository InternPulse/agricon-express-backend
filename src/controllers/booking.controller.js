"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingService = exports.CreateBookingController = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Validation Service
var CreateBookingValidator = /** @class */ (function () {
    function CreateBookingValidator() {
    }
    CreateBookingValidator.validate = function (booking) {
        var _a, _b;
        var errors = [];
        if (!((_a = booking.facilityId) === null || _a === void 0 ? void 0 : _a.trim())) {
            errors.push({ field: 'facilityId', message: 'Facility ID is required.' });
        }
        if (!((_b = booking.farmerId) === null || _b === void 0 ? void 0 : _b.trim())) {
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
    };
    return CreateBookingValidator;
}());
var CreateBookingService = /** @class */ (function () {
    function CreateBookingService() {
    }
    CreateBookingService.getFacilityDetails = function (facilityId) {
        return __awaiter(this, void 0, void 0, function () {
            var facility, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.facility.findUnique({
                                where: { id: facilityId },
                                include: {
                                    operator: true,
                                },
                            })];
                    case 1:
                        facility = _a.sent();
                        return [2 /*return*/, facility];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching facility details:', error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateBookingService.farmerExists = function (farmerId) {
        return __awaiter(this, void 0, void 0, function () {
            var farmer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.farmer.findUnique({
                                where: { id: farmerId },
                            })];
                    case 1:
                        farmer = _a.sent();
                        return [2 /*return*/, farmer !== null];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error checking farmer existence:', error_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateBookingService.isFacilityAvailable = function (facilityId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var overlappingBookings, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    facilityId: facilityId,
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
                            })];
                    case 1:
                        overlappingBookings = _a.sent();
                        return [2 /*return*/, overlappingBookings.length === 0];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error checking facility availability:', error_3);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateBookingService.calculateBookingAmount = function (facilityCostPerDay, startDate, endDate) {
        var timeDifference = endDate.getTime() - startDate.getTime();
        var durationInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
        var numberOfDays = Math.max(durationInDays, 1); // Ensure at least 1 day
        return facilityCostPerDay * numberOfDays;
    };
    return CreateBookingService;
}());
exports.CreateBookingService = CreateBookingService;
// Booking Controller
var CreateBookingController = /** @class */ (function () {
    function CreateBookingController() {
    }
    CreateBookingController.createBooking = function (bookingData) {
        return __awaiter(this, void 0, void 0, function () {
            var validationErrors, facility, farmerExists, isAvailable, amount, newBooking, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        validationErrors = CreateBookingValidator.validate(bookingData);
                        if (validationErrors.length > 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: validationErrors
                                }];
                        }
                        return [4 /*yield*/, CreateBookingService.getFacilityDetails(bookingData.facilityId)];
                    case 1:
                        facility = _a.sent();
                        if (!facility) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Facility not found.',
                                    errors: [{ field: 'facilityId', message: 'Invalid or unavailable facility.' }]
                                }];
                        }
                        if (!facility.available) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Facility is not available for booking.',
                                    errors: [{ field: 'facilityId', message: 'Facility is currently unavailable.' }]
                                }];
                        }
                        return [4 /*yield*/, CreateBookingService.farmerExists(bookingData.farmerId)];
                    case 2:
                        farmerExists = _a.sent();
                        if (!farmerExists) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Farmer not found.',
                                    errors: [{ field: 'farmerId', message: 'Invalid farmer ID.' }]
                                }];
                        }
                        return [4 /*yield*/, CreateBookingService.isFacilityAvailable(bookingData.facilityId, bookingData.startDate, bookingData.endDate)];
                    case 3:
                        isAvailable = _a.sent();
                        if (!isAvailable) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Facility is not available for the selected dates.',
                                    errors: [{ field: 'dateRange', message: 'Facility is already booked for the selected dates.' }]
                                }];
                        }
                        amount = bookingData.amount || CreateBookingService.calculateBookingAmount(facility.cost, bookingData.startDate, bookingData.endDate);
                        return [4 /*yield*/, prisma.booking.create({
                                data: {
                                    facilityId: bookingData.facilityId,
                                    farmerId: bookingData.farmerId,
                                    amount: amount,
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
                            })];
                    case 4:
                        newBooking = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: newBooking,
                                message: 'Booking created successfully.'
                            }];
                    case 5:
                        error_4 = _a.sent();
                        if (error_4 instanceof Error) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'An error occurred while creating the booking.',
                                    errors: [{ field: 'general', message: error_4.message }]
                                }];
                        }
                        console.error('Error creating booking:', error_4);
                        return [2 /*return*/, {
                                success: false,
                                message: 'An unexpected error occurred.',
                                errors: [{ field: 'general', message: 'Unexpected error occurred.' }]
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method to handle booking creation
    CreateBookingController.handleCreateBooking = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.createBooking(formData)];
                    case 1:
                        result = _c.sent();
                        if (result.success) {
                            console.log(result.message);
                            console.log('Booking ID:', (_a = result.data) === null || _a === void 0 ? void 0 : _a.id);
                            console.log('Total Amount:', (_b = result.data) === null || _b === void 0 ? void 0 : _b.amount);
                        }
                        else {
                            console.error('Booking creation failed:', result.message);
                            if (result.errors) {
                                result.errors.forEach(function (error) {
                                    console.error("Error in field ".concat(error.field, ": ").concat(error.message));
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateBookingController;
}());
exports.CreateBookingController = CreateBookingController;
