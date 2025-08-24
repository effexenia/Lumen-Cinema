import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { Header } from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import React from "react";
import MoviePage from './pages/MoviePage/MoviePage.tsx'; 
import LoginPopup from "./pages/LoginPage/LoginPopUp.tsx";
import RegisterPopup from "./pages/LoginPage/RegisterPopup.tsx";
//import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import MyTicketsPage from "./pages/MyTicketsPage/MyTicketsPage.tsx";
import SessionPage from "./pages/SessionPage/SessionPage.tsx";
import PaymentPage from "./pages/PaymentPage/PaymentPage.tsx";
import { AdminPanel } from "./pages/AdminPage/AdminPanel.tsx";
import ProtectedRoute from "./components/ProtectedRoutes.tsx";
import AboutPage from "./pages/AboutPage/AboutPage.tsx";
import PaymentSuccess from "./pages/PaymentPage/PaymentSuccessPage.tsx";

function App() {
  return (
    <BrowserRouter>
     <Header />
      <Routes>
      {/* Публичные маршруты */}
      <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
          */} 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/movie/:id" element={<MoviePage />}/>
        <Route path="/login" element={<LoginPopup/>}/>
        <Route path="/register" element={<RegisterPopup/>}/>
        <Route path="/tickets" element={<MyTicketsPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/about" element={<AboutPage />} />
        {/* Защищенные маршруты для пользователей */}
      {/* <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Route> */}

      {/* Защищенные маршруты только для админов */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        {/* <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/sessions" element={<AdminSessions />} /> */}
      </Route> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
