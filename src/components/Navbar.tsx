
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link to="/" className="logo">
            <span className="logo-text">Sharda Palace</span>
            
          </Link>

          <div className="nav-links desktop-only">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-actions desktop-only">
            <a href="tel:+919876543210" className="phone-link">
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </a>
            <Link to="/contact" className="btn btn-primary book-btn">Book Now</Link>
          </div>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} color="var(--color-primary)" /> : <Menu size={24} color={scrolled ? "var(--color-primary)" : "white"} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="mobile-menu-header">
              <span className="logo-text text-blue">Sharda Palace</span>
              <button onClick={() => setIsOpen(false)}><X size={24} color="var(--color-primary)" /></button>
            </div>
            
            <div className="mobile-links">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={link.path} onClick={() => setIsOpen(false)}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/contact" className="btn btn-primary full-width" style={{display: 'inline-flex', marginTop: '20px'}}>
                  Book Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
