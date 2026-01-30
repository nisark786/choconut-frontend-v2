import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";
import AdminProvider from "../context/AdminContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ChatProvider } from "../context/ChatContext";
import { ProductProvider } from "../context/ProductContext";

export const CombinedProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      
        <ChatProvider>
        <ProductProvider>
        <UserProvider>
      <AdminProvider>
        <NotificationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          </NotificationProvider>
      </AdminProvider>
        </UserProvider>
        </ProductProvider>
        </ChatProvider>
    </GoogleOAuthProvider>
  );
};