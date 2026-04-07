/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Council from './pages/Council';
import Library from './pages/Library';
import Contact from './pages/Contact';
import Forensic from './pages/Forensic';
import Institute from './pages/Institute';
import LoadingSpinner from './components/LoadingSpinner';

const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 400); // Reduced delay for better responsiveness
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-accent">
      {loading && <LoadingSpinner />}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/council" element={<Council />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forensic" element={<Forensic />} />
          <Route path="/institute" element={<Institute />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router basename="/NQB">
      <AppContent />
    </Router>
  );
}
