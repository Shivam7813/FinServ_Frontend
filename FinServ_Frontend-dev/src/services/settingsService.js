// src/services/settingsService.js

// 🔹 Fake settings data
let settings = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    loanUpdates: true,
  },
  security: {
    twoFactor: false,
  },
};

// simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ GET SETTINGS
export const getSettings = async () => {
  await delay(200);
  return { ...settings };
};

// ✅ UPDATE SETTINGS (future use)
export const updateSettings = async (newSettings) => {
  await delay(200);
  settings = { ...settings, ...newSettings };
  return true;
};