import React from 'react';
import { useApp } from '../../context/AppContext';
import { MousePointerClick, CalendarCheck, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { navigate } = useApp();

  const steps = [
    {
      step: '01',
      icon: MousePointerClick,
      title: 'Select Service',
      description: 'Browse our standardized maintenance menu with fixed upfront pricing and estimated labor time.',
    },
    {
      step: '02',
      icon: CalendarCheck,
      title: 'Pick Date & Vehicle',
      description: 'Choose your preferred date and time slot. Select from your saved virtual garage or input a vehicle.',
    },
    {
      step: '03',
      icon: Wrench,
      title: 'Real-Time Tracking',
      description: 'Drop off your vehicle and track your repair status live through your dashboard (Pending to In Service).',
    },
    {
      step: '04',
      icon: ShieldCheck,
      title: 'Drive with Confidence',
      description: 'Inspect digital technician notes, pick up your vehicle, and enjoy our 12-month service warranty.',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Simple & Transparent Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How CarCare Works
          </h2>
          <p className="text-slate-600 text-base mt-3">
            We removed the headaches and guesswork from automotive repairs. Here is how easy it is to schedule service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                id={`how-it-works-step-${item.step}`}
                className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-xs">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              Ready to service your vehicle?
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-md">
              Book online in under 60 seconds. No upfront credit card required.
            </p>
          </div>
          <button
            id="how-it-works-cta-btn"
            onClick={() => navigate('booking')}
            className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/25 shrink-0"
          >
            Schedule Your Appointment
          </button>
        </div>
      </div>
    </section>
  );
};
