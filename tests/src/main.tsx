import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import AboutPage from "./pages/CreateUser.tsx";
import HomePage from "./pages/Home.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-user" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
