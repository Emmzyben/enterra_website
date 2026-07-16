import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import PortfolioDetails from './pages/PortfolioDetails';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Safety from './pages/Safety';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Wallet from './pages/Wallet';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

// Pages that should NOT show the footer (full-screen app shell)
const NO_FOOTER_ROUTES = ['/dashboard', '/vendor/dashboard', '/client/dashboard'];

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Inner component so we can call useLocation (must be inside BrowserRouter)
const AppContent = () => {
  const location = useLocation();
  const hideFooter = NO_FOOTER_ROUTES.includes(location.pathname);

  return (
    <div className="app">
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/"                  element={<Landing />} />
          <Route path="/vendors"           element={<Vendors />} />
          <Route path="/vendors/:id"       element={<VendorDetails />} />
          <Route path="/messages"          element={<Messages />} />
          <Route path="/dashboard"         element={<Dashboard />} />
          <Route path="/vendor/dashboard"  element={<Dashboard />} />
          <Route path="/client/dashboard"  element={<Dashboard />} />
          <Route path="/events"            element={<Events />} />
          <Route path="/events/:id"        element={<EventDetails />} />
          <Route path="/contact"           element={<Contact />} />
          <Route path="/about"             element={<About />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/forgot-password"   element={<ForgotPassword />} />
          <Route path="/verify-email"      element={<Navigate to="/dashboard" replace />} />
          <Route path="/portfolio/:id"     element={<PortfolioDetails />} />
          <Route path="/safety"            element={<Safety />} />
          <Route path="/privacy"           element={<Privacy />} />
          <Route path="/terms"             element={<Terms />} />
          <Route path="/wallet"            element={<Wallet />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
