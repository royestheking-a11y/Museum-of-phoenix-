import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { migrateLocalDataToMongo } from './store/migrateData';
import SplashScreen from './components/SplashScreen';
import HeroLanding, { NavPage } from './components/HeroLanding';
import MuseumGate from './components/MuseumGate';
import CollectionsPage from './components/CollectionsPage';
import ArticlesPage from './components/ArticlesPage';
import MembershipPage from './components/MembershipPage';
import AdminPanel from './components/AdminPanel';
import ContactPage from './components/ContactPage';
import LoginModal from './components/LoginModal';
import MuseumDome from './components/MuseumDome';
import HallView from './components/HallView';
import SearchModal from './components/SearchModal';
import AudioSystem from './components/AudioSystem';
import SymbolTimeline from './components/SymbolTimeline';
import ResearchLibrary from './components/ResearchLibrary';
import CourseDashboard from './components/CourseDashboard';
import ChairmanPage from './components/ChairmanPage';
import DynamicSEO from './components/DynamicSEO';
import { getUserSession, clearUserSession } from './utils/auth';

export type UserLevel = 'Visitor' | 'Researcher' | 'Scholar' | 'Guest' | 'Admin';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLevel, setUserLevel] = useState<UserLevel>('Guest');
  const [searchOpen, setSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleNavPage = useCallback((page: NavPage) => {
    if (page === 'login') { navigate('/login'); return; }
    if (page === 'register') { navigate('/register'); return; }
    if (page === 'museum') { navigate(getUserSession() ? '/dome' : '/gate'); return; }
    const map: Partial<Record<NavPage | 'chairman', string>> = {
      collections: '/collections', research: '/research', courses: '/courses',
      articles: '/articles', membership: '/membership', admin: '/admin', contact: '/contact',
      chairman: '/chairman'
    };
    const t = map[page]; if (t) navigate(t);
  }, [navigate]);

  useEffect(() => {
    migrateLocalDataToMongo();
    const interval = setInterval(() => {
      const s = getUserSession();
      if (s) setUserLevel(s.level as UserLevel);
      else setUserLevel('Guest');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (['/home', '/gate', '/dome'].includes(location.pathname)) {
      localStorage.setItem('vm_has_visited', 'true');
    }

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (location.pathname !== '/' && location.pathname !== '/gate') setSearchOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [location.pathname]);

  useEffect(() => {
    import('./utils/soundManager').then(({ soundManager }) => {
      soundManager.setGlobalSoundEnabled(soundEnabled);
    });
  }, [soundEnabled]);

  const currentHallForAudio = location.pathname === '/dome' ? 0 : location.pathname.startsWith('/hall/') ? parseInt(location.pathname.split('/')[2]) : 0;
  const showAudio = !['/', '/gate', '/admin'].includes(location.pathname);
  const hasVisited = localStorage.getItem('vm_has_visited');
  
  const showLoginModal = ['/login', '/register', '/upgrade', '/profile'].includes(location.pathname);
  const loginTab = location.pathname.substring(1) as any;

  return (
    <>
      <DynamicSEO />
      <div className="w-full h-full overflow-hidden"
        style={{ background: '#062B24', fontFamily: 'Inter, "IBM Plex Sans Arabic", sans-serif' }}>
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            hasVisited ? <Navigate to="/home" replace /> : <SplashScreen key="splash" onEnter={() => { navigate('/home'); setSoundEnabled(true); }} />
          } />
          
          <Route path="/home" element={
            <HeroLanding key="hero"
              onEnterMuseum={() => navigate('/gate')}
              onOpenSearch={() => setSearchOpen(true)}
              onNavigate={handleNavPage}
              onRegister={() => navigate('/register')}
              onLogout={() => { clearUserSession(); setUserLevel('Guest'); navigate('/home'); }} />
          } />

          <Route path="/gate" element={
            <MuseumGate key="gate" onEnter={() => navigate('/dome')} />
          } />

          <Route path="/dome" element={
            <MuseumDome key="dome"
              userLevel={userLevel}
              onUpgradeRequired={() => navigate('/upgrade')}
              onOpenProfile={() => navigate('/profile')}
              onHome={() => navigate('/home')}
              onSelectHall={(id) => navigate(`/hall/${id}`)}
              onOpenSearch={() => setSearchOpen(true)}
              onOpenTimeline={() => navigate('/timeline')}
              onOpenResearch={() => navigate('/research')}
              onOpenCourses={() => navigate('/courses')} />
          } />

          <Route path="/hall/:id" element={
            <HallView key={`hall-${location.pathname}`} hallId={parseInt(location.pathname.split('/')[2] || '1')}
              onBack={() => navigate('/dome')}
              onHome={() => navigate('/home')}
              onOpenSearch={() => setSearchOpen(true)}
              onSelectHall={(id) => navigate(`/hall/${id}`)} />
          } />

          <Route path="/timeline" element={<SymbolTimeline key="timeline" onBack={() => navigate('/dome')} />} />
          <Route path="/research" element={<ResearchLibrary key="research" onBack={() => navigate('/dome')} />} />
          <Route path="/courses" element={<CourseDashboard key="courses" onBack={() => navigate('/dome')} />} />
          <Route path="/collections" element={<CollectionsPage key="collections" onBack={() => navigate('/home')} onGoToHall={(id) => navigate(`/hall/${id}`)} />} />
          <Route path="/articles" element={<ArticlesPage key="articles" onBack={() => navigate('/home')} />} />
          <Route path="/membership" element={
            <MembershipPage key="membership"
              userLevel={userLevel}
              onBack={() => navigate('/home')}
              onLogin={() => navigate('/login')}
              onRegister={() => navigate('/register')} />
          } />
          
          <Route path="/admin" element={
            userLevel === 'Admin' ? <AdminPanel key="admin" onBack={() => navigate('/home')} /> : <Navigate to="/home" replace />
          } />
          
          <Route path="/contact" element={<ContactPage key="contact" onBack={() => navigate('/home')} />} />
          <Route path="/chairman" element={<ChairmanPage key="chairman" onBack={() => navigate('/home')} />} />
          
          {/* Catch all modals that act as overlays */}
          <Route path="/login" element={<HeroLanding key="hero-login" onEnterMuseum={() => navigate('/gate')} onOpenSearch={() => setSearchOpen(true)} onNavigate={handleNavPage} onRegister={() => navigate('/register')} onLogout={() => { clearUserSession(); setUserLevel('Guest'); navigate('/home'); }} />} />
          <Route path="/register" element={<HeroLanding key="hero-register" onEnterMuseum={() => navigate('/gate')} onOpenSearch={() => setSearchOpen(true)} onNavigate={handleNavPage} onRegister={() => navigate('/register')} onLogout={() => { clearUserSession(); setUserLevel('Guest'); navigate('/home'); }} />} />
          <Route path="/profile" element={<MuseumDome key="dome-profile" userLevel={userLevel} onUpgradeRequired={() => navigate('/upgrade')} onOpenProfile={() => navigate('/profile')} onHome={() => navigate('/home')} onSelectHall={(id) => navigate(`/hall/${id}`)} onOpenSearch={() => setSearchOpen(true)} onOpenTimeline={() => navigate('/timeline')} onOpenResearch={() => navigate('/research')} onOpenCourses={() => navigate('/courses')} />} />
          <Route path="/upgrade" element={<MuseumDome key="dome-upgrade" userLevel={userLevel} onUpgradeRequired={() => navigate('/upgrade')} onOpenProfile={() => navigate('/profile')} onHome={() => navigate('/home')} onSelectHall={(id) => navigate(`/hall/${id}`)} onOpenSearch={() => setSearchOpen(true)} onOpenTimeline={() => navigate('/timeline')} onOpenResearch={() => navigate('/research')} onOpenCourses={() => navigate('/courses')} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {showAudio && (
        <div className="fixed z-[200] right-5 bottom-[180px] md:bottom-[90px] md:right-[20px]">
          <AudioSystem currentHall={currentHallForAudio} enabled={soundEnabled} onToggle={() => setSoundEnabled(e => !e)} />
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)}
        onNavigate={(hallId) => { navigate(`/hall/${hallId}`); setSearchOpen(false); }} />

      <LoginModal 
        open={showLoginModal} 
        initialTab={loginTab === 'profile' ? 'login' : loginTab} 
        onClose={() => navigate(-1)}
        onAdminAccess={() => { 
          setUserLevel('Admin'); 
          navigate('/admin'); 
        }}
        onEnterMuseum={(level) => { 
          setUserLevel(level); 
          navigate('/gate'); 
          setSoundEnabled(true); 
        }} 
        onLogout={() => {
          clearUserSession();
          setUserLevel('Guest');
          navigate('/home');
        }}
      />
    </div>
    </>
  );
}
