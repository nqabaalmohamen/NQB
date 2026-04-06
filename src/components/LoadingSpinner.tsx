import React from 'react';
import { motion } from 'motion/react';
import { Scale } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-accent/80 backdrop-blur-sm">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-secondary/20 border-t-secondary rounded-full"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Scale className="h-10 w-10 text-primary" />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
