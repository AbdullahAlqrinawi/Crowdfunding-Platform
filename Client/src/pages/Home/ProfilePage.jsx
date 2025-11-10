import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Tabs, Tab } from "../../components/project/Tabs";
import CampaignCard from "../../components/landing/CampaignCard";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaPen } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Footer } from "../../components/landing";
import Navbar from "../../components/project/Navbar";
import { Dialog } from "@headlessui/react";
import styles from "../../style";
import { useUser } from "../../components/project/UserContext";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

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
  });

  const fileInputRef = useRef();
  const projectFileInputRef = useRef();

  const getToken = () => localStorage.getItem("token");

  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const handleViewDonors = async (projectId, projectTitle) => {
    try {
      setSelectedProjectTitle(projectTitle);
      const response = await axios.get(
        `http://localhost:5000/api/donations/project/${projectId}/donors`
      );
      setDonors(response.data.donors);
      setIsDonorModalOpen(true);
    } catch (error) {
      console.error("Error fetching donors:", error);
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

      if (activeTab === "Funding") {
        return response.data.projects || [];
      } else if (
        activeTab === "My Campaigns" ||
        activeTab.includes("Campaigns")
      ) {
        return response.data.projects || [];
      } else if (activeTab === "Likes") {
        return response.data.likedProjects || response.data.projects || [];
      }

      return [];
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
      <div className="flex justify-center items-center h-40 text-white">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></span>
      </div>
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
            {projects[activeTab]?.length === 0 ? (
              <p className="col-span-full text-center text-zinc-400">
                {isOwnProfile
                  ? `No ${activeTab.toLowerCase()} yet.`
                  : `No campaigns yet.`}
              </p>
            ) : (
              projects[activeTab]?.map((proj, idx) => (
                <div key={idx} className="relative">
                  <CampaignCard
                    owner={proj.owner_id?.username || displayedUser.username}
                    title={proj.title}
                    image={`http://localhost:5000/${proj.image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    target={proj.target}
                    amountCollected={proj.amount_raised}
                    deadline={proj.end_date}
                    profileImage={
                      displayedUser.profile_pic
                        ? `http://localhost:5000/uploads/${displayedUser.profile_pic}`
                        : "/default-avatar.png"
                    }
                  />
                  {isOwnProfile &&
                    (activeTab === "My Campaigns" ||
                      activeTab.includes("Campaigns")) && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="bg-zinc-700 p-2 rounded-full hover:bg-zinc-600 transition"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleViewDonors(proj._id, proj.title)}
                          className="bg-indigo-600 p-2 rounded-full hover:bg-indigo-500 transition text-sm"
                        >
                          👥
                        </button>
                      </div>
                    )}
                </div>
              ))
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
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={projectFormData.location}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
                  <input
                    type="text"
                    name="categoryMain"
                    placeholder="Main Category"
                    value={projectFormData.categoryMain}
                    onChange={handleProjectChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                  />
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
          {/* View Donors Modal */}
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
            <li key={idx} className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg">
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
                <p className="font-semibold text-white">{donor.username}</p>
                <p className="text-zinc-400 text-sm">{donor.amount} ETH</p>
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
