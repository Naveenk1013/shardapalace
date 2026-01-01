import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Snowflake, Coffee, Car, Lock, Waves, Utensils, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import './Amenities.css';
import heroImage from '../assets/hero.jpg';

const Amenities: React.FC = () => {
  const amenities = [
    { icon: <Wifi size={32} />, title: "High-Speed WiFi", desc: "Stay connected with complimentary high-speed internet access throughout the hotel." },
    { icon: <Utensils size={32} />, title: "Sattvic Restaurant", desc: "Enjoy pure vegetarian cuisine prepared with love and hygiene." },
    { icon: <Snowflake size={32} />, title: "Air Conditioning", desc: "Climate controlled rooms to keep you comfortable in all seasons." },
    { icon: <Waves size={32} />, title: "Swimming Pool", desc: "Relax and rejuvenate in our clean and well-maintained swimming pool." },
    { icon: <Car size={32} />, title: "Free Parking", desc: "Ample secure parking space available for all our guests." },
    { icon: <Lock size={32} />, title: "24/7 Security", desc: "Round-the-clock security and CCTV surveillance for your safety." },
    { icon: <Coffee size={32} />, title: "Coffee Shop", desc: "Enjoy fresh brews and snacks at our in-house cafe." },
    { icon: <Zap size={32} />, title: "Power Backup", desc: "24-hour power backup to ensure zero interruptions to your comfort." }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-transition">
      <PageHeader 
        title="World-Class Amenities" 
        subtitle="Experience Luxury"
        backgroundImage={heroImage}
      />

      <section className="container section-padding">
        <motion.div 
          className="amenities-grid-luxury"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {amenities.map((amenity, index) => (
            <motion.div className="amenity-card-luxury" key={index} variants={item}>
              <div className="amenity-icon-wrapper">
                {amenity.icon}
              </div>
              <div className="amenity-content">
                <h3>{amenity.title}</h3>
                <p>{amenity.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Amenities;
