import React from "react";

export default function ProjectDescription({ project }) {
  return (
    <>
      <div className="bg-gray-800/50 border-l-4 border-purple-500 p-4 rounded-xl shadow-lg">
        <p className="text-gray-100 text-lg leading-relaxed italic">
          {project.description}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {project.story.split("\n").map((paragraph, index) => (
          <p key={index} className="text-gray-200 leading-relaxed text-base">
            {paragraph}
          </p>
        ))}
      </div>
    </>
  );
}
