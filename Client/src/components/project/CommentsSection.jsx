import React from "react";
import { PaperAirplaneIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default function CommentsSection({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  inputRef,
  focusInput,
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a comment..."
          className="w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
        />
        {newComment.trim() && (
          <button
            onClick={handleAddComment}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition"
          >
            <img
              src={
                comment.user.image &&
                comment.user.image !== "/api/placeholder/40/40"
                  ? `http://localhost:5000/uploads/${comment.user.image}`
                  : "/default-avatar.png"
              }
              alt={comment.user.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-purple-500"
              loading="lazy"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{comment.user.name}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-gray-200 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No comments yet</p>
            <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </section>
  );
}
