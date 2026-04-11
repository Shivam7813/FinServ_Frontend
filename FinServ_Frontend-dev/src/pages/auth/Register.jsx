import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiBase";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaIdCard,
  FaBriefcase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pan: "",
    aadhaar: "",
    employment: "",
    income: "",
    password: "",
    role: "USER",
    dob: "",
    city: "",
    pincode: "",
    state: "",
    companyName: "",
    businessName: "",
    experience: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "pan") value = value.toUpperCase();
    if (name === "aadhaar") value = value.replace(/\D/g, "").slice(0, 12);
    if (name === "mobile") value = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode") value = value.replace(/\D/g, "").slice(0, 6);

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        email: form.email,
        mobileNumber: form.mobile,
        password: form.password,
        role: form.role,
        fullName: form.name,
        dateOfBirth: form.dob,
        panNumber: form.pan,
        aadhaarNumber: form.aadhaar,
        addressLine1: form.address,
        city: form.city,
        pincode: form.pincode,
        state: form.state,

        // ✅ FIX: Do NOT send employmentType for BANK
        employmentType:
          form.role !== "BANK"
            ? form.employment.toUpperCase().replace("-", "_")
            : null,

        // SALARIED
        companyName:
          form.role !== "BANK" && form.employment === "salaried"
            ? form.companyName
            : null,

        monthlySalary:
          form.role !== "BANK" && form.employment === "salaried"
            ? Number(form.income)
            : null,

        workExperience:
          form.role !== "BANK" && form.employment === "salaried"
            ? Number(form.experience)
            : null,

        // BUSINESS / SELF EMPLOYED
        businessName:
          form.role !== "BANK" && form.employment !== "salaried"
            ? form.businessName
            : null,

        annualIncome:
          form.role !== "BANK" && form.employment !== "salaried"
            ? Number(form.income)
            : null,
      };

      await axios.post(`${API_BASE_URL}/api/users`, payload);

      toast.success("Registration Successful ✅");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-auto">

      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0a2540] to-[#081f36] text-white p-16 flex-col justify-between">
        <h1 className="text-4xl font-bold">Create Your Account</h1>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#f5f7fb] p-4">
        <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl">

          <h2 className="text-xl font-semibold text-center mb-5">
            Create Account
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <Input icon={<FaUser />} name="name" placeholder="Full Name *" onChange={handleChange} />
            <Input icon={<FaPhone />} name="mobile" placeholder="Mobile (10 digit) *" onChange={handleChange} />

            <Input icon={<FaEnvelope />} name="email" placeholder="Email *" onChange={handleChange} />
            <Input icon={<FaIdCard />} name="pan" placeholder="PAN (ABCDE1234F) *" onChange={handleChange} />

            <Input name="aadhaar" placeholder="Aadhaar (12 digit) *" onChange={handleChange} />
            <Input name="income" placeholder="Income *" onChange={handleChange} />

            <Input type="date" max={today} name="dob" onChange={handleChange} />
            <Input name="city" placeholder="City *" onChange={handleChange} />

            <Input name="pincode" placeholder="Pincode *" onChange={handleChange} />

            <select
              name="state"
              onChange={handleChange}
              className="bg-gray-100 border rounded-lg px-3 py-3"
            >
              <option value="">SELECT STATE *</option>
              <option>MAHARASHTRA</option>
              <option>GUJARAT</option>
              <option>DELHI</option>
              <option>KARNATAKA</option>
              <option>TAMIL NADU</option>
            </select>
          </div>

          <div className="mt-3">
            <Input name="address" placeholder="Address *" onChange={handleChange} full />
          </div>

          {/* EMPLOYMENT */}
          <select
            name="employment"
            onChange={handleChange}
            className="w-full mt-3 bg-gray-100 border rounded-lg px-3 py-3"
          >
            <option value="">Employment Type *</option>
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self Employed</option> {/* FIX */}
            <option value="business">Business</option>
          </select>

          {/* CONDITIONAL FIELDS */}
          {form.employment === "salaried" && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Input icon={<FaBriefcase />} name="companyName" placeholder="Company Name *" onChange={handleChange} />
              <Input name="experience" placeholder="Experience (Years) *" onChange={handleChange} />
            </div>
          )}

          {form.employment && form.employment !== "salaried" && (
            <div className="mt-3">
              <Input icon={<FaBriefcase />} name="businessName" placeholder="Business Name *" onChange={handleChange} full />
            </div>
          )}

          {/* ROLE */}
          <select
            name="role"
            onChange={handleChange}
            className="w-full mt-3 bg-gray-100 border rounded-lg px-3 py-3"
          >
            <option value="USER">USER</option>
            <option value="BANK_EVALUATE">BANK</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          {/* PASSWORD */}
          <div className="flex items-center bg-gray-100 border rounded-lg px-3 py-3 mt-3">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              onChange={handleChange}
              className="ml-2 w-full bg-transparent outline-none"
            />
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye onClick={() => setShowPassword(true)} />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-5 py-3 bg-[#0b2a4a] text-white rounded-lg hover:bg-[#081f36]"
          >
            {loading ? "Loading..." : "Register →"}
          </button>

        </div>
      </div>
    </div>
  );
};

const Input = ({ icon, name, placeholder, onChange, full, type, max }) => (
  <div className={`${full ? "col-span-2" : ""}`}>
    <div className="flex items-center bg-gray-100 border rounded-lg px-3 py-3">
      {icon && <span className="text-gray-400">{icon}</span>}
      <input
        type={type || "text"}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        max={max}
        className="ml-2 w-full bg-transparent outline-none"
      />
    </div>
  </div>
);

export default Register;