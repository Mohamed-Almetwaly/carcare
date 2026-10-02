import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ArrowRight, ShieldCheck, Star, Clock, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background automotive grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Ambient glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Copy, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Certified Automotive Service Center</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Take Care of Your Car, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                We Take Care of the Rest.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Book scheduled car maintenance, brake service, engine diagnostics, and tire care with certified mechanics. Enjoy upfront pricing, digital vehicle garage management, and real-time appointment status updates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-book-now-btn"
                onClick={() => navigate('booking')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all active:scale-98"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a Service</span>
              </button>

              <button
                id="hero-explore-services-btn"
                onClick={() => navigate('services')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition-all"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 font-bold text-lg">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Over 2,400+ Reviews</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="text-lg font-bold text-white">15,000+</div>
                <p className="text-xs text-slate-400 mt-0.5">Cars Serviced</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-emerald-400 font-bold text-lg">
                  <Clock className="w-4 h-4" />
                  <span>98.6%</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">On-Time Completion</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80"
                alt="Automotive Service Bay with certified mechanic inspecting vehicle"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Badge 1: Service Bay Active */}
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 flex items-center gap-3 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Bays 1-6 Operational</p>
                  <p className="text-[10px] text-slate-400">Master Technicians on Duty</p>
                </div>
              </div>

              {/* Floating Badge 2: Live Status Pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                    CC
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Sarah's Camry SE</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        Inspection Passed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Scheduled 40,000-Mile Service</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
