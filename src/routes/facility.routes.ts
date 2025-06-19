import express from 'express';
import { getFacility, updateFacility } from '../controllers/facility.controller';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isFacilityOwner } from '../middlewares/authorization.middlewares';

const router = express.Router();

router.get('/:facilityId', verifyAuth, getFacility)
router.put('/:facilityId', verifyAuth, isFacilityOwner, updateFacility)

export default router;