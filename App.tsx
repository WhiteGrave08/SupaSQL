import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { LandingLayout } from "./components/layout/LandingLayout";
import { LandingHome } from "./pages/landing/landing-home";
import { LandingProduct } from "./pages/landing/landing-product";
import { LandingPricing } from "./pages/landing/landing-pricing";
import { LandingContact } from "./pages/landing/landing-contact";

import { LandingLogin, LandingSignup } from "./pages/landing/landing-auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Routes */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingHome />} />
          <Route path="/product" element={<LandingProduct />} />
          <Route path="/pricing" element={<LandingPricing />} />
          <Route path="/contact" element={<LandingContact />} />
        </Route>

        {/* Auth Routes (Standalone) */}
        <Route path="/login" element={<LandingLogin />} />
        <Route path="/signup" element={<LandingSignup />} />

        {/* Protected Dashboard Route */}
        {/* In a real app, you'd wrap this in a RequireAuth component, 
            but Dashboard component handles its own auth check for now */}
        <Route path="/app/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
