import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { ServiceIcon } from '../common/ServiceIcon';
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Printer,
  Sparkles,
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const {
    currentUser,
    services,
    userCars,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    createAppointment,
    navigate,
  } = useApp();

  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCarId, setSelectedCarId] = useState<string>('custom');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState<number>(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [serviceId, setServiceId] = useState<number>(services[0]?.id || 1);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:30 AM');
  const [problemDescription, setProblemDescription] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize with logged in user details if available
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.fullName);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Preselect service if passed via context
  useEffect(() => {
    if (selectedServiceForBooking) {
      setServiceId(selectedServiceForBooking.id);
    }
  }, [selectedServiceForBooking]);

  // Set default minimum date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setPreferredDate(dateStr);
  }, []);

  // Handle existing car picker
  const handleCarSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCarId(val);
    if (val === 'custom') {
      setCarBrand('');
      setCarModel('');
      setCarYear(2021);
      setLicensePlate('');
    } else {
      const found = userCars.find((c) => c.id === Number(val));
      if (found) {
        setCarBrand(found.brand);
        setCarModel(found.model);
        setCarYear(found.year);
        setLicensePlate(found.licensePlate);
      }
    }
  };

  const currentSelectedService = services.find((s) => s.id === Number(serviceId)) || services[0];

  const timeSlots = [
    '08:00 AM',
    '09:30 AM',
    '11:00 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:15 PM',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!carBrand.trim()) errs.carBrand = 'Car brand/make is required';
    if (!carModel.trim()) errs.carModel = 'Car model is required';
    if (!carYear || carYear < 1980 || carYear > new Date().getFullYear() + 1) {
      errs.carYear = 'Enter a valid year (1980 - present)';
    }
    if (!licensePlate.trim()) errs.licensePlate = 'License plate is required';
    if (!preferredDate) errs.preferredDate = 'Please choose a preferred date';
    if (!preferredTime) errs.preferredTime = 'Please select a preferred time slot';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newAppt = createAppointment({
        serviceId: currentSelectedService.id,
        serviceName: currentSelectedService.name,
        customerName: customerName.trim(),
        phone: phone.trim(),
        carBrand: carBrand.trim(),
        carModel: carModel.trim(),
        carYear: Number(carYear),
        licensePlate: licensePlate.trim().toUpperCase(),
        serviceDate: preferredDate,
        serviceTime: preferredTime,
        problemDescription: problemDescription.trim() || 'General maintenance check and servicing',
        status: 'Pending',
        totalCost: currentSelectedService.estimatedPrice,
        carId: selectedCarId !== 'custom' ? Number(selectedCarId) : undefined,
      });

      setIsSubmitting(false);
      setConfirmedBooking(newAppt);
      setSelectedServiceForBooking(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedBooking) {
    return (
      <div id="booking-confirmation-view" className="py-16 bg-slate-50 min-h-screen animate-in fade-in duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            {/* Confirmation Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-10 text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Appointment Booked Successfully!
              </h1>
              <p className="text-emerald-100 text-sm mt-2 max-w-md mx-auto">
                Thank you, {confirmedBooking.customerName}. We have received your booking and queued it with our master technicians.
              </p>
              
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/30 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-wider">
                <span>Reference Code:</span>
                <span className="text-emerald-300 text-sm font-black">{confirmedBooking.bookingReference}</span>
              </div>
            </div>

            {/* Confirmation Details Summary */}
            <div className="p-8 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Scheduled Service
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <ServiceIcon name="Wrench" className="w-4 h-4 text-blue-600" />
                      {confirmedBooking.serviceName}
                    </p>
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      Estimated Cost: ${confirmedBooking.totalCost}.00
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Date & Time Slot
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {confirmedBooking.serviceDate} at {confirmedBooking.serviceTime}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Vehicle Details
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-slate-500" />
                      {confirmedBooking.carYear} {confirmedBooking.carBrand} {confirmedBooking.carModel}
                    </p>
                    <span className="text-xs text-slate-500 font-mono">
                      Plate: {confirmedBooking.licensePlate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Customer Contact
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {confirmedBooking.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem notes */}
              {confirmedBooking.problemDescription && (
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-700">
                  <span className="font-bold text-blue-900 block mb-1">Customer Problem Description:</span>
                  <p>{confirmedBooking.problemDescription}</p>
                </div>
              )}

              {/* What happens next instructions */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  What Happens Next?
                </h3>
                <ol className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Please arrive at <strong className="text-slate-800">1420 Motorway Blvd</strong> approximately 10 minutes before your scheduled time ({confirmedBooking.serviceTime}).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Our Service Advisor will check in your vehicle, inspect key fluids, and update the status to <span className="font-semibold text-indigo-600">"In Service"</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Track repair progress live inside your <strong className="text-slate-800">Customer Dashboard</strong>.
                    </span>
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  id="go-to-dashboard-btn"
                  onClick={() => navigate('dashboard')}
                  className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 text-center"
                >
                  View in Customer Dashboard
                </button>

                <button
                  id="print-confirmation-btn"
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  id="book-another-btn"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setProblemDescription('');
                  }}
                  className="w-full sm:w-auto py-3 px-4 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors text-center"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // BOOKING FORM VIEW
  return (
    <div id="booking-page" className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Easy Online Appointment
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Book a Car Maintenance Service
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Fill in your vehicle details and preferred appointment slot. Our service team will prepare the diagnostic bay in advance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Form */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Customer Contact Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  1. Customer Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="booking-name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Customer Full Name *
                    </label>
                    <input
                      id="booking-name-input"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.customerName ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-rose-500 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-phone-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="booking-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 748-2910"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.phone ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle Information */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-600" />
                    2. Vehicle Specifications
                  </h3>

                  {/* Saved car shortcut */}
                  {userCars.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="select-saved-car" className="text-xs text-slate-500 font-medium">Quick Pick:</label>
                      <select
                        id="select-saved-car"
                        value={selectedCarId}
                        onChange={handleCarSelect}
                        className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="custom">+ Enter Another Car</option>
                        {userCars.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.year} {c.brand} {c.model} ({c.licensePlate})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label htmlFor="booking-car-brand" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Car Brand / Make *
                    </label>
                    <input
                      id="booking-car-brand"
                      type="text"
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      placeholder="e.g. Toyota, BMW"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.carBrand ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.carBrand && <p className="text-xs text-rose-500 mt-1">{errors.carBrand}</p>}
                  </div>

                  <div>
                    <label htmlFor="booking-car-model" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Car Model *
                    </label>
                    <input
                      id="booking-car-model"
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. Camry SE, 330i"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.carModel ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.carModel && <p className="text-xs text-rose-500 mt-1">{errors.carModel}</p>}
                  </div>

                  <div>
                    <label htmlFor="booking-car-year" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Manufacturing Year *
                    </label>
                    <input
                      id="booking-car-year"
                      type="number"
                      min={1980}
                      max={new Date().getFullYear() + 1}
                      value={carYear}
                      onChange={(e) => setCarYear(Number(e.target.value))}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.carYear ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.carYear && <p className="text-xs text-rose-500 mt-1">{errors.carYear}</p>}
                  </div>

                  <div>
                    <label htmlFor="booking-car-plate" className="block text-xs font-bold text-slate-700 mb-1.5">
                      License Plate *
                    </label>
                    <input
                      id="booking-car-plate"
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                      placeholder="7XYZ892"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm uppercase font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.licensePlate ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.licensePlate && (
                      <p className="text-xs text-rose-500 mt-1">{errors.licensePlate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Service Selection & Preferred Schedule */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  3. Service Package & Date
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {/* Service Type */}
                  <div className="sm:col-span-1">
                    <label htmlFor="booking-service-type" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Service Type *
                    </label>
                    <select
                      id="booking-service-type"
                      value={serviceId}
                      onChange={(e) => setServiceId(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (${s.estimatedPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div className="sm:col-span-1">
                    <label htmlFor="booking-date-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      id="booking-date-input"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                        errors.preferredDate ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.preferredDate && (
                      <p className="text-xs text-rose-500 mt-1">{errors.preferredDate}</p>
                    )}
                  </div>

                  {/* Preferred Time */}
                  <div className="sm:col-span-1">
                    <label htmlFor="booking-time-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <select
                      id="booking-time-select"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Problem Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  4. Problem Description / Special Instructions
                </h3>

                <div className="mt-4">
                  <label htmlFor="booking-description-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Describe any specific symptoms, dashboard warnings, or sounds (Optional)
                  </label>
                  <textarea
                    id="booking-description-input"
                    rows={4}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="e.g. Squeaking noise when braking at low speed, or scheduled 40k oil change and tire rotation request..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  id="submit-booking-btn"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Registering Booking...</span>
                  ) : (
                    <>
                      <span>Submit Booking</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-2.5">
                  No payment required today. Pay at the service center after your inspection is complete.
                </p>
              </div>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs sticky top-28 space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Service Summary
              </h3>

              {/* Service selected banner */}
              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                  <ServiceIcon name={currentSelectedService.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentSelectedService.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {currentSelectedService.description}
                  </p>
                </div>
              </div>

              {/* Line item breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Standard Labor & Inspection</span>
                  <span className="font-semibold text-slate-800">Included</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Estimated Duration</span>
                  <span className="font-mono font-semibold text-slate-800">
                    ~{currentSelectedService.estimatedDurationMins} minutes
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>12-Mo / 12k Mile Warranty</span>
                  <span className="font-semibold text-emerald-600">Complimentary</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Multi-Point Digital Inspection</span>
                  <span className="font-semibold text-emerald-600">Complimentary</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Total</span>
                  <p className="text-[11px] text-slate-500">Taxes calculated at shop</p>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ${currentSelectedService.estimatedPrice}.00
                </div>
              </div>

              {/* Trust Callout */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Free Cancellation
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  Need to reschedule? Cancel or change your appointment anytime from your dashboard with zero cancellation fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
