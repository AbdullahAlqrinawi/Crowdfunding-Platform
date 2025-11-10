import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logo } from "../../assets";

export const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userEmail =
      location.state?.email || localStorage.getItem("pendingVerificationEmail");
    if (userEmail) {
      setEmail(userEmail);
      localStorage.setItem("pendingVerificationEmail", userEmail);
    } else {
      navigate("/signup");
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpString,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("pendingVerificationEmail");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCountdown(60); 
        setError("");
        alert("OTP sent successfully!");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-start pt-12 px-4">
      <img
        src={logo}
        alt="Sparkit Logo"
        className="w-[150px] sm:w-[180px] md:w-[200px] object-contain mb-8"
      />

      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>

        <p className="text-center text-gray-300">
          We've sent a 6-digit verification code to
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasteData = e.clipboardData.getData("text").trim();
                  if (
                    pasteData.length === otp.length &&
                    /^\d+$/.test(pasteData)
                  ) {
                    setOtp(pasteData.split(""));
                  }
                }}
                className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded text-white font-semibold ${
              isLoading ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
              className={`text-indigo-400 hover:text-indigo-300 ${
                isResending || countdown > 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isResending
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend OTP"}
            </button>
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Use different email
          </button>
        </div>
      </div>
    </div>
  );
};
