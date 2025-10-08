import { useEffect, useState } from 'react';
import API from '../utils/api';
import PetCard from '../components/PetCard';
import FilterBar from '../components/FilterBar';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/pets.css';

const ExplorePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    species: 'All',
    gender: 'All',
    size: 'All',
    sort: 'newest'
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.species !== 'All') params.append('species', filters.species);
      if (filters.gender !== 'All') params.append('gender', filters.gender);
      if (filters.size !== 'All') params.append('size', filters.size);
      params.append('sort', filters.sort);

      const res = await API.get(`/pets?${params.toString()}`);
      setPets(res.data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Error loading pets');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePet = async (petId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save pets');
      return;
    }
    try {
      const res = await API.post(`/pets/${petId}/save`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving pet');
    }
  };

  return (
    <div className="explore-page">
      <div className="page-header">
        <h1>Explore Pets</h1>
        <p>Find your perfect companion from our available pets</p>
      </div>

      <FilterBar 
        filters={filters} 
        setFilters={setFilters}
        onSearch={fetchPets}
      />

      {loading ? (
        <div className="loader">Loading pets...</div>
      ) : pets.length === 0 ? (
        <div className="no-results">
          <h3>No pets found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            Found {pets.length} {pets.length === 1 ? 'pet' : 'pets'}
          </div>
          <div className="pets-grid">
            {pets.map(pet => (
              <PetCard
                key={pet._id}
                pet={pet}
                onSave={isAuthenticated ? handleSavePet : null}
                isSaved={user?.savedPets?.includes(pet._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExplorePets;
