import { useEffect, useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FaUsers, FaPaw, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';
import Pagination from '../components/Pagination'; // New component
import AdoptionUpdateModal from '../components/AdoptionUpdateModal'; // New component
import '../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // State for pagination
  const [currentPetPage, setCurrentPetPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const itemsPerPage = 10;

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, petsRes, adoptionsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/pets'),
        API.get('/admin/adoptions'),
        API.get('/admin/users')
      ]);
      setStats(statsRes.data.stats);
      setPets(petsRes.data.pets);
      setAdoptions(adoptionsRes.data.adoptions);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Error loading admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPet = async (petId) => {
    try {
      await API.put(`/admin/pets/${petId}/verify`);
      setPets(pets.map(pet => 
        pet._id === petId ? { ...pet, verifiedByAdmin: true } : pet
      ));
      toast.success('Pet verified successfully');
    } catch (error) {
      toast.error('Error verifying pet');
    }
  };
  
  const handleToggleFeatured = async (petId) => {
    try {
      const res = await API.put(`/admin/pets/${petId}/feature`);
      setPets(pets.map(pet => 
        pet._id === petId ? { ...pet, featured: res.data.pet.featured } : pet
      ));
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Error updating featured status');
    }
  };

  const handleOpenAdoptionModal = (adoption) => {
    setSelectedAdoption(adoption);
    setIsModalOpen(true);
  };

  const handleUpdateAdoption = async ({ status, adminNotes, rejectionReason }) => {
    try {
      await API.put(`/admin/adoptions/${selectedAdoption._id}`, {
        status,
        adminNotes,
        rejectionReason
      });
      // Refresh data to reflect changes accurately
      await fetchAdminData(); 
      toast.success(`Application ${status.toLowerCase()} successfully`);
      setIsModalOpen(false);
      setSelectedAdoption(null);
    } catch (error) {
      toast.error('Error updating application');
    }
  };
  
  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) return;
    try {
      await API.delete(`/pets/${petId}`);
      setPets(pets.filter(pet => pet._id !== petId));
      toast.success('Pet deleted successfully');
    } catch (error) {
      toast.error('Error deleting pet');
    }
  };
  
  // Pagination logic
  const paginatedPets = pets.slice((currentPetPage - 1) * itemsPerPage, currentPetPage * itemsPerPage);
  const paginatedUsers = users.slice((currentUserPage - 1) * itemsPerPage, currentUserPage * itemsPerPage);

  if (loading) return <div className="loader">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage pets, applications, and users</p>
      </div>

      {/* Stats Overview */}
      {activeTab === 'overview' && (
        <>
          <div className="admin-stats">
            <div className="stat-card"><FaPaw className="stat-icon" /><div><h3>{stats?.totalPets}</h3><p>Total Pets</p></div></div>
            <div className="stat-card"><FaUsers className="stat-icon" /><div><h3>{stats?.totalUsers}</h3><p>Total Users</p></div></div>
            <div className="stat-card"><FaClipboardList className="stat-icon" /><div><h3>{stats?.totalAdoptions}</h3><p>Total Applications</p></div></div>
            <div className="stat-card"><FaClock className="stat-icon" /><div><h3>{stats?.pendingAdoptions}</h3><p>Pending</p></div></div>
            <div className="stat-card"><FaCheckCircle className="stat-icon" /><div><h3>{stats?.completedAdoptions}</h3><p>Completed</p></div></div>
            <div className="stat-card warning"><FaClock className="stat-icon" /><div><h3>{stats?.unverifiedPets}</h3><p>Unverified Pets</p></div></div>
          </div>

          <div className="admin-section">
            <h2>Recent Adoption Applications</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead><tr><th>Pet</th><th>Adopter</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {stats?.recentAdoptions?.map(app => (
                    <tr key={app._id}>
                      <td>{app.pet?.name}</td>
                      <td>{app.adopter?.name}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td><span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'pets' ? 'active' : ''} onClick={() => setActiveTab('pets')}>Pets ({pets.length})</button>
        <button className={activeTab === 'adoptions' ? 'active' : ''} onClick={() => setActiveTab('adoptions')}>Applications ({adoptions.length})</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users ({users.length})</button>
      </div>

      {/* Pets Management */}
      {activeTab === 'pets' && (
        <div className="admin-section">
          <h2>Manage Pets</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Species</th><th>Uploaded By</th><th>Status</th><th>Verified</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {paginatedPets.map(pet => (
                  <tr key={pet._id}>
                    <td><img src={pet.images[0]} alt={pet.name} className="table-img" /></td>
                    <td>{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.uploadedBy?.name}</td>
                    <td><span className={`badge ${pet.status.toLowerCase()}`}>{pet.status}</span></td>
                    <td>{pet.verifiedByAdmin ? <span className="badge approved">Yes</span> : <span className="badge pending">No</span>}</td>
                    <td>{pet.featured ? <span className="badge featured">Yes</span> : <span className="badge">No</span>}</td>
                    <td>
                      <div className="action-buttons">
                        {!pet.verifiedByAdmin && <button className="btn-sm btn-success" onClick={() => handleVerifyPet(pet._id)}>Verify</button>}
                        <button className="btn-sm btn-info" onClick={() => handleToggleFeatured(pet._id)}>{pet.featured ? 'Unfeature' : 'Feature'}</button>
                        <button className="btn-sm btn-danger" onClick={() => handleDeletePet(pet._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPetPage} totalPages={Math.ceil(pets.length / itemsPerPage)} onPageChange={setCurrentPetPage} />
        </div>
      )}

      {/* Adoptions Management */}
      {activeTab === 'adoptions' && (
        <div className="admin-section">
          <h2>Manage Adoption Applications</h2>
          <div className="adoptions-grid">
            {adoptions.map(app => (
              <div key={app._id} className="adoption-card">
                <div className="adoption-header">
                  <img src={app.pet?.images[0]} alt={app.pet?.name} />
                  <div>
                    <h3>{app.pet?.name}</h3>
                    <p>Applicant: {app.adopter?.name}</p>
                    <p>Email: {app.adopter?.email}</p>
                    <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span>
                </div>

                <div className="adoption-details">
                  <h4>Application Details</h4>
                  <p><strong>Phone:</strong> {app.applicationDetails?.phoneNumber}</p>
                  <p><strong>Reason:</strong> {app.applicationDetails?.reasonForAdoption}</p>
                  {app.appointmentDate && <p><strong>Visit Date:</strong> {new Date(app.appointmentDate).toLocaleDateString()}</p>}
                </div>
                
                <div className="adoption-actions">
                  <button className="btn-primary" onClick={() => handleOpenAdoptionModal(app)}>Manage Application</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Registered Users</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead><tr><th>Avatar</th><th>Name</th><th>Email</th><th>Verified</th><th>Joined</th><th>Admin</th></tr></thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user._id}>
                    <td><img src={user.avatar} alt={user.name} className="table-img" /></td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isEmailVerified ? <span className="badge approved">Yes</span> : <span className="badge pending">No</span>}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentUserPage} totalPages={Math.ceil(users.length / itemsPerPage)} onPageChange={setCurrentUserPage} />
        </div>
      )}

      {isModalOpen && selectedAdoption && (
        <AdoptionUpdateModal
          adoption={selectedAdoption}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateAdoption}
        />
      )}
    </div>
  );
};

export default AdminDashboard;