import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backgroundImage }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="page-header">
      <motion.div 
        className="page-header-bg"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          y
        }}
      />
      <div className="page-header-overlay"></div>
      <div className="container page-header-content">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="page-header-subtitle"
        >
          {subtitle || 'Hotel Sharda Palace'}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
      </div>
    </div>
  );
};

export default PageHeader;
