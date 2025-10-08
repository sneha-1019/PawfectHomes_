import express from 'express';
import {
  createAdoption,
  getMyApplications,
  getAdoptionById,
  cancelAdoption
} from '../controllers/adoptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createAdoption);
router.get('/my-applications', protect, getMyApplications);
router.get('/:id', protect, getAdoptionById);
router.delete('/:id', protect, cancelAdoption);

export default router;
