import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import './Contact.css';
import heroImage from '../assets/hero.jpg';

const Contact: React.FC = () => {
  return (
    <div className="contact-page page-transition">
      <PageHeader 
        title="Contact Us" 
        subtitle="We'd Love to Hear From You"
        backgroundImage={heroImage}
      />

      <section className="section-padding">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="section-title-left">
                <span className="subtitle text-gold">Get in Touch</span>
                <h2>Connect With Us</h2>
                <p className="contact-intro">Have questions about your booking? Reach out to us directly via phone, email, or visit us in the heart of Vrindavan.</p>
              </div>
              
              <div className="info-card">
                <div className="icon-wrapper"><MapPin size={24}/></div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Opp Dwarkadish Kila, Ashok Van<br/>Kailash Nagar, Vrindavan<br/>Mathura, Uttar Pradesh 281121</p>
                  <a 
                    href="https://www.google.com/maps/place/Hotel+sharda+palace/@27.5576501,77.6881865,17z/data=!3m1!4b1!4m9!3m8!1s0x3973710049d99081:0x861c1aeb46293830!5m2!4m1!1i2!8m2!3d27.5576501!4d77.6881865!16s%2Fg%2F11lzp0q39l?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-text-gold mt-2"
                  >
                    Get Directions &rarr;
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper"><Phone size={24}/></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 98765 43210</p>
                  <p className="text-sm text-muted">Available 24/7 for support</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper"><Mail size={24}/></div>
                <div>
                  <h4>Email Us</h4>
                  <p>info@shardapalace.com</p>
                  <p className="text-sm text-muted">We reply within 24 hours</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper"><Clock size={24}/></div>
                <div>
                  <h4>Front Desk Hours</h4>
                  <p>Check-in: 12:00 PM onwards</p>
                  <p>Check-out: 10:00 AM</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h3>Send us a Message</h3>
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Your Email" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="Your Phone" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows={5} placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary full-width">
                  Send Message <Send size={18} style={{marginLeft: '8px'}}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="map-section">
        <iframe 
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.043586202534!2d77.6881865!3d27.5576501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973710049d99081%3A0x861c1aeb46293830!2sHotel%20sharda%20palace!5e0!3m2!1sen!2sin!4v1709229000000!5m2!1sen!2sin" 
          width="100%" 
          height="500" 
          style={{border:0, filter: 'grayscale(100%) invert(90%)'}} 
          allowFullScreen={true} 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
