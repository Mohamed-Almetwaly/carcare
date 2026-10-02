import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, navigate } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!termsAgreed) {
      errs.terms = 'Please accept the service terms';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      setIsLoading(false);
      if (!res.success && res.message) {
        setErrors({ email: res.message });
      }
    }, 500);
  };

  return (
    <div id="register-page" className="py-16 bg-slate-50 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Banner */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/25 mb-4">
            <Wrench className="w-7 h-7 -rotate-45" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create a CarCare Account
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Schedule vehicle maintenance, track service logs, and manage your garage online.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                    errors.fullName ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                    errors.email ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 321-4567"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                    errors.phone ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                      errors.password ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                      errors.confirmPassword ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>
                  I agree to the CarCare Terms of Service and Privacy Policy.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-rose-500 mt-1">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <button
                id="register-to-login-link"
                onClick={() => navigate('login')}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
