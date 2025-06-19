import express from 'express';
import { addFacility,getFacility, updateFacility, getAllFacility, removeFacility, getAllFacilitiesController, getFacilitiesByOperatorController } from '../controllers/facility.controller';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isFacilityOwner, isOperator } from '../middlewares/authorization.middlewares';

const router = express.Router();

router.post('/', verifyAuth, facilityValidator, isOperator, addFacility);
router.get('/:facilityId', verifyAuth, getFacility);
router.get('/', verifyAuth, getAllFacility);
router.put('/:facilityId', verifyAuth, isFacilityOwner, updateFacility);
router.delete('/:facilityId', removeFacility);
router.get("/get",verifyAuth, getAllFacilitiesController)
router.get("/:operatorId", verifyAuth, getFacilitiesByOperatorController)

export default router;