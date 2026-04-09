import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ SERVICES
import { getApplications } from "../../services/applicationService";
import { getOffers, updateOfferStatus } from "../../services/offerService";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();

  // ✅ FETCH
  const fetchData = async () => {
    const apps = await getApplications();
    const offersData = await getOffers();

    setApplications(apps);
    setOffers(offersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 MAP
  const getApplicationDetails = (applicationId) => {
    return applications.find((app) => app.id === applicationId);
  };

  // 🔹 FILTER
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

  // ✅ SEND OFFER
  const handleSendOffer = async (id) => {
    await updateOfferStatus(id, "SENT");
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="p-4">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-4">
          Loan Offers
        </h2>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">

          <input
            type="text"
            placeholder="Search applicant..."
            className="border px-3 py-2 rounded-lg w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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

        {/* TABLE */}
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

                  return (
                    <tr key={offer.id} className="border-t hover:bg-gray-50">

                      {/* Applicant */}
                      <td className="p-3 flex items-center gap-2">
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
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(offer.status)}`}>
                          {formatStatus(offer.status)}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3 flex gap-2">

                        {/* 🔥 VIEW */}
                        <button
                          onClick={() =>
                            navigate(`/bank/review/${offer.applicationId}`)
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          View
                        </button>

                        {/* SEND */}
                        {offer.status === "DRAFT" && (
                          <button
                            onClick={() => handleSendOffer(offer.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Send
                          </button>
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