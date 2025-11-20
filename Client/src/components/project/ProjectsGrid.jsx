import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import CampaignCard from "../landing/CampaignCard";

/**
 * Props:
 * - projects (array)
 * - activeTab (string)
 * - displayedUser (object)
 * - isOwnProfile (bool)
 * - onEditProject (project) -> opens edit
 * - onViewDonors (projectId, projectTitle) -> opens donors modal
 */
const ProjectsGrid = ({
  projects = [],
  activeTab,
  displayedUser,
  isOwnProfile,
  onEditProject,
  onViewDonors,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects && projects.length > 0 ? (
        projects.map((proj, idx) => (
          <div key={idx} className="relative">
            <CampaignCard
              id={proj._id}
              owner={proj.owner_id?.username || displayedUser.username}
              title={proj.title}
              image={
                proj.image
                  ? `http://localhost:5000/${proj.image.replace(/\\/g, "/")}`
                  : "/default-project.png"
              }
              target={proj.target}
              amountCollected={proj.amount_raised}
              deadline={proj.end_date}
              profileImage={
                displayedUser.profile_pic
                  ? `http://localhost:5000/uploads/${displayedUser.profile_pic}`
                  : "/default-avatar.png"
              }
            />
            {isOwnProfile && activeTab === "My Campaigns" && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => onEditProject(proj)}
                  className="bg-zinc-700 p-2 rounded-full hover:bg-zinc-600 transition"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => onViewDonors(proj._id, proj.title)}
                  className="bg-indigo-600 p-2 rounded-full hover:bg-indigo-500 transition flex items-center justify-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaUsers size={16} />
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-zinc-400">
          {isOwnProfile ? `No ${activeTab.toLowerCase()} yet.` : `No campaigns yet.`}
        </p>
      )}
    </div>
  );
};

export default ProjectsGrid;
