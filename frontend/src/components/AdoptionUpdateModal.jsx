import { useState } from 'react';
import '../styles/admin.css';

const AdoptionUpdateModal = ({ adoption, onClose, onUpdate }) => {
  const [status, setStatus] = useState(adoption.status);
  const [adminNotes, setAdminNotes] = useState(adoption.adminNotes || '');
  const [rejectionReason, setRejectionReason] = useState(adoption.rejectionReason || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      status,
      adminNotes,
      rejectionReason: status === 'Rejected' ? rejectionReason : ''
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Manage Application for {adoption.pet.name}</h2>
        <p><strong>Applicant:</strong> {adoption.adopter.name}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {status === 'Rejected' && (
            <div className="form-group">
              <label>Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a clear reason for rejection"
                rows="3"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Admin Notes (optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes about the application"
              rows="4"
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionUpdateModal;