import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import QRCodeDisplay from "../components/QRCodeDisplay";
import DishCard from "../components/DishCard";
import DishForm from "../components/DishForm";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";
import RestaurantForm from "../components/RestaurantForm";
import gsap from "gsap";

export default function Dashboard() {
  const { restaurants, fetchProfile } = useAuth();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r._id === restaurantId);
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [deleteDishId, setDeleteDishId] = useState(null);
  const [showEditRestaurant, setShowEditRestaurant] = useState(false);

  const loadDishes = useCallback(async () => {
    if (!restaurantId) return;
    setLoadingDishes(true);
    try {
      const { data } = await api.get(`/swaad/dishes/restaurant/${restaurantId}`);
      setDishes(data);
    } catch {
      toast.error("Failed to load dishes");
    } finally {
      setLoadingDishes(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const handleAddDish = async (form) => {
    try {
      const formData = new FormData();
      formData.append("restaurantId", restaurantId);
      formData.append("dishName", form.dishName);
      formData.append("description", form.description || "");
      formData.append("price", String(form.price));
      formData.append("category", form.category || "Starter");
      formData.append("isVeg", String(form.isVeg));
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      await api.post("/swaad/dishes/adddish", formData);
      toast.success("Dish added!");
      setShowForm(false);
      loadDishes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add dish");
    }
  };

  const handleUpdateDish = async (form) => {
    try {
      const formData = new FormData();
      formData.append("dishName", form.dishName);
      formData.append("description", form.description || "");
      formData.append("price", String(form.price));
      formData.append("category", form.category || "Starter");
      formData.append("isVeg", String(form.isVeg));
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      await api.put(`/swaad/dishes/update/${editingDish._id}`, formData);
      toast.success("Dish updated!");
      setShowForm(false);
      setEditingDish(null);
      loadDishes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update dish");
    }
  };

  const handleDeleteDish = async () => {
    try {
      await api.delete(`/swaad/dishes/delete/${deleteDishId}`);
      toast.success("Dish deleted");
      loadDishes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete dish");
    } finally {
      setDeleteDishId(null);
    }
  };

  const handleUpdateRestaurant = async (form) => {
    try {
      await api.put(`/swaad/restaurant/update/${restaurantId}`, form);
      toast.success("Restaurant updated!");
      setShowEditRestaurant(false);
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update restaurant");
    }
  };

  useEffect(() => {
    if (!restaurant) navigate("/restaurants", { replace: true });
  }, [restaurant, navigate]);

  useEffect(() => {
    if (!restaurant) return;
    const ctx = gsap.context(() => {
      gsap.from(".dash-info", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" });
      gsap.from(".dash-qr", { y: 30, opacity: 0, duration: 0.5, delay: 0.15, ease: "power2.out" });
      gsap.from(".dash-dishes", { y: 30, opacity: 0, duration: 0.5, delay: 0.3, ease: "power2.out" });
    });
    return () => ctx.revert();
  }, [restaurant]);

  if (!restaurant) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <button
        onClick={() => navigate("/restaurants")}
        className="text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
      >
        ← Back to Restaurants
      </button>

      {/* Restaurant Info */}
      <div className="dash-info bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">{restaurant.name}</h2>
            <p className="text-gray-500 mt-1">{restaurant.address}</p>
            {restaurant.phone && <p className="text-gray-500 text-sm mt-1">📞 {restaurant.phone}</p>}
            {restaurant.description && <p className="text-sm text-gray-400 mt-2">{restaurant.description}</p>}
          </div>
          <button
            onClick={() => setShowEditRestaurant(true)}
            className="text-sm font-medium text-primary hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div className="dash-qr">
        <QRCodeDisplay restaurantId={restaurantId} />
      </div>

      {/* Dishes */}
      <div className="dash-dishes">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Dishes</h2>
          <button
            onClick={() => { setEditingDish(null); setShowForm(true); }}
            className="bg-primary text-white font-semibold px-5 py-2 rounded-xl hover:bg-primary-dark transition-colors text-sm cursor-pointer"
          >
            + Add Dish
          </button>
        </div>

        {loadingDishes ? (
          <Spinner />
        ) : dishes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🍽️</p>
            <p className="font-medium">No dishes yet. Add your first dish!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <DishCard
                key={dish._id}
                dish={dish}
                onEdit={(d) => { setEditingDish(d); setShowForm(true); }}
                onDelete={(id) => setDeleteDishId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <DishForm
          initial={editingDish}
          onSubmit={editingDish ? handleUpdateDish : handleAddDish}
          onCancel={() => { setShowForm(false); setEditingDish(null); }}
        />
      )}

      <ConfirmModal
        open={!!deleteDishId}
        title="Delete Dish?"
        message="This will permanently delete this dish. This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteDish}
        onCancel={() => setDeleteDishId(null)}
      />

      {showEditRestaurant && (
        <RestaurantForm
          initial={restaurant}
          onSubmit={handleUpdateRestaurant}
          onCancel={() => setShowEditRestaurant(false)}
        />
      )}
    </div>
  );
}
