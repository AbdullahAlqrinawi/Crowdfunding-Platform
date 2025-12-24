"use client";

import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logo } from "../../assets";
import { useUser } from "../../components/project/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const initialNavigation = [
  { name: "Campaigns", href: "/dashboard", current: false },
  {
    name: "My Campaigns",
    href: "/profile-page?tab=My%20Campaigns",
    current: false,
  },
  { name: "Funding", href: "/profile-page?tab=Funding", current: false },
  { name: "Create Project", href: "/create-project", current: false },
];

export default function Navbar({ activeTab }) {
  const [navigation, setNavigation] = useState(initialNavigation);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, profileVersion } = useUser();

  // Memoize avatar source with stable cache busting
  const avatarSrc = useMemo(() => {
    if (!user?.profile_pic) {
      return "/default-avatar.png";
    }
    // Only bust cache when profileVersion changes (i.e., when profile is actually updated)
    return `http://localhost:5000/uploads/${user.profile_pic}?v=${profileVersion}`;
  }, [user?.profile_pic, profileVersion]);

  useEffect(() => {
    setNavigation((prev) =>
      prev.map((item) => {
        const isPathMatch = item.href.split("?")[0] === location.pathname;

        if (item.href.startsWith("/profile-page")) {
          const searchParams = new URLSearchParams(location.search);
          const itemParams = new URLSearchParams(item.href.split("?")[1] || "");
          const isTabMatch = searchParams.get("tab") === itemParams.get("tab");
          const shouldBeActive = activeTab
            ? itemParams.get("tab") === activeTab
            : isPathMatch && isTabMatch;

          return {
            ...item,
            current: shouldBeActive,
          };
        }

        return {
          ...item,
          current: isPathMatch,
        };
      })
    );
  }, [location, activeTab]);

  const handleNavigationClick = async (clickedItem) => {
    setIsNavigating(true);
    setNavigation((prev) =>
      prev.map((item) =>
        item.name === clickedItem.name
          ? { ...item, current: true }
          : { ...item, current: false }
      )
    );

    if (clickedItem.href) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "prefetch";
      preloadLink.href = clickedItem.href;
      preloadLink.as = "document";
      document.head.appendChild(preloadLink);

      setTimeout(() => {
        navigate(clickedItem.href);
        document.head.removeChild(preloadLink);
        setIsNavigating(false);
      }, 150);
    }
  };

  const handleLogout = () => {
    logout(); // Use context logout method
    navigate("/");
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-500 z-50 animate-pulse"></div>
      )}
      <Disclosure as="nav" className="bg-primary sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:justify-start">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <img
                  src={logo}
                  alt="sparkit"
                  className="w-32 h-auto object-contain p-0 m-0"
                />
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:justify-center space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigationClick(item)}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center gap-3 pr-2 sm:pr-0">
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center focus:outline-none">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer">
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-gray-700 text-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/profile-page")}
                        className={classNames(
                          active ? "bg-gray-600" : "",
                          "block w-full text-left px-4 py-2 text-sm"
                        )}
                      >
                        Your Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/profile-page")}
                        className={classNames(
                          active ? "bg-gray-600" : "",
                          "block w-full text-left px-4 py-2 text-sm"
                        )}
                      >
                        Update Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? "bg-gray-600" : "",
                          "block w-full text-left px-4 py-2 text-sm"
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden absolute top-16 inset-x-0 z-40 bg-primary">
          <div className="space-y-1 px-2 pt-2 pb-3 shadow-lg">
            {navigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="button"
                onClick={() => handleNavigationClick(item)}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
}
