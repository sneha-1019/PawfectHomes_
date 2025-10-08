import Pet from '../models/Pet.js';
import User from '../models/User.js';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all pets (with filters and search)
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res) => {
  try {
    const { search, species, gender, size, status, sort } = req.query;
    
    // Build query
    let query = { verifiedByAdmin: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (species && species !== 'All') {
      query.species = species;
    }

    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    if (size && size !== 'All') {
      query.size = size;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else if (sort === 'popular') {
      sortOption = { views: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const pets = await Pet.find(query)
      .sort(sortOption)
      .populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      count: pets.length,
      pets
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('uploadedBy', 'name email avatar');

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Increment views
    pet.views += 1;
    await pet.save();

    res.status(200).json({ success: true, pet });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload new pet (requires authentication)
// @route   POST /api/pets
// @access  Private
export const createPet = async (req, res) => {
  try {
    const {
      name, species, breed, age, gender, size, color,
      description, healthInfo, temperament, location
    } = req.body;

    // Handle image uploads
    let imageUrls = [];
    
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
          folder: 'pawfect-home/pets',
          width: 800,
          crop: 'scale'
        });
        imageUrls.push(result.secure_url);
      }
    }

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      description,
      healthInfo: JSON.parse(healthInfo),
      temperament: JSON.parse(temperament),
      location: JSON.parse(location),
      images: imageUrls,
      uploadedBy: req.user.id,
      verifiedByAdmin: req.user.isAdmin || req.user.email === process.env.ADMIN_EMAIL
    });

    // Add to user's uploads
    await User.findByIdAndUpdate(req.user.id, {
      $push: { myUploads: pet._id }
    });

    res.status(201).json({ success: true, pet });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating pet' });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Owner or Admin)
export const updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Check if user is owner or admin
    if (pet.uploadedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, pet });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Owner or Admin)
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Check if user is owner or admin
    if (pet.uploadedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await pet.deleteOne();

    res.status(200).json({ success: true, message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Save/Unsave pet
// @route   POST /api/pets/:id/save
// @access  Private
export const toggleSavePet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const petId = req.params.id;

    const isSaved = user.savedPets.includes(petId);

    if (isSaved) {
      user.savedPets = user.savedPets.filter(id => id.toString() !== petId);
    } else {
      user.savedPets.push(petId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      message: isSaved ? 'Pet removed from saved' : 'Pet saved successfully'
    });
  } catch (error) {
    console.error('Toggle save pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured pets
// @route   GET /api/pets/featured
// @access  Public
export const getFeaturedPets = async (req, res) => {
  try {
    const pets = await Pet.find({ featured: true, verifiedByAdmin: true, status: 'Available' })
      .limit(6)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, pets });
  } catch (error) {
    console.error('Get featured pets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
