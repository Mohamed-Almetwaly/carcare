import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Car,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { sendContactMessage } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;

    sendContactMessage({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
    });

    setIsSent(true);
    setFullName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'Do I have to pay upfront when booking an appointment online?',
      a: 'No upfront payment is required! When you book online, your bay time is reserved. Payment is settled at the service center only after your technician completes the inspection or repair.',
    },
    {
      q: 'How long does a standard oil change or brake inspection take?',
      a: 'Standard oil & filter replacements take approximately 45 minutes. Comprehensive brake pad service and multi-point inspections take between 60 to 90 minutes. You are welcome to wait in our lounge with complimentary Wi-Fi and artisan coffee.',
    },
    {
      q: 'Are your mechanics certified and is work covered by warranty?',
      a: 'Yes, every mechanic on our floor holds ASE Master Certification. Furthermore, all parts and labor performed at CarCare include our complimentary 12-Month / 12,000-Mile nationwide warranty.',
    },
    {
      q: 'Can I drop off my vehicle before normal business hours?',
      a: 'Yes! We have an illuminated 24/7 Key Drop Box located directly beside Bay 1. Simply lock your car in our client lot and slide the key into the drop slot with your booking reference number.',
    },
  ];

  return (
    <div id="contact-page" className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Direct Support & Workshop Inquiries
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            We're Here to Help Keep You Moving
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Have questions about custom performance upgrades, fleet commercial servicing, or appointment times? Get in touch with our team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Main Facility
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">1420 Motorway Blvd</p>
              <p className="text-xs text-slate-500">Suite 100, Auto District, CA 90210</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Customer Care & Dispatch
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">+1 (800) 555-CARE</p>
              <p className="text-xs text-slate-500">Mon - Sat: 7:30 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Email Inquiries
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">service@carcare.com</p>
              <p className="text-xs text-slate-500">Average response time: 2 hours</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Operating Hours
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">Mon - Sat: 7:30 - 18:00</p>
              <p className="text-xs text-slate-500">Sunday: Closed for maintenance</p>
            </div>
          </div>
        </div>

        {/* Contact Form & Facility Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900">Send an Inquiry Message</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Our service advisors inspect every message directly and reply promptly.
            </p>

            {isSent && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Thank you! Your message was submitted.</strong>
                  A CarCare technician or advisor will contact you shortly via email or phone.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Michael Rossi"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michael@example.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Fleet Service Inquiry or Timing Belt Quote"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your vehicle model, year, and what services or questions you have..."
                  required
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                id="contact-form-submit-btn"
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Message</span>
              </button>
            </form>
          </div>

          {/* Facility Location Map Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs overflow-hidden">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Service Center Location
              </h3>

              {/* Map Illustration / Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Service Center Location Map"
                  className="w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-blue-900/15 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-white shadow-xl text-center flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1 shadow-md">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">CarCare Main Hub</span>
                    <span className="text-[10px] text-slate-500 font-medium">Bays 1-8 • Express Lane</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Convenient Amenities on Site:</p>
                <p>• High-speed Wi-Fi lounge with private work desks</p>
                <p>• Courtesy shuttle within 10-mile radius</p>
                <p>• Complimentary electric vehicle charging while in service</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs max-w-4xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 mt-1">
              Common questions regarding our scheduling, warranties, and garage inspections.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
