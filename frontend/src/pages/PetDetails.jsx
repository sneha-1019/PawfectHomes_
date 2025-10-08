import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaHeart, FaMapMarkerAlt, FaCalendar, FaVenusMars, FaRulerVertical, FaPaw, FaCheckCircle } from 'react-icons/fa';
import '../styles/pets.css';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    experience: '',
    homeType: 'House',
    hasYard: false,
    otherPets: '',
    employmentStatus: '',
    reasonForAdoption: '',
    phoneNumber: '',
    appointmentDate: ''
  });

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const res = await API.get(`/pets/${id}`);
      setPet(res.data.pet);
    } catch (error) {
      console.error('Error fetching pet:', error);
      toast.error('Pet not found');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to adopt');
      navigate('/auth');
      return;
    }

    try {
      await API.post('/adoption', {
        petId: id,
        applicationDetails: applicationData,
        appointmentDate: applicationData.appointmentDate
      });
      toast.success('Adoption application submitted successfully!');
      setShowAdoptModal(false);
      navigate('/applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting application');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="pet-details-page">
      <div className="pet-details-container">
        <div className="pet-images">
          <div className="main-image">
            <img src={pet.images[0]} alt={pet.name} />
          </div>
          {pet.images.length > 1 && (
            <div className="thumbnail-images">
              {pet.images.slice(1).map((img, idx) => (
                <img key={idx} src={img} alt={`${pet.name} ${idx + 2}`} />
              ))}
            </div>
          )}
        </div>

        <div className="pet-info-section">
          <div className="pet-header">
            <h1>{pet.name}</h1>
            <span className={`status-badge ${pet.status.toLowerCase()}`}>
              {pet.status}
            </span>
          </div>

          <div className="pet-meta">
            <div className="meta-item">
              <FaPaw />
              <span>{pet.breed}</span>
            </div>
            <div className="meta-item">
              <FaCalendar />
              <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
            </div>
            <div className="meta-item">
              <FaVenusMars />
              <span>{pet.gender}</span>
            </div>
            <div className="meta-item">
              <FaRulerVertical />
              <span>{pet.size}</span>
            </div>
            {pet.location && (
              <div className="meta-item">
                <FaMapMarkerAlt />
                <span>{pet.location.city}, {pet.location.state}</span>
              </div>
            )}
          </div>

          <div className="pet-description">
            <h3>About {pet.name}</h3>
            <p>{pet.description}</p>
          </div>

          <div className="pet-health">
            <h3>Health Information</h3>
            <div className="health-badges">
              {pet.healthInfo.vaccinated && (
                <span className="health-badge">
                  <FaCheckCircle /> Vaccinated
                </span>
              )}
              {pet.healthInfo.neutered && (
                <span className="health-badge">
                  <FaCheckCircle /> Neutered/Spayed
                </span>
              )}
            </div>
            {pet.healthInfo.medicalHistory && (
              <p>{pet.healthInfo.medicalHistory}</p>
            )}
          </div>

          {pet.temperament && pet.temperament.length > 0 && (
            <div className="pet-temperament">
              <h3>Temperament</h3>
              <div className="temperament-tags">
                {pet.temperament.map((trait, idx) => (
                  <span key={idx} className="tag">{trait}</span>
                ))}
              </div>
            </div>
          )}

          {pet.status === 'Available' && (
            <button 
              className="btn-adopt"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please login to adopt');
                  navigate('/auth');
                } else {
                  setShowAdoptModal(true);
                }
              }}
            >
              Apply to Adopt {pet.name}
            </button>
          )}
        </div>
      </div>

      {/* Adoption Modal */}
      {showAdoptModal && (
        <div className="modal-overlay" onClick={() => setShowAdoptModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Adoption Application for {pet.name}</h2>
            <form onSubmit={handleAdoptionSubmit}>
              <div className="form-group">
                <label>Pet Ownership Experience</label>
                <textarea
                  required
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                  placeholder="Tell us about your experience with pets"
                />
              </div>

              <div className="form-group">
                <label>Home Type</label>
                <select
                  value={applicationData.homeType}
                  onChange={(e) => setApplicationData({...applicationData, homeType: e.target.value})}
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Farm">Farm</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="hasYard"
                  checked={applicationData.hasYard}
                  onChange={(e) => setApplicationData({...applicationData, hasYard: e.target.checked})}
                />
                <label htmlFor="hasYard">I have a yard</label>
              </div>

              <div className="form-group">
                <label>Other Pets</label>
                <input
                  type="text"
                  value={applicationData.otherPets}
                  onChange={(e) => setApplicationData({...applicationData, otherPets: e.target.value})}
                  placeholder="Do you have other pets?"
                />
              </div>

              <div className="form-group">
                <label>Employment Status</label>
                <input
                  type="text"
                  required
                  value={applicationData.employmentStatus}
                  onChange={(e) => setApplicationData({...applicationData, employmentStatus: e.target.value})}
                  placeholder="Your employment status"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={applicationData.phoneNumber}
                  onChange={(e) => setApplicationData({...applicationData, phoneNumber: e.target.value})}
                  placeholder="Your contact number"
                />
              </div>

              <div className="form-group">
                <label>Reason for Adoption</label>
                <textarea
                  required
                  value={applicationData.reasonForAdoption}
                  onChange={(e) => setApplicationData({...applicationData, reasonForAdoption: e.target.value})}
                  placeholder="Why do you want to adopt this pet?"
                />
              </div>

              <div className="form-group">
                <label>Preferred Visit Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={applicationData.appointmentDate}
                  onChange={(e) => setApplicationData({...applicationData, appointmentDate: e.target.value})}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowAdoptModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
