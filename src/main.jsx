import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AdminProvider from "./context/AdminContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";



createRoot(document.getElementById("root")).render(
  <StrictMode>
<GoogleOAuthProvider clientId="887824720299-scpln1q5b8hq6mdmu499t9sje0qrqp2u.apps.googleusercontent.com">
    <AdminProvider>
      <UserProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UserProvider>
    </AdminProvider>
  </GoogleOAuthProvider>
  </StrictMode>
);
