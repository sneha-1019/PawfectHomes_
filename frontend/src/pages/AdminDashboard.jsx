import { useEffect, useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FaUsers, FaPaw, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
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

  const handleUpdateAdoption = async (adoptionId, status, notes = '', rejectionReason = '') => {
    try {
      await API.put(`/admin/adoptions/${adoptionId}`, {
        status,
        adminNotes: notes,
        rejectionReason
      });
      setAdoptions(adoptions.map(app => 
        app._id === adoptionId ? { ...app, status, adminNotes: notes } : app
      ));
      toast.success(`Application ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Error updating application');
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    
    try {
      await API.delete(`/pets/${petId}`);
      setPets(pets.filter(pet => pet._id !== petId));
      toast.success('Pet deleted successfully');
    } catch (error) {
      toast.error('Error deleting pet');
    }
  };

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
            <div className="stat-card">
              <FaPaw className="stat-icon" />
              <div>
                <h3>{stats?.totalPets}</h3>
                <p>Total Pets</p>
              </div>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div>
                <h3>{stats?.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <FaClipboardList className="stat-icon" />
              <div>
                <h3>{stats?.totalAdoptions}</h3>
                <p>Total Applications</p>
              </div>
            </div>
            <div className="stat-card">
              <FaClock className="stat-icon" />
              <div>
                <h3>{stats?.pendingAdoptions}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <FaCheckCircle className="stat-icon" />
              <div>
                <h3>{stats?.completedAdoptions}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card warning">
              <FaClock className="stat-icon" />
              <div>
                <h3>{stats?.unverifiedPets}</h3>
                <p>Unverified Pets</p>
              </div>
            </div>
          </div>

          {/* Recent Adoptions */}
          <div className="admin-section">
            <h2>Recent Adoption Applications</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Adopter</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentAdoptions?.map(app => (
                    <tr key={app._id}>
                      <td>{app.pet?.name}</td>
                      <td>{app.adopter?.name}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
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
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'pets' ? 'active' : ''}
          onClick={() => setActiveTab('pets')}
        >
          Pets ({pets.length})
        </button>
        <button
          className={activeTab === 'adoptions' ? 'active' : ''}
          onClick={() => setActiveTab('adoptions')}
        >
          Applications ({adoptions.length})
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
      </div>

      {/* Pets Management */}
      {activeTab === 'pets' && (
        <div className="admin-section">
          <h2>Manage Pets</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Species</th>
                  <th>Uploaded By</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => (
                  <tr key={pet._id}>
                    <td>
                      <img src={pet.images[0]} alt={pet.name} className="table-img" />
                    </td>
                    <td>{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.uploadedBy?.name}</td>
                    <td>
                      <span className={`badge ${pet.status.toLowerCase()}`}>
                        {pet.status}
                      </span>
                    </td>
                    <td>
                      {pet.verifiedByAdmin ? (
                        <span className="badge approved">Yes</span>
                      ) : (
                        <span className="badge pending">No</span>
                      )}
                    </td>
                    <td>
                      {pet.featured ? (
                        <span className="badge featured">Yes</span>
                      ) : (
                        <span className="badge">No</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {!pet.verifiedByAdmin && (
                          <button
                            className="btn-sm btn-success"
                            onClick={() => handleVerifyPet(pet._id)}
                          >
                            Verify
                          </button>
                        )}
                        <button
                          className="btn-sm btn-info"
                          onClick={() => handleToggleFeatured(pet._id)}
                        >
                          {pet.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          className="btn-sm btn-danger"
                          onClick={() => handleDeletePet(pet._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  <span className={`badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>

                <div className="adoption-details">
                  <h4>Application Details</h4>
                  <p><strong>Experience:</strong> {app.applicationDetails?.experience}</p>
                  <p><strong>Home Type:</strong> {app.applicationDetails?.homeType}</p>
                  <p><strong>Has Yard:</strong> {app.applicationDetails?.hasYard ? 'Yes' : 'No'}</p>
                  <p><strong>Other Pets:</strong> {app.applicationDetails?.otherPets || 'None'}</p>
                  <p><strong>Employment:</strong> {app.applicationDetails?.employmentStatus}</p>
                  <p><strong>Phone:</strong> {app.applicationDetails?.phoneNumber}</p>
                  <p><strong>Reason:</strong> {app.applicationDetails?.reasonForAdoption}</p>
                  {app.appointmentDate && (
                    <p><strong>Visit Date:</strong> {new Date(app.appointmentDate).toLocaleDateString()}</p>
                  )}
                </div>

                {app.status === 'Pending' && (
                  <div className="adoption-actions">
                    <button
                      className="btn-success"
                      onClick={() => {
                        const notes = prompt('Add admin notes (optional):');
                        handleUpdateAdoption(app._id, 'Approved', notes || '');
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        const reason = prompt('Rejection reason:');
                        if (reason) {
                          handleUpdateAdoption(app._id, 'Rejected', '', reason);
                        }
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {app.status === 'Approved' && (
                  <button
                    className="btn-primary"
                    onClick={() => handleUpdateAdoption(app._id, 'Completed')}
                  >
                    Mark as Completed
                  </button>
                )}
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
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Verified</th>
                  <th>Joined</th>
                  <th>Saved Pets</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <img src={user.avatar} alt={user.name} className="table-img" />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isEmailVerified ? (
                        <span className="badge approved">Yes</span>
                      ) : (
                        <span className="badge pending">No</span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.savedPets?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
