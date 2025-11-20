"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

/* NEW COMPONENT IMPORTS */
import LoadingSkeleton from "../../components/project/LoadingSkeletonForDetails";
import ProjectHeader from "../../components/project/ProjectHeader";
import ProjectDescription from "../../components/project/ProjectDescription";
import RewardsList from "../../components/project/RewardsList";
import CommentsSection from "../../components/project/CommentsSection";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false); // ✨ حالة جديدة للتأكد من جاهزية كل البيانات

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const inputRef = useRef(null);

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
      setLoading(true);
      setDataReady(false); // ✨ إعادة تعيين حالة البيانات
      
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // جلب بيانات المشروع
        const projectRes = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          { headers }
        );

        if (!projectRes.ok) {
          throw new Error("Project not found");
        }

        const projectData = await projectRes.json();

        if (projectData.error) {
          throw new Error(projectData.message || "Project not found");
        }

        // ✨ انتظار تحميل صورة البروفايل قبل عرض المشروع
        if (projectData.project.owner_id?.profile_pic) {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // continue even if image fails
            img.src = `http://localhost:5000/uploads/${projectData.project.owner_id.profile_pic}`;
          });
        }

        setProject(projectData.project);

        // جلب الإعجابات والتعليقات بالتوازي
        const [likesRes, commentsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/likes/project/${id}`),
          fetch(`http://localhost:5000/api/comments/project/${id}`),
        ]);

        const likesData = await likesRes.json();
        const commentsData = await commentsRes.json();

        if (!likesData.error) {
          setLikeCount(likesData.likes?.length || 0);
        }

        // فحص إعجاب المستخدم
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

        // تنسيق التعليقات
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

        // ✨ تأخير صغير للتأكد من تحميل كل شيء
        await new Promise(resolve => setTimeout(resolve, 300));
        setDataReady(true); // ✨ البيانات جاهزة الآن
        
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
      return { name: "Unknown", isCurrentUser: false, profilePic: "/default-avatar.png" };

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
      setDataReady(false);
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

  if (loading || !dataReady) {
    return (
      <>
        <Navbar />
        <LoadingSkeleton />
      </>
    );
  }

  if (!project)
    return (
      <>
        <Navbar />
        <div className="text-red-400 text-center p-10 min-h-screen flex items-center justify-center bg-primary">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Project not found</h2>
            <p className="text-gray-400">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary text-white">
        <div className="max-w-7xl mx-auto p-6 space-y-12 bg-primary text-white">
          <ProjectHeader
            project={project}
            ownerInfo={getOwnerInfo()}
            handleOwnerClick={handleOwnerClick}
            handleLike={handleLike}
            liked={liked}
            likeCount={likeCount}
            focusInput={focusInput}
            onShareOpen={() => setShowShareModal(true)}
          />

          <div className="flex flex-col gap-6">
            <ProjectDescription project={project} />
          </div>

          <RewardsList rewards={project.rewards} onRewardClick={handleRewardClick} />

          <CommentsSection
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            inputRef={inputRef}
            focusInput={focusInput}
          />

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
            <div className="absolute inset-0 bg-white/10 opacity-20 blur-xl animate-pulse"></div>

            <div className="flex items-center gap-4 relative z-10">
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
