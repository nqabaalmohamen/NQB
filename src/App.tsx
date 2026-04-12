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
import NewsDetail from './pages/NewsDetail';
import LoadingSpinner from './components/LoadingSpinner';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CarouselManager from './pages/admin/CarouselManager';
import NewsManager from './pages/admin/NewsManager';
import CouncilManager from './pages/admin/CouncilManager';
import ForensicManager from './pages/admin/ForensicManager';
import LibraryManager from './pages/admin/LibraryManager';
import InstituteManager from './pages/admin/InstituteManager';
import SettingsManager from './pages/admin/SettingsManager';
import MessagesManager from './pages/admin/MessagesManager';
import Maintenance from './pages/Maintenance';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { DataProvider, useData } from './context/DataContext';

const AppContent = () => {
  const { settings } = useData();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 400); // Reduced delay for better responsiveness
    return () => clearTimeout(timer);
  }, [location]);

  // If maintenance mode is ON and user is NOT an admin, show maintenance page
  if (settings.maintenanceMode && !isAdminPath) {
    return <Maintenance endTime={settings.maintenanceEndTime} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-accent">
      {loading && <LoadingSpinner />}
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/council" element={<Council />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forensic" element={<Forensic />} />
          <Route path="/institute" element={<Institute />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/carousel" element={<ProtectedRoute><CarouselManager /></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute><NewsManager /></ProtectedRoute>} />
          <Route path="/admin/council" element={<ProtectedRoute><CouncilManager /></ProtectedRoute>} />
          <Route path="/admin/forensic" element={<ProtectedRoute><ForensicManager /></ProtectedRoute>} />
          <Route path="/admin/library" element={<ProtectedRoute><LibraryManager /></ProtectedRoute>} />
          <Route path="/admin/institute" element={<ProtectedRoute><InstituteManager /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><MessagesManager /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router basename="/NQB">
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  );
}
