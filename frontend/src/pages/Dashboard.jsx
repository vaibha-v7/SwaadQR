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
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  const handleGenerateDescription = async ({ dishName, category, isVeg }) => {
    try {
      const { data } = await api.post("/swaad/dishes/generate-description", {
        dishName,
        category,
        isVeg
      });

      if (!data?.description) {
        throw new Error("No description generated");
      }

      toast.success("Description generated");
      return data.description;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate description");
      return "";
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

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".dash-info", {
          y: 42,
          opacity: 0,
          duration: 0.85
        })
        .from(
          ".dash-qr",
          {
            y: 36,
            opacity: 0,
            duration: 0.65
          },
          "-=0.4"
        )
        .from(
          ".dash-promo",
          {
            y: 36,
            opacity: 0,
            duration: 0.65
          },
          "-=0.45"
        )
        .from(
          ".dash-dishes-header",
          {
            y: 28,
            opacity: 0,
            duration: 0.55
          },
          "-=0.35"
        );

      gsap.to(".dash-promo-orb", {
        y: -22,
        x: -12,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.from(".dish-card-anim", {
        y: 34,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".dash-dishes-grid",
          start: "top 82%",
          once: true
        }
      });

      gsap.from(".dash-empty-state", {
        y: 24,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".dash-empty-state",
          start: "top 85%",
          once: true
        }
      });
    });
    return () => ctx.revert();
  }, [restaurant, dishes.length]);

  if (!restaurant) return <Spinner />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#fff5eb,_#fdfcfb)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10 space-y-8 sm:space-y-10 md:space-y-12">
        <button
          onClick={() => navigate("/restaurants")}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Restaurants
        </button>

        {/* Restaurant Header */}
        <header className="dash-info flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Dashboard</span>
              <div className="h-px w-12 bg-orange-200" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {restaurant.name} <span className="text-primary/25">/</span> Inventory
            </h1>

            <div className="flex flex-wrap gap-3 sm:gap-5 text-slate-600 font-medium">
              <div className="inline-flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                <span>{restaurant.address}</span>
              </div>
              {restaurant.phone && (
                <a
                  href={`tel:${String(restaurant.phone).replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  aria-label={`Call ${restaurant.phone}`}
                >
                  <span className="material-symbols-outlined text-primary text-lg">call</span>
                  <span>{restaurant.phone}</span>
                </a>
              )}
            </div>
            {restaurant.description && (
              <p className="max-w-2xl text-sm text-slate-500 leading-relaxed">{restaurant.description}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowEditRestaurant(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/70 backdrop-blur-md border border-white/70 text-slate-700 font-semibold hover:bg-white transition-colors"
            >
              Edit Restaurant Details
            </button>
            <button
              onClick={() => { setEditingDish(null); setShowForm(true); }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-orange-300/40 hover:bg-primary-dark transition-colors"
            >
              + Add New Dish
            </button>
          </div>
        </header>

        {/* QR + Promo */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="dash-qr lg:col-span-1 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.06)]">
            <QRCodeDisplay restaurantId={restaurantId} />
            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-900">Digital Menu Access</h3>
              <p className="text-sm text-slate-500 mt-1">Active QR for table-side digital menu access and sharing.</p>
            </div>
          </div>

          <div className="dash-promo lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(31,38,135,0.06)] relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">Elevate the Dining Journey</h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">Manage dishes in real time, generate descriptions instantly, and keep your digital menu polished for every guest experience.</p>
              <div className="mt-6 flex flex-wrap gap-5 text-primary font-bold text-sm">
                <div className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">bolt</span>
                  Real-time Sync
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">analytics</span>
                  Live Menu Control
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/75 border border-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Menu Visibility</p>
                <p className="mt-1 text-2xl font-black text-slate-900">24/7</p>
                <p className="text-xs text-slate-500 mt-1">Guests can access your menu instantly by scanning.</p>
              </div>
              <div className="rounded-2xl bg-white/75 border border-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Workflow Speed</p>
                <p className="mt-1 text-2xl font-black text-slate-900">Fast</p>
                <p className="text-xs text-slate-500 mt-1">Update dishes and descriptions without reprinting.</p>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.10),transparent_45%)]" />
            <div className="dash-promo-orb absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </section>

        {/* Dishes */}
        <section className="dash-dishes space-y-6">
          <div className="dash-dishes-header flex flex-wrap items-center gap-3 sm:gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Current Collection</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            <button
              onClick={() => { setEditingDish(null); setShowForm(true); }}
              className="w-full sm:w-auto bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm cursor-pointer"
            >
              + Add Dish
            </button>
          </div>

          {loadingDishes ? (
            <Spinner />
          ) : dishes.length === 0 ? (
            <div className="dash-empty-state text-center py-16 rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 backdrop-blur-sm text-gray-400">
              <p className="text-5xl mb-3">🍽️</p>
              <p className="font-semibold text-slate-500">No dishes yet. Add your first dish!</p>
            </div>
          ) : (
            <div className="dash-dishes-grid grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {dishes.map((dish) => (
                <div key={dish._id} className="dish-card-anim will-change-transform">
                  <DishCard
                    dish={dish}
                    onEdit={(d) => { setEditingDish(d); setShowForm(true); }}
                    onDelete={(id) => setDeleteDishId(id)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Modal */}
        {showForm && (
          <DishForm
            initial={editingDish}
            onSubmit={editingDish ? handleUpdateDish : handleAddDish}
            onGenerateDescription={handleGenerateDescription}
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
    </div>
  );
}
