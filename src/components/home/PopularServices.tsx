import React from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceIcon } from '../common/ServiceIcon';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';

export const PopularServices: React.FC = () => {
  const { services, startBookingWithService, navigate } = useApp();
  const displayServices = services.slice(0, 6);

  return (
    <section id="popular-services-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Automotive Maintenance Menu
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Popular Maintenance Services
            </h2>
            <p className="text-slate-600 text-base mt-2 max-w-xl">
              From routine synthetic fluid changes to advanced computer diagnostics, all performed by ASE-certified technicians.
            </p>
          </div>

          <button
            id="view-all-services-btn"
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 hover:border-blue-300 px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0 self-start md:self-auto"
          >
            <span>View All Services ({services.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <div
              key={service.id}
              id={`popular-service-card-${service.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-lg p-2 text-blue-600 shadow-sm">
                  <ServiceIcon name={service.iconName} className="w-5 h-5" />
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                    {service.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono font-medium bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    ~{service.estimatedDurationMins} min
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Price</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      ${service.estimatedPrice}
                      <span className="text-xs font-normal text-slate-500 ml-1">incl. parts</span>
                    </div>
                  </div>

                  <button
                    id={`book-service-btn-${service.id}`}
                    onClick={() => startBookingWithService(service)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md hover:shadow-blue-600/20 active:scale-98"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
