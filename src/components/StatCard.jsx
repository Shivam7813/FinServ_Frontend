// components/StatCard.jsx
export default function StatCard({ title, value, change, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-gray-500">{title}</p>
      </div>

      <span className={`text-${color}-500 font-semibold`}>
        {change}
      </span>
    </div>
  );
}