import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import PetCard from "../components/PetCard";
import { FaHeart, FaUsers, FaHome, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchFeaturedPets();
  }, []);

  const fetchFeaturedPets = async () => {
    try {
      const res = await API.get("/pets/featured");
      setFeaturedPets(res.data.pets);
    } catch (error) {
      console.error("Error fetching featured pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePet = async (petId) => {
    if (!isAuthenticated) {
      toast.error("Please login to save pets");
      return;
    }
    try {
      const res = await API.post(`/pets/${petId}/save`);
      toast.success(res.data.message);
      // Here you might want to trigger a user context refresh to update saved pets icon instantly
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving pet");
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your <span className="highlight">Pawfect</span> Companion
          </h1>
          <p className="hero-subtitle">
            Every pet deserves a loving home. Start your adoption journey today
            and make a difference in a furry friend's life.
          </p>
          <div className="hero-buttons">
            <Link to="/explore" className="btn-hero primary">
              Browse Pets <FaArrowRight />
            </Link>
            <Link to="/about" className="btn-hero secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          {/* **FIX: Replaced the old SVG with a cleaner, more professional one** */}
          <div className="hero-illustration">
            <img src="/images/pet-hero.png" alt="Happy pets" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <FaHeart className="stat-icon" />
          <h3>500+</h3>
          <p>Pets Adopted</p>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h3>1000+</h3>
          <p>Happy Families</p>
        </div>
        <div className="stat-card">
          <FaHome className="stat-icon" />
          <h3>150+</h3>
          <p>Pets Available</p>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Pets</h2>
          <p>Meet our adorable friends looking for their forever homes</p>
        </div>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="pets-grid">
            {featuredPets.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                onSave={isAuthenticated ? handleSavePet : null}
                isSaved={user?.savedPets?.some(
                  (savedPet) => savedPet === pet._id || savedPet._id === pet._id
                )}
              />
            ))}
          </div>
        )}

        <div className="section-footer">
          <Link to="/explore" className="btn-primary">
            View All Pets <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How Adoption Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse Pets</h3>
            <p>Explore our database of adorable pets waiting for adoption</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Apply to Adopt</h3>
            <p>Fill out an adoption application for your chosen pet</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Meet & Greet</h3>
            <p>Schedule a visit to meet your potential new companion</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Take Home</h3>
            <p>Complete the process and welcome your new family member</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>Happy Adoption Stories</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "We found our perfect companion through Pawfect Home. The process
              was smooth and the staff was incredibly helpful!"
            </p>
            <div className="testimonial-author">
              <strong>Sarah Johnson</strong>
              <span>★★★★★</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>
              "Adopting Max was the best decision ever. Thank you Pawfect Home
              for bringing so much joy to our family!"
            </p>
            <div className="testimonial-author">
              <strong>Michael Chen</strong>
              <span>★★★★★</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>
              "Amazing platform! Found my furry friend within a week. Highly
              recommend to anyone looking to adopt."
            </p>
            <div className="testimonial-author">
              <strong>Emily Rodriguez</strong>
              <span>★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Find Your Perfect Pet?</h2>
        <p>
          Join thousands of happy pet parents who found their companions through
          Pawfect Home
        </p>
        <Link to="/explore" className="btn-cta">
          Start Your Journey <FaArrowRight />
        </Link>
      </section>
    </div>
  );
};

export default Home;
