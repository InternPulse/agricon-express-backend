import express from 'express';
import { 
  getFacility, 
  updateFacility, 
  deleteFacility, 
  getFacilityStatus 
} from '../controllers/facility.controller';
import { isFacilityOwner } from '../middlewares/authorization.middlewares';

const router = express.Router();

// Existing routes
router.get('/:facilityId', isFacilityOwner, getFacility)
router.put('/:facilityId', isFacilityOwner, updateFacility)

// NEW: Your assigned routes
router.delete('/:facilityId', isFacilityOwner, deleteFacility)
router.get('/:facilityId/status', isFacilityOwner, getFacilityStatus)

export default router;