import API from "../api/api";

export async function createLoanCase(payload) {
  const { data } = await API.post("/loans/create", payload);
  return data;
}
