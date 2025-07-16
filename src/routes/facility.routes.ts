import express from 'express';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isAuthorizedOperator, isFacilityOwner } from '../middlewares/authorization.middlewares';
import { addFacility, getFacility, updateFacility, getAllFacility, deleteFacility, updateCapacity , deleteFacilityImage, getFacilitiesByOperatorController } from '../controllers/facility.controller';
import { upload } from '../config/config.cloudinary';
import { uploadFacilityImage } from '../controllers/cloudinary.controller';

const router = express.Router();

//Ideally facilityId should be id
router.post('/', verifyAuth, facilityValidator, isAuthorizedOperator, addFacility);
router.get('/', verifyAuth, getAllFacility); 
router.get('/:operatorId/all', verifyAuth, getFacilitiesByOperatorController);
router.post('/images', verifyAuth, upload.array('images', 5), uploadFacilityImage); 
router.get('/:facilityId', verifyAuth,  getFacility);
router.put('/:facilityId', verifyAuth, isFacilityOwner, updateFacility);
router.delete('/:facilityId', verifyAuth, isFacilityOwner, deleteFacility);
router.delete('/:facilityId/image', verifyAuth, isFacilityOwner, deleteFacilityImage)
router.patch('/capacity/:facilityId', verifyAuth, updateCapacity);

export default router;