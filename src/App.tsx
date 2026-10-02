import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { SqlViewerModal } from './components/common/SqlViewerModal';

// Pages
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { BookingPage } from './components/pages/BookingPage';
import { CustomerDashboard } from './components/pages/CustomerDashboard';
import { MyCarsPage } from './components/pages/MyCarsPage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { ContactPage } from './components/pages/ContactPage';
import { AboutPage } from './components/pages/AboutPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';

import { Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, setIsSqlModalOpen } = useApp();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'services':
        return <ServicesPage />;
      case 'booking':
        return <BookingPage />;
      case 'dashboard':
        return <CustomerDashboard />;
      case 'my-cars':
        return <MyCarsPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Quick Action for Portfolio Reviewers */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="floating-sql-schema-btn"
          onClick={() => setIsSqlModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-xl hover:shadow-2xl backdrop-blur-md border border-slate-700/80 text-xs font-semibold transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          title="Inspect relational database schema (MySQL DDL)"
        >
          <Database className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">View Database Schema</span>
          <span className="sm:hidden font-mono text-[11px]">.SQL</span>
        </button>
      </div>

      {/* Database Schema & Architecture Modal */}
      <SqlViewerModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
