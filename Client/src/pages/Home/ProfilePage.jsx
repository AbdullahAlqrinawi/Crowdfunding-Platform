import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Tabs, Tab } from "../../components/project/Tabs";
import CampaignCard from "../../components/landing/CampaignCard";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaPen, FaUsers } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Footer } from "../../components/landing";
import Navbar from "../../components/project/Navbar";
import { Dialog } from "@headlessui/react";
import styles from "../../style";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../components/project/UserContext";

// NEW COMPONENTS
import ProfileHeader from "../../components/project/ProfileHeader";
import ProjectsGrid from "../../components/project/ProjectsGrid";
import EditProfileModal from "../../components/project/EditProfileModal";
import EditProjectModal from "../../components/project/EditProjectModal";
import DonorsModal from "../../components/project/DonorsModal";
import LoadingSkeleton from "../../components/project/LoadingSkeleton";

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId: profileUserId } = useParams();
  const initialTab = searchParams.get("tab") || "My Campaigns";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user: currentUser, fetchUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectEditOpen, setIsProjectEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    linkedin: "",
    twitter: "",
    profile_pic: null,
  });

  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    target: "",
    end_date: "",
    story: "",
    location: "",
    categoryMain: "",
    categoryOptional: "",
    type: "",
    status: "",
  });

  const fileInputRef = useRef();
  const projectFileInputRef = useRef();

  const getToken = () => localStorage.getItem("token");

  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded); // للت Debug
      return decoded.id || decoded.userId || decoded._id; // جرب كل الاحتمالات
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const handleDonorClick = (donor) => {
    setIsDonorModalOpen(false);

    if (!donor) {
      console.error("Donor object is undefined");
      return;
    }

    // البحث عن المعرف بأي اسم محتمل
    const donorId = donor._id || donor.donor_id || donor.id || donor.userId;
    
    if (!donorId) {
      console.error("No valid donor ID found in donor object:", donor);
      return;
    }

    console.log("Navigating to donor profile:", donorId);
    console.log("Full donor data:", donor);

    navigate(`/profile-page/${donorId}`);
  };

  const handleViewDonors = async (projectId, projectTitle) => {
    try {
      setSelectedProjectTitle(projectTitle);
      const response = await axios.get(
        `http://localhost:5000/api/donations/project/${projectId}/donors`
      );

      console.log("Full API response:", response.data);

      if (response.data && response.data.donors) {
        console.log("Donors data received:", response.data.donors);
        
        // معالجة البيانات لتوحيد حقل المعرف
        const processedDonors = response.data.donors.map((donor, index) => {
          console.log(`Donor ${index}:`, donor);
          
          // إذا كان donor_id موجوداً ولكن _id غير موجود، انسخ donor_id إلى _id
          if (donor.donor_id && !donor._id) {
            donor._id = donor.donor_id;
          }
          
          return donor;
        });

        setDonors(processedDonors);
        setIsDonorModalOpen(true);
      } else {
        console.error("No donors data received or invalid structure");
        setDonors([]);
        setIsDonorModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      console.error("Error details:", error.response?.data);
      setDonors([]);
      setIsDonorModalOpen(true);
    }
  };

  const currentUserId = getUserIdFromToken();
  const isOwnProfile = !profileUserId || currentUserId === profileUserId;
  const displayedUser = isOwnProfile ? currentUser : profileUser;

  const getAvailableTabs = () => {
    if (isOwnProfile) {
      return ["My Campaigns", "Funding", "Likes"];
    } else {
      const userName = displayedUser?.username || "User";
      return [`${userName}'s Campaigns`];
    }
  };

  const availableTabs = getAvailableTabs();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    navigate(
      `/profile-page${
        profileUserId ? `/${profileUserId}` : ""
      }?tab=${encodeURIComponent(tab)}`,
      { replace: true }
    );
  };

  const fetchProfileUser = async () => {
    try {
      const userIdToFetch = profileUserId || currentUserId;
      if (!userIdToFetch) return;

      const response = await axios.get(
        `http://localhost:5000/api/users/${userIdToFetch}`
      );
      setProfileUser(response.data.user);
    } catch (error) {
      console.error("Error fetching profile user:", error);
    }
  };

  const fetchUserProjects = async () => {
    const userIdToFetch = profileUserId || currentUserId;
    if (!userIdToFetch) return [];

    try {
      let endpoint = "";
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log(
        `Fetching projects for tab: ${activeTab}, user: ${userIdToFetch}`
      );

      if (activeTab === "Funding") {
        endpoint = `http://localhost:5000/api/donations/user/projects/${userIdToFetch}`;
      } else if (
        activeTab === "My Campaigns" ||
        activeTab.includes("Campaigns")
      ) {
        endpoint = `http://localhost:5000/api/projects/user/${userIdToFetch}`;
      } else if (activeTab === "Likes") {
        endpoint = `http://localhost:5000/api/likes/user/${userIdToFetch}`;
      } else {
        return [];
      }

      const response = await axios.get(endpoint, { headers });
      console.log(`API Response for ${activeTab}:`, response.data);

      let projects = [];
      if (activeTab === "Funding") {
        projects = response.data.projects || response.data || [];
      } else if (
        activeTab === "My Campaigns" ||
        activeTab.includes("Campaigns")
      ) {
        projects = response.data.projects || response.data || [];
      } else if (activeTab === "Likes") {
        projects =
          response.data.likedProjects ||
          response.data.projects ||
          response.data ||
          [];
      }

      console.log(`Processed ${projects.length} projects for ${activeTab}`);
      return projects;
    } catch (error) {
      console.error(`Error fetching ${activeTab} projects:`, error);

      if (error.response?.status === 401) {
        console.log("User not authenticated for likes");
        return [];
      }
      if (error.response?.status === 404) {
        console.log("No projects found for this tab");
        return [];
      }

      return [];
    }
  };

  const [projects, setProjects] = useState({
    Funding: [],
    "My Campaigns": [],
    Likes: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (isOwnProfile) {
          await fetchUser();
        } else {
          await fetchProfileUser();
        }

        const fetchedProjects = await fetchUserProjects();
        setProjects((prev) => ({
          ...prev,
          [activeTab]: fetchedProjects,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, profileUserId, currentUserId, isOwnProfile]);

  useEffect(() => {
    if (displayedUser) {
      setFormData({
        username: displayedUser.username || "",
        email: displayedUser.email || "",
        bio: displayedUser.bio || "",
        linkedin: displayedUser.linkedin || "",
        twitter: displayedUser.twitter || "",
        profile_pic: null,
      });
      setPreviewImage(
        displayedUser.profile_pic
          ? `http://localhost:5000/uploads/${displayedUser.profile_pic}`
          : null
      );
    }
  }, [displayedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_pic: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProjectFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    setIsSaving(true);

    try {
      if (!token || !currentUserId) {
        console.error("Missing token or userId");
        return;
      }

      const data = new FormData();

      if (formData.username) data.append("username", formData.username);
      if (formData.email) data.append("email", formData.email);
      if (formData.bio) data.append("bio", formData.bio);
      if (formData.linkedin) data.append("linkedin", formData.linkedin);
      if (formData.twitter) data.append("twitter", formData.twitter);
      if (formData.profile_pic)
        data.append("profile_pic", formData.profile_pic);

      const response = await axios.put(
        `http://localhost:5000/api/users/${currentUserId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUser();
      setIsOpen(false);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setProjectFormData({
      title: project.title || "",
      description: project.description || "",
      target: project.target || "",
      end_date: project.end_date
        ? new Date(project.end_date).toISOString().split("T")[0]
        : "",
      story: project.story || "",
      location: project.location || "",
      categoryMain: project.main_category || "",
      categoryOptional: project.optional_category || "",
      type: project.type || "",
      status: project.status || "",
      image: null,
    });
    setIsProjectEditOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    setIsSaving(true);

    try {
      if (!token || !selectedProject) {
        console.error("Missing token or project");
        return;
      }

      const data = new FormData();
      data.append("title", projectFormData.title);
      data.append("description", projectFormData.description);
      data.append("target", projectFormData.target);
      data.append("end_date", projectFormData.end_date);
      data.append("story", projectFormData.story);
      data.append("location", projectFormData.location);
      data.append("categoryMain", projectFormData.categoryMain);
      data.append("categoryOptional", projectFormData.categoryOptional);
      data.append("type", projectFormData.type);
      data.append("status", projectFormData.status);

      if (projectFormData.image) {
        data.append("image", projectFormData.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/projects/${selectedProject._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fetchedProjects = await fetchUserProjects();
      setProjects((prev) => ({
        ...prev,
        [activeTab]: fetchedProjects,
      }));

      setIsProjectEditOpen(false);
      setSelectedProject(null);
    } catch (err) {
      console.error("Project update error:", err.response?.data || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton activeTab={activeTab} />;
  }

  if (!displayedUser)
    return <div className="text-center p-10 text-red-400">User not found</div>;

  return (
    <>
      <Navbar activeTab={activeTab} />
      <main className="bg-primary min-h-screen text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ProfileHeader
            previewImage={previewImage}
            displayedUser={displayedUser}
            isOwnProfile={isOwnProfile}
            onEditClick={() => setIsOpen(true)}
          />

          {/* Tabs */}
          <div className="mb-6 flex justify-center md:justify-start">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {availableTabs.map((tab) => (
                <Tab key={tab} value={tab} label={tab} />
              ))}
            </Tabs>
          </div>

          {/* Projects */}
          <ProjectsGrid
            projects={projects[activeTab]}
            activeTab={activeTab}
            displayedUser={displayedUser}
            isOwnProfile={isOwnProfile}
            onEditProject={handleEditProject}
            onViewDonors={handleViewDonors}
          />
        </div>
      </main>

      {/* Footer & Modals */}
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />

          {/* Edit Profile Modal */}
          <EditProfileModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            previewImage={previewImage}
            fileInputRef={fileInputRef}
            formData={formData}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
          />

          {/* Edit Project Modal */}
          <EditProjectModal
            open={isProjectEditOpen}
            onClose={() => setIsProjectEditOpen(false)}
            projectFormData={projectFormData}
            projectFileInputRef={projectFileInputRef}
            onProjectFileChange={handleProjectFileChange}
            onProjectChange={handleProjectChange}
            onProjectSubmit={handleProjectSubmit}
            isSaving={isSaving}
          />

          {/* Donors Modal */}
          <DonorsModal
            open={isDonorModalOpen}
            onClose={() => setIsDonorModalOpen(false)}
            donors={donors}
            selectedProjectTitle={selectedProjectTitle}
            onDonorClick={handleDonorClick}
          />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
