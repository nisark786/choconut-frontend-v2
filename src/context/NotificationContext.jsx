
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

  // Fetch initial notifications
  useEffect(() => {
    if (!currentUser) return;

    const fetchInitial = async () => {
      const endpoint = currentUser.is_staff
        ? "/notifications/admin/"
        : "/notifications/";
      const res = await api.get(endpoint);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread_count);
    };

    fetchInitial();
  }, [currentUser]);

  // WebSocket persistence with reconnect and error handling
  useEffect(() => {
    if (!currentUser) {
      if (socketRef.current) socketRef.current.close();
      return;
    }

    const token = getAccessToken();
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://${window.location.host}/ws/notifications/?token=${token}`;

    let ws;

    const connect = () => {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onmessage = (event) => {
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
          { autoClose: 4000, closeOnClick: true }
        );
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed. Reconnecting in 3s...", event);
        setTimeout(connect, 3000); // reconnect after 3 seconds
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close(); // close socket on error to trigger reconnect
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
    };
  }, [currentUser, navigate]);

  const markOneAsRead = useCallback(async (id) => {
    try {
      await api.post(`/notifications/${id}/read/`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
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
