import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import RestaurantForm from "../components/RestaurantForm";
import ConfirmModal from "../components/ConfirmModal";

export default function Restaurants() {
  const { restaurants, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleRegister = async (form) => {
    try {
      await api.post("/swaad/restaurant/register", form);
      toast.success("Restaurant registered!");
      setShowForm(false);
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/swaad/restaurant/delete/${deleteId}`);
      toast.success("Restaurant deleted!");
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete restaurant");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="rest-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Your Restaurants</h1>
          <p className="text-gray-500 mt-1">Manage your restaurants or add a new one.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm cursor-pointer whitespace-nowrap"
        >
          + Add Restaurant
        </button>
      </div>

      {/* Restaurant List */}
      {restaurants.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-5xl mb-3">🏪</p>
          <p className="text-gray-400 font-medium">No restaurants yet. Add your first one!</p>
        </div>
      )}

      <div className="space-y-4">
        {restaurants.map((r) => (
          <div key={r._id} className="rest-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{r.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{r.address}</p>
                {r.phone && <p className="text-gray-400 text-sm mt-0.5">📞 {r.phone}</p>}
                {r.description && <p className="text-sm text-gray-400 mt-2">{r.description}</p>}
              </div>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Active</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/dashboard/${r._id}`)}
                className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Manage Menu & QR →
              </button>
              <button
                onClick={() => setDeleteId(r._id)}
                className="px-4 py-2.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Restaurant?"
        message="This will permanently delete the restaurant and all its dishes. This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Registration Form */}
      {showForm && (
        <RestaurantForm onSubmit={handleRegister} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}
