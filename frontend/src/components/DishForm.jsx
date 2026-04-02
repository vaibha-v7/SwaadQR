import { useState, useEffect } from "react";

const CATEGORIES = ["Starter", "Main Course", "Dessert", "Beverage"];

export default function DishForm({ initial, onSubmit, onCancel, onGenerateDescription }) {
  const [form, setForm] = useState({
    dishName: "",
    description: "",
    imageFile: null,
    existingImage: "",
    price: "",
    category: "Starter",
    isVeg: true,
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        dishName: initial.dishName || "",
        description: initial.description || "",
        imageFile: null,
        existingImage: initial.image || "",
        price: initial.price ?? "",
        category: initial.category || "Starter",
        isVeg: initial.isVeg ?? true,
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price) });
  };

  const handleGenerateDescription = async () => {
    if (!onGenerateDescription || !form.dishName.trim()) return;

    setGenerating(true);
    try {
      const description = await onGenerateDescription({
        dishName: form.dishName,
        category: form.category,
        isVeg: form.isVeg
      });

      if (description) {
        setForm((prev) => ({ ...prev, description }));
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-orange-100 bg-[#f7f9fb] p-6 md:p-8 shadow-[0px_30px_80px_rgba(25,28,30,0.18)]"
      >
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Inventory</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{initial ? "Refine Dish" : "New Creation"}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7 rounded-2xl border border-orange-100/70 bg-white p-5 md:p-6 shadow-[0px_20px_50px_rgba(25,28,30,0.05)]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Dish Identity</label>
                <input
                  name="dishName"
                  value={form.dishName}
                  onChange={handleChange}
                  placeholder="e.g. Saffron-Infused Sea Bass"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pricing (Rs.)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    type="number"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Menu Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={generating || !form.dishName.trim()}
                    className="rounded-full border border-primary/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {generating ? "Generating..." : "Generate AI Description"}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the flavors, textures, and inspiration behind this dish..."
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Dietary</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={form.isVeg}
                    onChange={handleChange}
                    className="h-4 w-4 accent-green-600"
                  />
                  <span className="text-sm font-medium text-slate-700">Vegetarian</span>
                </label>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5 rounded-2xl border border-orange-100/70 bg-white p-5 md:p-6 shadow-[0px_20px_50px_rgba(25,28,30,0.05)]">
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Culinary Photography</label>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!initial}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:font-semibold file:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.existingImage && !form.imageFile && (
                <p className="mt-2 text-xs text-slate-500">Current image will be kept unless you select a new file.</p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#9D4300] to-[#F97316] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/30 transition-transform hover:scale-[1.01]"
              >
                {initial ? "Update Dish" : "Add Dish to Menu"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
