
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';

const Layout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Layout;
