// 🔹 STORAGE KEY
const STORAGE_KEY = "banks_data";

// 🔹 DEFAULT DATA (FIRST TIME ONLY)
const defaultBanks = [
  {
    id: 1,
    name: "HDFC Bank",
    roi: "8.5% - 10.5%",
    processing: "2-3 days",
    ltv: "90%",
    tenure: "84 months",
    features: [
      "Quick approval",
      "Minimal documentation",
      "Doorstep service",
    ],
  },
  {
    id: 2,
    name: "ICICI Bank",
    roi: "8.75% - 11%",
    processing: "2-4 days",
    ltv: "85%",
    tenure: "72 months",
    features: [
      "Online tracking",
      "Flexible EMI",
      "Part payment allowed",
    ],
  },
  {
    id: 3,
    name: "State Bank of India",
    roi: "8.25% - 9.75%",
    processing: "3-5 days",
    ltv: "85%",
    tenure: "84 months",
    features: [
      "Lowest rates",
      "Government backed",
      "No prepayment charges",
    ],
  },
];

// 🔹 SAFE LOAD + AUTO UPGRADE OLD DATA
const loadBanks = () => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!stored) return defaultBanks;

  // 🔥 upgrade old data (important)
  return stored.map((b, index) => ({
    id: b.id || Date.now() + index,
    name: b.name || "Unnamed Bank",
    roi: b.roi || "N/A",
    processing: b.processing || "N/A",
    ltv: b.ltv || "N/A",
    tenure: b.tenure || "N/A",
    features: b.features || [],
  }));
};

// 🔹 INITIAL DATA
let bankExecutives = loadBanks();

// 🔹 SAVE TO LOCALSTORAGE
const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bankExecutives));
};

// simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// ==============================
// ✅ GET ALL BANKS
// ==============================
export const getBanks = async () => {
  await delay(200);
  return [...bankExecutives];
};


// ==============================
// ✅ ADD BANK
// ==============================
export const addBank = async (bank) => {
  await delay(200);

  const newBank = {
    id: Date.now(),
    name: bank.name,
    roi: bank.roi || "N/A",
    processing: bank.processing || "N/A",
    ltv: bank.ltv || "N/A",
    tenure: bank.tenure || "N/A",
    features: bank.features || [],
  };

  bankExecutives.push(newBank);
  saveToStorage();

  return newBank;
};


// ==============================
// ✅ UPDATE BANK
// ==============================
export const updateBank = async (id, updatedData) => {
  await delay(200);

  bankExecutives = bankExecutives.map((b) =>
    b.id === id
      ? {
          ...b,
          ...updatedData,
        }
      : b
  );

  saveToStorage();
  return true;
};


// ==============================
// ✅ DELETE BANK
// ==============================
export const deleteBank = async (id) => {
  await delay(200);

  bankExecutives = bankExecutives.filter((b) => b.id !== id);

  saveToStorage();
  return true;
};