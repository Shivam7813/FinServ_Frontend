// src/pages/user/LoanOffers.jsx

import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

// ✅ SERVICE
import {
  getLoanOffers,
  saveSelectedOffer,
  getSelectedOffer,
} from "../../services/loanOfferService";

export default function LoanOffers() {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // ✅ LOAD DATA
  useEffect(() => {
    const fetchData = async () => {
      const data = await getLoanOffers();
      const saved = await getSelectedOffer();

      setOffers(data);
      setSelectedOffer(saved);
    };

    fetchData();
  }, []);

  // ✅ SELECT OFFER
  const handleSelect = async (offer) => {
    setSelectedOffer(offer);
    await saveSelectedOffer(offer);
  };

  return (
    <AdminLayout>

      <h2 className="text-xl font-semibold mb-4">
        Compare Loan Offers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`p-4 rounded-lg shadow border transition ${
              selectedOffer?.id === offer.id
                ? "border-teal-500 bg-teal-50"
                : "bg-white"
            }`}
          >

            <h3 className="text-lg font-semibold mb-2">
              {offer.bank}
            </h3>

            <p className="text-sm text-gray-600">
              Interest Rate: <span className="font-medium">{offer.interest}</span>
            </p>

            <p className="text-sm text-gray-600">
              EMI: <span className="font-medium">{offer.emi}</span>
            </p>

            <p className="text-sm text-gray-600">
              Tenure: <span className="font-medium">{offer.tenure}</span>
            </p>

            <p className="text-sm text-gray-600 mb-3">
              Processing Fee: <span className="font-medium">{offer.processingFee}</span>
            </p>

            <button
              onClick={() => handleSelect(offer)}
              className={`w-full py-2 rounded ${
                selectedOffer?.id === offer.id
                  ? "bg-green-500 text-white"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              {selectedOffer?.id === offer.id
                ? "Selected ✔"
                : "Select Offer"}
            </button>

          </div>
        ))}

      </div>

      {/* ✅ SELECTED SUMMARY */}
      {selectedOffer && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">

          <h3 className="font-semibold mb-2">
            Selected Offer
          </h3>

          <p>
            You selected <strong>{selectedOffer.bank}</strong> with{" "}
            <strong>{selectedOffer.interest}</strong> interest rate.
          </p>

          <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Proceed with this Offer
          </button>

        </div>
      )}

    </AdminLayout>
  );
}