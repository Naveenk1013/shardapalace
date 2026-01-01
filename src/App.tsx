
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Amenities from './pages/Amenities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="amenities" element={<Amenities />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
