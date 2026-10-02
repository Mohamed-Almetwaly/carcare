import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Car,
  ServiceItem,
  Appointment,
  AppointmentStatus,
  ContactMessage,
  PageView,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_CARS,
  INITIAL_APPOINTMENTS,
  INITIAL_MESSAGES,
} from '../data/initialData';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  currentPage: PageView;
  navigate: (page: PageView) => void;
  selectedServiceForBooking: ServiceItem | null;
  setSelectedServiceForBooking: (service: ServiceItem | null) => void;
  startBookingWithService: (service: ServiceItem) => void;
  
  // Data
  users: User[];
  cars: Car[];
  userCars: Car[];
  services: ServiceItem[];
  appointments: Appointment[];
  userAppointments: Appointment[];
  contactMessages: ContactMessage[];
  
  // CRUD Actions
  addCar: (car: Omit<Car, 'id' | 'userId' | 'createdAt'>) => void;
  updateCar: (id: number, updates: Partial<Car>) => void;
  deleteCar: (id: number) => void;
  
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: number, updates: Partial<ServiceItem>) => void;
  deleteService: (id: number) => void;
  
  createAppointment: (appointment: Omit<Appointment, 'id' | 'bookingReference' | 'userId' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: number, status: AppointmentStatus, notes?: string) => void;
  cancelAppointment: (id: number) => void;
  
  sendContactMessage: (msg: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>) => void;
  markMessageRead: (id: number) => void;
  
  // Auth
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (data: { fullName: string; email: string; phone: string; password?: string }) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: 'customer' | 'admin' | 'guest') => void;
  
  // Toasts & Modals
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isSqlModalOpen: boolean;
  setIsSqlModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  
  // Modals & Toasts
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persistent States
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('carcare_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('carcare_current_user');
    if (saved) return JSON.parse(saved);
    // Default to Sarah Jenkins (Customer) for immediate seamless exploration
    return INITIAL_USERS[1];
  });

  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem('carcare_cars');
    return saved ? JSON.parse(saved) : INITIAL_CARS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('carcare_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('carcare_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('carcare_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('carcare_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('carcare_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('carcare_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('carcare_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('carcare_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('carcare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('carcare_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBookingWithService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    navigate('booking');
  };

  // Auth Functions
  const login = (email: string, _password?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Welcome back, ${foundUser.fullName}!`, 'success');
      if (foundUser.role === 'admin') {
        navigate('admin');
      } else {
        navigate('dashboard');
      }
      return { success: true };
    }

    showToast('Invalid credentials. Try sarah.j@example.com or admin@carcare.com', 'error');
    return { success: false, message: 'User not found' };
  };

  const register = (data: { fullName: string; email: string; phone: string; password?: string }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);

    if (exists) {
      showToast('An account with this email already exists.', 'error');
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      id: Date.now(),
      fullName: data.fullName,
      email: normalizedEmail,
      phone: data.phone,
      role: 'customer',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created successfully! Welcome to CarCare, ${newUser.fullName}.`, 'success');
    navigate('dashboard');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
    navigate('home');
  };

  const switchRole = (role: 'customer' | 'admin' | 'guest') => {
    if (role === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      showToast('Switched to Admin Account (Marcus Vance)', 'info');
      navigate('admin');
    } else if (role === 'customer') {
      const customerUser = users.find((u) => u.email === 'sarah.j@example.com') || INITIAL_USERS[1];
      setCurrentUser(customerUser);
      showToast('Switched to Customer Account (Sarah Jenkins)', 'info');
      navigate('dashboard');
    } else {
      setCurrentUser(null);
      showToast('Viewing as Guest Visitor', 'info');
      navigate('home');
    }
  };

  // Car Management
  const addCar = (carData: Omit<Car, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newCar: Car = {
      ...carData,
      id: Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setCars((prev) => [newCar, ...prev]);
    showToast(`${newCar.brand} ${newCar.model} added to your garage!`, 'success');
  };

  const updateCar = (id: number, updates: Partial<Car>) => {
    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Vehicle details updated successfully.', 'success');
  };

  const deleteCar = (id: number) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    showToast('Vehicle removed from garage.', 'info');
  };

  // Service Management (Admin)
  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: Date.now(),
    };
    setServices((prev) => [...prev, newService]);
    showToast(`Service "${newService.name}" created.`, 'success');
  };

  const updateService = (id: number, updates: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Service package updated.', 'success');
  };

  const deleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service removed from catalog.', 'info');
  };

  // Appointment Management
  const createAppointment = (
    data: Omit<Appointment, 'id' | 'bookingReference' | 'userId' | 'createdAt'>
  ): Appointment => {
    const bookingRef = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = currentUser ? currentUser.id : 999;
    
    const newAppt: Appointment = {
      ...data,
      id: Date.now(),
      bookingReference: bookingRef,
      userId,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);
    showToast(`Appointment booked successfully! Ref: ${bookingRef}`, 'success');
    return newAppt;
  };

  const updateAppointmentStatus = (id: number, status: AppointmentStatus, notes?: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, ...(notes ? { mechanicNotes: notes } : {}) } : a))
    );
    showToast(`Appointment status updated to ${status}.`, 'info');
  };

  const cancelAppointment = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as AppointmentStatus } : a))
    );
    showToast('Appointment has been cancelled.', 'info');
  };

  // Contact Messages
  const sendContactMessage = (msgData: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: Date.now(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    showToast('Your message has been sent! Our team will reply shortly.', 'success');
  };

  const markMessageRead = (id: number) => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  // Derived user-specific data
  const userCars = currentUser ? cars.filter((c) => c.userId === currentUser.id) : [];
  const userAppointments = currentUser
    ? appointments.filter((a) => a.userId === currentUser.id)
    : [];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPage,
        navigate,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        startBookingWithService,
        users,
        cars,
        userCars,
        services,
        appointments,
        userAppointments,
        contactMessages,
        addCar,
        updateCar,
        deleteCar,
        addService,
        updateService,
        deleteService,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        sendContactMessage,
        markMessageRead,
        login,
        register,
        logout,
        switchRole,
        toasts,
        showToast,
        removeToast,
        isSqlModalOpen,
        setIsSqlModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
