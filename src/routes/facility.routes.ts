import express from 'express';
import { facilityValidator } from '../utils/validateFacility';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { isAuthorizedOperator, isOperator, isFacilityOwner } from '../middlewares/authorization.middlewares';
import { addFacility, getFacility, updateFacility, getAllFacilityByFiltering, deleteFacility, updateCapacity , deleteFacilityImage, getFacilitiesByOperatorController, globalFacilitySearch } from '../controllers/facility.controller';
import { upload } from '../config/config.cloudinary';
import { uploadFacilityImage } from '../controllers/cloudinary.controller';

const router = express.Router();

//Ideally facilityId should be id
router.post('/', verifyAuth, facilityValidator, addFacility);
router.get('/', verifyAuth,  getAllFacilityByFiltering);  //Allows filtering and no filtering 
router.get('/search', verifyAuth, globalFacilitySearch)
router.get('/all', verifyAuth, isAuthorizedOperator, getFacilitiesByOperatorController);
router.post('/images', verifyAuth, isOperator, upload.array('images', 5), uploadFacilityImage); 

router.get('/:facilityId', verifyAuth, getFacility);
router.put('/:facilityId', verifyAuth, isAuthorizedOperator, isFacilityOwner, updateFacility);
router.delete('/:facilityId', verifyAuth, isAuthorizedOperator, isFacilityOwner, deleteFacility);
router.delete('/:facilityId/image', verifyAuth, isAuthorizedOperator, isFacilityOwner, deleteFacilityImage);
router.patch('/capacity/:facilityId', verifyAuth, updateCapacity);

export default router;