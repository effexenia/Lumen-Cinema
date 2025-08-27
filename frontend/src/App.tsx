import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Header } from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoutes.tsx";

// Public pages
import HomePage from "./pages/HomePage/HomePage.tsx";
import MoviePage from './pages/MoviePage/MoviePage.tsx'; 
import LoginPopup from "./pages/LoginPage/LoginPopup.tsx";
import RegisterPopup from "./pages/LoginPage/RegisterPopup.tsx";
import SessionPage from "./pages/SessionPage/SessionPage.tsx";
import AboutPage from "./pages/AboutPage/AboutPage.tsx";
import PaymentSuccess from "./pages/PaymentPage/PaymentSuccessPage.tsx";

// Protected pages - user
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import MyTicketsPage from "./pages/MyTicketsPage/MyTicketsPage.tsx";
import PaymentPage from "./pages/PaymentPage/PaymentPage.tsx";

// Protected pages - admin
import { AdminPanel } from "./pages/AdminPage/AdminPanel.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        {/* Auth routes (only for non-authenticated users) */}
          <Route path="/login" element={<LoginPopup />} />
          <Route path="/register" element={<RegisterPopup />} />

        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tickets" element={<MyTicketsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* Protected routes only for admins */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminPanel />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;