import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, KeyRound, Sparkles, Send, RefreshCw, LogIn } from 'lucide-react';
import API from '../api/client.js';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice.js';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Flow control: 'phone', 'otp', or 'password'
  const [step, setStep] = useState('phone'); // 'phone' is the identifier input step (accepts phone or email)
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  
  // Local validation & states
  const [localError, setLocalError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const [timer, setTimer] = useState(0);

  // Check if input looks like email dynamically
  const isInputEmail = emailOrPhone.includes('@') || /[a-zA-Z]/.test(emailOrPhone);

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Handle OTP Resend countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validateInput = (input) => {
    const val = input.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(val) || phoneRegex.test(val);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSendSuccess('');
    dispatch(clearError());

    if (!validateInput(emailOrPhone)) {
      setLocalError('Please enter a valid email address or a 10-digit mobile number.');
      return;
    }

    try {
      dispatch(loginStart());
      const response = await API.post('/auth/send-otp', { emailOrPhone });
      
      if (response.data && response.data.success) {
        dispatch(loginFailure(null)); // Clear loading state
        if (response.data.requirePassword) {
          setStep('password');
          setSendSuccess(response.data.message || 'Administrator account detected. Please enter your password.');
        } else {
          setSendSuccess(response.data.message || 'OTP has been successfully logged to the server console!');
          setStep('otp');
          setTimer(60); // 60 seconds resend cooldown
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err.response?.data?.message || 'Failed to send OTP. Server offline.'));
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    const code = step === 'password' ? password : otp;

    if (step === 'otp' && !/^\d{6}$/.test(code)) {
      setLocalError('OTP must be a 6-digit number.');
      return;
    }
    if (step === 'password' && !code) {
      setLocalError('Password is required.');
      return;
    }

    try {
      dispatch(loginStart());
      const response = await API.post('/auth/verify-otp', { emailOrPhone, otp: code });
      
      if (response.data && response.data.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err.response?.data?.message || 'Verification failed. Please check the credentials.'));
    }
  };

  const triggerResend = async () => {
    if (timer > 0) return;
    setSendSuccess('');
    dispatch(clearError());
    try {
      const response = await API.post('/auth/send-otp', { emailOrPhone });
      if (response.data && response.data.success) {
        setSendSuccess('New OTP code has been logged to the server console!');
        setTimer(60);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
        {/* Decorative corner background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -z-10" />

        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 shadow-inner">
            <LogIn size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {step === 'phone' ? 'Welcome Back' : step === 'password' ? 'Admin Login' : 'Verify Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto font-medium">
            {step === 'phone' 
              ? 'Enter your email address or mobile number to sign in or create an account.'
              : step === 'password'
              ? 'Enter your administrator password to access the merchant control panel.'
              : `Enter the 6-digit verification code sent to ${emailOrPhone}`}
          </p>
        </div>

        {/* Status / Errors */}
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
            {localError || error}
          </div>
        )}
        {sendSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-1.5 animate-pulse">
            <Sparkles size={16} className="text-emerald-500 shrink-0" />
            <span className="leading-snug">{sendSuccess}</span>
          </div>
        )}

        {/* STEP 1: Email or Phone input */}
        {step === 'phone' && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div className="rounded-md shadow-sm">
              <label htmlFor="identifier" className="sr-only">Email or Mobile Number</label>
              <div className="relative">
                <input
                  id="identifier"
                  name="emailOrPhone"
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Email or 10-digit mobile number"
                  className="block w-full px-5 py-3.5 border border-slate-200 rounded-2xl placeholder-slate-400 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  {isInputEmail ? <Mail size={18} /> : <Phone size={18} />}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="animate-spin mr-2" size={16} />
                ) : (
                  <Send className="mr-2" size={16} />
                )}
                <span>{loading ? 'Sending Code...' : 'Get Verification Code'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP verification */}
        {step === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="rounded-md shadow-sm">
              <label htmlFor="otp-code" className="sr-only">6-Digit OTP</label>
              <div className="relative">
                <input
                  id="otp-code"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP code"
                  className="block w-full px-4 py-3.5 border border-slate-200 rounded-2xl placeholder-slate-400 text-slate-800 font-semibold tracking-[0.25em] text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
              </div>
            </div>

            {/* Resend actions */}
            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-slate-500 hover:text-amber-600 transition-colors"
              >
                ← Edit Number / Email
              </button>
              {timer > 0 ? (
                <span className="text-slate-400">Resend in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={triggerResend}
                  className="text-amber-500 hover:text-amber-600 transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="animate-spin mr-2" size={16} />
                ) : (
                  <Sparkles className="mr-2 animate-pulse text-amber-200" size={16} />
                )}
                <span>{loading ? 'Verifying...' : 'Verify & Log In'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Admin Password input */}
        {step === 'password' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="rounded-md shadow-sm">
              <label htmlFor="admin-password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="block w-full px-5 py-3.5 border border-slate-200 rounded-2xl placeholder-slate-400 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-slate-500 hover:text-amber-600 transition-colors"
              >
                ← Back to Login
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="animate-spin mr-2" size={16} />
                ) : (
                  <Sparkles className="mr-2 animate-pulse text-amber-200" size={16} />
                )}
                <span>{loading ? 'Logging In...' : 'Verify & Log In'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
