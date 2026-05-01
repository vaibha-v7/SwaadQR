import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now log in.");
    } else if (searchParams.get("error") === "invalid_token") {
      toast.error("Invalid or expired verification link.");
    } else if (searchParams.get("error") === "verification_failed") {
      toast.error("Verification failed. Please try again or contact support.");
    }
  }, [searchParams]);

  if (!authLoading && isAuthenticated) return <Navigate to="/restaurants" replace />;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/restaurants");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fff2df_0%,_#f7f9fb_45%,_#eef3f8_100%)] px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-orange-100 bg-[#f7f9fb]/95 p-6 md:p-8 shadow-[0px_30px_80px_rgba(25,28,30,0.18)] backdrop-blur-md">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Owner Portal</p>
        <h1 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-900">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Sign in to manage your restaurants and menu.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-orange-100/70 bg-white p-5 shadow-[0px_20px_50px_rgba(25,28,30,0.05)]">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#9D4300] to-[#F97316] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/30 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
