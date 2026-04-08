// src/pages/user/ApplyLoan.jsx

import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function ApplyLoan() {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    pan: "",
    aadhaar: "",
    employmentType: "",
    income: "",
    carType: "",
    carModel: "",
    carPrice: "",
    downPayment: "",
    loanAmount: "",
    tenure: "",
  });

  const [documents, setDocuments] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", form);
    console.log("Documents:", documents);

    alert("Loan Application Submitted 🚀");
  };

  return (
    <AdminLayout>

      <h2 className="text-xl font-semibold mb-4">Apply for Loan</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">

        {/* PERSONAL INFO */}
        <div>
          <h3 className="font-semibold mb-3">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Full Name" name="fullName" onChange={handleChange} />
            <Input label="Mobile Number" name="mobile" onChange={handleChange} />
            <Input label="Email" name="email" onChange={handleChange} />
            <Input label="Address" name="address" onChange={handleChange} />
            <Input label="PAN Card" name="pan" onChange={handleChange} />
            <Input label="Aadhaar Number" name="aadhaar" onChange={handleChange} />

            <Select
              label="Employment Type"
              name="employmentType"
              options={["Salaried", "Self-Employed"]}
              onChange={handleChange}
            />

            <Input label="Monthly Income" name="income" onChange={handleChange} />

          </div>
        </div>

        {/* LOAN DETAILS */}
        <div>
          <h3 className="font-semibold mb-3">Loan Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Select
              label="Car Type"
              name="carType"
              options={["New", "Used"]}
              onChange={handleChange}
            />

            <Input label="Car Model" name="carModel" onChange={handleChange} />
            <Input label="Car Price" name="carPrice" onChange={handleChange} />
            <Input label="Down Payment" name="downPayment" onChange={handleChange} />
            <Input label="Loan Amount" name="loanAmount" onChange={handleChange} />
            <Input label="Loan Tenure (Months)" name="tenure" onChange={handleChange} />

          </div>
        </div>

        {/* DOCUMENT UPLOAD */}
        <div>
          <h3 className="font-semibold mb-3">Upload Documents</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FileInput label="Aadhaar Card" name="aadhaarDoc" onChange={handleFileChange} />
            <FileInput label="PAN Card" name="panDoc" onChange={handleFileChange} />
            <FileInput label="Salary Slips (3 months)" name="salarySlips" onChange={handleFileChange} />
            <FileInput label="Bank Statements" name="bankStatements" onChange={handleFileChange} />
            <FileInput label="Address Proof" name="addressProof" onChange={handleFileChange} />
            <FileInput label="Car Quotation" name="carQuotation" onChange={handleFileChange} />
            <FileInput label="Photograph" name="photo" onChange={handleFileChange} />

          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
        >
          Submit Application
        </button>

      </form>

    </AdminLayout>
  );
}

/* 🔹 Reusable Components */

function Input({ label, name, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="text"
        name={name}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
      />
    </div>
  );
}

function Select({ label, name, options, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        name={name}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, name, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-lg"
      />
    </div>
  );
}