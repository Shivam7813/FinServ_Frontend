// src/services/loanOfferService.js

const OFFER_KEY = "loan_offers";
const SELECTED_KEY = "selected_offer";

// 🔹 DEFAULT DATA (only first time)
const defaultOffers = [
  {
    id: 1,
    bank: "HDFC Bank",
    interest: "8.5%",
    tenure: "60 months",
    emi: "₹16,200",
    processingFee: "₹2,500",
  },
  {
    id: 2,
    bank: "ICICI Bank",
    interest: "8.7%",
    tenure: "60 months",
    emi: "₹16,500",
    processingFee: "₹2,000",
  },
  {
    id: 3,
    bank: "SBI",
    interest: "8.3%",
    tenure: "60 months",
    emi: "₹15,900",
    processingFee: "₹1,800",
  },
];

// 🔹 INIT STORAGE
if (!localStorage.getItem(OFFER_KEY)) {
  localStorage.setItem(OFFER_KEY, JSON.stringify(defaultOffers));
}

// 🔹 delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// ==============================
// ✅ GET OFFERS
// ==============================
export const getLoanOffers = async () => {
  await delay(200);
  return JSON.parse(localStorage.getItem(OFFER_KEY)) || [];
};


// ==============================
// ✅ SAVE SELECTED OFFER
// ==============================
export const saveSelectedOffer = async (offer) => {
  await delay(100);
  localStorage.setItem(SELECTED_KEY, JSON.stringify(offer));
};


// ==============================
// ✅ GET SELECTED OFFER
// ==============================
export const getSelectedOffer = async () => {
  await delay(100);
  return JSON.parse(localStorage.getItem(SELECTED_KEY));
};