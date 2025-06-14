export var UserRole;
(function (UserRole) {
    UserRole[UserRole["FARMER"] = 0] = "FARMER";
    UserRole[UserRole["INFRA_OWNER"] = 1] = "INFRA_OWNER";
    UserRole[UserRole["ADMIN"] = 2] = "ADMIN";
})(UserRole || (UserRole = {}));
export var FacilityType;
(function (FacilityType) {
    FacilityType[FacilityType["DRYER"] = 0] = "DRYER";
    FacilityType[FacilityType["STORAGE"] = 1] = "STORAGE";
    FacilityType[FacilityType["PROCESSING"] = 2] = "PROCESSING";
    FacilityType[FacilityType["OTHER"] = 3] = "OTHER";
})(FacilityType || (FacilityType = {}));
export var TransactionReason;
(function (TransactionReason) {
    TransactionReason[TransactionReason["BOOKING"] = 0] = "BOOKING";
    TransactionReason[TransactionReason["EXTENSION"] = 1] = "EXTENSION";
    TransactionReason[TransactionReason["PENALTY"] = 2] = "PENALTY";
    TransactionReason[TransactionReason["OTHER"] = 3] = "OTHER";
})(TransactionReason || (TransactionReason = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["PENDING"] = 0] = "PENDING";
    TransactionStatus[TransactionStatus["COMPLETED"] = 1] = "COMPLETED";
    TransactionStatus[TransactionStatus["FAILED"] = 2] = "FAILED";
    TransactionStatus[TransactionStatus["REFUNDED"] = 3] = "REFUNDED";
})(TransactionStatus || (TransactionStatus = {}));
