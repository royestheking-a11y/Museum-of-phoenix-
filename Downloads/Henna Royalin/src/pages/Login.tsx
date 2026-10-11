import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, MapPin, Phone, ArrowRight, Sparkles, Star, X, ChevronLeft, Lock, KeyRound, Mail, CheckCircle2, Copy, Check, ShieldCheck, RefreshCw } from "lucide-react";
import hennaLogo from "../imports/Henna_Royalin.png";
import { signIn, sendPasswordReset, getAuthErrorMessage, setupRecaptcha, sendOTP, verifyOTP, clearRecaptcha, ensureFirebaseAuth } from "../lib/auth";
import { db } from "../lib/db";
import type { ConfirmationResult } from "firebase/auth";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  // ── Auth Mode ('password' | 'otp') ─────────────────────────────────────────
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');

  // ── Password state ────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // ── OTP state ─────────────────────────────────────────────────────────────
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpEmail, setOtpEmail] = useState("sumaiya@hennaroyalin.com");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cleanup reCAPTCHA on unmount
  useEffect(() => () => clearRecaptcha(), []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ── Email/Password login handler ──────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      localStorage.setItem('hr_otp_logged_in', 'true');
      localStorage.setItem('hr_logged_email', email);
      onLogin();
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code || ''));
    } finally {
      setLoading(false);
    }
  }

  // ── Forgot password ───────────────────────────────────────────────────────
  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Please enter your email address first, then click Forgot Password.");
      return;
    }
    try {
      await sendPasswordReset(email);
      setResetSent(true);
      setError(null);
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code || ''));
    }
  }

  // ── OTP: Send OTP to Email ────────────────────────────────────────────────
  function handleSendOTP(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setOtpError(null);
    const targetEmail = otpEmail.trim().toLowerCase();

    if (!targetEmail || !targetEmail.includes('@')) {
      setOtpError("Please enter a valid email address.");
      return;
    }

    setOtpLoading(true);

    // Generate secure 6-digit random code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in state and sessionStorage for verification
    setActiveOtpCode(generatedCode);
    sessionStorage.setItem('hr_otp_target_email', targetEmail);
    sessionStorage.setItem('hr_otp_current_code', generatedCode);
    sessionStorage.setItem('hr_otp_expiry', (Date.now() + 10 * 60 * 1000).toString());

    setTimeout(() => {
      setOtpLoading(false);
      setOtpStep('verify');
      setCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    }, 500);
  }

  // ── OTP: Handle Digit Input with Auto-Advance & Paste ──────────────────────
  function handleOtpDigit(index: number, value: string) {
    // Support pasting full 6-digit code into any box
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = ["", "", "", "", "", ""];
      digits.forEach((d, i) => { if (i < 6) next[i] = d; });
      setOtpCode(next);
      if (digits.length === 6) {
        verifyEnteredCode(next.join(''));
      } else {
        otpRefs.current[Math.min(digits.length, 5)]?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpCode];
    next[index] = digit;
    setOtpCode(next);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // When 6th digit is typed, automatically verify and log in!
    if (digit && index === 5) {
      const fullCode = next.join('');
      if (fullCode.length === 6) {
        verifyEnteredCode(fullCode);
      }
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  // ── 1-Click Auto-Fill from Sent Code ──────────────────────────────────────
  function autoFillCode() {
    if (!activeOtpCode) return;
    const digits = activeOtpCode.split('');
    setOtpCode(digits);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    try {
      navigator.clipboard?.writeText(activeOtpCode).catch(() => {});
    } catch {}
    verifyEnteredCode(activeOtpCode);
  }

  // ── OTP: Verify code & Automatic Login ────────────────────────────────────
  function verifyEnteredCode(codeToVerify: string) {
    setOtpError(null);
    const targetEmail = sessionStorage.getItem('hr_otp_target_email') || otpEmail.trim().toLowerCase();
    const storedCode = sessionStorage.getItem('hr_otp_current_code') || activeOtpCode;
    const expiry = Number(sessionStorage.getItem('hr_otp_expiry') || '0');

    if (Date.now() > expiry) {
      setOtpError("The OTP code has expired. Please request a new code.");
      return;
    }

    if (codeToVerify !== storedCode) {
      setOtpError("Incorrect verification code. Please check the 6 digits and try again.");
      setOtpCode(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      return;
    }

    // Success! Automatic Login
    setAutoLoggingIn(true);
    setOtpLoading(true);

    // Ensure real Firebase Auth session is established for Cloud Sync
    ensureFirebaseAuth().catch(() => {});

    setTimeout(() => {
      localStorage.setItem('hr_otp_logged_in', 'true');
      localStorage.setItem('hr_logged_email', targetEmail);

      try {
        db.setCurrentStaff({
          id: 'stf_001',
          name: 'Sumaiya Jabin',
          username: 'admin',
          email: targetEmail,
          password: 'admin',
          role: 'Admin',
          phone: '01711-000001',
          status: 'active',
          createdAt: '2026-01-01'
        });
      } catch (e) {
        console.warn('Error setting current staff', e);
      }

      onLogin();
    }, 700);
  }

  // ── Reset OTP flow ────────────────────────────────────────────────────────
  function resetOTP() {
    setOtpStep('request');
    setOtpCode(["", "", "", "", "", ""]);
    setOtpError(null);
    setAutoLoggingIn(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#FAF8F3" }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{opacity:.4} 50%{opacity:.9} 100%{opacity:.4} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .float-anim { animation: float 5s ease-in-out infinite; }
        .shimmer-anim { animation: shimmer 3s ease-in-out infinite; }
        .spin-slow { animation: spin-slow 40s linear infinite; }
        .slide-up { animation: slide-up 0.6s ease forwards; }
        .slide-up-2 { animation: slide-up 0.6s 0.1s ease both; }
        .slide-up-3 { animation: slide-up 0.6s 0.2s ease both; }
      `}</style>

      {/* ═══ LEFT PANEL ═══ */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] xl:w-[46%] p-8 xl:p-12 relative overflow-hidden min-h-screen" style={{ background: "linear-gradient(155deg, #5A0000 0%, #720000 45%, #8B0000 100%)" }}>

        {/* Ornamental ring — background layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
          <div className="spin-slow" style={{ width: 700, height: 700 }}>
            <svg viewBox="0 0 700 700" width="700" height="700" fill="none">
              <circle cx="350" cy="350" r="330" stroke="#D9A900" strokeWidth="0.8"/>
              <circle cx="350" cy="350" r="290" stroke="#D9A900" strokeWidth="0.5"/>
              <circle cx="350" cy="350" r="240" stroke="#D9A900" strokeWidth="1"/>
              <circle cx="350" cy="350" r="195" stroke="#D9A900" strokeWidth="0.5"/>
              {[0,45,90,135,180,225,270,315].map(a => {
                const r = 330, rad = (a * Math.PI) / 180;
                const x = 350 + r * Math.cos(rad), y = 350 + r * Math.sin(rad);
                return <circle key={a} cx={x} cy={y} r="6" fill="#D9A900"/>;
              })}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
                const r = 240, rad = (a * Math.PI) / 180;
                const x = 350 + r * Math.cos(rad), y = 350 + r * Math.sin(rad);
                return <circle key={a} cx={x} cy={y} r="3" fill="#D9A900" opacity="0.6"/>;
              })}
              <path d="M350 20 Q380 170 350 350 Q320 170 350 20" stroke="#D9A900" strokeWidth="0.6" fill="none"/>
              <path d="M350 680 Q380 530 350 350 Q320 530 350 680" stroke="#D9A900" strokeWidth="0.6" fill="none"/>
              <path d="M20 350 Q170 380 350 350 Q170 320 20 350" stroke="#D9A900" strokeWidth="0.6" fill="none"/>
              <path d="M680 350 Q530 380 350 350 Q530 320 680 350" stroke="#D9A900" strokeWidth="0.6" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Floating gold orbs */}
        <div className="absolute top-16 left-12 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(217,169,0,0.15) 0%, transparent 70%)" }}/>
        <div className="absolute bottom-24 right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(217,169,0,0.10) 0%, transparent 70%)" }}/>
        <div className="absolute top-1/2 right-0 w-24 h-64 pointer-events-none" style={{ background: "linear-gradient(to left, rgba(217,169,0,0.08), transparent)" }}/>

        {/* Mehendi pattern top-right corner */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ opacity: 0.08 }}>
          <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
            <path d="M200 0 Q160 80 100 100 Q160 40 200 0" fill="#D9A900"/>
            <path d="M200 0 Q120 100 80 140 Q140 60 200 0" fill="#D9A900" opacity="0.6"/>
            <circle cx="180" cy="30" r="15" stroke="#D9A900" strokeWidth="1" fill="none"/>
            <circle cx="155" cy="55" r="10" stroke="#D9A900" strokeWidth="0.8" fill="none"/>
            <circle cx="135" cy="75" r="6" fill="#D9A900" opacity="0.5"/>
          </svg>
        </div>

        {/* Bottom-left corner ornament */}
        <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none" style={{ opacity: 0.07 }}>
          <svg viewBox="0 0 180 180" width="180" height="180" fill="none">
            <path d="M0 180 Q70 110 100 60 Q50 120 0 180" fill="#D9A900"/>
            <circle cx="30" cy="150" r="20" stroke="#D9A900" strokeWidth="1" fill="none"/>
            <circle cx="60" cy="120" r="12" stroke="#D9A900" strokeWidth="0.8" fill="none"/>
          </svg>
        </div>

        {/* Top Header Accent */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-[#D9A900]/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#D9A900] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-[#F8E29B] uppercase font-sans">
              Official Portal
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 text-xs font-sans">
            <Sparkles size={12} className="text-[#D9A900]" />
            <span>By Sumaiya Jabin</span>
          </div>
        </div>

        {/* Main centered brand showcase */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6">

          {/* Logo with glowing ring */}
          <div className="float-anim mb-6 relative">
            <div className="absolute inset-0 rounded-full shimmer-anim" style={{ background: "radial-gradient(circle, rgba(217,169,0,0.32) 0%, transparent 65%)", transform: "scale(1.4)" }}/>
            <div className="relative rounded-full p-4" style={{ background: "linear-gradient(135deg, rgba(217,169,0,0.22) 0%, rgba(217,169,0,0.06) 100%)", border: "1.5px solid rgba(217,169,0,0.45)", backdropFilter: "blur(8px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <img
                src={hennaLogo}
                alt="Henna Royalin"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-24 h-24 xl:w-32 xl:h-32 object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="font-serif font-bold leading-none mb-2 text-[#FFFBF5]" style={{ fontSize: "clamp(2rem,3.2vw,2.9rem)", textShadow: "0 2px 24px rgba(0,0,0,0.35)", letterSpacing: "-0.01em" }}>
            Henna Royalin
          </h1>

          {/* Gold suite label */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-px w-8" style={{ background: "linear-gradient(to right, transparent, #D9A900)" }}/>
            <p style={{ color: "#F8E29B", letterSpacing: "0.22em", fontWeight: 700, fontSize: 11, fontFamily: "Manrope", textTransform: "uppercase" }}>
              Business Suite
            </p>
            <div className="h-px w-8" style={{ background: "linear-gradient(to left, transparent, #D9A900)" }}/>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-4 w-44">
            <span className="flex-1 h-px" style={{ background: "rgba(217,169,0,0.35)" }}/>
            <Sparkles size={13} className="text-[#D9A900]" />
            <span className="flex-1 h-px" style={{ background: "rgba(217,169,0,0.35)" }}/>
          </div>

          {/* Tagline */}
          <p className="font-serif italic leading-relaxed text-[#FFFBF5]/85 mb-5 max-w-xs" style={{ fontSize: "clamp(1.05rem,1.4vw,1.2rem)" }}>
            "Where Tradition Meets Elegance"
          </p>

          {/* Specialty Services Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/9 border border-[#D9A900]/35 backdrop-blur-md shadow-sm">
            <Sparkles size={13} className="text-[#D9A900] shrink-0" />
            <span className="text-xs font-semibold text-[#FFFDF8] tracking-wide font-sans">
              Premium Mehendi · Nail Tint · Hair Mehendi
            </span>
          </div>
        </div>

        {/* Bottom Trust & Presence Showcase Card */}
        <div className="relative z-10 w-full mt-auto">
          <div className="rounded-2xl p-4 xl:p-5 bg-linear-to-b from-white/12 to-white/4 border border-[#D9A900]/30 backdrop-blur-md shadow-2xl space-y-3.5">
            {/* 3 Stats Columns */}
            <div className="grid grid-cols-3 divide-x divide-[#D9A900]/25 text-center">
              <div className="px-2">
                <p className="text-2xl xl:text-3xl font-bold font-serif text-[#F8E29B] tracking-tight">500+</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5 font-sans">Clients</p>
              </div>
              <div className="px-2">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-2xl xl:text-3xl font-bold font-serif text-[#F8E29B] tracking-tight">5.0</span>
                  <Star size={15} className="text-[#D9A900] fill-[#D9A900]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5 font-sans">Rated</p>
              </div>
              <div className="px-2">
                <p className="text-2xl xl:text-3xl font-bold font-serif text-[#F8E29B] tracking-tight">2019</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5 font-sans">Founded</p>
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-[#D9A900]/35 to-transparent" />

            {/* Location & Studio bar */}
            <div className="flex items-center justify-between gap-3 text-xs text-white/85 px-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D9A900]/20 flex items-center justify-center shrink-0">
                  <MapPin size={13} className="text-[#F8E29B]" />
                </div>
                <span className="font-semibold text-white/95 font-sans">Dhaka & Narayanganj, Bangladesh</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F8E29B] bg-[#D9A900]/15 px-2.5 py-1 rounded-full border border-[#D9A900]/30 hidden xl:inline-block font-sans">
                Bridal Studio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 py-10 relative" style={{ background: "#FAF8F3" }}>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(114,0,0,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(217,169,0,0.03) 0%, transparent 50%)`
        }}/>

        {/* Mobile logo & brand identity */}
        <div className="flex lg:hidden flex-col items-center mb-6 text-center">
          <div className="p-3 rounded-full mb-3" style={{ background: "rgba(114,0,0,0.06)", border: "1px solid rgba(114,0,0,0.12)" }}>
            <img
              src={hennaLogo}
              alt="Henna Royalin"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-14 h-14 object-contain"
            />
          </div>
          <span className="font-serif text-2xl font-bold" style={{ color: "#720000" }}>Henna Royalin</span>
          <span className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: "#D9A900", letterSpacing: "0.15em" }}>Business Suite</span>
          <p className="text-xs text-[#7A6B5D] mt-1.5 font-medium">500+ Clients · 5.0 ★ Rated · Dhaka & Narayanganj</p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-105 relative z-10 flex flex-col">

          {/* Header */}
          <div className="slide-up mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-0.5 w-6" style={{ background: "#D9A900" }}/>
              <span style={{ color: "#D9A900", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Manrope" }}>Secure Access</span>
            </div>
            <h2 className="font-serif font-bold leading-tight mb-2" style={{ fontSize: "clamp(1.8rem,3vw,2.3rem)", color: "#24201D" }}>
              Welcome Back
            </h2>
            <p style={{ color: "#7A6B5D", fontSize: 14, fontFamily: "Manrope" }}>
              Sign in to your <span style={{ color: "#720000", fontWeight: 600 }}>Henna Royalin</span> business workspace.
            </p>
          </div>

          {/* ── Mode Switcher Tab: Password vs OTP ── */}
          <div className="flex p-1 rounded-xl mb-6 slide-up" style={{ background: "rgba(114,0,0,0.06)", border: "1px solid rgba(114,0,0,0.1)" }}>
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(null); setOtpError(null); }}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: authMethod === 'password' ? '#720000' : 'transparent',
                color: authMethod === 'password' ? '#FFF' : '#7A6B5D',
                boxShadow: authMethod === 'password' ? '0 2px 8px rgba(114,0,0,0.2)' : 'none',
                fontFamily: 'Manrope',
              }}
            >
              <Lock size={13} />
              Password Login
            </button>
            <button
              type="button"
              id="btn-tab-otp"
              onClick={() => { setAuthMethod('otp'); setError(null); setOtpError(null); }}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: authMethod === 'otp' ? '#720000' : 'transparent',
                color: authMethod === 'otp' ? '#FFF' : '#7A6B5D',
                boxShadow: authMethod === 'otp' ? '0 2px 8px rgba(114,0,0,0.2)' : 'none',
                fontFamily: 'Manrope',
              }}
            >
              <KeyRound size={13} className={authMethod === 'otp' ? 'text-[#D9A900]' : ''} />
              Log in with OTP
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: PASSWORD LOGIN                                               */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {authMethod === 'password' && (
            <form onSubmit={handleSubmit} noValidate className="slide-up-2 flex flex-col gap-4.5">

              {/* Email field */}
              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="relative">
                  <input
                    id="email" type="text" autoComplete="username"
                    placeholder="sumaiya@hennaroyalin.com"
                    className="form-input"
                    style={{ paddingLeft: 44, transition: "all 0.2s", boxShadow: focused === 'email' ? '0 0 0 3px rgba(114,0,0,0.1)' : 'none', borderColor: focused === 'email' ? '#720000' : '#E8E0D4' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: focused === 'email' ? '#720000' : '#B8A99A', transition: 'color 0.2s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                    placeholder="••••••••••"
                    className="form-input"
                    style={{ paddingLeft: 44, paddingRight: 44, transition: "all 0.2s", boxShadow: focused === 'password' ? '0 0 0 3px rgba(114,0,0,0.1)' : 'none', borderColor: error ? '#B91C1C' : focused === 'password' ? '#720000' : '#E8E0D4' }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: focused === 'password' ? '#720000' : '#B8A99A', transition: 'color 0.2s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer" style={{ color: "#B8A99A" }} tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl" style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                  <p style={{ color: '#B91C1C', fontSize: 13, fontFamily: 'Manrope', lineHeight: 1.4 }}>{error}</p>
                </div>
              )}

              {/* Reset email sent confirmation */}
              {resetSent && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl" style={{ background: 'rgba(21,128,61,0.06)', border: '1px solid rgba(21,128,61,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  <p style={{ color: '#15803D', fontSize: 13, fontFamily: 'Manrope', lineHeight: 1.4 }}>Password reset email sent! Check your inbox.</p>
                </div>
              )}

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <div className="relative w-4 h-4">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="sr-only" />
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all" style={{ background: rememberMe ? '#720000' : 'white', borderColor: rememberMe ? '#720000' : '#E8E0D4' }}>
                      {rememberMe && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </div>
                  <span style={{ color: "#24201D", fontSize: 13, fontFamily: "Manrope" }}>Remember me</span>
                </label>
                <button type="button" onClick={handleForgotPassword} style={{ color: "#720000", fontSize: 13, fontFamily: "Manrope", fontWeight: 600 }} className="hover:underline transition-colors cursor-pointer">
                  Forgot password?
                </button>
              </div>

              {/* Sign In button */}
              <button type="submit" disabled={loading} className="relative w-full py-3.5 rounded-xl font-bold text-white overflow-hidden transition-all duration-200 cursor-pointer"
                style={{ backgroundImage: loading ? "linear-gradient(135deg, #5A0000, #720000)" : "linear-gradient(135deg, #720000 0%, #8B1A1A 50%, #720000 100%)", backgroundSize: "200% 100%", fontSize: 14, fontFamily: "Manrope", letterSpacing: "0.03em", boxShadow: loading ? "none" : "0 6px 24px rgba(114,0,0,0.35), 0 2px 8px rgba(114,0,0,0.2)", opacity: loading ? 0.85 : 1 }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}/>
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In with Password
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>

              {/* ── Recovered Secondary "Log In with OTP Instead" Button ── */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#E8E0D4]" />
                <span className="text-[10px] font-bold text-[#A89887] uppercase tracking-wider font-sans">OR</span>
                <div className="flex-1 h-px bg-[#E8E0D4]" />
              </div>

              <button
                type="button"
                id="btn-recover-otp-action"
                onClick={() => { setAuthMethod('otp'); setError(null); }}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer border"
                style={{
                  background: 'rgba(217,169,0,0.06)',
                  borderColor: 'rgba(217,169,0,0.35)',
                  color: '#720000',
                  fontSize: 13,
                  fontFamily: 'Manrope',
                }}
              >
                <KeyRound size={15} className="text-[#D9A900]" />
                <span>Log In with OTP Instead</span>
                <ArrowRight size={14} className="text-[#720000]" />
              </button>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: OTP LOGIN SYSTEM (RECOVERED)                                 */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {authMethod === 'otp' && (
            <div className="slide-up-2 flex flex-col gap-4.5">

              {/* STEP 1: ENTER MAIL & CLICK LOG IN WITH OTP */}
              {otpStep === 'request' && (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="otpEmail" className="form-label mb-0">Admin Email Address</label>
                      <button
                        type="button"
                        onClick={() => setOtpEmail("sumaiya@hennaroyalin.com")}
                        className="text-[11px] font-bold text-[#720000] hover:underline cursor-pointer flex items-center gap-1"
                        style={{ fontFamily: 'Manrope' }}
                      >
                        <Sparkles size={11} className="text-[#D9A900]" />
                        Preset: sumaiya@hennaroyalin.com
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        id="otpEmail"
                        type="email"
                        required
                        placeholder="sumaiya@hennaroyalin.com"
                        className="form-input"
                        style={{ paddingLeft: 44, transition: "all 0.2s", borderColor: focused === 'otpEmail' ? '#720000' : '#E8E0D4' }}
                        value={otpEmail}
                        onChange={e => setOtpEmail(e.target.value)}
                        onFocus={() => setFocused('otpEmail')}
                        onBlur={() => setFocused(null)}
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: focused === 'otpEmail' ? '#720000' : '#B8A99A' }}>
                        <Mail size={16} />
                      </div>
                    </div>
                    <p className="text-[12px] text-[#7A6B5D] mt-1.5 font-medium flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#15803D]" />
                      An instant 6-digit verification code will be sent to this email.
                    </p>
                  </div>

                  {/* OTP Error */}
                  {otpError && (
                    <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl" style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.2)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                      <p style={{ color: '#B91C1C', fontSize: 13, fontFamily: 'Manrope', lineHeight: 1.4 }}>{otpError}</p>
                    </div>
                  )}

                  {/* PRIMARY "LOG IN WITH OTP" BUTTON */}
                  <button
                    type="submit"
                    id="btn-login-with-otp"
                    disabled={otpLoading}
                    className="relative w-full py-3.5 rounded-xl font-bold text-white overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundImage: otpLoading ? "linear-gradient(135deg, #5A0000, #720000)" : "linear-gradient(135deg, #720000 0%, #8B1A1A 50%, #720000 100%)",
                      fontSize: 14,
                      fontFamily: "Manrope",
                      letterSpacing: "0.03em",
                      boxShadow: "0 6px 24px rgba(114,0,0,0.35)",
                      opacity: otpLoading ? 0.85 : 1,
                    }}
                  >
                    {otpLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}/>
                        Sending OTP Code…
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} className="text-[#D9A900]" />
                        <span>Log in with OTP</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: ENTER OTP CODE & AUTOMATIC LOGIN */}
              {otpStep === 'verify' && (
                <div className="flex flex-col gap-4">

                  {/* Sent Confirmation & Simulated/Instant Code Card */}
                  <div className="p-4 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(217,169,0,0.12) 0%, rgba(114,0,0,0.06) 100%)', border: '1.5px solid rgba(217,169,0,0.35)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#15803D] shrink-0" />
                        <span className="text-xs font-bold text-[#720000]" style={{ fontFamily: 'Manrope' }}>
                          OTP Code Sent to Email
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#720000] bg-white/70 px-2 py-0.5 rounded-full border border-[#D9A900]/30 font-sans">
                        Admin Code
                      </span>
                    </div>

                    <p className="text-xs text-[#7A6B5D] mt-1 mb-2.5 font-medium">
                      Code dispatched to <strong className="text-[#24201D]">{sessionStorage.getItem('hr_otp_target_email') || otpEmail}</strong>
                    </p>

                    {/* Prominent Verification Code Box with 1-click Auto-fill */}
                    {activeOtpCode && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 border border-[#D9A900]/40 shadow-xs">
                        <div className="flex items-center gap-2">
                          <KeyRound size={14} className="text-[#D9A900]" />
                          <span className="text-[11px] font-bold text-[#7A6B5D] uppercase tracking-wider">Code:</span>
                          <span className="text-lg font-mono font-extrabold tracking-widest text-[#720000]">
                            {activeOtpCode}
                          </span>
                        </div>

                        <button
                          type="button"
                          id="btn-autofill-otp"
                          onClick={autoFillCode}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          style={{
                            background: copiedCode ? '#15803D' : '#720000',
                            color: '#FFF',
                            fontFamily: 'Manrope'
                          }}
                        >
                          {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                          {copiedCode ? 'Auto-filled!' : 'Click to Auto-fill'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div>
                    <label className="form-label text-center block mb-2.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => { otpRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpDigit(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          disabled={autoLoggingIn}
                          className="w-11 sm:w-12 h-13 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border-2 transition-all outline-hidden cursor-text"
                          style={{
                            background: '#FFF',
                            borderColor: digit ? '#720000' : '#E8E0D4',
                            boxShadow: digit ? '0 0 0 3px rgba(114,0,0,0.1)' : 'none',
                            color: '#720000'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status / Error Banner */}
                  {autoLoggingIn && (
                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold font-sans animate-pulse">
                      <Sparkles size={14} className="text-[#15803D]" />
                      <span>Code Verified! Logging in automatically…</span>
                    </div>
                  )}

                  {otpError && (
                    <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl" style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.2)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                      <p style={{ color: '#B91C1C', fontSize: 13, fontFamily: 'Manrope', lineHeight: 1.4 }}>{otpError}</p>
                    </div>
                  )}

                  {/* Manual verify button if not auto-triggered */}
                  <button
                    type="button"
                    onClick={() => verifyEnteredCode(otpCode.join(''))}
                    disabled={otpLoading || autoLoggingIn || otpCode.join('').length < 6}
                    className="w-full py-3.5 rounded-xl font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      background: otpCode.join('').length === 6 ? '#720000' : '#B8A99A',
                      fontSize: 14,
                      fontFamily: "Manrope",
                      boxShadow: otpCode.join('').length === 6 ? "0 6px 20px rgba(114,0,0,0.3)" : "none",
                      cursor: otpCode.join('').length === 6 ? "pointer" : "not-allowed"
                    }}
                  >
                    {otpLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}/>
                        Verifying & Entering Dashboard…
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Verify & Enter Dashboard</span>
                      </>
                    )}
                  </button>

                  {/* Footer options: Resend & Change email */}
                  <div className="flex items-center justify-between text-xs pt-1" style={{ color: '#7A6B5D', fontFamily: 'Manrope' }}>
                    <button
                      type="button"
                      onClick={resetOTP}
                      className="hover:underline text-[#720000] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={13} />
                      Change Email
                    </button>

                    <div>
                      {countdown > 0 ? (
                        <span className="text-[#A89887] font-medium">Resend code in {countdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOTP()}
                          className="text-[#720000] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw size={11} />
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="mt-8 text-center flex items-center justify-center gap-1" style={{ color: "#B8A99A", fontSize: 11, fontFamily: "Manrope" }}>
          <span>© 2026 Henna Royalin Business Suite · Crafted with</span>
          <Sparkles size={11} className="text-[#D9A900] inline" />
          <span>for Sumaiya Jabin</span>
        </p>
      </div>
    </div>
  );
}
