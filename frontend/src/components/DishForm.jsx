import { useState, useEffect } from "react";

const CATEGORIES = ["Starter", "Main Course", "Dessert", "Beverage"];

export default function DishForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    dishName: "",
    description: "",
    imageFile: null,
    existingImage: "",
    price: "",
    category: "Starter",
    isVeg: true,
  });

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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold">{initial ? "Edit Dish" : "Add Dish"}</h2>

        <input
          name="dishName"
          value={form.dishName}
          onChange={handleChange}
          placeholder="Dish Name"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="space-y-2">
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!initial}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary file:font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {form.existingImage && !form.imageFile && (
            <p className="text-xs text-gray-500">Current image will be kept unless you select a new file.</p>
          )}
        </div>
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (₹)"
          type="number"
          min="0"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="accent-green-500 w-4 h-4" />
          <span className="text-sm font-medium">Vegetarian</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
          >
            {initial ? "Update" : "Add Dish"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-200 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
