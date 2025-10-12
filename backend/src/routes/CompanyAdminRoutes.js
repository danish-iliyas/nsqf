import express from 'express';
import {
    createCompanyAdmin,
    loginCompanyAdmin,
    createState,
    createDistrict,
    createBlock,
    getStatesByCompany,
    getDistrictsByCompany,
    getBlocksByCompany,
    registerStateCoordinator,
    assignToCoordinator,
    coordinatorLogin,
    getManagedTrainers,
    getAllByCompany,
    assignStatesToCoordinator
} from '../controllers/companyAdminController.js';
import { protectCompanyAdmin , } from '../middleware/authenticationMiddleware.js';
import { isCoordinator, protect } from '../middleware/coordinatorAuth.js';


const router = express.Router();

// --- Auth Routes ---
router.post('/', createCompanyAdmin);
router.post('/login', loginCompanyAdmin);

// --- Location Management Routes ---
// These routes would ideally be protected by middleware to ensure the user is an authenticated CompanyAdmin
router.post('/states',protectCompanyAdmin, createState);
router.post('/districts',protectCompanyAdmin, createDistrict);
router.post('/blocks',protectCompanyAdmin, createBlock);
router.get('/getStates',protectCompanyAdmin, getStatesByCompany);
router.get('/getDistricts',protectCompanyAdmin, getDistrictsByCompany);
router.get('/getBlocks',protectCompanyAdmin, getBlocksByCompany);
router.get('/getAllDetaileByCompany',protectCompanyAdmin, getAllByCompany);
// --- State Coordinator Management Routes ---
router.post('/registerStateCoordinator', protectCompanyAdmin, registerStateCoordinator);
router.post('/coordinatorLogin', coordinatorLogin);
// router.put('/assignCoordinatorToMultipleTrainers', protectCompanyAdmin, assignToCoordinator);
router.put('/coordinators/:coordinatorId/assign-states', assignStatesToCoordinator);
router.post('/assignTrainerToCoordinator', protectCompanyAdmin, assignToCoordinator);
router.get('/getManagedTrainers', protect,  getManagedTrainers);




export default router;
