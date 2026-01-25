// src/context/NotificationContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { UserContext } from "./UserContext";
import api from "../api/axios";
import { getAccessToken } from "../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  // Initial Fetch
  // src/context/NotificationContext.jsx
useEffect(() => {
  if (!currentUser) return;

  const fetchInitial = async () => {
    const endpoint = currentUser.is_staff ? "/notifications/admin/" : "/notifications/";
    const res = await api.get(endpoint);
    setNotifications(res.data.notifications);
    setUnreadCount(res.data.unread_count);
  };

  fetchInitial();
}, [currentUser]);

  // WebSocket Persistence
  useEffect(() => {
    if (!currentUser) {
      if (socketRef.current) socketRef.current.close();
      return;
    }

    const token = getAccessToken();
    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast.dismiss();

      toast.info(
        <div
          onClick={() => navigate("/notifications")}
          style={{ cursor: "pointer" }}
        >
          <strong>{data.title}</strong>
          <div style={{ fontSize: "0.85rem" }}>{data.message}</div>
        </div>,
        
        {
          autoClose: 4000,
          closeOnClick: true,
        },
      );
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [currentUser]);

  const markOneAsRead = useCallback(async (id) => {
    try {
      await api.post(`/notifications/${id}/read/`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markOneAsRead, setUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
