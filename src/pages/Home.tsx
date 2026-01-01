
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Coffee, Wifi, Shield, CheckCircle, Flame, Users, BedDouble } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';
import heroImage from '../assets/hero.jpg';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-background"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            y: y1
          }}
        />
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.span 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Premium Hospitality in Vrindavan
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to <br/>
            <span className="text-gold">Hotel Sharda Palace</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Your peaceful sanctuary in the divine city of Vrindavan
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/rooms" className="btn btn-outline">Explore Rooms</Link>
            <a href="tel:+919876543210" className="btn btn-primary">Call Now</a>
          </motion.div>
        </div>
        
        {/* Stats Section Overlay */}
        <motion.div 
          className="hero-stats container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="stat-item">
            <h3>4.5</h3>
            <p>Guest Rating</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Happy Guests</p>
          </div>
          <div className="stat-item">
            <h3>24x7</h3>
            <p>Security</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Satisfaction</p>
          </div>
        </motion.div>

        <motion.div 
          className="scroll-indicator"
          style={{ opacity }}
        >
          <span>Scroll</span>
          <div className="line"></div>
        </motion.div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding about-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="subtitle text-gold">Experience Divine Hospitality</span>
            <h2>Why Choose Sharda Palace</h2>
            <p className="section-desc">Experience divine hospitality with modern amenities in the spiritual heart of Vrindavan</p>
          </div>
          
          <div className="features-grid-large">
            <div className="feature-card">
              <Shield className="feature-icon" size={40} />
              <h3>Safe & Secure</h3>
              <p>24x7 security and safety measures for peace of mind</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" size={40} />
              <h3>Family Friendly</h3>
              <p>Perfect for families and pilgrims seeking comfort</p>
            </div>
            <div className="feature-card">
              <Star className="feature-icon" size={40} />
              <h3>Spiritual Haven</h3>
              <p>Peaceful atmosphere in the heart of Vrindavan</p>
            </div>
            <div className="feature-card">
              <CheckCircle className="feature-icon" size={40} />
              <h3>Premium Service</h3>
              <p>Dedicated staff ensuring exceptional hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms & Suites */}
      <section className="section-padding bg-light rooms-preview">
        <div className="container">
          <div className="section-title text-center">
            <span className="subtitle text-gold">Our Rooms & Suites</span>
            <h2>Comfortable Accommodations</h2>
            <p className="section-desc">Designed for your spiritual journey and family comfort</p>
          </div>
          
          <div className="rooms-grid">
            {[
              { 
                title: 'Deluxe Room', 
                size: '250 sq ft • 2 Adults', 
                amenities: ['AC', 'TV', 'Attached Bathroom'],
                image: heroImage 
              },
              { 
                title: 'Super Deluxe Room', 
                size: '300 sq ft • 2-3 Adults', 
                amenities: ['Premium Bedding', 'Mini Fridge', 'Balcony'],
                image: heroImage 
              },
              { 
                title: 'Family Suite', 
                size: '450 sq ft • 4-5 People', 
                amenities: ['2 Bedrooms', 'Living Area', 'Kitchenette'],
                image: heroImage 
              }
            ].map((room, index) => (
              <motion.div 
                className="room-card" 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="room-image">
                  <img src={room.image} alt={room.title} />
                  <div className="room-number">{index + 1}</div>
                </div>
                <div className="room-content">
                  <h3>{room.title}</h3>
                  <div className="room-meta-large">
                    <BedDouble size={16}/> {room.size}
                  </div>
                  <div className="room-amenities-list">
                    {room.amenities.map(am => <span key={am}>• {am}</span>)}
                  </div>
                  <Link to="/rooms" className="btn btn-outline full-width">Book Now</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* World Class Amenities */}
      <section className="section-padding amenities-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>World-Class Amenities</h2>
            <p className="section-desc">Everything you need for a comfortable and memorable stay</p>
          </div>

          <div className="amenities-grid-home">
             <div className="amenity-item">
               <div className="icon-circle"><CheckCircle size={24}/></div>
               <div>
                 <h4>Swimming Pool</h4>
                 <p>Refreshing pool for relaxation</p>
               </div>
             </div>
             <div className="amenity-item">
               <div className="icon-circle"><Coffee size={24}/></div>
               <div>
                 <h4>Pure Veg Restaurant</h4>
                 <p>Delicious sattvic cuisine</p>
               </div>
             </div>
             <div className="amenity-item">
               <div className="icon-circle"><Wifi size={24}/></div>
               <div>
                 <h4>Free WiFi</h4>
                 <p>Stay connected throughout</p>
               </div>
             </div>
             <div className="amenity-item">
               <div className="icon-circle"><Flame size={24}/></div>
               <div>
                 <h4>Bonfire & Lounge</h4>
                 <p>Evening relaxation spots</p>
               </div>
             </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg" style={{backgroundImage: `url(${heroImage})`}}></div>
        <div className="overlay-dark"></div>
        <div className="container cta-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Ready to Experience Divine Hospitality?</h2>
            <p style={{color: 'rgba(255,255,255,0.9)', marginBottom: '30px', fontSize: '1.2rem'}}>Book your stay at Hotel Sharda Palace today and enjoy peaceful comfort in Vrindavan</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">Book Your Stay</Link>
              <a href="mailto:info@shardapalace.com" className="btn btn-outline btn-large">Email Us</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
