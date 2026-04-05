import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import api from "../api/axios";
import toast from "react-hot-toast";
import RestaurantForm from "../components/RestaurantForm";
import ConfirmModal from "../components/ConfirmModal";

export default function Restaurants() {
  const { restaurants, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const totalRestaurants = restaurants.length;
  const activeMenus = restaurants.length;

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
    <div className="relative min-h-screen bg-[#f9f9f9] text-zinc-900">
      <div className="pointer-events-none fixed -left-24 -top-24 h-80 w-80 rounded-full bg-orange-200/30 blur-[95px]" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/30 blur-[95px]" />

      <header className="sticky top-0 z-20 border-b border-orange-100/80 bg-white/80 backdrop-blur-xl shadow-[0_24px_48px_-20px_rgba(249,115,22,0.2)]">
        {/* <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 md:px-8">
          <div className="text-xl font-extrabold uppercase tracking-tight text-zinc-900 md:text-2xl">The Radiant Gourmet</div>
          <nav className="hidden items-center space-x-8 md:flex">
            <span className="border-b-2 border-orange-500 pb-1 text-sm font-bold text-zinc-900">Dashboard</span>
            <span className="text-sm font-medium text-zinc-500">Analytics</span>
            <span className="text-sm font-medium text-zinc-500">Settings</span>
          </nav>
          <div className="flex items-center space-x-3">
            <button type="button" className="rounded-full p-2 text-zinc-600 transition hover:bg-zinc-100">
              🔔
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-orange-200">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">RG</div>
            </div>
          </div>
        </div> */}
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-10 md:px-8 md:py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-zinc-900 md:text-6xl">Your Restaurants</h1>
          <p className="mt-2 text-sm font-medium text-zinc-500 md:text-lg">
            Manage your culinary empire and digital experiences from a single luminous dashboard.
          </p>
        </section>

        <section className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          <div className="rounded-2xl bg-[#f3f3f3] p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Total Restaurants</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-zinc-900">{totalRestaurants}</p>
          </div>
          <div className="rounded-2xl bg-[#f3f3f3] p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Active Menus</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-zinc-900">{activeMenus}</p>
          </div>
          {/* <div className="rounded-2xl bg-[#f3f3f3] p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Total Scans</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-zinc-900">
              {(totalScans / 1000).toFixed(1)}k <span className="ml-1 text-sm font-medium text-orange-500">+12% this week</span>
            </p>
          </div> */}
        </section>

        {restaurants.length === 0 && !showForm && (
          <div className="mb-10 rounded-2xl border-2 border-dashed border-orange-200/80 bg-white/70 py-14 text-center">
            <p className="mb-2 text-5xl">🏪</p>
            <p className="font-medium text-zinc-500">No restaurants yet. Add your first one!</p>
          </div>
        )}

        <section className="grid grid-cols-1 gap-8 pb-20 lg:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((r) => {
            return (
              <article
                key={r._id}
                className="rest-card flex flex-col overflow-hidden rounded-2xl border border-orange-100/80 bg-white/80 shadow-[0_18px_36px_-24px_rgba(249,115,22,0.35)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-18px_rgba(249,115,22,0.42)]"
              >
                <div className="relative flex h-24 items-center justify-between bg-gradient-to-r from-orange-100 to-amber-100 px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-2xl">🏪</div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-700">Restaurant</p>
                      <p className="text-sm font-semibold text-zinc-700">Business Profile</p>
                    </div>
                  </div>
                  {r.category && (
                    <div className="rounded-full bg-orange-500/90 px-3 py-1 backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">{r.category}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-grow flex-col p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{r.name}</h2>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                      Active
                    </span>
                  </div>

                  <div className="mb-6 space-y-2">
                    <p className="text-sm text-zinc-600">📍 {r.address}</p>
                    {r.phone && <p className="text-sm text-zinc-600">📞 {r.phone}</p>}
                    {r.description && <p className="text-sm italic leading-relaxed text-zinc-500">{r.description}</p>}
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      onClick={() => navigate(`/dashboard/${r._id}`)}
                      className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200/60 transition hover:bg-primary-dark active:scale-95 cursor-pointer"
                    >
                      Manage Menu & QR
                    </button>
                    <button
                      onClick={() => setDeleteId(r._id)}
                      className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <button
            onClick={() => setShowForm(true)}
            className="rest-card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200/70 bg-[#f3f3f3] p-12 text-center transition hover:bg-white cursor-pointer"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl text-white transition group-hover:scale-110">
              +
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Expand Your Empire</h3>
            <p className="mt-2 max-w-[220px] text-sm text-zinc-500">Onboard a new location and design its digital presence.</p>
          </button>
        </section>
      </main>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Restaurant?"
        message="This will permanently delete the restaurant and all its dishes. This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {showForm && (
        <RestaurantForm onSubmit={handleRegister} onCancel={() => setShowForm(false)} />
      )}

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white shadow-[0_24px_48px_-10px_rgba(249,115,22,0.5)] transition hover:scale-110 hover:bg-primary-dark active:scale-95 cursor-pointer"
        aria-label="Add New Restaurant"
      >
        +
      </button>
    </div>
  );
}
