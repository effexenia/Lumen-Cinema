import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { Header } from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import React from "react";
import MoviePage from './pages/MoviePage/MoviePage.tsx'; 

function App() {
  return (
    <BrowserRouter>
     <Header />
      <Routes>
      <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
          */}
        <Route path="/movie/:id" element={<MoviePage />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
