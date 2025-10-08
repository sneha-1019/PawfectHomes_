import Adoption from '../models/Adoption.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { sendAdoptionNotification } from '../utils/email.js';

// @desc    Create adoption application
// @route   POST /api/adoption
// @access  Private
export const createAdoption = async (req, res) => {
  try {
    const { petId, applicationDetails, appointmentDate } = req.body;

    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    if (pet.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Pet is not available for adoption' });
    }

    // Check if user already applied for this pet
    const existingApplication = await Adoption.findOne({
      pet: petId,
      adopter: req.user.id,
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You already have an active application for this pet' });
    }

    // Create adoption application
    const adoption = await Adoption.create({
      pet: petId,
      adopter: req.user.id,
      applicationDetails,
      appointmentDate
    });

    // Update pet status to Pending
    pet.status = 'Pending';
    await pet.save();

    res.status(201).json({
      success: true,
      message: 'Adoption application submitted successfully',
      adoption
    });
  } catch (error) {
    console.error('Create adoption error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's adoption applications
// @route   GET /api/adoption/my-applications
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Adoption.find({ adopter: req.user.id })
      .populate('pet')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single adoption application
// @route   GET /api/adoption/:id
// @access  Private
export const getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet')
      .populate('adopter', 'name email avatar');

    if (!adoption) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check if user is the adopter or admin
    if (adoption.adopter._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, adoption });
  } catch (error) {
    console.error('Get adoption error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel adoption application
// @route   DELETE /api/adoption/:id
// @access  Private
export const cancelAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check if user is the adopter
    if (adoption.adopter.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update pet status back to Available
    await Pet.findByIdAndUpdate(adoption.pet, { status: 'Available' });

    await adoption.deleteOne();

    res.status(200).json({ success: true, message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('Cancel adoption error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
