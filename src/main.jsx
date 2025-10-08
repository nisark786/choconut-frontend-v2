import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AdminProvider from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <UserProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UserProvider>
    </AdminProvider>
  </StrictMode>
);
