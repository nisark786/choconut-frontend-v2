import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* You can add a sidebar or topbar here */}
      <Outlet /> {/* nested admin routes */}
    </div>
  );
}
