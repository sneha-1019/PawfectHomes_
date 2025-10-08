import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PetCard from '../components/PetCard';
import toast from 'react-hot-toast';
import { FaHeart, FaClipboardList, FaUpload, FaCalendar } from 'react-icons/fa';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [savedPets, setSavedPets] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [savedRes, applicationsRes] = await Promise.all([
        API.get('/auth/me'),
        API.get('/adoption/my-applications')
      ]);
      setSavedPets(savedRes.data.user.savedPets || []);
      setMyApplications(applicationsRes.data.applications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsavePet = async (petId) => {
    try {
      await API.post(`/pets/${petId}/save`);
      setSavedPets(savedPets.filter(pet => pet._id !== petId));
      toast.success('Pet removed from saved');
    } catch (error) {
      toast.error('Error removing pet');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your pet adoption journey</p>
        </div>
        <img src={user?.avatar} alt={user?.name} className="user-avatar" />
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaHeart className="stat-icon" />
          <div>
            <h3>{savedPets.length}</h3>
            <p>Saved Pets</p>
          </div>
        </div>
        <div className="stat-card">
          <FaClipboardList className="stat-icon" />
          <div>
            <h3>{myApplications.length}</h3>
            <p>Applications</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/upload-pet" className="action-card">
          <FaUpload />
          <h3>Upload Pet</h3>
          <p>List a pet for adoption</p>
        </Link>
        <Link to="/applications" className="action-card">
          <FaClipboardList />
          <h3>My Applications</h3>
          <p>Track adoption status</p>
        </Link>
        <Link to="/explore" className="action-card">
          <FaCalendar />
          <h3>Browse Pets</h3>
          <p>Find your companion</p>
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Saved Pets</h2>
        {savedPets.length === 0 ? (
          <div className="empty-state">
            <p>No saved pets yet. Start exploring!</p>
            <Link to="/explore" className="btn-primary">Browse Pets</Link>
          </div>
        ) : (
          <div className="pets-grid">
            {savedPets.map(pet => (
              <PetCard
                key={pet._id}
                pet={pet}
                onSave={handleUnsavePet}
                isSaved={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Applications</h2>
        {myApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet</p>
          </div>
        ) : (
          <div className="applications-list">
            {myApplications.slice(0, 3).map(app => (
              <div key={app._id} className="application-item">
                <img src={app.pet?.images[0]} alt={app.pet?.name} />
                <div className="application-info">
                  <h4>{app.pet?.name}</h4>
                  <p>Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
        {myApplications.length > 3 && (
          <Link to="/applications" className="btn-secondary">View All Applications</Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
