import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FinOpsSection from './components/FinOpsSection'; // Import the new section
import Features from './components/Features';
import Footer from './components/Footer';
import "./index.css"
import InquirySection from './components/InquirySection';
import About from './components/About';
import Pricing from './components/Pricing';
function App() {
  return (
    <div className="min-h-screen bg-[#0f0f11] font-sans selection:bg-[#8B2FC9]/30">
      <Navbar />
      <Hero />
      <About/>
      <FinOpsSection /> 
      <Features />
      <Pricing/>
      <InquirySection/>
      <Footer />
    </div>
  );
}

export default App;