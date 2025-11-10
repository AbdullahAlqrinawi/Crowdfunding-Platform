import { useState } from 'react'

export default function MetaMaskButton() {
  const [loading, setLoading] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  const connectWallet = async () => {
    setLoading(true)
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        if (accounts.length > 0) {
          setWalletConnected(true)
        }
      } else {
        alert('Please install MetaMask to use this feature.')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to connect MetaMask')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!walletConnected && (
        <button
          type="button"
          onClick={connectWallet}
          className="w-full bg-[#1a1a1a] border border-[#ff9c00]/40 text-white py-2 px-4 rounded-md flex items-center justify-center gap-3 hover:bg-[#2c2c2c] transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
              ></path>
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.6 318.6" width="24" height="24">
                <path fill="#e2761b" d="M274.1 35.3l-98.5 73.2 18.2-42.2zM44.5 35.3l98 73.6-18-42.5zM239.2 213.6l-25.2 38.4 53.9 14.8 15.5-52.3zM30.6 214.4l15.5 52.3 53.9-14.8-25.2-38.4zM133.3 143.8l-19.6 28.6 56.9.8-19-29.1zM108.3 266.1l33.3-16.3-28.6-22.3zM159.4 249.7l33.3 16.3-4.8-38.5zM240.6 266.1l-28.6-22.3-4.8 38.5zM79.2 194.2l8.4 29.1 24.4-37.9zM209.4 194.2l-32.8 37.9 24.4 37.9z"/>
              </svg>
              <span>Connect with MetaMask</span>
            </>
          )}
        </button>
      )}

      {walletConnected && (
        <p className="text-green-400 text-center mt-4"> Wallet connected successfully!</p>
      )}
    </>
  )
}
