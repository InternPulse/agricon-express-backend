import { body } from "express-validator";

export const facilityValidator = [
  body("operatorId")
    .notEmpty().withMessage("Operator ID is required"),

  body("name")
    .isString().withMessage("Name must be a string")
    .notEmpty().withMessage("Name is required"),

  body("location")
    .isString().withMessage("Location must be a string")
    .notEmpty().withMessage("Location is required"),

  body("pricePerDay")
    .isFloat({ gt: 0 }).withMessage("Price per day must be a positive number")
    .notEmpty().withMessage("Price per day is required"),

  body("type")
    .isIn(["DRYER", "STORAGE", "PROCESSING", "OTHERS"])
    .withMessage("Type must be a valid FacilityType"),

  body("available")
    .isBoolean().withMessage("Available must be a boolean")
    .notEmpty().withMessage("Available is required"),

  body("contact")
    .isString().withMessage("Contact must be a string"),

  body("description")
    .isString().withMessage("Description must be a string"),

  body("capacity")
    .isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
];
