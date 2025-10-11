import { Link } from 'react-router-dom';
import { FaPaw, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <FaPaw />
            <span>Pawfect Home</span>
          </div>
          <p>Finding loving homes for pets in need. Every pet deserves a forever home.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/explore">Explore Pets</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        {/* <p>&copy; {new Date().getFullYear()} Pawfect Home. All rights reserved.</p> */}
        <p>&copy; 2024 Pawfect Home. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
