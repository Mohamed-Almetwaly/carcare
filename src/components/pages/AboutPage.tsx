import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  const team = [
    {
      name: 'Marcus Vance',
      role: 'Lead Master Technician & Shop Director',
      bio: '22+ years of automotive engineering experience. ASE Certified Master with specialized training in German and Japanese powertrains.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Diagnostics & Electrical Specialist',
      bio: 'Former OEM technical lead specializing in hybrid battery systems, CAN bus diagnostics, and onboard telemetry calibration.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'David Chen',
      role: 'Chassis, Suspension & Braking Lead',
      bio: 'Motorsports suspension tuning veteran with 14 years fine-tuning track setups and daily road vehicle safety dynamics.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div id="about-page" className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
            Engineering Excellence & Transparency
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Setting a Higher Standard for Automotive Care
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
            Founded with a simple premise: vehicle maintenance should be clear, predictable, and managed with the precision of high-performance engineering.
          </p>
        </div>

        {/* Story / Facilities Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              State-of-the-Art Diagnostics Meets Traditional Craft
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              At CarCare, we believe you shouldn't have to guess what is happening under your hood. Every vehicle entering our bays undergoes a rigorous computerized scan paired with hands-on mechanical inspection by certified specialists.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              We eliminate hidden charges, inflated estimates, and obscure technical jargon. You receive digital inspection reports directly on your personal dashboard with photographic proof and clear price breakdowns before any wrench turns.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>OEM Spec Replacement Parts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>12-Mo / 12k-Mi Nationwide Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Eco-Friendly Fluid Recycling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Hidden Fees Guarantee</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
              alt="CarCare Workshop Facility"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                  Modern Facilities
                </span>
                <p className="text-sm font-semibold mt-1">
                  8 Hydraulic Lift Diagnostic Bays with Optical Alignment Rigs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certified Team */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Meet Our Certified Master Technicians
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every mechanic at CarCare maintains active ASE certifications and undergoes 80+ hours of continuous factory training every year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md mb-4"
                />
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <span className="text-xs font-semibold text-blue-600 mt-0.5">{member.role}</span>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl shadow-blue-500/15 max-w-4xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to experience honest, precision vehicle care?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">
            Book your next oil change, brake service, or general inspection in less than two minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('booking')}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-600 font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Book an Appointment Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
