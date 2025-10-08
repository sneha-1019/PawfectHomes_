import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  applicationDetails: {
    experience: String,
    homeType: {
      type: String,
      enum: ['House', 'Apartment', 'Farm', 'Other']
    },
    hasYard: Boolean,
    otherPets: String,
    employmentStatus: String,
    reasonForAdoption: String,
    phoneNumber: String
  },
  documents: [{
    type: String,
    url: String
  }],
  appointmentDate: Date,
  rejectionReason: String,
  adminNotes: String
}, {
  timestamps: true
});

export default mongoose.model('Adoption', adoptionSchema);
