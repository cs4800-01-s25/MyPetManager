import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Sign up form submitted!");
      console.log("Signup attempt for:", formData.email);

      const response = await fetch("http://localhost:4350/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //TODO: add first and lastname
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Registration failed");
      }

      // Redirect back to /login with a success message in location.state
      navigate("/login", {
        state: { successMessage: "Account Successfully Created! Please sign in." },
      });
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-102px-389px)]">
      <Card className="w-full max-w-md bg-white shadow-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-['Poltawski_Nowy',Helvetica] text-center">
            Join Our Community
          </CardTitle>
          <CardDescription className="text-center font-paragraph-2">
            Create an account to manage your pet's health and connect with other pet owners
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
               <label htmlFor="firstName" className="font-paragraph-2 text-sm font-medium">
                 First Name
               </label>
               <Input
                 id="firstName"
                 name="firstName"
                 type="text"
                 value={formData.firstName}
                 onChange={handleChange}
                 placeholder="Enter your first name"
                 required
                 className="w-full"
               />
             </div>
               <div className="space-y-2">
               <label htmlFor="lastName" className="font-paragraph-2 text-sm font-medium">
                 Last Name
               </label>
               <Input
                 id="lastName"
                 name="lastName"
                 type="text"
                 value={formData.lastName}
                 onChange={handleChange}
                 placeholder="Enter your last name"
                 required
                 className="w-full"
               />
             </div>
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

            {/* Password */}
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
                placeholder="Create a password"
                required
                className="w-full"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="font-paragraph-2 text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full"
              />
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="rounded border-gray-300 text-brown focus:ring-brown"
              />
              <label htmlFor="terms" className="font-paragraph-2 text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-brown hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-brown hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] bg-[#7c5c42] hover:bg-[#6a4f38] rounded-full font-['Poltawski_Nowy',Helvetica] transition-colors duration-200"
            >
              <span className="text-lg font-bold text-white">
                {loading ? "Creating Account..." : "Sign Up"}
              </span>
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="font-paragraph-2 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-brown hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;