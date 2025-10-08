import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide pet name'],
    trim: true
  },
  species: {
    type: String,
    required: [true, 'Please specify species'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  healthInfo: {
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    medicalHistory: String
  },
  temperament: [String],
  images: [{
    type: String,
    required: true
  }],
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  status: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedByAdmin: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
petSchema.index({ name: 'text', breed: 'text', description: 'text' });

export default mongoose.model('Pet', petSchema);
