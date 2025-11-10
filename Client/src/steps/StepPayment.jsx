export default function StepPayment({ connectWallet, walletConnected, wallet_address, connecting }) {
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
          walletConnected ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-500'
        }`}
        disabled={walletConnected || connecting}
      >
        {walletConnected
          ? `Connected: ${wallet_address.slice(0, 6)}...${wallet_address.slice(-4)}`
          : connecting
          ? 'Connecting...'
          : 'Connect Wallet'}
      </button>
    </div>
  );
}
