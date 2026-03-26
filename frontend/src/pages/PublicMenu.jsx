import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import VegBadge from "../components/VegBadge";
import Spinner from "../components/Spinner";

export default function PublicMenu() {
  const { restaurantId } = useParams();
  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const containerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/swaad/restaurant/${restaurantId}`),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/swaad/dishes/restaurant/${restaurantId}`),
    ])
      .then(([restRes, dishRes]) => {
        setRestaurant(restRes.data);
        setDishes(dishRes.data);
      })
      .catch(() => {
        setRestaurant(null);
        setDishes([]);
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  useEffect(() => {
    if (loading || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pm-header", { y: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
      gsap.from(".pm-info", { y: 20, opacity: 0, duration: 0.5, delay: 0.2, ease: "power2.out" });
      gsap.from(".pm-filter", { y: 15, opacity: 0, duration: 0.4, delay: 0.35, ease: "power2.out" });
      gsap.from(".pm-dish", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.45,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading, filter]);

  const categories = ["All", ...new Set(dishes.map((d) => d.category).filter(Boolean))];
  const filtered = filter === "All" ? dishes : dishes.filter((d) => d.category === filter);

  if (loading) return <Spinner />;

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="pm-header bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {restaurant?.name || "Restaurant"}
          </h1>

          {restaurant?.description && (
            <p className="text-sm text-gray-500 mt-1">{restaurant.description}</p>
          )}

          <div className="pm-info flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
            {restaurant?.address && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {restaurant.address}
              </span>
            )}
            {restaurant?.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1 text-primary font-medium hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {restaurant.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {dishes.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No dishes available yet.</p>
        ) : (
          <>
            {/* Category Filter */}
            <div className="pm-filter flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    filter === cat
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Section title */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              {filter === "All" ? "Menu" : filter}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filtered.length} {filtered.length === 1 ? "item" : "items"})
              </span>
            </h2>

            {/* Dishes */}
            <div className="space-y-3">
              {filtered.map((dish) => (
                <div
                  key={dish._id}
                  className="pm-dish bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden"
                >
                  <div className="p-4 flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <VegBadge isVeg={dish.isVeg} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-1.5 leading-tight">
                      {dish.dishName}
                    </h3>
                    <span className="text-primary font-bold text-base mt-1 inline-block">
                      ₹{dish.price}
                    </span>
                    {dish.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{dish.description}</p>
                    )}
                  </div>
                  {dish.image && (
                    <div className="relative w-32 h-32 flex-shrink-0 self-center mr-3">
                      <img
                        src={dish.image}
                        alt={dish.dishName}
                        className="w-full h-full object-cover py-2 rounded-xl"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <footer className="text-center text-xs text-gray-300 mt-10 pb-6">
              Powered by <span className="font-semibold text-gray-400">SwaadQR</span>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
