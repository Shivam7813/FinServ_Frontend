import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.email || !form.password) {
      toast.warning("Please fill all fields ⚠️");
      return;
    }

    try {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 1000));

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Duplicate check
      const exists = users.find(
        (u) => u.email === form.email.trim().toLowerCase()
      );

      if (exists) {
        toast.error("User already exists ❌");
        return;
      }

      // Save user
      users.push({
        ...form,
        email: form.email.trim().toLowerCase(),
        role: form.role.toLowerCase(), 
      });

      localStorage.setItem("users", JSON.stringify(users));

      // Success toast
      toast.success("Registration Successful 🎉");

      // Redirect after toast
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      toast.error("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0a2540] via-[#0b2a4a] to-[#081f36] text-white px-20 py-20 flex-col justify-between">
        <div className="flex items-center gap-4">
        <div className="bg-[#1cc5b7] p-4 rounded-xl shadow-lg flex items-center justify-center">
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-white"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>

        </div>
        <div>
            <h2 className="text-xl font-semibold">Caryanam</h2>
            <p className="text-sm text-gray-300">FinServ</p>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Create Your <br /> Account
          </h1>
          <p className="text-gray-300 max-w-xl">
            Join and start managing your finance workflows easily.
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
            Create Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Register to continue
          </p>

          {/* NAME */}
          <label className="text-sm text-gray-600">Full Name</label>
          <div className="flex items-center border rounded-lg px-3 py-3 mt-1 mb-4 bg-gray-50">
            <FaUser className="text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={handleChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* EMAIL */}
          <label className="text-sm text-gray-600">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-3 mt-1 mb-4 bg-gray-50">
            <FaEnvelope className="text-gray-400" />
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* PASSWORD */}
          <label className="text-sm text-gray-600">Password</label>
          <div className="flex items-center border rounded-lg px-3 py-3 mt-1 mb-4 bg-gray-50">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
            />
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye onClick={() => setShowPassword(true)} />
            )}
          </div>

          {/* ROLE */}
          <label className="text-sm text-gray-600">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-3 mt-1 mb-5 bg-gray-50"
          >
            <option value="USER">User</option>
            <option value="BANK">Bank</option>
            <option value="ADMIN">Admin</option>
            <option value="DEALER">Dealer</option>
          </select>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-[#0b2a4a] text-white rounded-lg font-medium"
          >
            {loading ? "Registering..." : "Register →"}
          </button>

          {/* LOGIN LINK */}
          <p className="mt-5 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-[#1cc5b7] cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;