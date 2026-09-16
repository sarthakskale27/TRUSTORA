import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Auth / Landing
import { LandingPage } from './pages/landing/LandingPage';
import { Login }       from './pages/auth/Login';
import { Register }    from './pages/auth/Register';

// Host portal
import { Layout }            from './components/layout/Layout';
import { OnboardingWizard }  from './pages/onboarding/OnboardingWizard';
import { Dashboard }         from './pages/dashboard/Dashboard';
import { PropertyList }      from './pages/properties/PropertyList';
import { PropertyDetail }    from './pages/properties/PropertyDetail';
import { AICopywriter }      from './pages/ai-tools/AICopywriter';
import { PhotoAnalyzer }     from './pages/ai-tools/PhotoAnalyzer';
import { DynamicPricing }    from './pages/pricing/DynamicPricing';
import { BookingManager }    from './pages/bookings/BookingManager';
import { WhatsAppConcierge } from './pages/assistant/WhatsAppConcierge';
import { TrustoraRadar }     from './pages/trust-radar/TrustoraRadar';
import { Analytics }         from './pages/analytics/Analytics';

// Guest portal
import { GuestLayout }    from './components/layout/GuestLayout';
import { GuestHome }      from './pages/guest/GuestHome';
import { PlanTrip }       from './pages/guest/PlanTrip';
import { NearMe }         from './pages/guest/NearMe';
import { MyBookings }     from './pages/guest/MyBookings';
import { Wishlist }       from './pages/guest/Wishlist';
import { MyReviews }      from './pages/guest/MyReviews';
import { GuestConcierge } from './pages/guest/GuestConcierge';
import { GuestProfile }   from './pages/guest/GuestProfile';

const Spinner = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading Trustora Intelligence...</p>
  </div>
);

/* ── GUEST APP ── */
const GuestApp = () => {
  const [activeTab, setActiveTab] = useState('guest-home');
  const renderView = () => {
    switch (activeTab) {
      case 'guest-home':      return <GuestHome onNavigate={setActiveTab} />;
      case 'plan-trip':       return <PlanTrip />;
      case 'near-me':         return <NearMe />;
      case 'browse':          return <PlanTrip />;
      case 'my-bookings':     return <MyBookings />;
      case 'wishlist':        return <Wishlist />;
      case 'my-reviews':      return <MyReviews />;
      case 'concierge-guest': return <GuestConcierge />;
      case 'guest-profile':   return <GuestProfile />;
      case 'guest-trust':     return <GuestProfile />;
      default:                return <GuestHome onNavigate={setActiveTab} />;
    }
  };
  return <GuestLayout activeTab={activeTab} setActiveTab={setActiveTab}>{renderView()}</GuestLayout>;
};

/* ── HOST APP ── */
const HostApp = () => {
  const [activeTab, setActiveTab]       = useState('dashboard');
  const [selectedPropertyId, setSelId] = useState(null);
  const renderView = () => {
    if (selectedPropertyId && activeTab === 'properties') {
      return <PropertyDetail propertyId={selectedPropertyId} onBack={() => setSelId(null)}
        onNavigateTab={(tab) => { setSelId(null); setActiveTab(tab); }} />;
    }
    switch (activeTab) {
      case 'dashboard':      return <Dashboard onNavigate={setActiveTab} />;
      case 'properties':     return <PropertyList onSelectProperty={setSelId} onAddNew={() => setActiveTab('onboarding')} />;
      case 'onboarding':     return <OnboardingWizard onComplete={() => setActiveTab('properties')} />;
      case 'ai-copywriter':  return <AICopywriter />;
      case 'photo-analyzer': return <PhotoAnalyzer />;
      case 'pricing':        return <DynamicPricing />;
      case 'bookings':       return <BookingManager />;
      case 'concierge':      return <WhatsAppConcierge />;
      case 'trust-radar':    return <TrustoraRadar />;
      case 'analytics':      return <Analytics />;
      default:               return <Dashboard onNavigate={setActiveTab} />;
    }
  };
  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => { setSelId(null); setActiveTab(tab); }}>
      {renderView()}
    </Layout>
  );
};

/* ── ROOT ── */
const AppContent = () => {
  const { user, loading } = useAuth();
  // authView: null=landing, 'login', 'register'
  const [authView, setAuthView]       = useState(null);
  const [initialPortal, setInitPortal] = useState(null);

  if (loading) return <Spinner />;

  if (!user) {
    if (authView === 'login') {
      return <Login
        initialPortal={initialPortal}
        onSwitchToRegister={() => setAuthView('register')}
        onBack={() => setAuthView(null)}
      />;
    }
    if (authView === 'register') {
      return <Register
        onSwitchToLogin={() => setAuthView('login')}
        onBack={() => setAuthView(null)}
      />;
    }
    // Landing page
    return <LandingPage
      onGuestLogin={() => { setInitPortal('guest'); setAuthView('login'); }}
      onHostLogin={()  => { setInitPortal('host');  setAuthView('login'); }}
      onRegister={()   => setAuthView('register')}
    />;
  }

  return user.role === 'guest' ? <GuestApp /> : <HostApp />;
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
