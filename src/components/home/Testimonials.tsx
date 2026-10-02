import React from 'react';
import { INITIAL_TESTIMONIALS } from '../../data/initialData';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Verified Car Owners
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Loved by Drivers Everywhere
          </h2>
          <p className="text-slate-600 text-base mt-3">
            Read reviews from local vehicle owners who trust CarCare for their daily commuters, family SUVs, and performance vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              id={`testimonial-card-${t.id}`}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{t.date}</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{t.car}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
