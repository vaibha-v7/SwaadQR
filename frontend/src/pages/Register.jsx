import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone_no: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

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
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fff2df_0%,_#f7f9fb_45%,_#eef3f8_100%)] px-4 py-12">
        <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative mx-auto mt-8 w-full max-w-md rounded-3xl border border-orange-100 bg-[#f7f9fb]/95 p-6 text-center shadow-[0px_30px_80px_rgba(25,28,30,0.18)] backdrop-blur-md md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Verification</p>
          <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl shadow-sm">✉️</div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Check Your Email</h2>
          <p className="mt-2 text-sm text-slate-500">
            We sent a verification link to <strong className="font-semibold text-slate-700">{form.email}</strong>. Verify and then log in.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#9D4300] to-[#F97316] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/30 transition-transform hover:scale-[1.01]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fff2df_0%,_#f7f9fb_45%,_#eef3f8_100%)] px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-orange-100 bg-[#f7f9fb]/95 p-6 md:p-8 shadow-[0px_30px_80px_rgba(25,28,30,0.18)] backdrop-blur-md">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Owner Onboarding</p>
        <h1 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-900">Create Your Account</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Start managing your menu and restaurants in one place.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-orange-100/70 bg-white p-5 shadow-[0px_20px_50px_rgba(25,28,30,0.05)]">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Phone Number</label>
            <input
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.phone_no && <p className="mt-1 text-xs text-red-500">{errors.phone_no}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#9D4300] to-[#F97316] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/30 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
