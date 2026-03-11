import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useGithub } from '../context/GithubContext';
import ProfileCard from '../components/ProfileCard';

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

const Home = () => {
  const { username, setUsername } = useGithub();
  const [searchInput, setSearchInput] = useState('');
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async (searchUsername) => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      // Using the official GitHub API
      const response = await axios.get(`https://api.github.com/users/${searchUsername}`);
      setProfileData(response.data);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
      fetchProfile(searchInput.trim());
    }
  };

  // Render helpers
  const renderLoadingView = () => (
    <div className="mt-20 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="mt-4 text-slate-400 font-medium animate-pulse">Fetching profile...</p>
    </div>
  );

  const renderFailureView = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-16 flex max-w-md flex-col items-center rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center backdrop-blur-sm"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="mb-2 text-xl font-bold text-slate-200">User Not Found</h3>
      <p className="mb-6 text-slate-400">We couldn't find a GitHub user with that username. Please check the spelling and try again.</p>
      <button
        onClick={() => setApiStatus(apiStatusConstants.initial)}
        className="rounded-lg bg-slate-800 px-6 py-2 font-medium text-slate-200 transition-colors hover:bg-slate-700"
      >
        Clear Search
      </button>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center pt-10 pb-20">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center"
      >
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
          Visualize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">GitHub Profiles</span>
        </h1>
        <p className="mb-10 text-lg text-slate-400">
          Enter a GitHub username to generate beautiful charts, analyze repository stats, and explore commit history.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative group mx-auto max-w-md">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 opacity-30 blur transition duration-500 group-hover:opacity-60"></div>
          
          <div className="relative flex items-center rounded-xl bg-slate-900 ring-1 ring-slate-800 focus-within:ring-blue-500">
            <Search className="ml-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g., Anvians, Ankit-Sharma..."
              className="w-full bg-transparent p-4 text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={apiStatus === apiStatusConstants.inProgress}
              className="mr-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </form>
      </motion.div>

      {/* Dynamic Content Rendering based on API Status */}
      {apiStatus === apiStatusConstants.inProgress && renderLoadingView()}
      {apiStatus === apiStatusConstants.failure && renderFailureView()}
      {apiStatus === apiStatusConstants.success && profileData && (
        <ProfileCard profile={profileData} />
      )}

    </div>
  );
};

export default Home;