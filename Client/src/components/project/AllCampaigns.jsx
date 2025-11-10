import React, { useState, useEffect } from "react";
import axios from "axios";
import CampaignCard from "../landing/CampaignCard";
import { useNavigate } from "react-router-dom";

export const AllCampaigns = ({ searchQuery, filters }) => {
  const [campaignsData, setCampaignsData] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
          amountCollected: parseFloat(project.amount_raised?.toString?.() || "0"),
          status: project.status,
          location: project.location,
          category: project.main_category,
          type: project.project_type,
        }));
        setCampaignsData(transformedData);
        setFilteredCampaigns(transformedData);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let result = [...campaignsData];

    if (searchQuery) {
      result = result.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter(campaign => {
        if (filters.status === 'Upcoming') {
          return new Date(campaign.deadline) > new Date();
        } else if (filters.status === 'Active') {
          return campaign.status === 'OPEN';
        } else if (filters.status === 'Ended') {
          return campaign.status === 'CLOSED' || new Date(campaign.deadline) < new Date();
        }
        return true;
      });
    }

    if (filters.location) {
      result = result.filter(campaign => 
        campaign.location?.toLowerCase() === filters.location.toLowerCase()
      );
    }

    if (filters.category) {
      result = result.filter(campaign => 
        campaign.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.type) {
      result = result.filter(campaign => 
        campaign.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    setFilteredCampaigns(result);
    setCurrentPage(1); 
  }, [searchQuery, filters, campaignsData]);

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
    <div className="space-y-6">
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No campaigns found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCampaigns.map((item) => (
              <CampaignCard
                key={item.id}
                {...item}
                handleClick={() => navigate(`/campaign/${item.id}`, {
                  state: item
                })}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-30"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-indigo-600" : "bg-gray-700"
                  } text-white`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};