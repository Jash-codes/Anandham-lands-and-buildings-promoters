import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import InquiryModal from '@/components/InquiryModal';
import HomePage from '@/pages/HomePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import type { Project } from '@/lib/types';

export default function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryProject, setInquiryProject] = useState<Project | null>(null);

  const openInquiry = useCallback((project?: Project | null) => {
    setInquiryProject(project ?? null);
    setInquiryOpen(true);
  }, []);

  const closeInquiry = useCallback(() => {
    setInquiryOpen(false);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header onEnquire={() => openInquiry(null)} />
        <main className="flex-1 pb-16 lg:pb-0">
          <Routes>
            <Route path="/" element={<HomePage onEnquire={openInquiry} />} />
            <Route path="/projects" element={<ProjectsPage onEnquire={openInquiry} />} />
            <Route path="/project/:slug" element={<ProjectDetailPage onEnquire={openInquiry} />} />
            <Route path="/about" element={<AboutPage onEnquire={openInquiry} />} />
            <Route path="/contact" element={<ContactPage onEnquire={openInquiry} />} />
          </Routes>
        </main>
        <Footer />
        <FloatingCTA onEnquire={() => openInquiry(null)} />
        <InquiryModal open={inquiryOpen} onClose={closeInquiry} project={inquiryProject} />
      </div>
    </BrowserRouter>
  );
}
