import express from 'express';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import {  addFacility,getFacility, updateFacility, getAllFacility, removeFacility, updateFacilityCapacity } from '../controllers/facility.controller';
import { isAuthorizedOperator, isFacilityOwner } from '../middlewares/authorization.middlewares';


const router = express.Router();

router.post('/', verifyAuth, facilityValidator, isAuthorizedOperator, addFacility);
router.get('/', verifyAuth, getAllFacility);
router.get('/:facilityId', verifyAuth,  getFacility);
router.put('/:facilityId', verifyAuth, isFacilityOwner, updateFacility);
router.delete('/:facilityId', verifyAuth, isFacilityOwner, removeFacility);
router.get('/capacity', verifyAuth, updateFacilityCapacity);

export default router;