import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceIcon } from '../common/ServiceIcon';
import { Clock, Search, ArrowRight, ShieldCheck, Check, Sparkles, Filter } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, startBookingWithService } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'duration'>('default');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    services.forEach((s) => cats.add(s.category));
    return ['All', ...Array.from(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesSearch =
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.estimatedPrice - b.estimatedPrice;
        if (sortBy === 'price-desc') return b.estimatedPrice - a.estimatedPrice;
        if (sortBy === 'duration') return a.estimatedDurationMins - b.estimatedDurationMins;
        return a.id - b.id;
      });
  }, [services, searchQuery, selectedCategory, sortBy]);

  return (
    <div id="services-page" className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Transparent Automotive Maintenance
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our Car Care & Maintenance Services
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            All services are executed to manufacturer specifications using OEM-grade components and certified computerized equipment.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="services-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. Brake, Oil, AC)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <label htmlFor="services-sort-select" className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                Sort:
              </label>
              <select
                id="services-sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Fastest Service</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching services found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or reset the category filters.
            </p>
            <button
              id="reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                id={`service-catalog-card-${service.id}`}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-lg p-2 text-blue-600 shadow-sm">
                    <ServiceIcon name={service.iconName} className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold bg-slate-900/80 px-2 py-0.5 rounded">
                      {service.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono bg-slate-900/80 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-blue-400" />
                      ~{service.estimatedDurationMins} min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Est. Price</span>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        ${service.estimatedPrice}
                      </div>
                    </div>

                    <button
                      id={`catalog-book-btn-${service.id}`}
                      onClick={() => startBookingWithService(service)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md hover:shadow-blue-600/20 active:scale-98"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quality Guarantee Callout */}
        <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                100% Manufacturer Warranty Compliant
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Under the Magnuson-Moss Warranty Act, servicing your vehicle with our certified technicians preserves all original factory warranties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Digital Work Receipts</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>OEM Spec Fluids</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
