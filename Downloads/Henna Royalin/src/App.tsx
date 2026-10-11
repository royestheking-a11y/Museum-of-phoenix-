import { useState, useEffect } from 'react';
import hennaLogo from './imports/Henna_Royalin.png';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import ProductionCapacity from './pages/ProductionCapacity';
import Payments from './pages/Payments';
import EmployeeSalary from './pages/EmployeeSalary';
import StaffAccess from './pages/StaffAccess';
import Reports from './pages/Reports';
import Steadfast from './pages/Steadfast';
import Settings from './pages/Settings';
import { watchAuthState, signOut } from './lib/auth';
import { getPageFromLocation, syncLocation, PAGE_TITLES, type Page } from './lib/routes';

export type { Page };

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(() => getPageFromLocation());
  const [isPOSOpen, setIsPOSOpen] = useState(false);

  const navigate = (page: string, replace = false) => {
    const resolved = (page as Page);
    setCurrentPage(resolved);
    syncLocation(resolved, replace);
  };

  // Sync initial URL and listen for browser back / forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const page = getPageFromLocation();
      setCurrentPage(page);
      document.title = PAGE_TITLES[page] || 'Henna Royalin';
    };

    // Ensure initial URL and document title match current page
    syncLocation(currentPage, true);

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Real Firebase auth state — persists across browser refreshes + OTP session
  useEffect(() => {
    const checkOtpSession = () => localStorage.getItem("hr_otp_logged_in") === "true";
    if (checkOtpSession()) {
      setIsLoggedIn(true);
      setAuthLoading(false);
    }
    const unsubscribe = watchAuthState((user) => {
      if (user || checkOtpSession()) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} onOpenPOS={() => navigate('pos')} />;
      case 'pos':
        return <POS onNavigate={navigate} />;
      case 'order':
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers onNavigate={navigate} />;
      case 'product':
      case 'products':
        return <Products onNavigate={navigate} />;
      case 'stock':
        return <Inventory onNavigate={navigate} defaultTab="cones" />;
      case 'production':
      case 'production-capacity':
        return <ProductionCapacity onNavigate={navigate} />;
      case 'inventory':
        return <Inventory onNavigate={navigate} defaultTab="materials" />;
      case 'payment':
      case 'payments':
        return <Payments />;
      case 'employees':
      case 'payroll':
        return <EmployeeSalary />;
      case 'staff':
      case 'roles':
      case 'users-roles':
        return <StaffAccess />;
      case 'report':
      case 'reports':
        return <Reports defaultTab="overview" />;
      case 'analytics':
        return <Reports defaultTab="pl" />;
      case 'steadfast':
        return <Steadfast />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={navigate} onOpenPOS={() => navigate('pos')} />;
    }
  };

  return (
    <ModalProvider>
      {authLoading ? (
        /* ── Premium Branded Loading Screen ── */
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #5A0000 0%, #720000 45%, #8B0000 100%)' }}>

          {/* Keyframe styles */}
          <style>{`
            @keyframes hr-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
            @keyframes hr-shimmer { 0%{opacity:.35} 50%{opacity:1} 100%{opacity:.35} }
            @keyframes hr-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes hr-spin-rev { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
            @keyframes hr-progress { 0%{width:0%} 100%{width:88%} }
            @keyframes hr-fade-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
            .hr-float { animation: hr-float 3s ease-in-out infinite; }
            .hr-shimmer { animation: hr-shimmer 2s ease-in-out infinite; }
            .hr-spin-slow { animation: hr-spin-slow 8s linear infinite; }
            .hr-spin-rev { animation: hr-spin-rev 12s linear infinite; }
            .hr-fade-in { animation: hr-fade-in 0.7s ease forwards; }
            .hr-progress-bar { animation: hr-progress 2.4s cubic-bezier(0.4,0,0.2,1) forwards; }
          `}</style>

          {/* Background ornamental ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.05 }}>
            <div className="hr-spin-slow" style={{ width: 700, height: 700 }}>
              <svg viewBox="0 0 700 700" width="700" height="700" fill="none">
                <circle cx="350" cy="350" r="330" stroke="#D9A900" strokeWidth="0.8"/>
                <circle cx="350" cy="350" r="280" stroke="#D9A900" strokeWidth="0.5"/>
                <circle cx="350" cy="350" r="220" stroke="#D9A900" strokeWidth="1"/>
                {[0,45,90,135,180,225,270,315].map(a => {
                  const rad = (a * Math.PI) / 180;
                  const x = 350 + 330 * Math.cos(rad), y = 350 + 330 * Math.sin(rad);
                  return <circle key={a} cx={x} cy={y} r="6" fill="#D9A900"/>;
                })}
              </svg>
            </div>
          </div>

          {/* Floating gold orbs */}
          <div className="absolute top-16 left-16 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,169,0,0.18) 0%, transparent 70%)' }}/>
          <div className="absolute bottom-20 right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,169,0,0.12) 0%, transparent 70%)' }}/>
          <div className="absolute top-1/2 left-0 w-32 h-80 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(217,169,0,0.07), transparent)' }}/>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center hr-fade-in">

            {/* Logo with spinning gold ring */}
            <div className="hr-float mb-8 relative flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="absolute hr-spin-slow" style={{ width: 148, height: 148 }}>
                <svg viewBox="0 0 148 148" width="148" height="148" fill="none">
                  <circle cx="74" cy="74" r="70" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="8 6"/>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="148" y2="148">
                      <stop offset="0%" stopColor="#D9A900" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="#F8E29B" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="#D9A900" stopOpacity="0.9"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Inner reverse ring */}
              <div className="absolute hr-spin-rev" style={{ width: 118, height: 118 }}>
                <svg viewBox="0 0 118 118" width="118" height="118" fill="none">
                  <circle cx="59" cy="59" r="55" stroke="#D9A900" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="4 8"/>
                </svg>
              </div>
              {/* Logo container */}
              <div className="relative rounded-full flex items-center justify-center"
                style={{ width: 100, height: 100, background: 'linear-gradient(135deg, rgba(217,169,0,0.25) 0%, rgba(217,169,0,0.08) 100%)', border: '1.5px solid rgba(217,169,0,0.5)', boxShadow: '0 0 40px rgba(217,169,0,0.2), 0 8px 32px rgba(0,0,0,0.4)' }}>
                <img
                  src={hennaLogo}
                  alt="Henna Royalin"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="hr-shimmer"
                  style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(217,169,0,0.3))' }}
                />
              </div>
            </div>

            {/* Brand name */}
            <h1 className="font-serif font-bold text-[#FFFBF5] mb-1" style={{ fontSize: '2rem', letterSpacing: '-0.01em', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
              Henna Royalin
            </h1>

            {/* Subtitle with gold dividers */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, #D9A900)' }}/>
              <span style={{ color: '#F8E29B', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope' }}>
                Business Suite
              </span>
              <div className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, #D9A900)' }}/>
            </div>

            {/* Progress bar */}
            <div className="rounded-full overflow-hidden" style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full hr-progress-bar" style={{ background: 'linear-gradient(90deg, #D9A900, #F8E29B, #D9A900)', width: 0 }}/>
            </div>

            <p className="mt-4 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Manrope', letterSpacing: '0.08em' }}>
              Loading your workspace…
            </p>
          </div>
        </div>
      ) : !isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Layout
          currentPage={currentPage}
          onNavigate={navigate}
          isPOSOpen={isPOSOpen}
          onClosePOS={() => setIsPOSOpen(false)}
          onOpenPOS={() => navigate('pos')}
          onLogout={() => { localStorage.removeItem("hr_otp_logged_in"); localStorage.removeItem("hr_logged_email"); signOut(); setIsLoggedIn(false); }}
        >
          {renderPage()}
        </Layout>
      )}
    </ModalProvider>
  );
}
