import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const { owner, restaurants, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone_no: "" });

  useEffect(() => {
    setForm({
      name: owner?.name || "",
      phone_no: owner?.phone_no || ""
    });
  }, [owner]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_no" && value !== "" && !/^\d*$/.test(value)) {
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        name: form.name,
        phone_no: form.phone_no
      });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto mt-12 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold">Your Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
        {!isEditing ? (
          <>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Name</span>
              <p className="font-semibold">{owner?.name}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Email</span>
              <p className="font-semibold">{owner?.email}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Phone</span>
              <p className="font-semibold">{owner?.phone_no || "Not provided"}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Edit details
            </button>
          </>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Email</label>
              <input
                value={owner?.email || ""}
                disabled
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Phone</label>
              <input
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                placeholder="Phone number"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="mt-1 text-xs text-gray-400">Add your phone number if it was missing during Google sign-in.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {restaurants.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h2 className="font-bold text-lg">Restaurants ({restaurants.length})</h2>
          {restaurants.map((r) => (
            <div key={r._id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
              <p className="font-semibold">{r.name}</p>
              <p className="text-sm text-gray-500">{r.address}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full border border-red-200 text-red-500 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
