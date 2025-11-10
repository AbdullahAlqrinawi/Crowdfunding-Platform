import {
    Card,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Tooltip,
  } from "@material-tailwind/react";
  import { PencilIcon } from "@heroicons/react/24/solid";
  import { useState } from "react";
  import CampaignCard from "../campaigns/CampaignCard";
  import { ProfileEditCard } from "./ProfileEditCard";
  import { ProfileInfoCard } from "./ProfileInfoCard";
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  
  const allProjects = [
    {
      id: 1,
      owner: "0xAbdullah123456789",
      title: "Support Clean Water Projects",
      image: "https://pbs.twimg.com/media/GnXNxcnbkAEhXXQ.jpg",
      target: 10000,
      deadline: "2025-07-15",
      amountCollected: 4500,
      type: "saved",
    },
    {
      id: 2,
      owner: "0x123456789ABCDEF",
      title: "Test Campaign",
      image:
        "https://www.nexustech.je/media/xqfou14f/ai-and-project-managaement.jpg?width=1399&height=787",
      target: 8000,
      deadline: "2025-06-20",
      amountCollected: 3000,
      type: "liked",
    },
    {
      id: 3,
      owner: "0xAAA111BBB",
      title: "Green Energy Innovation",
      image: "https://source.unsplash.com/featured/?energy",
      target: 15000,
      deadline: "2025-08-01",
      amountCollected: 7000,
      type: "funding",
    },
    {
      id: 4,
      owner: "0xMyWallet123",
      title: "My Personal Campaign",
      image: "https://source.unsplash.com/featured/?startup",
      target: 5000,
      deadline: "2025-07-01",
      amountCollected: 2000,
      type: "my",
    },
  ];
  
  export function Profile() {
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("saved");
  
    const profileDetails = {
      name: "Richard Davis",
      bio: "CEO / Co-Founder",
      email: "richard@example.com",
      phone: "+123456789",
    };
  
    const projectTabs = [
      { label: "Saved", value: "saved" },
      { label: "Liked", value: "liked" },
      { label: "Funding", value: "funding" },
      { label: "My Campaigns", value: "my" },
    ];
  
    const filteredProjects = allProjects.filter(
      (project) => project.type === activeTab
    );
  
    return (
      <Card className="mx-3 mt-8 mb-6 lg:mx-4 border bg-gray-900 text-white border-gray-800 p-6">
        <div className="flex items-center gap-6 mb-10">
          <Avatar
            src="/img/bruce-mars.jpeg"
            alt="profile"
            size="xxl"
            variant="rounded"
            className="rounded-lg shadow-lg shadow-blue-gray-900/40"
          />
          <div>
            <Typography variant="h4" className="text-white mb-1">
              {profileDetails.name}
            </Typography>
            <Typography variant="small" className="text-gray-400">
              {profileDetails.bio}
            </Typography>
          </div>
        </div>
  
        {!editMode ? (
          <ProfileInfoCard
            title="Profile Information"
            description="Welcome to your profile. Here you can view and edit your details."
            details={profileDetails}
            action={
              <Tooltip content="Edit Profile">
                <PencilIcon
                  className="h-5 w-5 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setEditMode(true)}
                />
              </Tooltip>
            }
          />
        ) : (
          <ProfileEditCard
            details={profileDetails}
            onSave={() => setEditMode(false)}
          />
        )}
  
        <div className="mt-12">
          <Typography variant="h5" className="text-white mb-4">
            Projects
          </Typography>
          <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
            <TabsHeader className="bg-gray-800 rounded-lg p-1 flex gap-2">
              {projectTabs.map(({ label, value }) => {
                const isActive = value === activeTab;
                const tabClass = classNames(
                  "rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gray-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                );
  
                return (
                  <Tab key={value} value={value} className={tabClass}>
                    {label}
                  </Tab>
                );
              })}
            </TabsHeader>
  
            <TabsBody>
              <TabPanel value={activeTab} className="min-h-[200px]">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <CampaignCard
                        key={project.id}
                        owner={project.owner}
                        title={project.title}
                        image={project.image}
                        target={project.target}
                        deadline={project.deadline}
                        amountCollected={project.amountCollected}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center mt-4">No projects in this category.</p>
                )}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </Card>
    );
  }
  
  export default Profile;
  