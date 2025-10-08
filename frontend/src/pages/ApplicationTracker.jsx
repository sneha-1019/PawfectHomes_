import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaTimesCircle, FaCalendar } from 'react-icons/fa';
import '../styles/dashboard.css';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/adoption/my-applications');
      setApplications(res.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this application?')) return;
    
    try {
      await API.delete(`/adoption/${id}`);
      setApplications(applications.filter(app => app._id !== id));
      toast.success('Application cancelled successfully');
    } catch (error) {
      toast.error('Error cancelling application');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'Rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      case 'Completed':
        return <FaCheckCircle className="status-icon completed" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>My Adoption Applications</h1>
        <p>Track the status of your adoption applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Browse our available pets and apply for adoption</p>
          <Link to="/explore" className="btn-primary">Explore Pets</Link>
        </div>
      ) : (
        <div className="applications-container">
          {applications.map(app => (
            <div key={app._id} className="application-card">
              <div className="app-header">
                <img src={app.pet?.images[0]} alt={app.pet?.name} />
                <div className="app-info">
                  <h3>{app.pet?.name}</h3>
                  <p>{app.pet?.breed} • {app.pet?.age} years old</p>
                  <p className="app-date">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="app-status">
                  {getStatusIcon(app.status)}
                  <span className={`status-text ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="app-details">
                <h4>Application Details</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Home Type:</strong>
                    <span>{app.applicationDetails?.homeType}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Has Yard:</strong>
                    <span>{app.applicationDetails?.hasYard ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Employment:</strong>
                    <span>{app.applicationDetails?.employmentStatus}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong>
                    <span>{app.applicationDetails?.phoneNumber}</span>
                  </div>
                </div>

                {app.appointmentDate && (
                  <div className="appointment-info">
                    <FaCalendar />
                    <span>Scheduled Visit: {new Date(app.appointmentDate).toLocaleDateString()}</span>
                  </div>
                )}

                {app.status === 'Rejected' && app.rejectionReason && (
                  <div className="rejection-reason">
                    <strong>Reason:</strong>
                    <p>{app.rejectionReason}</p>
                  </div>
                )}

                {app.adminNotes && (
                  <div className="admin-notes">
                    <strong>Admin Notes:</strong>
                    <p>{app.adminNotes}</p>
                  </div>
                )}
              </div>

              <div className="app-actions">
                <Link to={`/pet/${app.pet?._id}`} className="btn-secondary">
                  View Pet
                </Link>
                {app.status === 'Pending' && (
                  <button
                    className="btn-danger"
                    onClick={() => handleCancelApplication(app._id)}
                  >
                    Cancel Application
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
