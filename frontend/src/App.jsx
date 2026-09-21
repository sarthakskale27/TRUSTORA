import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Auth / Landing
import { LandingPage } from './pages/landing/LandingPage';
import { Login }       from './pages/auth/Login';
import { Register }    from './pages/auth/Register';

// Host Portal
import { Layout }                from './components/layout/Layout';
import { Dashboard }             from './pages/dashboard/Dashboard';
import { PropertyList }          from './pages/properties/PropertyList';
import { PropertyDetail }        from './pages/properties/PropertyDetail';
import { HostPropertyDetail }    from './pages/properties/HostPropertyDetail';
import { TrustoraRadar }         from './pages/trust-radar/TrustoraRadar';
import { HostVerification }      from './pages/trust-radar/HostVerification';
import { FraudRadar }            from './pages/trust-radar/FraudRadar';
import { ReviewAnomalyRadar }    from './pages/trust-radar/ReviewAnomalyRadar';
import { NeighbourhoodVibe }     from './pages/trust-radar/NeighbourhoodVibe';
import { OnboardingWizard }      from './pages/onboarding/OnboardingWizard';
import { AICopywriter }          from './pages/ai-tools/AICopywriter';
import { PhotoAnalyzer }         from './pages/ai-tools/PhotoAnalyzer';
import { DynamicPricing }        from './pages/pricing/DynamicPricing';
import { BookingManager }        from './pages/bookings/BookingManager';
import { WhatsAppConcierge }     from './pages/assistant/WhatsAppConcierge';
import { Analytics }             from './pages/analytics/Analytics';

// Guest Portal
import { GuestLayout }           from './components/layout/GuestLayout';
import { GuestHome }             from './pages/guest/GuestHome';
import { PlanTrip }              from './pages/guest/PlanTrip';
import { CompareProperties }     from './pages/guest/CompareProperties';
import { NearMe }                from './pages/guest/NearMe';
import { MyBookings }            from './pages/guest/MyBookings';
import { Wishlist }              from './pages/guest/Wishlist';
import { MyReviews }             from './pages/guest/MyReviews';
import { GuestConcierge }        from './pages/guest/GuestConcierge';
import { GuestProfile }          from './pages/guest/GuestProfile';

const Spinner = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading Trustora Intelligence...</p>
  </div>
);

/* ── GUEST PORTAL ── */
const GuestApp = () => {
  const [activeTab, setActiveTab]           = useState('guest-home');
  const [selectedPropertyId, setSelId]     = useState(null);
  const [comparePropertyIds, setCompareIds] = useState([]);
  // Each time user navigates to my-bookings (especially after a payment),
  // bump this key so MyBookings unmounts/remounts and re-fetches fresh data
  const [bookingsRefreshKey, setBookingsRefreshKey] = useState(0);

  const handleOpenCompare = (ids) => {
    setCompareIds(ids);
    setSelId(null);
    setActiveTab('compare');
  };

  // Central tab navigator — always increments bookingsRefreshKey when going to my-bookings
  const navigateTab = (tab) => {
    setSelId(null);
    if (tab === 'my-bookings') {
      setBookingsRefreshKey(k => k + 1);
    }
    setActiveTab(tab);
  };

  const renderView = () => {
    if (selectedPropertyId) {
      return (
        <PropertyDetail
          propertyId={selectedPropertyId}
          onBack={() => setSelId(null)}
          onNavigateTab={navigateTab}
        />
      );
    }

    switch (activeTab) {
      case 'guest-home':      return <GuestHome onNavigate={navigateTab} onSelectProperty={setSelId} />;
      case 'plan-trip':       return <PlanTrip onSelectProperty={setSelId} onCompare={handleOpenCompare} />;
      case 'compare':         return <CompareProperties selectedIds={comparePropertyIds} onSelectProperty={setSelId} onNavigate={navigateTab} />;
      case 'near-me':         return <NearMe onSelectProperty={setSelId} />;
      case 'browse':          return <PlanTrip onSelectProperty={setSelId} onCompare={handleOpenCompare} />;
      // key={bookingsRefreshKey} forces a full remount → fresh useEffect fetch every time
      case 'my-bookings':     return <MyBookings key={bookingsRefreshKey} />;
      case 'wishlist':        return <Wishlist onSelectProperty={setSelId} />;
      case 'my-reviews':      return <MyReviews />;
      case 'concierge-guest': return <GuestConcierge />;
      case 'guest-profile':   return <GuestProfile />;
      default:                return <GuestHome onNavigate={navigateTab} onSelectProperty={setSelId} />;
    }
  };

  return (
    <GuestLayout activeTab={activeTab} setActiveTab={navigateTab}>
      {renderView()}
    </GuestLayout>
  );
};

/* ── HOST PORTAL ── */
const HostApp = () => {
  const [activeTab, setActiveTab]       = useState('dashboard');
  const [selectedPropertyId, setSelId] = useState(null);

  const renderView = () => {
    if (selectedPropertyId && activeTab === 'properties') {
      return (
        <HostPropertyDetail
          propertyId={selectedPropertyId}
          onBack={() => setSelId(null)}
          onNavigateTab={(tab) => { setSelId(null); setActiveTab(tab); }}
        />
      );
    }

    switch (activeTab) {
      // 1. Trust Intelligence Core
      case 'dashboard':          return <Dashboard onNavigate={setActiveTab} />;
      case 'trust-radar':        return <TrustoraRadar onNavigate={setActiveTab} />;
      case 'host-verification':  return <HostVerification onNavigate={setActiveTab} />;
      case 'fraud-radar':        return <FraudRadar onNavigate={setActiveTab} />;
      case 'review-anomaly':     return <ReviewAnomalyRadar onNavigate={setActiveTab} />;
      case 'neighbourhood-vibe': return <NeighbourhoodVibe onNavigate={setActiveTab} />;

      // 2. Host Growth Operations
      case 'properties':         return <PropertyList onSelectProperty={setSelId} onAddNew={() => setActiveTab('onboarding')} onNavigate={setActiveTab} />;
      case 'onboarding':         return <OnboardingWizard onComplete={() => setActiveTab('properties')} onNavigate={setActiveTab} />;
      case 'ai-copywriter':      return <AICopywriter />;
      case 'photo-analyzer':     return <PhotoAnalyzer />;
      case 'pricing':            return <DynamicPricing />;
      case 'bookings':           return <BookingManager />;
      case 'concierge':          return <WhatsAppConcierge />;
      case 'analytics':          return <Analytics />;

      default:                   return <Dashboard onNavigate={setActiveTab} />;
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
  const [authView, setAuthView]       = useState(null);
  const [initialPortal, setInitPortal] = useState(null);

  if (loading) return <Spinner />;

  if (!user) {
    if (authView === 'login') {
      return (
        <Login
          initialPortal={initialPortal}
          onSwitchToRegister={() => setAuthView('register')}
          onBack={() => setAuthView(null)}
        />
      );
    }
    if (authView === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setAuthView('login')}
          onBack={() => setAuthView(null)}
        />
      );
    }
    return (
      <LandingPage
        onGuestLogin={() => { setInitPortal('guest'); setAuthView('login'); }}
        onHostLogin={()  => { setInitPortal('host');  setAuthView('login'); }}
        onRegister={()   => setAuthView('register')}
      />
    );
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
