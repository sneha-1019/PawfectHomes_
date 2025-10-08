import express from 'express';
import {
  getAllAdoptions,
  updateAdoptionStatus,
  getAllUsers,
  getAllPets,
  verifyPet,
  toggleFeatured,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// All routes require authentication and admin access
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/adoptions', getAllAdoptions);
router.put('/adoptions/:id', updateAdoptionStatus);
router.get('/users', getAllUsers);
router.get('/pets', getAllPets);
router.put('/pets/:id/verify', verifyPet);
router.put('/pets/:id/feature', toggleFeatured);

export default router;
