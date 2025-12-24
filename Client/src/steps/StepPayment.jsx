export default function StepPayment({ connectWallet, walletConnected, wallet_address, connecting }) {
  const displayMethods = [
    { name: "PayPal", note: "Prototype only", logo: "https://www.paypalobjects.com/webstatic/icon/pp258.png" },
    { name: "Visa", note: "Prototype only", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", note: "Prototype only", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "Apple Pay", note: "Prototype only", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
    { name: "Google Pay", note: "Prototype only", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },

        { name: "WalletConnect", note: "Prototype only", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Walletconnect-logo.png"},
        { name: "Coinbase Wallet", note: "Prototype only", logo:"https://raw.githubusercontent.com/gist/taycaldwell/2291907115c0bb5589bc346661435007/raw/280eafdc84cb80ed0c60e36b4d0c563f6dca6b3e/cbw.svg"},
    { name: "Trust Wallet", note: "Prototype only", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/trust-wallet-icon.png" },
    { name: "Phantom (Solana)", note: "Prototype only", logo: "https://docs.phantom.com/favicon.svg" },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-6 flex flex-col items-center text-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
        alt="MetaMask Logo"
        className="w-20 h-20 object-contain rounded-full p-2"
      />

      <p className="font-semibold text-white">Connect your wallet to receive funds:</p>

      <button
        type="button"
        onClick={connectWallet}
        className={`px-6 py-2 rounded-lg text-white font-medium transition ${
          walletConnected ? "bg-green-600 cursor-default" : "bg-blue-600 hover:bg-blue-500"
        }`}
        disabled={walletConnected || connecting}
      >
        {walletConnected
          ? `Connected: ${wallet_address.slice(0, 6)}...${wallet_address.slice(-4)}`
          : connecting
          ? "Connecting..."
          : "Connect Wallet"}
      </button>

      <div className="w-full border-t border-gray-700 pt-4 space-y-3">
       <p className="text-sm text-gray-300 font-semibold">Other payment methods</p>
<p className="text-xs text-gray-400">
  These payment options are coming soon. Currently, only MetaMask is supported.
</p>


        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {displayMethods.map((m) => (
            <button
              key={m.name}
              type="button"
              disabled
              className="bg-gray-900/40 border border-gray-700 rounded-xl p-3 flex flex-col items-center gap-2 opacity-60 cursor-not-allowed"
              title="Prototype only (disabled)"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={m.logo} alt={m.name} className="w-8 h-8 object-contain" />
              </div>
              <p className="text-xs text-white font-semibold">{m.name}</p>
              <p className="text-[10px] text-gray-400">{m.note}</p>
            </button>
          ))}
        </div>

        <div className="bg-gray-900/30 border border-gray-700 rounded-xl p-3 text-left w-full">
          <p className="text-xs text-gray-300 font-semibold mb-1">Future implementation ideas:</p>
          <ul className="text-[11px] text-gray-400 space-y-1 list-disc pl-4">
            <li>Integrate Stripe / Checkout for Visa & MasterCard</li>
            <li>Add PayPal checkout (PayPal SDK)</li>
            <li>Support WalletConnect for more wallets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
