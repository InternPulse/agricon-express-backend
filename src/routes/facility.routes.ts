import express from 'express';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isAuthorizedOperator, isFacilityOwner } from '../middlewares/authorization.middlewares';
import {  addFacility,getFacility, updateFacility, getAllFacility, removeFacility } from '../controllers/facility.controller';

const router = express.Router();

router.post('/', verifyAuth, facilityValidator, isAuthorizedOperator, addFacility);
router.get('/', verifyAuth, getAllFacility);
router.get('/:facilityId', verifyAuth,  getFacility);
router.put('/:facilityId', verifyAuth, isFacilityOwner, updateFacility);
router.delete('/:facilityId', verifyAuth, isFacilityOwner, removeFacility);
router.get('/get', getAllFacilitiesController);
router.get('/:operatorId', getFacilitiesByOperatorController);

export default router;