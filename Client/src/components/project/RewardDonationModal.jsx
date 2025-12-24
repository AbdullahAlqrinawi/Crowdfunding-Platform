"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";

const RewardDonationModal = ({
  reward,
  projectWalletAddress,
  projectId,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(reward.amount);
  const [isDonating, setIsDonating] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [step, setStep] = useState("");

  // ✅ payment selection gate (must click MetaMask)
  const [paymentMethodConfirmed, setPaymentMethodConfirmed] = useState(false);

  // ✅ Coming soon methods (display only)
  const displayMethods = [
    { name: "PayPal", note: "Coming Soon", logo: "https://www.paypalobjects.com/webstatic/icon/pp258.png" },
    { name: "Visa", note: "Coming Soon", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", note: "Coming Soon", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "Apple Pay", note: "Coming Soon", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
    { name: "Google Pay", note: "Coming Soon", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
    { name: "WalletConnect", note: "Coming Soon", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Walletconnect-logo.png" },
    { name: "Coinbase Wallet", note: "Coming Soon", logo: "https://raw.githubusercontent.com/gist/taycaldwell/2291907115c0bb5589bc346661435007/raw/280eafdc84cb80ed0c60e36b4d0c563f6dca6b3e/cbw.svg" },
    { name: "Trust Wallet", note: "Coming Soon", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/trust-wallet-icon.png" },
    { name: "Phantom (Solana)", note: "Coming Soon", logo: "https://docs.phantom.com/favicon.svg" },
  ];

  const getReadableError = (err) => {
    const message = err?.message || "";

    if (
      err?.code === -32002 ||
      message.includes("too many errors") ||
      message.includes("coalesce error") ||
      message.includes("RPC endpoint")
    ) {
      return "Wallet provider is busy. Please wait a moment and try again.";
    }

    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      return "Network error. Please check your internet connection.";
    }

    if (err?.code === 4001) {
      return "Transaction rejected by user.";
    }

    if (message.toLowerCase().includes("insufficient")) {
      return "Insufficient balance in your wallet.";
    }

    return message || "Funding failed. Please try again.";
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const decoded = jwtDecode(token);
      return decoded.id || decoded._id || decoded.userId;
    } catch {
      return null;
    }
  };

  const recordDonationInDatabase = async (donationData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to record donation in database");
      }

      return responseData;
    } catch (err) {
      throw err;
    }
  };

  const handleDonate = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to donate");
      return;
    }

    if (amount < reward.amount) {
      setError(`Minimum donation amount is ${reward.amount} ETH`);
      return;
    }

    setIsDonating(true);
    setError("");
    setTxHash("");
    setStep("initializing");

    try {
      setStep("checking_balance");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const balance = await provider.getBalance(walletAddress);
      const requiredAmount = ethers.parseEther(amount.toString());

      if (balance < requiredAmount) {
        throw new Error("Insufficient balance in your wallet");
      }

      setStep("sending_transaction");
      const tx = await signer.sendTransaction({
        to: projectWalletAddress,
        value: requiredAmount,
      });

      setTxHash(tx.hash);

      setStep("confirming_transaction");
      await tx.wait(1);

      setStep("recording_donation");
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("User not authenticated. Please login again.");

      const donationData = {
        amount: parseFloat(amount),
        donor_id: userId,
        project_id: projectId,
        currency: "ETH",
        transaction_hash: tx.hash,
        payment_address: walletAddress,
        network: "Ethereum",
        selected_reward: reward._id || reward.title,
      };

      await recordDonationInDatabase(donationData);

      setStep("updating_records");
      const updateResponse = await fetch(
        `http://localhost:5000/api/projects/${projectId}/amount`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parseFloat(amount) }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update amount raised");
      }

      setStep("completed");
      onSuccess(amount, tx.hash);
      onClose();
    } catch (err) {
      console.error("Donation error:", err);
      setError(getReadableError(err));
    } finally {
      setIsDonating(false);
      setStep("");
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case "checking_balance":
        return "Checking wallet balance...";
      case "sending_transaction":
        return "Sending transaction...";
      case "confirming_transaction":
        return "Confirming transaction...";
      case "recording_donation":
        return "Recording your donation...";
      case "updating_records":
        return "Updating records...";
      case "completed":
        return "Donation completed!";
      default:
        return "Processing your donation...";
    }
  };

  const handleChooseMetamask = () => {
    setError("");
    setTxHash("");
    setPaymentMethodConfirmed(true);
  };

  return (
    <Dialog open={true} onClose={() => (!isDonating ? onClose() : null)} className="relative z-50">
      {/* نفس خلفية DonorsModal */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      {/* نفس تمركز DonorsModal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* ✅ نفس Panel Style تبعك الأصلي (بدون max-h/overflow-hidden اللي خربت الشكل) */}
        <Dialog.Panel className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-white">
              Confirm Donation
            </Dialog.Title>

            <button
              onClick={onClose}
              disabled={isDonating}
              className="text-zinc-400 hover:text-white transition-colors text-xl disabled:opacity-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* ✅ STEP 0: اختيار الدفع (Scrollable فقط هون عشان ما يطوّل Panel) */}
          {!paymentMethodConfirmed ? (
            <>
              <div className="mb-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-left">
                <p className="text-white text-sm font-semibold mb-1">Choose payment method</p>
                <p className="text-zinc-400 text-xs">
                  Other payment options are coming soon. For now, donations are supported only via MetaMask.
                </p>
              </div>

              {/* خلي Step 0 هو اللي يسكرول إذا طول */}
              <div className="max-h-80 overflow-y-auto pr-1 space-y-4">
                {/* MetaMask (ONLY clickable) */}
                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex flex-col items-center gap-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
                    alt="MetaMask"
                    className="w-14 h-14 object-contain rounded-full p-2 bg-zinc-900"
                  />
                  <p className="text-white font-semibold">MetaMask</p>

                  <button
                    type="button"
                    onClick={handleChooseMetamask}
                    className="w-full px-4 py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-500 transition"
                  >
                    Continue with MetaMask
                  </button>

                  {!window.ethereum && (
                    <p className="text-xs text-red-300 text-center">
                      MetaMask is not detected. Please install MetaMask to continue.
                    </p>
                  )}
                </div>

                {/* Coming Soon methods (disabled) */}
                <div className="border-t border-zinc-700 pt-4">
                  <p className="text-sm text-white font-semibold mb-2">Other payment methods</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {displayMethods.map((m) => (
                      <button
                        key={m.name}
                        type="button"
                        disabled
                        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex flex-col items-center gap-2 opacity-60 cursor-not-allowed"
                        title="Coming Soon"
                      >
                        <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center overflow-hidden">
                          <img src={m.logo} alt={m.name} className="w-7 h-7 object-contain" />
                        </div>
                        <p className="text-xs text-white font-semibold text-center">{m.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-200">
                          Coming Soon
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-left">
                    <p className="text-xs text-white font-semibold mb-1">Planned features:</p>
                    <ul className="text-[11px] text-zinc-400 space-y-1 list-disc pl-4">
                      <li>Integrate Stripe / Checkout for Visa & MasterCard</li>
                      <li>Add PayPal checkout (PayPal SDK)</li>
                      <li>Support WalletConnect for more wallets</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={onClose}
                  disabled={isDonating}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            /* ✅ STEP 1: الواجهة الأصلية (رجعناها بدون أي wrappers بتخرب شكلها) */
            <>
              <div className="mb-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <p className="text-zinc-300 text-sm mb-2">You're donating to receive:</p>
                <p className="font-semibold text-white text-lg">{reward.title}</p>
                <p className="text-zinc-400 text-sm mt-2">{reward.description}</p>
              </div>

              <div className="mb-4">
                <label className="block text-zinc-300 mb-2 font-medium">Amount (ETH)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={reward.amount}
                  step="0.01"
                  className="w-full px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  disabled={isDonating}
                />
                <p className="text-xs text-zinc-400 mt-2">Minimum: {reward.amount} ETH</p>
              </div>

              {isDonating && (
                <div className="mb-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-indigo-300 font-medium">{getStepMessage()}</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {txHash && (
                <div className="mb-4 p-4 bg-indigo-900/20 border border-indigo-700 rounded-lg">
                  <p className="text-indigo-300 text-sm font-medium">Transaction Sent</p>
                  <p className="text-indigo-200 text-xs font-mono mt-1">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    if (!isDonating) setPaymentMethodConfirmed(false);
                  }}
                  disabled={isDonating}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  onClick={onClose}
                  disabled={isDonating}
                  className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDonate}
                  disabled={isDonating}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    isDonating
                      ? "bg-indigo-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  } text-white`}
                >
                  {isDonating ? "Processing..." : "Confirm Donation"}
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RewardDonationModal;
