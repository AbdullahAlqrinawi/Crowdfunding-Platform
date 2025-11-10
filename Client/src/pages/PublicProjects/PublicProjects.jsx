import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CampaignCard from "../../components/landing/CampaignCard";
import { logo } from "../../assets";
import styles from "../../style";
import SimpleNavbar from "./SimpleNavbar";
import { Footer } from "../../components/landing";

export const PublicProjects = () => {
  const [campaignsData, setCampaignsData] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const campaignsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects");
        const transformedData = response.data.projects.map((project) => ({
          id: project._id,
          owner: project.owner_id,
          title: project.title,
          image: `http://localhost:5000/${project.image.replace("\\", "/")}`,
          target: parseFloat(project.target?.toString?.() || "0"),
          deadline: new Date(project.end_date).toISOString().split("T")[0],
          amountCollected: parseFloat(
            project.amount_raised?.toString?.() || "0"
          ),
          status: project.status,
          location: project.location,
          category: project.main_category,
          type: project.project_type,
          description: project.description,
        }));
        setCampaignsData(transformedData);
        setFilteredCampaigns(transformedData);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCampaignClick = (campaign) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      navigate(`/campaign/${campaign.id}`, {
        state: campaign
      });
    } else {
      setSelectedCampaign(campaign);
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setSelectedCampaign(null);
  };

  const indexOfLast = currentPage * campaignsPerPage;
  const indexOfFirst = indexOfLast - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="min-h-screen w-full bg-primary text-white">
     <SimpleNavbar />
      {/* Header Section */}
      <div className={`${styles.paddingX} ${styles.flexCenter} pt-8 pb-12`}>
        <div className={`${styles.boxWidth} text-center`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Public Projects
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing crowdfunding campaigns and support innovative ideas
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`${styles.paddingX} ${styles.flexCenter} pb-12`}>
        <div className={`${styles.boxWidth}`}>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No campaigns found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCampaigns.map((item) => (
                  <CampaignCard
                    key={item.id}
                    {...item}
                    handleClick={() => handleCampaignClick(item)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-30 hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      } transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-30 hover:bg-gray-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Left Side - Project Preview */}
            <div className="md:w-1/2 p-6 bg-gray-900">
              {selectedCampaign && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={logo}
                      alt="Project Logo"
                      className="w-12 h-12 object-contain"
                    />
                    <h3 className="text-xl font-bold text-white">
                      Project Preview
                    </h3>
                  </div>

                  <img
                    src={selectedCampaign.image}
                    alt={selectedCampaign.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <h2 className="text-2xl font-bold text-white">
                    {selectedCampaign.title}
                  </h2>

                  <p className="text-gray-300 line-clamp-3">
                    {selectedCampaign.description ||
                      "An amazing project waiting for your support..."}
                  </p>

                  <div className="flex justify-between items-center pt-4">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {parseFloat(selectedCampaign.amountCollected).toFixed(5)} ETH
                      </p>
                      <p className="text-sm text-gray-400">
                        Raised of {selectedCampaign.target} ETH
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {selectedCampaign.deadline}
                      </p>
                      <p className="text-sm text-gray-400">Deadline</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Authentication Buttons */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-6 w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors z-10"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold">Join Our Community</h2>
              </div>

              <p className="text-gray-300 mb-8 text-center">
                Sign in or create an account to view full project details and support this campaign.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleSignIn}
                  className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>

                <button
                  onClick={handleSignUp}
                  className="w-full py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
                >
                  Sign Up
                </button>
              </div>

              <p className="text-gray-400 text-sm text-center mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
};