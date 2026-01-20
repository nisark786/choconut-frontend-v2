// src/pages/Address.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { MapPin, Plus, CheckCircle, ArrowRight, Home } from "lucide-react";
import { toast } from "react-toastify";

export default function Address() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId;

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await api.get("/orders/address/");
    setAddresses(res.data);
  };

  const saveAddress = async () => {
  try {
    if (!orderId) {
      toast.error("Invalid order");
      navigate("/cart");
      return;
    }

    // CASE 1: Existing address
    if (selected?.id) {
      await api.post(`/orders/${orderId}/address/`, {
        address_id: selected.id,
      });

      toast.success("Address selected");
      navigate("/payment", {
        state: { orderId, addressId: selected.id },
      });
      return;
    }

    // CASE 2: New address validation
    if (!form.full_name || !form.phone || !form.address_line) {
      toast.error("Please fill all required fields");
      return;
    }

    await api.post(`/orders/${orderId}/address/`, form);

    toast.success("Address added");
    navigate("/payment", { state: { orderId } });

  } catch (err) {
    toast.error("Failed to save address");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saved Addresses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-amber-600" /> Saved Addresses
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelected(addr);
                    setForm({
                      full_name: "",
                      phone: "",
                      address_line: "",
                      city: "",
                      state: "",
                      pincode: "",
                      is_default: false,
                    });
                  }}
                  className={`p-4 rounded-xl cursor-pointer border-2 ${
                    selected?.id === addr.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-amber-200"
                  }`}
                >
                  <h3 className="font-semibold">{addr.full_name}</h3>
                  <p className="text-sm">{addr.phone}</p>
                  <p className="text-sm mt-2">
                    {addr.address_line}, {addr.city}, {addr.state} –{" "}
                    {addr.pincode}
                  </p>
                  {selected?.id === addr.id && (
                    <CheckCircle className="text-amber-600 w-5 h-5 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Address */}
          <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-600" /> Add New Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {Object.keys(form).map((key) =>
                key !== "is_default" ? (
                  <input
                    key={key}
                    placeholder={key.replace("_", " ")}
                    className="input"
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" /> Delivery
          </h2>

          <button
            onClick={saveAddress}
            disabled={!selected && !form.full_name}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Continue to Payment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
