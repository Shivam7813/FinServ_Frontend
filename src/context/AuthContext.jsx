import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);

        // normalize role
        parsedUser.role = parsedUser.role?.toLowerCase();

        setUser(parsedUser);
      }
    } catch (error) {
      console.error("User parse error:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // Login
  const login = async (credentials) => {
    let users = [];

    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers && storedUsers !== "undefined") {
        users = JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error("Users parse error:", error);
      users = [];
    }

    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
        u.password === credentials.password.trim()
    );

    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    // normalize role here also
    const normalizedUser = {
      ...foundUser,
      role: foundUser.role?.toLowerCase(),
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);

    return normalizedUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);