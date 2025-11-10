'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

const RewardDonationModal = ({ 
  reward, 
  projectWalletAddress,
  projectId,
  onClose, 
  onSuccess 
}) => {
  const [amount, setAmount] = useState(reward.amount);
  const [isDonating, setIsDonating] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [step, setStep] = useState('');

  const recordDonationInDatabase = async (donationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(donationData)
      });

      if (!response.ok) {
        throw new Error('Failed to record donation in database');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording donation:', error);
      throw error;
    }
  };

  const handleDonate = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to donate');
      return;
    }

    if (amount < reward.amount) {
      setError(`Minimum donation amount is ${reward.amount} ETH`);
      return;
    }

    setIsDonating(true);
    setError('');
    setTxHash('');
    setStep('initializing');

    try {
      setStep('checking_balance');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const balance = await provider.getBalance(signer.address);
      const requiredAmount = ethers.parseEther(amount.toString());
      
      if (balance < requiredAmount) {
        throw new Error('Insufficient balance in your wallet');
      }

      setStep('sending_transaction');
      const tx = await signer.sendTransaction({
        to: projectWalletAddress,
        value: requiredAmount
      });
      setTxHash(tx.hash);

      setStep('confirming_transaction');
      const receipt = await tx.wait(1);

      setStep('recording_donation');
      const donationData = {
        amount: parseFloat(amount),
        donor_id: await signer.getAddress(),
        project_id: projectId,
        currency: 'ETH',
        transaction_hash: tx.hash,
        payment_address: await signer.getAddress(),
        network: 'Ethereum',
        selected_reward: reward._id || reward.title
      };

      await recordDonationInDatabase(donationData);

      setStep('updating_records');
      const updateResponse = await fetch(`http://localhost:5000/api/projects/${projectId}/amount`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update amount raised');
      }

      setStep('completed');
      
      onSuccess(amount, tx.hash);
      onClose(); 

    } catch (err) {
      setError(err.message || 'Donation failed. Please try again.');
      console.error('Donation error:', err);
    } finally {
      setIsDonating(false);
      setStep('');
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case 'checking_balance': return 'Checking wallet balance...';
      case 'sending_transaction': return 'Sending transaction...';
      case 'confirming_transaction': return 'Confirming transaction...';
      case 'recording_donation': return 'Recording your donation...';
      case 'updating_records': return 'Updating records...';
      case 'completed': return 'Donation completed!';
      default: return 'Processing your donation...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Confirm Donation
          </h3>
          <button 
            onClick={onClose}
            disabled={isDonating}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-xl disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
          <p className="text-gray-300 text-sm mb-2">You're donating to receive:</p>
          <p className="font-semibold text-white text-lg">{reward.title}</p>
          <p className="text-gray-400 text-sm mt-2">{reward.description}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-3 font-medium">Amount (ETH)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={reward.amount}
              step="0.01"
              className="w-full px-4 py-3 bg-gray-750 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              disabled={isDonating}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Minimum: {reward.amount} ETH</p>
        </div>

        {isDonating && (
          <div className="mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-400 font-medium">{getStepMessage()}</span>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-400 text-lg mr-2">⚠</span>
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          </div>
        )}

        {txHash && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-blue-400 text-lg mr-2">🔗</span>
              <div className="flex-1">
                <p className="text-blue-300 text-sm font-medium">Transaction Sent</p>
                <p className="text-blue-400 text-xs font-mono">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isDonating}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-all duration-200 border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDonate}
            disabled={isDonating}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isDonating 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
            } text-white shadow-lg`}
          >
            {isDonating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </span>
            ) : (
              'Confirm Donation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardDonationModal;