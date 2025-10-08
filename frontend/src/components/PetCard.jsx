import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

const PetCard = ({ pet, onSave, isSaved }) => {
  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img src={pet.images[0]} alt={pet.name} />
        {onSave && (
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onSave(pet._id);
            }}
          >
            <FaHeart />
          </button>
        )}
        <span className={`status-badge ${pet.status.toLowerCase()}`}>
          {pet.status}
        </span>
      </div>
      <div className="pet-card-content">
        <h3>{pet.name}</h3>
        <p className="pet-breed">{pet.breed}</p>
        <div className="pet-info">
          <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
          <span>•</span>
          <span>{pet.gender}</span>
          <span>•</span>
          <span>{pet.size}</span>
        </div>
        {pet.location && (
          <div className="pet-location">
            <FaMapMarkerAlt />
            <span>{pet.location.city}, {pet.location.state}</span>
          </div>
        )}
        <Link to={`/pet/${pet._id}`} className="btn-view">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
