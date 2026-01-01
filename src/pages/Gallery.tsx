
import React from 'react';
import './Gallery.css';
import heroImage from '../assets/hero.jpg';

const Gallery: React.FC = () => {
  // Using hero image for all items since we only have one image, but structured for loops
  const images = Array(6).fill(heroImage);

  return (
    <div className="gallery-page">
      <section className="page-header" style={{backgroundImage: `url(${heroImage})`}}>
        <div className="container">
          <h1>Gallery</h1>
          <p>A glimpse into our world</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="gallery-grid">
            {images.map((img, idx) => (
              <div key={idx} className="gallery-item">
                <img src={img} alt={`Gallery ${idx + 1}`} />
                <div className="overlay">
                  <span>View Image</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
