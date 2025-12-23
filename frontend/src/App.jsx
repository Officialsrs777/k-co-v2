import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Home/Navbar';
import Hero from './components/Home/Hero';
import About from './components/Home/About';
import FinOpsSection from './components/Home/FinOpsSection';
import Features from './components/Home/Features';
import Pricing from './components/Home/Pricing';
import InquirySection from './components/Home/InquirySection';
import Footer from './components/Home/Footer';
import HowItWorks from './components/Home/HowItWorks';

// Dashboard
import Dashboard from './components/Dashboard/DashboardPage';
import CSVUpload from './components/CSVUpload';

import './index.css';

const Home = () => (
  <div className="min-h-screen bg-[#0f0f11] font-sans overflow-x-hidden">
    <Navbar /> 
    <main>
      <Hero />    
      <About />
      <FinOpsSection />
      <Features />
      <Pricing />
      <HowItWorks />
      <InquirySection />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Auth routes REMOVED because AuthModal handles them on the Home page */}

        <Route path="/upload" element={<CSVUpload />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;