import React from "react";

export default function RewardsList({ rewards, onRewardClick }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition bg-gray-800 hover:border-purple-500/50"
          >
            <div>
              <h3 className="text-xl font-semibold text-white">
                {reward.title}
              </h3>
              <p className="text-gray-400 mt-2">{reward.description}</p>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-primary font-bold text-lg">ETH {reward.amount}</p>
              <button
                onClick={() => onRewardClick(reward)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium"
              >
                Donate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
