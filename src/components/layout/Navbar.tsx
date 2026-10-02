import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Calendar,
  Car,
  LayoutDashboard,
  Shield,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Database,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    navigate,
    logout,
    switchRole,
    setIsSqlModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (page: any) => {
    navigate(page);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar for portfolio demo quick-switch */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-slate-200">CarCare Service Center</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">Hours: Mon - Fri 7:30 AM - 6:00 PM</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="topbar-sql-btn"
              onClick={() => setIsSqlModalOpen(true)}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded text-[11px] font-medium border border-slate-700"
            >
              <Database className="w-3 h-3 text-blue-400" />
              <span>MySQL Schema (.sql)</span>
            </button>

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                id="role-dropdown-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-medium"
              >
                <span>Demo View:</span>
                <span className="text-blue-400 font-bold capitalize">
                  {currentUser ? currentUser.role : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div
                  id="role-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium"
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Portfolio Role
                  </div>
                  <button
                    id="switch-customer-btn"
                    onClick={() => {
                      switchRole('customer');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>Sarah (Customer)</span>
                    {currentUser?.role === 'customer' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                  <button
                    id="switch-admin-btn"
                    onClick={() => {
                      switchRole('admin');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>Marcus (Workshop Admin)</span>
                    {currentUser?.role === 'admin' && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                  <button
                    id="switch-guest-btn"
                    onClick={() => {
                      switchRole('guest');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>Logged Out Guest</span>
                    {!currentUser && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 focus:outline-hidden group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Wrench className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
                <span>Car</span>
                <span className="text-blue-600">Care</span>
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Automotive Service
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold text-slate-600">
            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-600 bg-blue-50/80 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              id="nav-services-btn"
              onClick={() => handleNav('services')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                currentPage === 'services'
                  ? 'text-blue-600 bg-blue-50/80 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Services
            </button>
            <button
              id="nav-how-it-works-btn"
              onClick={() => {
                handleNav('home');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              How It Works
            </button>
            <button
              id="nav-about-btn"
              onClick={() => {
                handleNav('home');
                setTimeout(() => {
                  const el = document.getElementById('why-choose-us-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              About
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => handleNav('contact')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                currentPage === 'contact'
                  ? 'text-blue-600 bg-blue-50/80 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </button>

            {/* Authenticated user specific links */}
            {currentUser && currentUser.role === 'customer' && (
              <>
                <button
                  id="nav-my-cars-btn"
                  onClick={() => handleNav('my-cars')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentPage === 'my-cars'
                      ? 'text-blue-600 bg-blue-50/80 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  My Cars
                </button>
                <button
                  id="nav-dashboard-btn"
                  onClick={() => handleNav('dashboard')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentPage === 'dashboard'
                      ? 'text-blue-600 bg-blue-50/80 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button
                id="nav-admin-dashboard-btn"
                onClick={() => handleNav('admin')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentPage === 'admin'
                    ? 'text-blue-600 bg-blue-50/80 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-600" />
                Admin Command
              </button>
            )}
          </nav>

          {/* Right Action CTA & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-book-service-btn"
              onClick={() => handleNav('booking')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Service</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  id="nav-user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={
                      currentUser.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-100"
                  />
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-xs font-bold text-slate-800">{currentUser.fullName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div
                    id="nav-user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
                        {currentUser.role} Account
                      </span>
                    </div>

                    {currentUser.role === 'customer' ? (
                      <>
                        <button
                          id="menu-dashboard-link"
                          onClick={() => handleNav('dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          Customer Dashboard
                        </button>
                        <button
                          id="menu-cars-link"
                          onClick={() => handleNav('my-cars')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Car className="w-4 h-4 text-slate-500" />
                          My Cars ({currentUser.id === 2 ? 2 : 1})
                        </button>
                        <button
                          id="menu-booking-link"
                          onClick={() => handleNav('booking')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-slate-500" />
                          Book Service Appointment
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          id="menu-admin-link"
                          onClick={() => handleNav('admin')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-blue-600" />
                          Admin Command Center
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button
                        id="menu-logout-btn"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <button
              id="mobile-nav-home"
              onClick={() => handleNav('home')}
              className={`p-2.5 rounded-lg text-left ${
                currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              id="mobile-nav-services"
              onClick={() => handleNav('services')}
              className={`p-2.5 rounded-lg text-left ${
                currentPage === 'services' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Services
            </button>
            <button
              id="mobile-nav-booking"
              onClick={() => handleNav('booking')}
              className={`p-2.5 rounded-lg text-left ${
                currentPage === 'booking' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Book Service
            </button>
            <button
              id="mobile-nav-contact"
              onClick={() => handleNav('contact')}
              className={`p-2.5 rounded-lg text-left ${
                currentPage === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Contact
            </button>
          </div>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3 px-2 py-1">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.fullName}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{currentUser.fullName}</p>
                  <p className="text-xs text-slate-500 capitalize">{currentUser.role} Account</p>
                </div>
              </div>

              {currentUser.role === 'customer' ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="mobile-nav-dashboard"
                    onClick={() => handleNav('dashboard')}
                    className="p-2.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 text-center"
                  >
                    Customer Dashboard
                  </button>
                  <button
                    id="mobile-nav-my-cars"
                    onClick={() => handleNav('my-cars')}
                    className="p-2.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 text-center"
                  >
                    My Cars
                  </button>
                </div>
              ) : (
                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNav('admin')}
                  className="w-full p-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold text-center"
                >
                  Admin Command Center
                </button>
              )}

              <button
                id="mobile-logout-btn"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-semibold text-rose-600"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                id="mobile-login-btn"
                onClick={() => handleNav('login')}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Log In
              </button>
              <button
                id="mobile-register-btn"
                onClick={() => handleNav('register')}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
