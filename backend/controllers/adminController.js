import Pet from '../models/Pet.js';
import User from '../models/User.js';
import Adoption from '../models/Adoption.js';
import { sendAdoptionNotification } from '../utils/email.js';

// @desc    Get all adoption applications (Admin)
// @route   GET /api/admin/adoptions
// @access  Private/Admin
export const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate('pet')
      .populate('adopter', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, adoptions });
  } catch (error) {
    console.error('Get all adoptions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update adoption status (Admin)
// @route   PUT /api/admin/adoptions/:id
// @access  Private/Admin
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason } = req.body;

    const adoption = await Adoption.findById(req.params.id)
      .populate('pet')
      .populate('adopter');

    if (!adoption) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    adoption.status = status;
    adoption.adminNotes = adminNotes;
    if (status === 'Rejected') {
      adoption.rejectionReason = rejectionReason;
    }
    await adoption.save();

    // Update pet status
    if (status === 'Approved') {
      await Pet.findByIdAndUpdate(adoption.pet._id, { status: 'Adopted' });
    } else if (status === 'Rejected') {
      await Pet.findByIdAndUpdate(adoption.pet._id, { status: 'Available' });
    }

    // Send notification email
    await sendAdoptionNotification(adoption.adopter.email, adoption.pet.name, status);

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      adoption
    });
  } catch (error) {
    console.error('Update adoption status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all pets including unverified (Admin)
// @route   GET /api/admin/pets
// @access  Private/Admin
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: pets.length, pets });
  } catch (error) {
    console.error('Get all pets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Verify pet listing (Admin)
// @route   PUT /api/admin/pets/:id/verify
// @access  Private/Admin
export const verifyPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    pet.verifiedByAdmin = true;
    await pet.save();

    res.status(200).json({ success: true, message: 'Pet verified successfully', pet });
  } catch (error) {
    console.error('Verify pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle featured status (Admin)
// @route   PUT /api/admin/pets/:id/feature
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    pet.featured = !pet.featured;
    await pet.save();

    res.status(200).json({
      success: true,
      message: pet.featured ? 'Pet featured' : 'Pet unfeatured',
      pet
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalPets = await Pet.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAdoptions = await Adoption.countDocuments();
    const pendingAdoptions = await Adoption.countDocuments({ status: 'Pending' });
    const approvedAdoptions = await Adoption.countDocuments({ status: 'Approved' });
    const completedAdoptions = await Adoption.countDocuments({ status: 'Completed' });
    const unverifiedPets = await Pet.countDocuments({ verifiedByAdmin: false });

    // Get recent adoptions
    const recentAdoptions = await Adoption.find()
      .populate('pet', 'name species')
      .populate('adopter', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalPets,
        totalUsers,
        totalAdoptions,
        pendingAdoptions,
        approvedAdoptions,
        completedAdoptions,
        unverifiedPets,
        recentAdoptions
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
