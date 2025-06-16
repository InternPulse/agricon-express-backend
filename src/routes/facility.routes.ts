import express from 'express';
import { getFacility, updateFacility } from '../controllers/facility.controller';
import { isFacilityOwner } from '../middlewares/authorization.middlewares';

const router = express.Router();

router.get('/:facilityId', isFacilityOwner, getFacility)
router.put('/:facilityId', isFacilityOwner, updateFacility)

export default router;