import express from 'express';
import { addFacility, getFacility, updateFacility } from '../controllers/facility.controller';
import { isFacilityOwner } from '../middlewares/authorization.middlewares';

const router = express.Router();

router.post('/facility', addFacility);
router.get('/:facilityId', isFacilityOwner, getFacility)
router.put('/:facilityId', isFacilityOwner, updateFacility)

export default router;