import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Thermometer, Tv, Coffee, User, Maximize } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import './Rooms.css';
import heroImage from '../assets/hero.jpg';

const Rooms: React.FC = () => {
  return (
    <div className="page-transition">
      <PageHeader 
        title="Our Rooms & Suites" 
        subtitle="Sanctuary of Comfort"
        backgroundImage={heroImage}
      />

      <section className="container section-padding">
        <div className="rooms-list">
          {[
            {
              title: "Deluxe Room",
              price: "₹2,500 / Night",
              size: "250 sq ft",
              capacity: "2 Adults",
              desc: "Ideally designed for couples or solo travelers, our Deluxe Rooms offer a perfect blend of modern amenities and traditional warmth.",
              amenities: [
                { icon: <Wifi size={18}/>, name: "Free Wi-Fi" },
                { icon: <Thermometer size={18}/>, name: "Air Conditioning" },
                { icon: <Tv size={18}/>, name: "LED TV" },
                { icon: <Coffee size={18}/>, name: "Tea/Coffee Maker" }
              ]
            },
            {
              title: "Super Deluxe Room",
              price: "₹3,500 / Night",
              size: "300 sq ft",
              capacity: "2-3 Adults",
              desc: "Spacious and elegant, the Super Deluxe Rooms feature premium bedding and a seating area for added comfort during your stay.",
              amenities: [
                { icon: <Wifi size={18}/>, name: "Free Wi-Fi" },
                { icon: <Maximize size={18}/>, name: "Balcony" },
                { icon: <User size={18}/>, name: "Room Service" },
                { icon: <Coffee size={18}/>, name: "Mini Fridge" }
              ]
            },
            {
              title: "Family Suite",
              price: "₹6,000 / Night",
              size: "450 sq ft",
              capacity: "4-5 People",
              desc: "The ultimate luxury for families. Two interconnected spaces with a living area, perfect for keeping the family together while enjoying privacy.",
              amenities: [
                { icon: <Wifi size={18}/>, name: "Free Wi-Fi" },
                { icon: <Maximize size={18}/>, name: "Living Area" },
                { icon: <Thermometer size={18}/>, name: "Kitchenette" },
                { icon: <Tv size={18}/>, name: "2 LED TVs" }
              ]
            }
          ].map((room, index) => (
            <motion.div 
              className="room-list-card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="room-list-image">
                <img src={heroImage} alt={room.title} />
              </div>
              <div className="room-list-content">
                <div className="room-header">
                  <h3>{room.title}</h3>
                  <span className="room-price">{room.price}</span>
                </div>
                <div className="room-specs">
                  <span><Maximize size={16} /> {room.size}</span>
                  <span><User size={16} /> {room.capacity}</span>
                </div>
                <p>{room.desc}</p>
                <div className="room-amenities">
                  {room.amenities.map((am, i) => (
                    <div key={i} className="amenity-tag">
                      {am.icon} <span>{am.name}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
