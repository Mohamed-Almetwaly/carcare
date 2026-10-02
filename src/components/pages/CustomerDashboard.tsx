import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ServiceIcon } from '../common/ServiceIcon';
import {
  Calendar,
  Car,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  FileText,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    userCars,
    userAppointments,
    cancelAppointment,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] = useState<any | null>(null);

  // If not logged in or admin, prompt
  if (!currentUser) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen text-center px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Log into your CarCare customer account to view your scheduled services and vehicle garage.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('login')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Go to Login Page
            </button>
            <button
              onClick={() => navigate('register')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const upcomingAppointments = userAppointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Confirmed' || a.status === 'In Service'
  );

  const pastAppointments = userAppointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled'
  );

  const displayedAppointments =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : activeTab === 'past'
      ? pastAppointments
      : userAppointments;

  return (
    <div id="customer-dashboard-page" className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome back, {currentUser.fullName}!
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
                  Customer Portal
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.phone}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              id="dash-add-car-btn"
              onClick={() => navigate('my-cars')}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              <Car className="w-4 h-4 text-slate-600" />
              <span>My Cars ({userCars.length})</span>
            </button>
            <button
              id="dash-book-service-btn"
              onClick={() => navigate('booking')}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Service</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Appointments</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {userAppointments.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Lifetime service history</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming & Active</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 mt-2 font-mono">
              {upcomingAppointments.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Active in shop queue</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Servicing</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-2 font-mono">
              {pastAppointments.filter((a) => a.status === 'Completed').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Passed inspection</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Vehicles</span>
              <Car className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {userCars.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">In virtual garage</p>
          </div>
        </div>

        {/* My Cars Quick Carousel/Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">My Garage (Vehicles)</h2>
            </div>
            <button
              id="dash-manage-cars-btn"
              onClick={() => navigate('my-cars')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage Garage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {userCars.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
              <Car className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No cars added to your garage yet</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">
                Add your vehicle details for 1-click booking and service record keeping.
              </p>
              <button
                onClick={() => navigate('my-cars')}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                + Add Your First Car
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCars.map((car) => (
                <div
                  key={car.id}
                  id={`dashboard-car-card-${car.id}`}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {car.licensePlate}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {car.mileage.toLocaleString()} mi
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {car.year} {car.brand} {car.model}
                    </h3>
                    {car.color && (
                      <p className="text-xs text-slate-500 mt-0.5">Color: {car.color}</p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {userAppointments.filter((a) => a.licensePlate === car.licensePlate).length} services logged
                    </span>
                    <button
                      onClick={() => navigate('booking')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Book Service →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Service Appointments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of ongoing repairs, scheduled visits, and completed service history.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                id="dash-tab-all"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({userAppointments.length})
              </button>
              <button
                id="dash-tab-upcoming"
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                id="dash-tab-past"
                onClick={() => setActiveTab('past')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'past' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past & Cancelled ({pastAppointments.length})
              </button>
            </div>
          </div>

          {/* Appointments Table / Cards */}
          {displayedAppointments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No appointments in this category</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Schedule regular maintenance for your vehicle to keep it operating safely and efficiently.
              </p>
              <button
                onClick={() => navigate('booking')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Schedule an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedAppointments.map((appt) => (
                <div
                  key={appt.id}
                  id={`appointment-card-${appt.id}`}
                  className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <ServiceIcon name="Wrench" className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {appt.bookingReference}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {appt.serviceName}
                        </h4>
                        <StatusBadge status={appt.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium text-slate-800">
                          {appt.carYear} {appt.carBrand} {appt.carModel}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-500">{appt.licensePlate}</span>
                        <span className="text-slate-400">•</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {appt.serviceDate} at {appt.serviceTime}
                        </span>
                      </p>

                      {appt.mechanicNotes && (
                        <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 text-slate-700 mt-2 inline-block">
                          <strong className="text-slate-900">Technician Note:</strong> {appt.mechanicNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
                      <span className="text-lg font-black text-slate-900 font-mono">
                        ${appt.totalCost}.00
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppointmentForDetail(appt)}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        Details
                      </button>

                      {(appt.status === 'Pending' || appt.status === 'Confirmed') && (
                        <button
                          id={`cancel-appt-btn-${appt.id}`}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                              cancelAppointment(appt.id);
                            }
                          }}
                          className="px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointmentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {selectedAppointmentForDetail.bookingReference}
                </span>
                <StatusBadge status={selectedAppointmentForDetail.status} size="sm" />
              </div>
              <button
                onClick={() => setSelectedAppointmentForDetail(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedAppointmentForDetail.serviceName}
              </h3>
              <p className="text-xs text-slate-500">
                Scheduled for {selectedAppointmentForDetail.serviceDate} at {selectedAppointmentForDetail.serviceTime}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointmentForDetail.carYear} {selectedAppointmentForDetail.carBrand} {selectedAppointmentForDetail.carModel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License Plate:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedAppointmentForDetail.licensePlate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Center:</span>
                <span className="font-semibold text-slate-800">1420 Motorway Blvd, Auto District</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Estimated Price:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${selectedAppointmentForDetail.totalCost}.00
                </span>
              </div>
            </div>

            {selectedAppointmentForDetail.problemDescription && (
              <div className="text-xs">
                <span className="font-bold text-slate-700 block mb-1">Customer Problem Description:</span>
                <p className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-200">
                  {selectedAppointmentForDetail.problemDescription}
                </p>
              </div>
            )}

            {selectedAppointmentForDetail.mechanicNotes && (
              <div className="text-xs">
                <span className="font-bold text-indigo-900 block mb-1">Technician Bay Notes:</span>
                <p className="p-3 bg-indigo-50/70 rounded-lg text-indigo-950 border border-indigo-100">
                  {selectedAppointmentForDetail.mechanicNotes}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedAppointmentForDetail(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
