import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Star, GitFork, AlertCircle, FolderGit2, SearchX } from 'lucide-react';
import axios from 'axios';
import { useGithub } from '../context/GithubContext';

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

// Helper function to color-code popular languages
const getLanguageColor = (lang) => {
  const colors = {
    JavaScript: 'text-yellow-400',
    TypeScript: 'text-blue-400',
    Python: 'text-green-400',
    Java: 'text-orange-400',
    HTML: 'text-orange-500',
    CSS: 'text-blue-500',
  };
  return colors[lang] || 'text-slate-400';
};

const Repository = () => {
  const { username } = useGithub();
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (username) {
      fetchRepos();
    }
  }, [username]);

  const fetchRepos = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      // Fetching up to 100 repos, sorted by recently updated
      const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      setRepos(response.data);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  // Framer Motion variants for the staggered grid animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // --- Render Helpers ---

  if (!username) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <SearchX className="mb-4 h-16 w-16 text-slate-600" />
        <h2 className="text-2xl font-bold text-slate-200">No User Selected</h2>
        <p className="mt-2 text-slate-400">Please go back to the home page and search for a GitHub user.</p>
        <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-500">
          Go to Search
        </Link>
      </div>
    );
  }

  if (apiStatus === apiStatusConstants.inProgress) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-blue-500">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="mt-4 font-medium text-slate-400 animate-pulse">Loading repositories...</p>
      </div>
    );
  }

  if (apiStatus === apiStatusConstants.failure) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-slate-200">Failed to load repositories</h2>
        <button onClick={fetchRepos} className="mt-6 rounded-lg bg-slate-800 px-6 py-2 font-medium text-slate-200 transition hover:bg-slate-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8 flex items-end justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Repositories</h1>
          <p className="text-slate-400">Showing repositories for <span className="font-semibold text-blue-400">@{username}</span></p>
        </div>
        <div className="rounded-full bg-slate-800/50 px-4 py-1 text-sm font-medium text-slate-300 ring-1 ring-slate-700">
          {repos.length} Repos
        </div>
      </div>

      {repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FolderGit2 className="mb-4 h-16 w-16 opacity-50" />
          <p className="text-lg">This user has no public repositories.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {repos.map((repo) => (
            <motion.div key={repo.id} variants={itemVariants}>
              <Link 
                to={`/repositories/${repo.name}`}
                className="group flex h-full flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-blue-500/10"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="line-clamp-1 text-lg font-bold text-blue-400 group-hover:text-blue-300">
                      {repo.name}
                    </h3>
                    <span className="rounded-full border border-slate-700 bg-slate-800/50 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                      {repo.visibility}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full bg-current ${getLanguageColor(repo.language)}`}></span>
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 transition-colors group-hover:text-yellow-400">
                    <Star className="h-4 w-4" /> {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1 transition-colors group-hover:text-emerald-400">
                    <GitFork className="h-4 w-4" /> {repo.forks_count}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Repository;