import React from "react";

export default function LoadingSkeleton() {
  return (
    <>
      <div className="min-h-screen bg-primary text-white">
        <div className="max-w-7xl mx-auto p-6 space-y-12">
          {/* Image Skeleton with Shimmer */}
          <div className="relative overflow-hidden">
            <div className="w-full h-80 md:h-[500px] bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
            </div>

            {/* Owner Badge Skeleton */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="h-10 w-10 rounded-full bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                </div>
                <div className="h-3 w-32 bg-gray-700 rounded relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Title Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="h-10 bg-gray-800 rounded-lg w-64 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
            </div>
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-12 bg-gray-800 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="bg-gray-800/50 border-l-4 border-purple-500 p-4 rounded-xl">
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
              </div>
              <div className="h-4 bg-gray-700 rounded w-5/6 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
              </div>
            </div>
          </div>

          {/* Rewards Skeleton */}
          <div className="space-y-8">
            <div className="h-8 bg-gray-800 rounded-lg w-32 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-700 rounded relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                    </div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-6 bg-gray-700 rounded w-20 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                      </div>
                      <div className="h-10 bg-gray-700 rounded w-24 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add shimmer animation to global styles */}
        <style jsx global>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </>
  );
}
