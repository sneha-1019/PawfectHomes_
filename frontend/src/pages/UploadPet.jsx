import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

const UploadPet = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    color: '',
    description: '',
    vaccinated: false,
    neutered: false,
    medicalHistory: '',
    temperament: [],
    city: '',
    state: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleTemperamentChange = (e) => {
    const traits = e.target.value.split(',').map(t => t.trim());
    setFormData({ ...formData, temperament: traits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const submitData = new FormData();
    images.forEach(image => {
      submitData.append('images', image);
    });

    submitData.append('name', formData.name);
    submitData.append('species', formData.species);
    submitData.append('breed', formData.breed);
    submitData.append('age', formData.age);
    submitData.append('gender', formData.gender);
    submitData.append('size', formData.size);
    submitData.append('color', formData.color);
    submitData.append('description', formData.description);
    submitData.append('healthInfo', JSON.stringify({
      vaccinated: formData.vaccinated,
      neutered: formData.neutered,
      medicalHistory: formData.medicalHistory
    }));
    submitData.append('temperament', JSON.stringify(formData.temperament));
    submitData.append('location', JSON.stringify({
      city: formData.city,
      state: formData.state
    }));

    try {
      await API.post('/pets', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Pet uploaded successfully! Pending admin verification.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading pet');
    }
  };

  return (
    <div className="upload-pet-page">
      <div className="upload-container">
        <h1>Upload Pet for Adoption</h1>
        <p>Fill in the details about the pet you want to list for adoption</p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label>Pet Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Species *</label>
              <select name="species" value={formData.species} onChange={handleChange} required>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Breed *</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Age (years) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Size *</label>
              <select name="size" value={formData.size} onChange={handleChange} required>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Color *</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Temperament (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Friendly, Playful, Calm"
              onChange={handleTemperamentChange}
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="vaccinated"
                checked={formData.vaccinated}
                onChange={handleChange}
              />
              Vaccinated
            </label>
            <label>
              <input
                type="checkbox"
                name="neutered"
                checked={formData.neutered}
                onChange={handleChange}
              />
              Neutered/Spayed
            </label>
          </div>

          <div className="form-group">
            <label>Medical History</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pet Images * (Max 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            <small>Upload clear photos of the pet</small>
          </div>

          <button type="submit" className="btn-primary btn-submit">
            Upload Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPet;
