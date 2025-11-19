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
    return (
      <>
        <Navbar activeTab={activeTab} />
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
  }

  if (!displayedUser)
    return <div className="text-center p-10 text-red-400">User not found</div>;

  return (
    <>
      <Navbar activeTab={activeTab} />
      <main className="bg-primary min-h-screen text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              <img
                src={previewImage || "/default-avatar.png"}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-zinc-600"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="absolute bottom-0 right-0 bg-zinc-700 p-2 rounded-full hover:bg-zinc-600 transition"
                >
                  <FaPen size={16} />
                </button>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{displayedUser.username}</h1>
              <p className="mt-2 text-zinc-300">
                {displayedUser.bio || "No bio yet."}
              </p>
              <div className="flex gap-4 mt-4 text-xl">
                {displayedUser.twitter && (
                  <a
                    href={displayedUser.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaXTwitter />
                  </a>
                )}
                {displayedUser.linkedin && (
                  <a
                    href={displayedUser.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex justify-center md:justify-start">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {availableTabs.map((tab) => (
                <Tab key={tab} value={tab} label={tab} />
              ))}
            </Tabs>
          </div>

          {/* Projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects[activeTab] && projects[activeTab].length > 0 ? (
              projects[activeTab].map((proj, idx) => (
                <div key={idx} className="relative">
                  <CampaignCard
                    id={proj._id}
                    owner={proj.owner_id?.username || displayedUser.username}
                    title={proj.title}
                    image={
                      proj.image
                        ? `http://localhost:5000/${proj.image.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "/default-project.png"
                    }
                    target={proj.target}
                    amountCollected={proj.amount_raised}
                    deadline={proj.end_date}
                    profileImage={
                      displayedUser.profile_pic
                        ? `http://localhost:5000/uploads/${displayedUser.profile_pic}`
                        : "/default-avatar.png"
                    }
                  />
                  {isOwnProfile && activeTab === "My Campaigns" && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEditProject(proj)}
                        className="bg-zinc-700 p-2 rounded-full hover:bg-zinc-600 transition"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleViewDonors(proj._id, proj.title)}
                        className="bg-indigo-600 p-2 rounded-full hover:bg-indigo-500 transition flex items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <FaUsers size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-zinc-400">
                {isOwnProfile
                  ? `No ${activeTab.toLowerCase()} yet.`
                  : `No campaigns yet.`}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer & Modals */}
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />

          {/* Edit Profile Modal */}
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
                <Dialog.Title className="text-xl font-bold mb-4 text-white">
                  Edit Profile
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={previewImage || "/default-avatar.png"}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-zinc-600"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                    >
                      Choose an image
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <textarea
                    name="bio"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <input
                    type="text"
                    name="twitter"
                    placeholder="Twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-600 text-white hover:bg-zinc-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>

          {/* Edit Project Modal */}
          <Dialog
            open={isProjectEditOpen}
            onClose={() => setIsProjectEditOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
                <Dialog.Title className="text-xl font-bold mb-4 text-white">
                  Edit Project
                </Dialog.Title>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => projectFileInputRef.current.click()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
                    >
                      Change Project Image
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={projectFileInputRef}
                      onChange={handleProjectFileChange}
                      className="hidden"
                    />
                  </div>

                  <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    value={projectFormData.title}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <textarea
                    name="description"
                    placeholder="Project Description"
                    value={projectFormData.description}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                    rows="3"
                  />
                  <input
                    type="number"
                    name="target"
                    placeholder="Funding Target"
                    value={projectFormData.target}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <input
                    type="date"
                    name="end_date"
                    value={projectFormData.end_date}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <textarea
                    name="story"
                    placeholder="Project Story"
                    value={projectFormData.story}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                    rows="4"
                  />

                  <select
                    name="location"
                    value={projectFormData.location}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  >
                    <option value="">Select Location</option>
                    <option value="Jordan">Jordan</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Germany">Germany</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="France">France</option>
                  </select>

                  <select
                    name="categoryMain"
                    value={projectFormData.categoryMain}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  >
                    <option value="">Select Main Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Art">Art</option>
                    <option value="Environment">Environment</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Food">Food</option>
                  </select>

                  <select
                    name="type"
                    value={projectFormData.type}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                    <option value="Organization">Organization</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Commercial">Commercial</option>
                  </select>

                  <select
                    name="status"
                    value={projectFormData.status}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  >
                    <option value="">Select Status</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Ended">Ended</option>
                  </select>

                  <input
                    type="text"
                    name="categoryOptional"
                    placeholder="Optional Category"
                    value={projectFormData.categoryOptional}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsProjectEditOpen(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-600 text-white hover:bg-zinc-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>

          <Dialog
            open={isDonorModalOpen}
            onClose={() => setIsDonorModalOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
                <Dialog.Title className="text-xl font-bold mb-4 text-white">
                  Donors for {selectedProjectTitle}
                </Dialog.Title>

                {donors.length === 0 ? (
                  <p className="text-zinc-400 text-center">No donors yet.</p>
                ) : (
                  <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {donors.map((donor, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleDonorClick(donor)} // تمرير donor كامل بدلاً من donor._id فقط
                        className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                      >
                        <img
                          src={
                            donor.profile_pic
                              ? `http://localhost:5000/uploads/${donor.profile_pic}`
                              : "/default-avatar.png"
                          }
                          alt="donor"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {donor.username || "Anonymous"}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            {donor.amount} ETH
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setIsDonorModalOpen(false)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
