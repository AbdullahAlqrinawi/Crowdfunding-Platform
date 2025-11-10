'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

import { donorsData, rewardsData, commentsData as initialComments } from '../../components/test/dummyData';
import { Footer } from '../../components/landing';
import Navbar from '../../components/project/Navbar';
import RewardDonationModal from '../../components/project/RewardDonationModal';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef(null);

  const [selectedReward, setSelectedReward] = useState(null);
const [showDonationModal, setShowDonationModal] = useState(false);
const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`);
        const data = await res.json();
        if (!data.error) {
          setProject(data.project);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleLike = () => {
    setLikeCount((prev) => prev + (liked ? -1 : 1));
    setLiked(!liked);
  };

  const handleRewardClick = (reward) => {
  setSelectedReward(reward);
  setShowDonationModal(true);
};


const handleDonationSuccess = async (amount, txHash) => {
  setDonationSuccess(true);
  
  setProject(prev => ({
    ...prev,
    amount_raised: prev.amount_raised + amount
  }));

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`);
    const data = await res.json();
    if (!data.error) {
      setProject(data.project);
    }
  } catch (err) {
    console.error('Error refetching project:', err);
  }
};


  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      name: 'You',
      image: 'https://randomuser.me/api/portraits/lego/1.jpg',
      text: newComment,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  if (loading) return <div className="text-white text-center p-10">Loading...</div>;
  if (!project) return <div className="text-red-400 text-center p-10">Project not found</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary text-white">
        <div className="max-w-7xl mx-auto p-6 space-y-12 bg-primary text-white">

          {/* Project Image */}
          <div className="relative">
           <img
  src={`http://localhost:5000/${project.image.replace(/\\/g, '/')}`}
  alt={project.title}
          className="w-full h-80 md:h-[500px] object-cover rounded-lg shadow-lg"
/>

          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              {/* <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition ${
                      liked ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <HeartIcon className="h-6 w-6" />
                  </button>
                  <span className="absolute top-full mt-1 text-xs text-gray-400">{likeCount}</span>
                </div>

                <button
                  onClick={() => setSaved(!saved)}
                  className={`p-2 rounded-full transition ${
                    saved ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <BookmarkIcon className="h-6 w-6" />
                </button>

                <button
                  onClick={focusInput}
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                >
                  <ChatBubbleLeftIcon className="h-6 w-6" />
                </button>
              </div> */}
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">{project.description}</p>
          </div>

          {/* Donors (Static) */}
          {/* <div className="space-y-6">
            <h2 className="text-2xl font-bold">Donors</h2>
            <div className="flex flex-wrap gap-6">
              {donorsData.map((donor, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <img
                    src={donor.image}
                    alt={donor.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                  <p className="text-gray-400 text-sm">{donor.name}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* Rewards */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.rewards.map((reward, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition bg-gray-800"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white">{reward.title}</h3>
                    <p className="text-gray-400 mt-2">{reward.description}</p>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-primary font-bold text-lg">ETH {reward.amount}</p>
                    <button 
                      onClick={() => handleRewardClick(reward)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm">
                      Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          {/* <section className="space-y-8">
            <h2 className="text-2xl font-bold">Comments</h2>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Write a comment..."
                className="w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg focus:outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
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

            <div className="space-y-6">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex gap-4">
                  <img
                    src={comment.image}
                    alt={comment.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{comment.name}</div>
                    <div className="text-gray-400">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </section> */}
          <Footer />
        </div>
      </div>
     {showDonationModal && selectedReward && (
  <RewardDonationModal
    reward={selectedReward}
    projectId={id}
    projectWalletAddress={project.wallet_address} 
    onClose={() => setShowDonationModal(false)}
    onSuccess={handleDonationSuccess}
  />
)}
{donationSuccess && (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
    Donation successful! Thank you for your support.
  </div>
)}
    </>
  );
}
