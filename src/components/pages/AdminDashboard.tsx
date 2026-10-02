import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, ServiceItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ServiceIcon } from '../common/ServiceIcon';
import {
  Shield,
  Users,
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  FileText,
  Mail,
  ChevronDown,
  TrendingUp,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    cars,
    services,
    appointments,
    contactMessages,
    updateAppointmentStatus,
    addService,
    updateService,
    deleteService,
    markMessageRead,
    switchRole,
  } = useApp();

  // Active admin section tab
  const [adminTab, setAdminTab] = useState<'appointments' | 'services' | 'customers' | 'cars' | 'inquiries'>('appointments');

  // Appointment filters
  const [apptStatusFilter, setApptStatusFilter] = useState<string>('All');
  const [apptSearch, setApptSearch] = useState('');

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState<number>(79);
  const [serviceDuration, setServiceDuration] = useState<number>(60);
  const [serviceIcon, setServiceIcon] = useState('Wrench');

  // Tech Notes Modal
  const [editingNotesApptId, setEditingNotesApptId] = useState<number | null>(null);
  const [techNotesText, setTechNotesText] = useState('');

  // Ensure user is admin, or show easy switch banner
  const isSuperAdmin = currentUser?.role === 'admin';

  // KPI Calculations
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalCars = cars.length;
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;
  const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'Completed')
    .reduce((sum, a) => sum + (Number(a.totalCost) || 0), 0);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchStatus = apptStatusFilter === 'All' || a.status === apptStatusFilter;
      const matchSearch =
        a.customerName.toLowerCase().includes(apptSearch.toLowerCase()) ||
        a.bookingReference.toLowerCase().includes(apptSearch.toLowerCase()) ||
        a.licensePlate.toLowerCase().includes(apptSearch.toLowerCase()) ||
        a.serviceName.toLowerCase().includes(apptSearch.toLowerCase()) ||
        a.carBrand.toLowerCase().includes(apptSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [appointments, apptStatusFilter, apptSearch]);

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceName('');
    setServiceCategory('General');
    setServiceDesc('');
    setServicePrice(69);
    setServiceDuration(45);
    setServiceIcon('Wrench');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceCategory(service.category);
    setServiceDesc(service.description);
    setServicePrice(service.estimatedPrice);
    setServiceDuration(service.estimatedDurationMins);
    setServiceIcon(service.iconName);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: serviceName.trim(),
        category: serviceCategory.trim() || 'General',
        description: serviceDesc.trim(),
        estimatedPrice: Number(servicePrice),
        estimatedDurationMins: Number(serviceDuration),
        iconName: serviceIcon,
      });
    } else {
      addService({
        name: serviceName.trim(),
        category: serviceCategory.trim() || 'General',
        description: serviceDesc.trim(),
        estimatedPrice: Number(servicePrice),
        estimatedDurationMins: Number(serviceDuration),
        iconName: serviceIcon,
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      });
    }

    setIsServiceModalOpen(false);
  };

  const handleOpenNotes = (apptId: number, existingNotes?: string) => {
    setEditingNotesApptId(apptId);
    setTechNotesText(existingNotes || '');
  };

  const handleSaveNotes = () => {
    if (editingNotesApptId) {
      const appt = appointments.find((a) => a.id === editingNotesApptId);
      if (appt) {
        updateAppointmentStatus(editingNotesApptId, appt.status, techNotesText.trim());
      }
      setEditingNotesApptId(null);
    }
  };

  return (
    <div id="admin-dashboard-page" className="py-10 bg-slate-100/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  CarCare Workshop Command
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider border border-blue-400/30">
                  Manager Portal
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Real-time shop operations, appointments dispatch, customer garage registry, and pricing catalog.
              </p>
            </div>
          </div>

          {!isSuperAdmin && (
            <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-300">Viewing as Customer:</span>
              <button
                onClick={() => switchRole('admin')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
              >
                Switch to Admin
              </button>
            </div>
          )}
        </div>

        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Customers</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {totalCustomers}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Active accounts</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Cars</span>
              <Car className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {totalCars}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Registered fleet</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Appointments</span>
              <Calendar className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {totalAppointments}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Total booked</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2 font-mono">
              {pendingAppointments}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Needs review</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
              {completedAppointments}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Services done</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Realized
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            id="admin-tab-appointments"
            onClick={() => setAdminTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              adminTab === 'appointments'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments Manager ({appointments.length})</span>
          </button>

          <button
            id="admin-tab-services"
            onClick={() => setAdminTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              adminTab === 'services'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Services Catalog ({services.length})</span>
          </button>

          <button
            id="admin-tab-customers"
            onClick={() => setAdminTab('customers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              adminTab === 'customers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers Roster ({totalCustomers})</span>
          </button>

          <button
            id="admin-tab-cars"
            onClick={() => setAdminTab('cars')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              adminTab === 'cars'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicle Registry ({cars.length})</span>
          </button>

          <button
            id="admin-tab-inquiries"
            onClick={() => setAdminTab('inquiries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              adminTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Messages ({contactMessages.length})</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS MANAGEMENT */}
        {adminTab === 'appointments' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-4">
            {/* Filter and search toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={apptSearch}
                  onChange={(e) => setApptSearch(e.target.value)}
                  placeholder="Search customer, ref, or plate..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs font-semibold">
                {['All', 'Pending', 'Confirmed', 'In Service', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setApptStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      apptStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Ref / Date</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Vehicle</th>
                    <th className="px-5 py-3.5">Service Package</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Status & Action</th>
                    <th className="px-5 py-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                        No appointments match current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] block w-fit">
                            {appt.bookingReference}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-1">
                            {appt.serviceDate} • {appt.serviceTime}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-800">
                          <div>{appt.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{appt.phone}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-900">
                            {appt.carYear} {appt.carBrand} {appt.carModel}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 uppercase">
                            {appt.licensePlate}
                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {appt.serviceName}
                        </td>

                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          ${appt.totalCost}.00
                        </td>

                        <td className="px-5 py-4">
                          {/* Live Status Switcher */}
                          <div className="flex items-center gap-2">
                            <select
                              id={`admin-status-select-${appt.id}`}
                              value={appt.status}
                              onChange={(e) =>
                                updateAppointmentStatus(appt.id, e.target.value as AppointmentStatus)
                              }
                              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Service">In Service</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleOpenNotes(appt.id, appt.mechanicNotes)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline truncate max-w-[120px] block"
                          >
                            {appt.mechanicNotes ? appt.mechanicNotes : '+ Add Note'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES MANAGEMENT */}
        {adminTab === 'services' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Maintenance Services Catalog</h3>
                <p className="text-xs text-slate-500">
                  Manage repair services, adjust labor rates, and add new specialty procedures.
                </p>
              </div>

              <button
                id="add-new-service-btn"
                onClick={handleOpenAddService}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  id={`admin-service-card-${service.id}`}
                  className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-300 transition-all bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditService(service)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete service "${service.name}"?`)) {
                              deleteService(service.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                        <ServiceIcon name={service.iconName} className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{service.name}</h4>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">~{service.estimatedDurationMins} min</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ${service.estimatedPrice}.00
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMERS TABLE */}
        {adminTab === 'customers' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registered Customers</h3>
              <p className="text-xs text-slate-500">
                Directory of vehicle owners registered in the CarCare database.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Customer Name</th>
                    <th className="px-5 py-3.5">Contact Details</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Garage Cars</th>
                    <th className="px-5 py-3.5">Total Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const countCars = cars.filter((c) => c.userId === u.id).length;
                    const countAppts = appointments.filter((a) => a.userId === u.id).length;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 flex items-center gap-3">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={u.fullName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="font-bold text-slate-900">{u.fullName}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-slate-800">{u.email}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-800">
                          {countCars} vehicles
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-blue-600">
                          {countAppts} bookings
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: VEHICLE REGISTRY TABLE */}
        {adminTab === 'cars' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Vehicle Registry</h3>
              <p className="text-xs text-slate-500">
                All client cars registered in the workshop garage system.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">License Plate</th>
                    <th className="px-5 py-3.5">Make & Model</th>
                    <th className="px-5 py-3.5">Year</th>
                    <th className="px-5 py-3.5">Mileage</th>
                    <th className="px-5 py-3.5">Registered Owner</th>
                    <th className="px-5 py-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cars.map((car) => {
                    const owner = users.find((u) => u.id === car.userId);
                    return (
                      <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {car.licensePlate}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {car.brand} {car.model}
                        </td>
                        <td className="px-5 py-4 font-mono">{car.year}</td>
                        <td className="px-5 py-4 font-mono font-medium text-slate-700">
                          {car.mileage.toLocaleString()} mi
                        </td>
                        <td className="px-5 py-4 font-medium text-blue-600">
                          {owner ? owner.fullName : 'Guest'}
                        </td>
                        <td className="px-5 py-4 text-slate-500 truncate max-w-xs">
                          {car.notes || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: INQUIRIES */}
        {adminTab === 'inquiries' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Customer Inquiries Inbox</h3>
              <p className="text-xs text-slate-500">
                Inquiries received through the Contact & Support page form.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                    msg.isRead ? 'bg-white' : 'bg-blue-50/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{msg.subject}</span>
                      {!msg.isRead && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{msg.message}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>From: {msg.fullName} ({msg.email})</span>
                      {msg.phone && <span>• Tel: {msg.phone}</span>}
                    </div>
                  </div>

                  {!msg.isRead && (
                    <button
                      onClick={() => markMessageRead(msg.id)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shrink-0"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingService ? 'Edit Maintenance Service' : 'Add New Service Package'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Transmission Flush"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    placeholder="e.g. Drivetrain"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Icon Style</label>
                  <select
                    value={serviceIcon}
                    onChange={(e) => setServiceIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Wrench">Wrench</option>
                    <option value="Droplet">Droplet (Fluids)</option>
                    <option value="Cpu">Cpu (Engine)</option>
                    <option value="Disc">Disc (Brakes)</option>
                    <option value="CircleDot">CircleDot (Tires)</option>
                    <option value="Zap">Zap (Battery)</option>
                    <option value="Wind">Wind (AC)</option>
                    <option value="Gauge">Gauge (Diagnostics)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(Number(e.target.value))}
                    min={10}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Detailed breakdown of labor, replacement parts, and fluids..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technician Notes Modal */}
      {editingNotesApptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Technician Bay Work Log & Notes
              </h3>
              <button
                onClick={() => setEditingNotesApptId(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Notes entered here will be visible on the customer's dashboard and work summary.
            </p>

            <textarea
              rows={4}
              value={techNotesText}
              onChange={(e) => setTechNotesText(e.target.value)}
              placeholder="e.g. Assigned to Bay 2. Master Tech Dave. Completed 50-point inspection, brake pads measured at 8mm..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingNotesApptId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
