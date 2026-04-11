import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { createLoanCase } from "../../services/createLoanService";
import API from "../../api/api";

export default function CreateLoanCase() {
  const [users, setUsers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    bankId: "",
    loanType: "AUTO_NEW_CAR",
    loanAmount: "",
    downPayment: "",
    tenure: "60",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingMeta(true);
        const [usersRes, banksRes] = await Promise.all([
          API.get("/users"),
          API.get("/banks"),
        ]);
        const u = Array.isArray(usersRes.data) ? usersRes.data : [];
        const b = Array.isArray(banksRes.data) ? banksRes.data : [];
        setUsers(
          u.map((row) => ({
            id: row.userId,
            label: `${row.fullName || "User"} (${row.email || row.userId})`,
          }))
        );
        setBanks(
          b.map((row) => ({
            id: row.id,
            label: row.bankName || `Bank ${row.id}`,
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMeta(false);
      }
    };
    load();
  }, []);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = Number(form.userId);
    const bankId = Number(form.bankId);
    const loanAmount = Number(form.loanAmount);
    const downPayment = Number(form.downPayment);
    const tenure = Number(form.tenure);

    if (!userId || !bankId) {
      alert("Select a customer and a bank.");
      return;
    }
    if (!loanAmount || loanAmount <= 0) {
      alert("Enter a valid loan amount.");
      return;
    }
    if (downPayment < 0 || downPayment >= loanAmount) {
      alert("Down payment must be less than the loan amount.");
      return;
    }
    if (!tenure || tenure < 6 || tenure > 360 || tenure % 6 !== 0) {
      alert("Tenure must be between 6 and 360 months, in steps of 6.");
      return;
    }

    try {
      setSubmitting(true);
      await createLoanCase({
        loanType: form.loanType,
        loanAmount,
        downPayment,
        tenure,
        userId,
        bankId,
      });
      alert("Loan case created successfully.");
      setForm({
        userId: "",
        bankId: "",
        loanType: "AUTO_NEW_CAR",
        loanAmount: "",
        downPayment: "",
        tenure: "60",
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Could not create loan";
      alert(typeof msg === "string" ? msg : "Could not create loan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-2">Create New Loan Case</h1>
      <p className="text-gray-500 mb-6">
        Creates a loan application in Caryanam_Finserv for an existing customer.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-2xl space-y-5"
      >
        {loadingMeta ? (
          <p className="text-gray-500 text-sm">Loading customers and banks…</p>
        ) : null}

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Customer
          </label>
          <select
            required
            className="w-full border rounded-lg p-2"
            value={form.userId}
            onChange={(e) => setField("userId", e.target.value)}
          >
            <option value="">Select customer</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Partner bank
          </label>
          <select
            required
            className="w-full border rounded-lg p-2"
            value={form.bankId}
            onChange={(e) => setField("bankId", e.target.value)}
          >
            <option value="">Select bank</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Loan type
          </label>
          <select
            className="w-full border rounded-lg p-2"
            value={form.loanType}
            onChange={(e) => setField("loanType", e.target.value)}
          >
            <option value="AUTO_NEW_CAR">Auto — new car</option>
            <option value="AUTO_USED_CAR">Auto — used car</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Loan amount (₹)
            </label>
            <input
              required
              type="number"
              min="1"
              className="w-full border rounded-lg p-2"
              value={form.loanAmount}
              onChange={(e) => setField("loanAmount", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Down payment (₹)
            </label>
            <input
              required
              type="number"
              min="1"
              className="w-full border rounded-lg p-2"
              value={form.downPayment}
              onChange={(e) => setField("downPayment", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Tenure (months, multiple of 6)
          </label>
          <input
            required
            type="number"
            min="6"
            max="360"
            step="6"
            className="w-full border rounded-lg p-2"
            value={form.tenure}
            onChange={(e) => setField("tenure", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || loadingMeta}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Create loan case"}
        </button>
      </form>
    </AdminLayout>
  );
}
