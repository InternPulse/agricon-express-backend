import express from 'express';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isAuthorizedToCreateFacility, isFacilityOwner } from '../middlewares/authorization.middlewares';
import {  addFacility,getFacility, updateFacility, getAllFacility, removeFacility, updateCapacityController ,  uploadFacilityImage, deleteFacilityImage, getFacilitiesByOperatorController } from '../controllers/facility.controller';
import { upload } from '../config/config.cloudinary';

const router = express.Router();

router.post('/', verifyAuth, facilityValidator, isAuthorizedToCreateFacility, addFacility);
router.get('/:operatorId/all', verifyAuth, getFacilitiesByOperatorController);
router.post('/:facilityId/image', verifyAuth, isFacilityOwner, upload.single('image'), uploadFacilityImage); 
router.get('/', verifyAuth, getAllFacility);
// router.post('/:facilityId/upload-image', verifyAuth, isFacilityOwner, upload.single('image'), uploadFacilityImage); 
router.get('/:facilityId', verifyAuth,  getFacility);
router.put('/:facilityId', verifyAuth, isFacilityOwner, updateFacility);
router.delete('/:facilityId', verifyAuth, isFacilityOwner, removeFacility);
router.delete('/:facilityId/image', verifyAuth, isFacilityOwner, deleteFacilityImage)
router.patch('/capacity/:facilityId', verifyAuth, updateCapacityController);

export default router;