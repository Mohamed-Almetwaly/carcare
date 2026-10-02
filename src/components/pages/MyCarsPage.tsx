import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car as CarType } from '../../types';
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Gauge,
  X,
  Check,
  AlertCircle,
  Wrench,
  Shield,
} from 'lucide-react';

export const MyCarsPage: React.FC = () => {
  const { currentUser, userCars, addCar, updateCar, deleteCar, navigate, showToast } = useApp();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);

  // Form Fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2022);
  const [licensePlate, setLicensePlate] = useState('');
  const [mileage, setMileage] = useState<number>(25000);
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!currentUser) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen text-center px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Virtual Garage Access</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Sign in to manage your vehicles, record odometer readings, and schedule fast maintenance.
          </p>
          <button
            onClick={() => navigate('login')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors"
          >
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setBrand('');
    setModel('');
    setYear(new Date().getFullYear());
    setLicensePlate('');
    setMileage(25000);
    setColor('');
    setNotes('');
    setFormErrors({});
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (car: CarType) => {
    setEditingCar(car);
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year);
    setLicensePlate(car.licensePlate);
    setMileage(car.mileage);
    setColor(car.color || '');
    setNotes(car.notes || '');
    setFormErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!brand.trim()) errs.brand = 'Brand / Make is required';
    if (!model.trim()) errs.model = 'Model is required';
    if (!year || year < 1980 || year > new Date().getFullYear() + 1) {
      errs.year = 'Enter a valid model year (1980 - present)';
    }
    if (!licensePlate.trim()) errs.licensePlate = 'License plate is required';
    if (mileage === undefined || mileage < 0) errs.mileage = 'Enter a valid mileage';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingCar) {
      updateCar(editingCar.id, {
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        licensePlate: licensePlate.trim().toUpperCase(),
        mileage: Number(mileage),
        color: color.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setEditingCar(null);
    } else {
      addCar({
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        licensePlate: licensePlate.trim().toUpperCase(),
        mileage: Number(mileage),
        color: color.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  const handleDelete = (car: CarType) => {
    if (window.confirm(`Are you sure you want to remove ${car.year} ${car.brand} ${car.model} (${car.licensePlate}) from your garage?`)) {
      deleteCar(car.id);
    }
  };

  return (
    <div id="my-cars-page" className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Car className="w-4 h-4" />
              Vehicle Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              My Garage
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Keep your vehicle fleet specs, mileage, and maintenance logs synchronized.
            </p>
          </div>

          <button
            id="add-new-car-modal-btn"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Car</span>
          </button>
        </div>

        {/* Cars Grid */}
        {userCars.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your Garage is Empty</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto mb-6">
              Add your car to unlock instant 1-click booking, mileage tracking, and factory service recommendations.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              + Add Your First Car
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.map((car) => (
              <div
                key={car.id}
                id={`garage-car-card-${car.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: License plate + Actions */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                      {car.licensePlate}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        id={`edit-car-btn-${car.id}`}
                        onClick={() => handleOpenEdit(car)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-car-btn-${car.id}`}
                        onClick={() => handleDelete(car)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Make / Model / Year */}
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {car.brand}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-0.5">
                      {car.year} {car.model}
                    </h2>
                  </div>

                  {/* Specs Matrix */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Odometer Mileage
                      </span>
                      <div className="font-mono font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-blue-500" />
                        {car.mileage.toLocaleString()} mi
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Exterior Color
                      </span>
                      <div className="font-medium text-slate-800 mt-0.5 truncate">
                        {car.color || 'Unspecified'}
                      </div>
                    </div>
                  </div>

                  {car.notes && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600">
                      <span className="font-bold text-slate-700 block mb-0.5">Notes:</span>
                      <p className="line-clamp-2">{car.notes}</p>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    id={`car-book-now-${car.id}`}
                    onClick={() => navigate('booking')}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-600 group-hover/btn:text-white" />
                    <span>Book Service for This Car</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Car Modal */}
      {(isAddModalOpen || editingCar) && (
        <div id="car-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                {editingCar ? 'Edit Vehicle Information' : 'Add Vehicle to Garage'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCar(null);
                  resetForm();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Car Brand / Make *
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.brand && <p className="text-[11px] text-rose-500 mt-1">{formErrors.brand}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Car Model *
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Camry SE"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.model && <p className="text-[11px] text-rose-500 mt-1">{formErrors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.year && <p className="text-[11px] text-rose-500 mt-1">{formErrors.year}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="7XYZ892"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.licensePlate && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.licensePlate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mileage (mi) *
                  </label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.mileage && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.mileage}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exterior Paint Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Celestial Silver Metallic"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Garage Notes / Tire Packages (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Regular synthetic oil only. Winter tire package installed."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCar(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-car-submit-btn"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {editingCar ? 'Update Car' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
