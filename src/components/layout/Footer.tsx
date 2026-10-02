import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Github,
  Linkedin,
  Twitter,
  Database,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setIsSqlModalOpen, services } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Wrench className="w-5 h-5 -rotate-45" />
              </div>
              <div className="text-2xl font-black tracking-tight text-white">
                <span>Car</span>
                <span className="text-blue-500">Care</span>
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              CarCare is an automotive service booking and vehicle maintenance platform.
              Schedule factory-grade scheduled servicing, tire alignments, engine diagnostics,
              and brake repairs with upfront pricing and digital garage tracking.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ASE Certified Master Mechanics</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <Award className="w-4 h-4 text-amber-400" />
                <span>12-Month / 12k Mile Warranty</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Twitter X Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <button
                id="footer-sql-modal-trigger"
                onClick={() => setIsSqlModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-xs font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>MySQL Schema</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => navigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-services"
                  onClick={() => navigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Services Catalog
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-booking"
                  onClick={() => navigate('booking')}
                  className="hover:text-white transition-colors"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-dashboard"
                  onClick={() => navigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-my-cars"
                  onClick={() => navigate('my-cars')}
                  className="hover:text-white transition-colors"
                >
                  My Garage (Cars)
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Maintenance Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <button
                    id={`footer-service-${service.id}`}
                    onClick={() => navigate('services')}
                    className="hover:text-white transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{service.name}</span>
                    <span className="text-xs text-slate-500 font-mono">${service.estimatedPrice}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Service Center
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>1420 Motorway Blvd, Auto District, Suite 100</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (555) 321-CARE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>service@carcare.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="text-slate-300">Mon - Fri: 7:30 AM - 6:00 PM</p>
                  <p className="text-slate-400">Sat: 8:00 AM - 4:00 PM</p>
                  <p className="text-slate-500">Sun: Emergency Towing Only</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CarCare Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              id="footer-open-sql"
              onClick={() => setIsSqlModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              MySQL DDL & Schemas
            </button>
            <span>•</span>
            <span className="text-slate-400">Built for Portfolio Showcase & CV</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
