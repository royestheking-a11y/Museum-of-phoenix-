import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileAppNav from './MobileAppNav';
import StudioPOSModal from '../ui/StudioPOSModal';

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isPOSOpen?: boolean;
  onClosePOS?: () => void;
  onOpenPOS?: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export default function Layout({
  currentPage,
  onNavigate,
  isPOSOpen,
  onClosePOS,
  onOpenPOS,
  onLogout,
  children
}: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internalPosOpen, setInternalPosOpen] = useState(false);

  const effectivePosOpen = isPOSOpen !== undefined ? isPOSOpen : internalPosOpen;

  const handleOpenPOS = () => {
    setInternalPosOpen(true);
    onOpenPOS?.();
  };

  const handleClosePOS = () => {
    setInternalPosOpen(false);
    onClosePOS?.();
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileOpen(false); // close mobile drawer on navigate
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FAF8F3' }}>
      {/* Studio POS Modal */}
      <StudioPOSModal
        isOpen={effectivePosOpen}
        onClose={handleClosePOS}
        onSuccess={() => onNavigate('orders')}
      />

      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile App Navigation (Bottom Dock + Full All-Pages App Launcher) */}
      <MobileAppNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        onOpenPOS={handleOpenPOS}
        onLogout={onLogout}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onMobileMenuToggle={() => setMobileOpen(o => !o)}
          onOpenPOS={handleOpenPOS}
          onLogout={onLogout}
        />
        <main
          className="flex-1 overflow-y-auto pb-24 md:pb-6"
          style={{ background: '#FAF8F3' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
