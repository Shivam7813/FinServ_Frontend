// components/LoanTable.jsx
export default function LoanTable() {
  const data = [
    {
      id: "AUTO-2024-0124",
      name: "Rajesh Kumar",
      amount: "₹8,50,000",
      status: "Under Review",
    },
    {
      id: "AUTO-2024-0123",
      name: "Priya Sharma",
      amount: "₹12,00,000",
      status: "Approved",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Loan Cases</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Case Number</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-3">{item.id}</td>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}