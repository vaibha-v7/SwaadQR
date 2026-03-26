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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">{initial ? "Edit Restaurant" : "Register Your Restaurant"}</h2>
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Restaurant Name"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer">
            {initial ? "Update Restaurant" : "Register Restaurant"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 border border-gray-200 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
