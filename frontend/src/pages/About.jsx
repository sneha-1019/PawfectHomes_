import { FaHeart, FaUsers, FaAward, FaPaw } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About Pawfect Home</h1>
        <p>Connecting pets with loving families since 2025</p>
      </div>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            At Pawfect Home, we believe every pet deserves a loving, forever home. Our mission is to connect
            homeless and abandoned pets with caring families, creating lasting bonds that enrich both human and
            animal lives. We work tirelessly to ensure that every adoption is a perfect match, providing support
            and resources throughout the entire adoption journey.
          </p>
        </div>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaHeart className="value-icon" />
            <h3>Compassion</h3>
            <p>We treat every animal with love, care, and respect they deserve.</p>
          </div>
          <div className="value-card">
            <FaUsers className="value-icon" />
            <h3>Community</h3>
            <p>Building a community of pet lovers dedicated to animal welfare.</p>
          </div>
          <div className="value-card">
            <FaAward className="value-icon" />
            <h3>Excellence</h3>
            <p>Providing the highest quality care and adoption services.</p>
          </div>
          <div className="value-card">
            <FaPaw className="value-icon" />
            <h3>Advocacy</h3>
            <p>Promoting responsible pet ownership and animal rights.</p>
          </div>
        </div>
      </section>

      <section className="story-section">
        <h2>Our Story</h2>
        <div className="story-content">
          <p>
            Pawfect Home was founded in 2025 with a simple yet powerful vision: to create a world where no pet
            is left without a loving home. What started as a small local initiative has grown into a comprehensive
            platform connecting thousands of pets with their forever families.
          </p>
          <p>
            Our team of dedicated animal lovers, veterinarians, and volunteers work around the clock to ensure
            that every pet receives the care they need while waiting for adoption. We carefully screen potential
            adopters to ensure the best possible matches and provide ongoing support to help families and their
            new companions adjust to life together.
          </p>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨‍⚕️</div>
            <h3>Dr. Michael Smith</h3>
            <p>Chief Veterinarian</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h3>Sarah Johnson</h3>
            <p>Adoption Coordinator</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍💻</div>
            <h3>David Chen</h3>
            <p>Operations Manager</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍🏫</div>
            <h3>Emily Rodriguez</h3>
            <p>Community Outreach</p>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <h2>Our Impact</h2>
        <div className="impact-stats">
          <div className="impact-card">
            <h3>500+</h3>
            <p>Successful Adoptions</p>
          </div>
          <div className="impact-card">
            <h3>1000+</h3>
            <p>Happy Families</p>
          </div>
          <div className="impact-card">
            <h3>50+</h3>
            <p>Partner Shelters</p>
          </div>
          <div className="impact-card">
            <h3>98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      <section className="rating-section">
        <h2>Community Reviews</h2>
        <div className="rating-display">
          <div className="rating-stars">
            ⭐⭐⭐⭐⭐
          </div>
          <h3>4.9 out of 5</h3>
          <p>Based on 500+ reviews from happy pet parents</p>
        </div>
      </section>
    </div>
  );
};

export default About;
