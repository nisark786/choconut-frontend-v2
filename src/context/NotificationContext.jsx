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
    let reconnectTimeout; // Cocoa Guard: Track the timeout

    const connect = () => {
      // Don't open a new one if one is already connecting or open
      if (ws?.readyState === WebSocket.OPEN) return;

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
          { autoClose: 4000 },
        );
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed. Attempting reconnect...");
        // Only reconnect if the component is still mounted
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        ws.close();
      };
    };

    connect();

    // Cleanup: The most important part!
    return () => {
      clearTimeout(reconnectTimeout); // Stop any pending reconnects
      if (ws) {
        ws.onclose = null; // Remove handler so it doesn't trigger on manual close
        ws.close();
      }
    };
  }, [currentUser, navigate]);

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
