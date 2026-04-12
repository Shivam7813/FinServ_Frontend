import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../api/api";

import { applyLoan } from "../../services/applyLoanService";
import {
  fetchBanks,
  syncUserProfileFromDashboard,
  mergeFormMobileIntoStoredUser,
} from "../../services/userLoanApi";

export default function ApplyLoan() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [prefetchedBankId, setPrefetchedBankId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchBanks()
      .then((banks) => {
        const id = Number(banks[0]?.id);
        if (!cancelled && Number.isFinite(id) && id > 0) {
          setPrefetchedBankId(id);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!form.fullName) newErrors.fullName = "Full Name is required";
    if (!form.mobile) newErrors.mobile = "Mobile is required";
    if (!form.loanAmount) newErrors.loanAmount = "Loan Amount is required";
    if (!form.downPayment) newErrors.downPayment = "Down payment is required";
    if (!form.tenure) newErrors.tenure = "Tenure is required (6–360, steps of 6)";
    if (!form.carType) newErrors.carType = "Select car type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadSingleDocument = async (loanId, type, file) => {
    const formData = new FormData();
    formData.append("loanId", loanId);
    formData.append("type", type);
    formData.append("file", file);
    return API.post("/documents/upload", formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        user = {};
      }

      const payload = {
        ...form,
        fullName: user?.name || form.fullName,
      };

      const response = await applyLoan(payload, prefetchedBankId);

      const loanId =
        response?.loanid ??
        response?.data?.loanid ??
        response?.data?.id ??
        response?.data?.loanId ??
        response?.id ??
        response?.loanId;

      if (!loanId) {
        toast.error("Loan created but Loan ID not found!");
        return;
      }

      const uploadSafe = async (type, file) => {
        try {
          await uploadSingleDocument(loanId, type, file);
        } catch (error) {
          console.error(`${type} upload failed`, error);
        }
      };

      const uploadPromises = [];
      if (documents?.aadhaarDoc) {
        uploadPromises.push(uploadSafe("AADHAAR", documents.aadhaarDoc));
      }
      if (documents?.panDoc) {
        uploadPromises.push(uploadSafe("PAN", documents.panDoc));
      }
      if (documents?.salarySlips) {
        uploadPromises.push(uploadSafe("SALARY_SLIP", documents.salarySlips));
      }
      if (documents?.bankStatements) {
        uploadPromises.push(uploadSafe("BANK_STATEMENT", documents.bankStatements));
      }

      await Promise.all(uploadPromises);

      mergeFormMobileIntoStoredUser(form.mobile);
      await syncUserProfileFromDashboard();

      toast.success("Loan application submitted");

      setForm({
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

      setDocuments({});
      setErrors({});
      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>

      <h2 className="text-xl font-semibold mb-4">Apply for Loan</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">

        {/* PERSONAL INFO */}
        <div>
          <h3 className="font-semibold mb-3">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
            <Input label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            <Input label="PAN Card" name="pan" value={form.pan} onChange={handleChange} />
            <Input label="Aadhaar Number" name="aadhaar" value={form.aadhaar} onChange={handleChange} />

            <Select label="Employment Type" name="employmentType" value={form.employmentType} options={["Salaried", "Self-Employed"]} onChange={handleChange} />

            <Input label="Monthly Income" name="income" value={form.income} onChange={handleChange} />

          </div>
        </div>

        {/* LOAN DETAILS */}
        <div>
          <h3 className="font-semibold mb-3">Loan Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Select label="Car Type" name="carType" value={form.carType} options={["New", "Used"]} onChange={handleChange} error={errors.carType} />

            <Input label="Car Model" name="carModel" value={form.carModel} onChange={handleChange} />
            <Input label="Car Price" name="carPrice" value={form.carPrice} onChange={handleChange} />
            <Input label="Down Payment" name="downPayment" value={form.downPayment} onChange={handleChange} error={errors.downPayment} />
            <Input label="Loan Amount" name="loanAmount" value={form.loanAmount} onChange={handleChange} error={errors.loanAmount} />
            <Input label="Loan Tenure (months, e.g. 60)" name="tenure" value={form.tenure} onChange={handleChange} error={errors.tenure} />

          </div>
        </div>

        {/* DOCUMENTS */}
        <div>
  <h3 className="font-semibold mb-3 text-lg text-gray-800">
    Upload Documents
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Aadhaar */}
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <FileInput label="Aadhaar Card" name="aadhaarDoc" onChange={handleFileChange} />

      {documents?.aadhaarDoc && (
        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-xs truncate w-[65%]">
            {documents.aadhaarDoc.name}
          </span>

          <div className="flex gap-2">
            {/* View */}
            <button
              type="button"
              onClick={() =>
                window.open(URL.createObjectURL(documents.aadhaarDoc), "_blank")
              }
              className="text-blue-500 text-xs"
            >
              View
            </button>

            {/* Remove */}
            <button
              type="button"
              onClick={() =>
                setDocuments((prev) => ({ ...prev, aadhaarDoc: null }))
              }
              className="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>

    {/* PAN */}
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <FileInput label="PAN Card" name="panDoc" onChange={handleFileChange} />

      {documents?.panDoc && (
        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-xs truncate w-[65%]">
            {documents.panDoc.name}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                window.open(URL.createObjectURL(documents.panDoc), "_blank")
              }
              className="text-blue-500 text-xs"
            >
              View
            </button>

            <button
              type="button"
              onClick={() =>
                setDocuments((prev) => ({ ...prev, panDoc: null }))
              }
              className="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Salary Slips */}
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <FileInput label="Salary Slips" name="salarySlips" onChange={handleFileChange} />

      {documents?.salarySlips && (
        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-xs truncate w-[65%]">
            {documents.salarySlips.name}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                window.open(URL.createObjectURL(documents.salarySlips), "_blank")
              }
              className="text-blue-500 text-xs"
            >
              View
            </button>

            <button
              type="button"
              onClick={() =>
                setDocuments((prev) => ({ ...prev, salarySlips: null }))
              }
              className="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Bank Statements */}
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <FileInput label="Bank Statements" name="bankStatements" onChange={handleFileChange} />

      {documents?.bankStatements && (
        <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-xs truncate w-[65%]">
            {documents.bankStatements.name}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                window.open(URL.createObjectURL(documents.bankStatements), "_blank")
              }
              className="text-blue-500 text-xs"
            >
              View
            </button>

            <button
              type="button"
              onClick={() =>
                setDocuments((prev) => ({ ...prev, bankStatements: null }))
              }
              className="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>

  </div>
</div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </button>

      </form>

    </AdminLayout>
  );
}


/* COMPONENTS */

function Input({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-400"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, name, value = "", options, onChange, error }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-lg"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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