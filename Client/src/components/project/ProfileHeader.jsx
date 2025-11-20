import React from "react";
import { FaPen, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ProfileHeader = ({
  previewImage,
  displayedUser,
  isOwnProfile,
  onEditClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
      <div className="relative">
        <img
          src={previewImage || "/default-avatar.png"}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover border-2 border-zinc-600"
        />
        {isOwnProfile && (
          <button
            onClick={onEditClick}
            className="absolute bottom-0 right-0 bg-zinc-700 p-2 rounded-full hover:bg-zinc-600 transition"
          >
            <FaPen size={16} />
          </button>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold">{displayedUser.username}</h1>
        <p className="mt-2 text-zinc-300">
          {displayedUser.bio || "No bio yet."}
        </p>
        <div className="flex gap-4 mt-4 text-xl">
          {displayedUser.twitter && (
            <a href={displayedUser.twitter} target="_blank" rel="noreferrer">
              <FaXTwitter />
            </a>
          )}
          {displayedUser.linkedin && (
            <a href={displayedUser.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
