import "./App.css";
import { ProfileInfo, useAuth } from "./providers/auth";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Login } from "./pages/login";
import { Register } from "./pages/signup";
import { ForgotPassword } from "./pages/forgotPassword";
import { Terms } from "./pages/terms-and-conditions";
import { Policy } from "./pages/policy";
import { Dashboard } from "./pages/protected-pages/dashboard";
import { useEffect } from "react";
import { getPromise } from "./util/generalActions";
import { Activate } from "./pages/activate";
import { ResetPassword } from "./pages/reset";
import "./i18n";

function App() {
  const { token, setProfile, logout } = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          {/* <Route path="about-us" element={<AboutUs />} /> */}

          {!token && <Route path="/" element={<Login />} />}
          {!token && <Route path="/activate/:id" element={<Activate />} />}
          {token && <Route path="/*" element={<Dashboard />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
