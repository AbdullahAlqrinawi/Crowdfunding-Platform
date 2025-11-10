import { AiOutlineClose } from 'react-icons/ai'; 

export default function StepRewards({ formData, handleRewardChange, addReward, removeReward }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-6">
      <label className="block mb-4 font-semibold text-lg text-white">Rewards</label>

      {formData.rewards.map((reward, index) => (
        <div
          key={index}
          className="space-y-3 bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-sm relative group transition-all duration-300"
        >
          {formData.rewards.length > 1 && (
            <button
              type="button"
              onClick={() => removeReward(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
            >
              <AiOutlineClose size={20} />
            </button>
          )}

          <input
            type="text"
            name="title"
            value={reward.title}
            onChange={(e) => handleRewardChange(index, e)}
            placeholder="Reward Title"
            className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white focus:outline-none"
          />
          <textarea
            name="description"
            value={reward.description}
            onChange={(e) => handleRewardChange(index, e)}
            placeholder="Reward Description"
            rows={2}
            className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white resize-none focus:outline-none"
          />
          <input
            type="number"
            name="amount"
            value={reward.amount}
            onChange={(e) => handleRewardChange(index, e)}
            placeholder="Amount (ETH)"
            className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white focus:outline-none"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addReward}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition w-full"
      >
        Add Another Reward
      </button>
    </div>
  );
}
