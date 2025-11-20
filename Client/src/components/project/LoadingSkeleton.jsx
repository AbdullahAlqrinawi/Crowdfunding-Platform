import React from "react";

/**
 * Simple loading skeleton that matches the original layout
 */
const LoadingSkeleton = ({ activeTab }) => {
  return (
    <>
      <div className="bg-primary min-h-screen text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse border-2 border-zinc-600" />
            </div>
            <div className="flex-1 w-full space-y-3">
              <div className="h-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg w-48 animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-full max-w-md animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-3/4 max-w-sm animate-pulse" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="mb-6 flex justify-center md:justify-start gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-32 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700"
              >
                <div className="h-48 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingSkeleton;
