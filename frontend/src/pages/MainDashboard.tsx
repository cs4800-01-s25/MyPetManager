
import React, { useState, useEffect } from "react";

interface userInfo {
  userType: string;
  userId: string;
  firstName: string;
  lastName: string
  email: string;
  accessToken: string;
}
export const MainDashboard = () => {
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Retrieve the user and token from localStorage  
  useEffect(() => {
    // if you see this twice, its fine, its for testing purposes, when in build, it should be fine
     console.log("🚨 useEffect triggered in Dashboard");
    // log this shit
    console.log("MainDashboard component mounted");
    console.log("Stored user:", localStorage.getItem("user"));
    console.log("Stored token:", localStorage.getItem("token"));
    
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      setError("You must be logged in to access the dashboard.");
      setLoading(false);
      return;
    }

    // Parse the user information
    const token = storedToken;

    // Fetch user-specific data from the protected route
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4350/api/users/dashboard", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // Send token in Authorization header
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch dashboard data.");

        const data = await response.json();
        setUserInfo(data);  // Assuming data contains the user info
      } catch (err: any) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1>Welcome to Your Dashboard, {userInfo?.firstName}</h1>
      <p>Your User ID: {userInfo?.userId}</p>
      <p>Your User Type: {userInfo?.userType}</p>
    </div>
  );
};


export default MainDashboard;