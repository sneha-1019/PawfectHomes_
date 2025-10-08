import express from 'express';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  toggleSavePet,
  getFeaturedPets
} from '../controllers/petController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPets);
router.get('/featured', getFeaturedPets);
router.get('/:id', getPetById);
router.post('/', protect, createPet);
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);
router.post('/:id/save', protect, toggleSavePet);

export default router;
