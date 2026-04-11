import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search cases..."
          className="border px-3 py-2 rounded-lg"
        />

        {/* User */}
        <div className="flex items-center gap-2">
          
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center rounded-full">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Name + Role */}
          <div>
            <p className="text-sm font-semibold">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role || "Role"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}