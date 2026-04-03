import { useState } from "react";

export default function RestaurantForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    address: initial?.address || "",
    phone: initial?.phone || "",
    description: initial?.description || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (value !== "" && !/^\d*$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Restaurant name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (form.phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl border border-orange-100 bg-[#f7f9fb] p-6 md:p-8 shadow-[0px_30px_80px_rgba(25,28,30,0.18)]"
      >
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{initial ? "Refine Restaurant" : "Register Your Restaurant"}</h2>
        </div>

        <section className="rounded-2xl border border-orange-100/70 bg-white p-5 md:p-6 shadow-[0px_20px_50px_rgba(25,28,30,0.05)]">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Restaurant Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Swaad Darbar"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 24, Connaught Place, New Delhi"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {errors.address && <p className="mt-1 text-xs font-medium text-red-500">{errors.address}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Brand Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Authentic North Indian cuisine with tandoori specialties and family-style dining."
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/30 transition-colors hover:bg-primary-dark cursor-pointer"
            >
              {initial ? "Update Restaurant" : "Register Restaurant"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </section>
      </form>
    </div>
  );
}
