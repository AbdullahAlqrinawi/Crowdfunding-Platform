import React from "react"
import { daysLeft, inPercent } from "../../utils/utils"
import ProgressBar from "../project/ProgressBar"
import { useNavigate } from "react-router-dom";

const CampaignCard = ({
  id,
  title,
  image,
  target,
  deadline,
  amountCollected,
  handleClick,
  owner,
  profileImage 
}) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      navigate(`/campaign/${id}`, {
        state: {
          id,
          title,
          image,
          target,
          deadline,
          amountCollected,
          owner, 
          profileImage 
        },
      });
    }
  }

  const remainingDays = daysLeft(deadline)
  const percentage = inPercent(target, amountCollected)

  return (
    <div className="border border-gray-border bg-dark-alt/70 text-warm-white rounded-xl overflow-hidden relative shadow-lg">
      <img
        src={image}
        alt={title}
        className="w-full aspect-video object-cover cursor-pointer"
        onClick={handleCardClick}
      />

      <div className="p-3 flex flex-col gap-2">
        <h2 className="text-white line-clamp-1 font-medium text-lg">{title}</h2>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <ProgressBar goal={target} raisedAmount={amountCollected} />
          <span className="text-xs text-white font-semibold">{percentage}%</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-0">
            <h2 className="text-lg font-bold text-white">
               {parseFloat(amountCollected).toFixed(5)} ETH
            </h2>
            <p className="text-xs text-white">Collected of {target} ETH</p>
          </div>

          {remainingDays > 0 && (
            <div className="flex flex-col gap-0 text-right">
              <h2 className="text-lg font-bold text-white">
                {remainingDays} {remainingDays > 1 ? "days" : "day"}
              </h2>
              <p className="text-xs text-white">Remaining</p>
            </div>
          )}
        </div>
        
        <button
          onClick={handleCardClick}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          View Project
        </button>
      </div>
    </div>
  )
}

export default CampaignCard