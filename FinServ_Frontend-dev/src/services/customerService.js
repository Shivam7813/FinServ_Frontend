// 🔹 Fake users
let users = [
  { id: 1, fullName: "Rahul Sharma", email: "rahul@gmail.com" },
  { id: 2, fullName: "Priya Verma", email: "priya@gmail.com" },
];

// 🔹 Fake loans
let applications = [
  { id: 1, fullName: "Rahul Sharma", loanAmount: 500000, status: "APPROVED" },
  { id: 2, fullName: "Rahul Sharma", loanAmount: 200000, status: "PENDING" },
  { id: 3, fullName: "Priya Verma", loanAmount: 1500000, status: "UNDER_REVIEW" },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ GET USERS
export const getUsers = async () => {
  await delay(200);
  return [...users];
};

// ✅ GET APPLICATIONS
export const getApplications = async () => {
  await delay(200);
  return [...applications];
};

// ✅ ADD USER
export const addUser = async (user) => {
  await delay(200);

  const newUser = { id: Date.now(), ...user };
  users.push(newUser);

  return newUser;
};

// ✅ UPDATE USER
export const updateUser = async (id, updatedData) => {
  await delay(200);

  users = users.map((u) =>
    u.id === id ? { ...u, ...updatedData } : u
  );

  return true;
};

// ✅ DELETE USER
export const deleteUser = async (id) => {
  await delay(200);

  users = users.filter((u) => u.id !== id);

  return true;
};