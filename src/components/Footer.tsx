
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Clock, CheckCircle } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-blue">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Hotel Sharda Palace</h3>
            <p>Experience divine hospitality in the heart of Vrindavan. A peaceful sanctuary for pilgrims and families seeking spiritual comfort and modern amenities.</p>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/rooms">Rooms & Suites</Link></li>
              <li><Link to="/amenities">Amenities</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>info@shardapalace.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Vrindavan, Mathura<br/>Uttar Pradesh, India</span>
            </div>
            <div className="social-links" style={{marginTop: '20px', display: 'flex', gap: '15px'}}>
              <a href="#" style={{color: 'white'}}><Facebook size={20} /></a>
              <a href="#" style={{color: 'white'}}><Instagram size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Check-in Details</h4>
            <div className="contact-item">
              <Clock size={18} />
              <div>
                <span>Check-in: 12:00 PM onwards</span><br/>
                <span style={{opacity: 0.7}}>Check-out: 11:00 AM</span>
              </div>
            </div>
            <div className="contact-item" style={{marginTop: '15px'}}>
              <CheckCircle size={18} />
              <span>24x7 Front Desk Available</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Hotel Sharda Palace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
