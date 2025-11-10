"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/project/UserContext";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

import { Footer } from "../../components/landing";
import Navbar from "../../components/project/Navbar";
import RewardDonationModal from "../../components/project/RewardDonationModal";
import ShareModal from "../../components/project/ShareModal";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const inputRef = useRef(null);
  const token = localStorage.getItem("token");

  const [selectedReward, setSelectedReward] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const projectLink = `${window.location.origin}/project/${id}`;

  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const projectRes = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: headers,
          }
        );

        if (!projectRes.ok) {
          throw new Error("Project not found");
        }

        const projectData = await projectRes.json();

        if (projectData.error) {
          throw new Error(projectData.message || "Project not found");
        }

        setProject(projectData.project);

        const [likesRes, commentsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/likes/project/${id}`),
          fetch(`http://localhost:5000/api/comments/project/${id}`),
        ]);

        const likesData = await likesRes.json();
        const commentsData = await commentsRes.json();

        if (!likesData.error) {
          setLikeCount(likesData.likes?.length || 0);
        }

        if (token) {
          try {
            const userLikeRes = await fetch(
              `http://localhost:5000/api/likes/check`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...headers,
                },
                body: JSON.stringify({ project_id: id }),
              }
            );

            if (userLikeRes.ok) {
              const userLikeData = await userLikeRes.json();
              setLiked(userLikeData.liked || false);
            }
          } catch (error) {
            console.error("Error checking user like:", error);
          }
        }

        if (!commentsData.error) {
          const formattedComments =
            commentsData.comments?.map((comment) => ({
              id: comment._id,
              content: comment.content,
              created_at: comment.createdAt,
              user: {
                name: comment.user_id?.username || "Unknown",
                image: comment.user_id?.profile_pic || null,
              },
            })) || [];
          setComments(formattedComments);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        setProject(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        setLiked(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const token = localStorage.getItem("token");
    if (!token) {
      setLiked(false);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to like projects");
        setLiked(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/likes`, {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: id,
        }),
      });

      if (response.ok) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
      } else {
        const errorData = await response.json();
        console.error("Like error:", errorData);

        if (
          errorData.message?.includes("already liked") ||
          errorData.message?.includes("مُعجب بالفعل")
        ) {
          setLiked(true);
          const likesRes = await fetch(
            `${import.meta.env.VITE_API_URL}/likes/project/${id}`
          );
          const likesData = await likesRes.json();
          if (!likesData.error) {
            setLikeCount(likesData.likes?.length || 0);
          }
        } else {
          alert(errorData.message || "Failed to toggle like");
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleOwnerClick = () => {
    if (project && project.owner_id) {
      if (currentUser && currentUser._id === project.owner_id._id) {
        navigate("/profile-page");
      } else {
        navigate(`/profile-page/${project.owner_id._id}`);
      }
    }
  };
  const getOwnerInfo = () => {
    if (!project || !project.owner_id)
      return { name: "Unknown", isCurrentUser: false };

    const isCurrentUser =
      currentUser && currentUser._id === project.owner_id._id;
    const ownerName = isCurrentUser
      ? "You"
      : project.owner_id.username || "Project Owner";

    return {
      name: ownerName,
      isCurrentUser: isCurrentUser,
      profilePic: project.owner_id.profile_pic
        ? `http://localhost:5000/uploads/${project.owner_id.profile_pic}`
        : "/default-avatar.png",
    };
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to add comments");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          project_id: id,
        }),
      });

      if (response.ok) {
        const commentData = await response.json();

        const newCommentWithUser = {
          id: commentData.comment._id,
          content: commentData.comment.content,
          created_at: commentData.comment.createdAt,
          user: {
            name: commentData.comment.user_id?.username || "You",
            image:
              commentData.comment.user_id?.profile_pic ||
              "/api/placeholder/40/40",
          },
        };

        setComments((prev) => [newCommentWithUser, ...prev]);
        setNewComment("");
      } else {
        const errorData = await response.json();
        console.error("Comment error:", errorData);
        alert(errorData.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Network error. Please try again.");
    }
  };
  useEffect(() => {
    return () => {
      setLiked(false);
      setLikeCount(0);
      setComments([]);
    };
  }, [id]);

  const handleRewardClick = (reward) => {
    setSelectedReward(reward);
    setShowDonationModal(true);
  };

  const handleDonationSuccess = async (amount, txHash) => {
    setDonationSuccess(true);

    setProject((prev) => ({
      ...prev,
      amount_raised: parseFloat(prev.amount_raised) + parseFloat(amount),
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`);
      const data = await res.json();
      if (!data.error) {
        setProject(data.project);
      }
    } catch (err) {
      console.error("Error refetching project:", err);
    }

    setTimeout(() => setDonationSuccess(false), 5000);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  if (loading)
    return <div className="text-white text-center p-10">Loading...</div>;
  if (!project)
    return (
      <div className="text-red-400 text-center p-10">Project not found</div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary text-white">
        <div className="max-w-7xl mx-auto p-6 space-y-12 bg-primary text-white">
          <div className="relative">
            <img
              src={`http://localhost:5000/${project.image.replace(/\\/g, "/")}`}
              alt={project.title}
              className="w-full h-80 md:h-[500px] object-cover rounded-lg shadow-lg"
            />
            <div
              className="absolute bottom-4 left-4 flex items-center gap-3 bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md cursor-pointer hover:bg-gray-700/80 transition"
              onClick={handleOwnerClick}
            >
              <img
                src={getOwnerInfo().profilePic}
                alt="Owner"
                className="h-10 w-10 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h3 className="text-white font-semibold">
                  {getOwnerInfo().name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {getOwnerInfo().isCurrentUser
                    ? "Project Owner (You)"
                    : "Project Owner"}
                  {getOwnerInfo().isCurrentUser &&
                    " - Click to view your profile"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
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
                  onClick={() => setShowShareModal(true)}
                  className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition border border-gray-600"
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 border-l-4 border-purple-500 p-4 rounded-xl shadow-lg">
              <p className="text-gray-100 text-lg leading-relaxed italic">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {project.story.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-200 leading-relaxed text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.rewards.map((reward, index) => (
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
                    <p className="text-primary font-bold text-lg">
                      ETH {reward.amount}
                    </p>
                    <button
                      onClick={() => handleRewardClick(reward)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
                  <ChatBubbleLeftIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-lg">No comments yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </section>

          <Footer />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        projectLink={projectLink}
      />

{showDonationModal && selectedReward && (
  <RewardDonationModal
    reward={selectedReward}
    projectId={id}
    projectWalletAddress={project.wallet_address}
    onClose={() => {
      setShowDonationModal(false);
      setSelectedReward(null); 
    }}
    onSuccess={handleDonationSuccess}
  />
)}

     {donationSuccess && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-8 py-4 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md relative overflow-hidden">
      {/* subtle glow effect */}
      <div className="absolute inset-0 bg-white/10 opacity-20 blur-xl animate-pulse"></div>

      <div className="flex items-center gap-4 relative z-10">
        {/* Animated checkmark icon */}
        <div className="relative">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
            <svg
              className="w-6 h-6 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full bg-white/40 animate-ping"></div>
        </div>

        {/* Text */}
        <div>
          <h3 className="font-semibold text-lg tracking-wide drop-shadow-sm">
            Thank You!
          </h3>
          <p className="text-white/90 text-sm">
            Your donation has been received successfully 
          </p>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
