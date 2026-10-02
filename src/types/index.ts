export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Car {
  id: number;
  userId: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
  color?: string;
  notes?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  estimatedPrice: number;
  estimatedDurationMins: number;
  iconName: string;
  imageUrl: string;
  isActive: boolean;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'In Service' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: number;
  bookingReference: string;
  userId: number;
  carId?: number;
  serviceId: number;
  serviceName: string;
  customerName: string;
  phone: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  licensePlate: string;
  serviceDate: string;
  serviceTime: string;
  problemDescription: string;
  status: AppointmentStatus;
  totalCost: number;
  mechanicNotes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  car: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export type PageView =
  | 'home'
  | 'services'
  | 'booking'
  | 'dashboard'
  | 'my-cars'
  | 'login'
  | 'register'
  | 'admin'
  | 'contact';
