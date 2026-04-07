// src/pages/admin/Settings.jsx

import AdminLayout from "../../layouts/AdminLayout";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-gray-500">
            Configure system preferences and account settings.
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Notification Preferences</h2>

          {[
            "Email Notifications",
            "SMS Notifications",
            "Push Notifications",
            "Loan Status Updates",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <div>
                <p className="font-medium">{item}</p>
                <p className="text-sm text-gray-500">
                  Manage your {item.toLowerCase()}
                </p>
              </div>

              {/* Toggle */}
              <div className="w-11 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Security</h2>

          {[
            { title: "Two-Factor Authentication", btn: "Enable" },
            { title: "Change Password", btn: "Update" },
            { title: "Active Sessions", btn: "View All" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  Manage your account security
                </p>
              </div>

              <button className="px-4 py-1.5 border rounded-md text-sm hover:bg-gray-100">
                {item.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-red-500">
            Danger Zone
          </h2>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="font-medium">Logout from all devices</p>
              <p className="text-sm text-gray-500">
                Sign out from all active sessions
              </p>
            </div>

            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Logout All
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}