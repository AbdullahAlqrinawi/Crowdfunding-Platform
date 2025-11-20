import React from "react";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function ProjectHeader({
  project,
  ownerInfo,
  handleOwnerClick,
  handleLike,
  liked,
  likeCount,
  focusInput,
  onShareOpen,
}) {
  return (
    <div className="relative">
      {/* الصورة الرئيسية للمشروع */}
      <div className="relative w-full h-80 md:h-[500px]">
        <img
          src={`http://localhost:5000/${project.image.replace(/\\/g, "/")}`}
          alt={project.title}
          className="w-full h-full object-cover rounded-lg shadow-lg"
          loading="eager"
        />

        {/* === Owner Info (داخل الصورة - أسفل يسار) === */}
        <div
          className="absolute left-4 bottom-4 flex items-center gap-3 bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-700/80 transition z-10"
          onClick={handleOwnerClick}
        >
          <img
            src={ownerInfo.profilePic}
            alt="Owner"
            className="h-10 w-10 rounded-full object-cover border-2 border-primary"
            loading="eager"
          />
          <div>
            <h3 className="text-white font-semibold">{ownerInfo.name}</h3>
            <p className="text-gray-300 text-xs">
              {ownerInfo.isCurrentUser ? "Project Owner (You)" : "Project Owner"}
            </p>
          </div>
        </div>
      </div>

      {/* بقية محتوى الـ Header */}
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`
                  p-3 rounded-full transition-all duration-300 
                  flex items-center justify-center border
                  ${
                    liked
                      ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30"
                      : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white"
                  }
                `}
              >
                {liked ? (
                  <HeartIconSolid className="h-6 w-6 fill-current" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
              <span
                className={`
                  text-lg font-semibold transition-colors duration-300
                  ${liked ? "text-red-400" : "text-gray-400"}
                `}
              >
                {likeCount}
              </span>
            </div>
            <button
              onClick={focusInput}
              className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition border border-gray-600"
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </button>

            <button
              onClick={onShareOpen}
              className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition border border-gray-600"
            >
              <ShareIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}