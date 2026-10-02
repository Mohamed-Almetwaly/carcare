import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, Mail, Lock, Check, Shield, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid email or password.');
      }
    }, 450);
  };

  const handleFillDemo = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setEmail('sarah.j@example.com');
      setPassword('password123');
    } else {
      setEmail('admin@carcare.com');
      setPassword('password123');
    }
    setErrorMessage('');
  };

  return (
    <div id="login-page" className="py-16 bg-slate-50 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Banner */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/25 mb-4">
            <Wrench className="w-7 h-7 -rotate-45" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Sign In to CarCare
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Access your garage, view service history, and track live repairs.
          </p>
        </div>

        {/* Portfolio Demo Helper Card */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px]">
              Portfolio Quick Demo Sign-In
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
              Instant Fill
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="fill-demo-customer"
              onClick={() => handleFillDemo('customer')}
              className="px-3 py-2 bg-white hover:bg-blue-100/50 text-slate-700 border border-blue-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              id="fill-demo-admin"
              onClick={() => handleFillDemo('admin')}
              className="px-3 py-2 bg-white hover:bg-blue-100/50 text-slate-700 border border-blue-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() =>
                    showToast('Password reset link has been dispatched to your email.', 'info')
                  }
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                id="login-to-register-link"
                onClick={() => navigate('register')}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
