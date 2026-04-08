import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";

export default function Offers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      amount: 500000,
      interest: "8.5%",
      tenure: "5 Years",
      status: "Sent",
    },
    {
      id: 2,
      name: "Priya Verma",
      amount: 300000,
      interest: "9%",
      tenure: "3 Years",
      status: "Draft",
    },
    {
      id: 3,
      name: "Amit Patel",
      amount: 700000,
      interest: "7.8%",
      tenure: "7 Years",
      status: "Accepted",
    },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSendOffer = (id) => {
    const updated = offers.map((offer) =>
      offer.id === id ? { ...offer, status: "Sent" } : offer
    );
    setOffers(updated);
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Loan Offers</h2>

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Interest</th>
                <th className="p-3">Tenure</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-t">
                  <td className="p-3 font-medium">{offer.name}</td>
                  <td className="p-3">₹{offer.amount}</td>
                  <td className="p-3">{offer.interest}</td>
                  <td className="p-3">{offer.tenure}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        offer.status
                      )}`}
                    >
                      {offer.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      View
                    </button>

                    {offer.status === "Draft" && (
                      <button
                        onClick={() => handleSendOffer(offer.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Send
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}