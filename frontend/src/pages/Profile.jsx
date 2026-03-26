import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const { owner, restaurants, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto mt-12 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold">Your Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
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
          <p className="font-semibold">{owner?.phone_no}</p>
        </div>
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
