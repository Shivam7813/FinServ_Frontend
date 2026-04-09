import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

// ✅ SERVICE IMPORT
import { createLoanCase } from "../../services/createLoanService";

export default function CreateLoanCase() {
  const [step, setStep] = useState(1);

  // ✅ ADD FORM STATE (NO UI CHANGE)
  const [formData, setFormData] = useState({});

  // ✅ HANDLE INPUT CHANGE (GENERIC)
  const handleChange = (e) => {
    const { placeholder, value, type, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [placeholder || "field_" + Date.now()]:
        type === "file" ? files[0] : value,
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ✅ SUBMIT FUNCTION (NO UI CHANGE)
  const handleSubmit = async () => {
    try {
      await createLoanCase(formData);
      alert("Loan Case Created ✅");
    } catch (err) {
      console.error(err);
      alert("Error creating loan ❌");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">
        Create New Loan Case
      </h1>

      {/* TOP SECTION */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-500 text-sm">Case Number</p>
            <p className="text-teal-600 font-semibold">
              AUTO-2024-5736
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Step {step} of 5
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-blue-900 h-2 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm">
          {["Loan Details", "Customer Info", "Vehicle Details", "Documents", "Bank Selection"].map(
            (label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    step === index + 1
                      ? "bg-blue-900 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-xs">{label}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-6 rounded-xl shadow">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Loan Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Loan Type</label>
                <select onChange={handleChange} className="w-full border p-2 rounded mt-1">
                  <option>Auto Loan - New Car</option>
                  <option>Auto Loan - Used Car</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Requested Amount</label>
                <input onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="₹ 10,00,000" />
              </div>

              <div>
                <label className="text-sm">Tenure</label>
                <select onChange={handleChange} className="w-full border p-2 rounded mt-1">
                  <option>12 Months</option>
                  <option>36 Months</option>
                  <option>60 Months</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Down Payment</label>
                <input onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="₹ 2,00,000" />
              </div>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-2">Customer Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Full Name" />
              <input onChange={handleChange} type="date" className="border p-2 rounded" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="PAN Number" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Aadhaar Number" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Mobile Number" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Email" />
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Car Brand" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Car Model" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="On Road Price" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Registration City" />
              <input onChange={handleChange} className="border p-2 rounded" placeholder="Dealer Name" />
              <select onChange={handleChange} className="border p-2 rounded">
                <option>SUV</option>
                <option>Sedan</option>
                <option>Hatchback</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>

            <div className="grid grid-cols-2 gap-4">
              <input onChange={handleChange} type="file" className="border p-2 rounded" />
              <input onChange={handleChange} type="file" className="border p-2 rounded" />
              <input onChange={handleChange} type="file" className="border p-2 rounded" />
              <input onChange={handleChange} type="file" className="border p-2 rounded" />
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Bank Selection</h2>

            <div className="grid grid-cols-2 gap-4">
              <select onChange={handleChange} className="border p-2 rounded">
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>SBI</option>
              </select>

              <input onChange={handleChange} className="border p-2 rounded" placeholder="Interest Rate %" />
              <select onChange={handleChange} className="border p-2 rounded">
                <option>12 Months</option>
                <option>36 Months</option>
                <option>60 Months</option>
              </select>

              <input onChange={handleChange} className="border p-2 rounded" placeholder="EMI Estimate" />
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            ← Previous
          </button>

          <button
            onClick={step === 5 ? handleSubmit : nextStep}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg"
          >
            {step === 5 ? "Submit" : "Save & Continue →"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}