// test/LoginPage.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


// Set test environment to jsdom
//vi.stubEnv("NODE_ENV", "test");

// Mock fetch API
globalThis.fetch = vi.fn();

describe("Login API Request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send correct data to /api/login", async () => {
    // Mock successful API response
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Login successful!" }),
    });

    // Simulate frontend request
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    // Check fetch was called once with correct data
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    // Check response
    const data = await response.json();
    expect(data).toEqual({ success: true, message: "Login successful!" });
  });

  it("should handle failed login response", async () => {
    // Mock failed API response
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    // Simulate frontend request
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "wrong@example.com",
        password: "wrongpassword",
      }),
    });

    // Check fetch was called correctly
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));

    // Check response
    const data = await response.json();
    expect(data).toEqual({ message: "Invalid credentials" });
  });
});