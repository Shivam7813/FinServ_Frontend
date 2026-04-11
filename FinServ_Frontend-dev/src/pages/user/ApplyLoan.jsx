import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";

// ✅ SERVICE
import { applyLoan } from "../../services/applyLoanService";
import { fetchBanks } from "../../services/userLoanApi";

export default function ApplyLoan() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [bankId, setBankId] = useState("");
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

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchBanks();
        setBanks(list);
        if (list.length === 1) {
          setBankId(String(list[0].id));
        }
      } catch (e) {
        console.error(e);
        toast.error("Could not load banks. Is the server running?");
      }
    };
    load();
  }, []);

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
    if (!bankId) newErrors.bankId = "Select a bank";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // ✅ AUTO USER NAME
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        ...form,
        fullName: user?.name || form.fullName,
      };

      await applyLoan(payload, Number(bankId));

      toast.success("Loan application submitted");

      // ✅ RESET FORM
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
      setBankId(banks.length === 1 ? String(banks[0].id) : "");
      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
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

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Preferred bank</label>
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="">Select bank</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName}
                  </option>
                ))}
              </select>
              {errors.bankId && (
                <p className="text-red-500 text-xs mt-1">{errors.bankId}</p>
              )}
              {banks.length === 0 && (
                <p className="text-amber-600 text-xs mt-1">
                  No banks in the system yet. An admin must add a bank before you
                  can apply.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* DOCUMENTS */}
        <div>
          <h3 className="font-semibold mb-3">Upload Documents</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileInput label="Aadhaar Card" name="aadhaarDoc" onChange={handleFileChange} />
            <FileInput label="PAN Card" name="panDoc" onChange={handleFileChange} />
            <FileInput label="Salary Slips" name="salarySlips" onChange={handleFileChange} />
            <FileInput label="Bank Statements" name="bankStatements" onChange={handleFileChange} />
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