import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone_no: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_no") {
      if (value !== "" && !/^\d*$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      if (!/\d/.test(form.password)) newErrors.password = "Password must contain at least one digit";
      else if (!/[^A-Za-z0-9]/.test(form.password)) newErrors.password = "Password must contain at least one special character";
    }
    if (!form.phone_no.trim()) {
      newErrors.phone_no = "Phone number is required";
    } else if (form.phone_no.length !== 10) {
      newErrors.phone_no = "Phone number must be exactly 10 digits";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await api.post("/swaad/owner/register", form);
      setDone(true);
      toast.success("Registered! Check your email to verify.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center space-y-4 px-4">
        <div className="text-5xl">✉️</div>
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-gray-500">We sent a verification link to <strong>{form.email}</strong>. Verify and then log in.</p>
        <Link to="/login" className="inline-block mt-4 text-primary font-semibold hover:underline">
          Go to Login →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-3xl font-extrabold text-center mb-8">Create your account</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div>
          <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Phone Number" type="tel" inputMode="numeric" maxLength={10} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          {errors.phone_no && <p className="text-red-500 text-xs mt-1">{errors.phone_no}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer">
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
