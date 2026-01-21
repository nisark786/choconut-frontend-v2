import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";
import AdminProvider from "../context/AdminContext";

export const CombinedProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AdminProvider>
        <UserProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </UserProvider>
      </AdminProvider>
    </GoogleOAuthProvider>
  );
};