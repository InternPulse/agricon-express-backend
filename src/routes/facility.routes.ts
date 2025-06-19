import express from 'express';
import { addFacility,getFacility, updateFacility, getAllFacility, removeFacility } from '../controllers/facility.controller';
import { validateRequest } from '../middlewares/validator.middleware';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isFacilityOwner } from '../middlewares/authorization.middlewares';

const router = express.Router();

router.post('/', verifyAuth, facilityValidator, validateRequest, addFacility);
router.get('/:facilityId', verifyAuth, getFacility);
router.get('/', verifyAuth, getAllFacility);
router.put('/update/:facilityId', verifyAuth, isFacilityOwner, updateFacility);
router.delete('/delete/:facilityId', removeFacility);

export default router;