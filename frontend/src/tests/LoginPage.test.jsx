// test/LoginPage.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


// Mock fetch API
globalThis.fetch = vi.fn();

// Helper to render with Router (since LoginPage uses Link)
const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe("LoginPage API Mocking", () => {
  beforeEach(() => {
    // Clear mock before each test
    vi.clearAllMocks();
  });

  it("should call fetch with correct data when form is submitted", async () => {
    // Mock successful response
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Login successful!" }),
    });

    renderLoginPage();

    // Fill in form

    // Find inputs and button
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit form, find and click
    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    // Check if fetch was called correctly
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
    });

    // Add debugging output
    console.log("Mocked Fetch Call:", globalThis.fetch.mock.calls[0]);

    // Verify success case, No error message should be displayed
    expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
  });

  it("should show error message when login fails", async () => {
    // Mock failed response
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    renderLoginPage();

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    // Add debugging output
    await waitFor(() => {
      console.log("Mocked Fetch Call:", globalThis.fetch.mock.calls[0]);
    });

    // Check error message appears
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    // Verify fetch was called
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));
  });

  it("should disable button and show loading state during API call", async () => {
    // Mock a delayed successful response to test loading state
    globalThis.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true }),
              }),
            100
          )
        )
    );

    renderLoginPage();

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    // Verify button is disabled and shows loading text
    expect(
      screen.getByRole("button", { name: /Signing in.../i })
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for API call to complete
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Sign In/i })
      ).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });
});
