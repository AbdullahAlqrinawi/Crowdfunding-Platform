import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Footer, Stats } from '../../components/landing';
import DashboardHero from '../../components/landing/DashboardHero';
import Navbar from '../../components/project/Navbar';
import FilterBar from '../../components/project/FilterBar';
import { Search } from '../../components/project/Search';
import { AllCampaigns } from '../../components/project/AllCampaigns';
import styles from "../../style";
import { useUser } from '../../components/project/UserContext';

export const Dashboard = () => {
  const { user, fetchUser, updateUser } = useUser();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const navbarRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.id;
      } catch {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = getUserIdFromToken();
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
          
          if (updateUser) {
            updateUser(response.data.user);
          } else if (fetchUser) {
            fetchUser();
          }

          if (!response.data.user.bio) {
            setShowProfileModal(true);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [navigate, updateUser, fetchUser]); 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        if (currentScrollY > navbarRef.current.offsetHeight) {
          setIsNavbarSticky(true);
        }
      } else {
        if (currentScrollY <= navbarRef.current.offsetHeight) {
          setIsNavbarSticky(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (!user) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div
        ref={navbarRef}
        className={`z-10 ${isNavbarSticky ? 'sticky top-0 bg-primary shadow-lg' : ''}`}
      >
        <Navbar user={user}/>
      </div>

      <DashboardHero />

      <div className="px-6 sm:px-12">
        <Stats />
      </div>

      <div className="flex flex-col sm:flex-row bg-gray-950 min-h-screen text-white">
        <div className="w-full sm:w-72 p-4 border-b sm:border-b-0 sm:border-r border-gray-800">
          <FilterBar
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-1 p-6 space-y-6">
          <Search 
            onMobileFilterOpen={() => setMobileFiltersOpen(true)}
            onSearch={handleSearch}
          />
          <AllCampaigns 
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
};