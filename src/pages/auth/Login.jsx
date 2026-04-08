import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ✅ Handle Login
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await login(form);

      console.log("Logged in user:", user);

      // ✅ Remember Me
      if (remember) {
        localStorage.setItem("remember", "true");
      } else {
        localStorage.removeItem("remember");
      }

      toast.success("Login Successful 🎉");

      // ✅ ROLE BASED REDIRECT (FINAL FIX)
      const role = user?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "bank") {
        navigate("/bank/dashboard", { replace: true });
      } else if (role === "user") {
        navigate("/user/dashboard", { replace: true });
      } else {
        console.warn("Unknown role:", role);
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0a2540] via-[#0b2a4a] to-[#081f36] text-white px-20 py-20 flex-col justify-between">

        <div className="flex items-center gap-4">
          <div className="bg-[#1cc5b7] p-4 rounded-xl text-xl shadow-lg">
            🚗
          </div>
          <div>
            <h2 className="text-xl font-semibold">Caryanam</h2>
            <p className="text-sm text-gray-300">FinServ</p>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Streamline Your <br /> Auto Finance Journey
          </h1>
          <p className="text-gray-300 max-w-xl">
            Digitize, verify, and process loan applications with ease.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h3 className="text-[#1cc5b7] text-2xl">500+</h3>
            <p className="text-gray-400 text-sm">Dealers</p>
          </div>
          <div>
            <h3 className="text-[#1cc5b7] text-2xl">₹100Cr+</h3>
            <p className="text-gray-400 text-sm">Loans</p>
          </div>
          <div>
            <h3 className="text-[#1cc5b7] text-2xl">15+</h3>
            <p className="text-gray-400 text-sm">Banks</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[#f5f7fb]">

        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-semibold text-center mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to continue
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <label className="text-sm text-gray-600">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-3 mt-1 mb-4 bg-gray-50 focus-within:ring-2 focus-within:ring-[#1cc5b7]">
            <FaEnvelope className="text-gray-400" />
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* PASSWORD */}
          <label className="text-sm text-gray-600">Password</label>
          <div className="flex items-center border rounded-lg px-3 py-3 mt-1 mb-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#1cc5b7]">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
            />
            {showPassword ? (
              <FaEyeSlash
                onClick={() => setShowPassword(false)}
                className="cursor-pointer text-gray-400"
              />
            ) : (
              <FaEye
                onClick={() => setShowPassword(true)}
                className="cursor-pointer text-gray-400"
              />
            )}
          </div>

          {/* REMEMBER */}
          <div className="flex items-center justify-between text-sm mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-[#0b2a4a] text-white rounded-lg font-medium hover:bg-[#081f36] transition"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          {/* REGISTER */}
          <p className="mt-3 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#1cc5b7] cursor-pointer"
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;