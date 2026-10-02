import React from 'react';
import {
  Award,
  DollarSign,
  ShieldCheck,
  Zap,
  Clock,
  ThumbsUp,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: Award,
      title: 'ASE-Certified Master Technicians',
      description: 'Our repair bays are staffed exclusively by certified professionals with factory-level diagnostic training.',
    },
    {
      icon: DollarSign,
      title: '100% Upfront Pricing',
      description: 'No hidden shop supplies, mystery labor fees, or surprise surcharges. You approve every penny before work begins.',
    },
    {
      icon: ShieldCheck,
      title: '12-Month / 12k Mile Warranty',
      description: 'All parts and repair labor are backed by our comprehensive nationwide warranty protection for total peace of mind.',
    },
    {
      icon: Zap,
      title: 'Real-Time Status Tracking',
      description: 'Track your car live across 5 lifecycle stages (Pending, Confirmed, In Service, Completed, Cancelled) on your phone.',
    },
    {
      icon: Cpu,
      title: 'Factory-Grade OEM Parts',
      description: 'We install original manufacturer equipment and premium certified fluids designed specifically for your vehicle model.',
    },
    {
      icon: Clock,
      title: 'Express Turnaround Guarantee',
      description: 'We value your schedule. 98.6% of standard maintenance appointments are completed and handed back on time.',
    },
  ];

  return (
    <section id="why-choose-us-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            The CarCare Difference
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose CarCare Service Center?
          </h2>
          <p className="text-slate-600 text-base mt-3">
            We built our automotive center around trust, precision engineering, and modern digital customer transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                id={`why-choose-card-${idx}`}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-6 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
