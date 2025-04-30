import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";

interface FormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      console.log("Form submitted!");
      console.log("Login attempt with:", formData.email);

      setLoading(true);
      const response = await fetch("http://localhost:4350/api/auth/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) // this structured as email: nextline password
      });
      if (!response.ok) throw new Error("Invalid credentials");

      // The response is a json with user info and authentication token
      // You can store the token in localStorage or context for further use
      const data = await response.json();
      console.log("Response data:", data);
      // Store the token and userId in localStorage so that refreshes doesn't cook it.
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken); // Store token in localStorage
       // We redirect to the protected route after successful login
      navigate("/dashboard");
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-102px-389px)]">
      <Card className="w-full max-w-md bg-white shadow-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-['Poltawski_Nowy',Helvetica] text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center font-paragraph-2">
            Sign in to access your pet care dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="font-paragraph-2 text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="font-paragraph-2 text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-brown focus:ring-brown"
                />
                <label htmlFor="remember" className="font-paragraph-2 text-sm">
                  Remember me
                </label>
              </div>
              
              <Link to="/forgot-password" className="font-paragraph-2 text-sm text-brown hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] bg-[#7c5c42] hover:bg-[#6a4f38] rounded-full font-['Poltawski_Nowy',Helvetica] transition-colors duration-200"
            >
              <span className="text-lg font-bold text-white">
                {loading ? "Signing in..." : "Sign In"}
              </span>
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="font-paragraph-2 text-sm text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brown hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;