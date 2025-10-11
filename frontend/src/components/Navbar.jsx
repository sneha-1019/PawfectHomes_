import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPaw, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  if (loading) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <FaPaw className="logo-icon" />
            <span>Pawfect Home</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <FaPaw className="logo-icon" />
          <span>Pawfect Home</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* FIX: Completely separate navigation links for Admins vs. Users/Guests */}
          {isAdmin ? (
            // ADMIN VIEW
            <>
              <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                Admin Dashboard
              </Link>
            </>
          ) : (
            // USER & GUEST VIEW
            <>
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/explore" className="nav-link" onClick={closeMenu}>
                Explore Pets
              </Link>
              <Link to="/about" className="nav-link" onClick={closeMenu}>
                About
              </Link>
              <Link to="/contact" className="nav-link" onClick={closeMenu}>
                Contact
              </Link>
              <Link to="/faq" className="nav-link" onClick={closeMenu}>
                FAQ
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
              )}
            </>
          )}

          {/* Authentication Buttons */}
          {isAuthenticated ? (
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/auth" className="btn-primary" onClick={closeMenu}>
              <FaUser /> Sign In
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
