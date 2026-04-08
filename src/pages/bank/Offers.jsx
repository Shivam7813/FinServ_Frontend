import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";
import { offers as mockOffers, applications } from "../../mock/mockData";

export default function Offers() {
  const [offers, setOffers] = useState(mockOffers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🔹 Map applicationId → applicant details
  const getApplicationDetails = (applicationId) => {
    return applications.find((app) => app.id === applicationId);
  };

  // 🔹 Filter logic
  const filteredOffers = offers.filter((offer) => {
    const app = getApplicationDetails(offer.applicationId);
    const name = app?.fullName?.toLowerCase() || "";

    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "SENT":
        return "bg-blue-100 text-blue-700";
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => status.replaceAll("_", " ");

  // 🔹 Send Offer
  const handleSendOffer = (id) => {
    const updated = offers.map((offer) =>
      offer.id === id ? { ...offer, status: "SENT" } : offer
    );
    setOffers(updated);
  };

  return (
    <AdminLayout>
      <div className="p-4">

        {/* 🔹 Header */}
        <h2 className="text-2xl font-semibold mb-4">
          Loan Offers
        </h2>

        {/* 🔥 Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">

          {/* Search */}
          <input
            type="text"
            placeholder="Search applicant..."
            className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Status Filter */}
          <select
            className="border px-3 py-2 rounded-lg w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* 🔥 Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">

            {/* Header */}
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

            {/* Body */}
            <tbody>
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No offers found
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => {
                  const app = getApplicationDetails(
                    offer.applicationId
                  );

                  const isFinal =
                    offer.status === "ACCEPTED" ||
                    offer.status === "REJECTED";

                  return (
                    <tr
                      key={offer.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* Applicant */}
                      <td className="p-3 font-medium flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full text-sm font-semibold">
                          {app?.fullName?.charAt(0) || "U"}
                        </div>
                        {app?.fullName || "Unknown"}
                      </td>

                      {/* Amount */}
                      <td className="p-3">₹{offer.amount}</td>

                      {/* Interest */}
                      <td className="p-3">{offer.interest}</td>

                      {/* Tenure */}
                      <td className="p-3">{offer.tenure}</td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            offer.status
                          )}`}
                        >
                          {formatStatus(offer.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 flex gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          View
                        </button>

                        {offer.status === "DRAFT" && (
                          <button
                            onClick={() =>
                              handleSendOffer(offer.id)
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Send
                          </button>
                        )}

                        {isFinal && (
                          <span className="text-gray-400 text-sm">
                            Completed
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}