
import React from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './FloatingActions.css';

const FloatingActions: React.FC = () => {
  return (
    <div className="floating-actions">
      <motion.a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="action-btn whatsapp-btn"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaWhatsapp size={24} />
        <span className="tooltip">Chat with us</span>
      </motion.a>
      
      <motion.a 
        href="tel:+919876543210" 
        className="action-btn call-btn"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaPhoneAlt size={20} />
        <span className="tooltip">Call Now</span>
      </motion.a>
    </div>
  );
};

export default FloatingActions;
