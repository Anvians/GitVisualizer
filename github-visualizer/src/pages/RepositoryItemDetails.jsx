import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Loader2, AlertCircle, ArrowLeft, ExternalLink, 
  Star, GitFork, Eye, CircleDot, Code2, Calendar 
} from 'lucide-react';
import axios from 'axios';
import { useGithub } from '../context/GithubContext';

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

const RepositoryItemDetails = () => {
  const { repoName } = useParams();
  const { username } = useGithub();
  const navigate = useNavigate();
  
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [repoDetails, setRepoDetails] = useState(null);

  useEffect(() => {
    if (username && repoName) {
      fetchRepoDetails();
    }
  }, [username, repoName]);

  const fetchRepoDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
      setRepoDetails(response.data);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error("Error fetching repository details:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  // --- Render Helpers ---

  if (!username) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-slate-600" />
        <h2 className="text-2xl font-bold text-slate-200">Session Expired</h2>
        <p className="mt-2 text-slate-400">Please go back to the home page and search for a user again.</p>
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
        <p className="mt-4 font-medium text-slate-400 animate-pulse">Loading repository details...</p>
      </div>
    );
  }

  if (apiStatus === apiStatusConstants.failure) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-slate-200">Repository Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 rounded-lg bg-slate-800 px-6 py-2 font-medium text-slate-200 transition hover:bg-slate-700">
          Go Back
        </button>
      </div>
    );
  }

  if (!repoDetails) return null;

  // Formatting dates to be more readable
  const createdAt = new Date(repoDetails.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const updatedAt = new Date(repoDetails.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      {/* Back Button & Header */}
      <button 
        onClick={() => navigate('/repositories')}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Repositories
      </button>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-100">{repoDetails.name}</h1>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {repoDetails.visibility}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-400">
            {repoDetails.description || 'No description provided for this repository.'}
          </p>
        </div>
        
        <a 
          href={repoDetails.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          View on GitHub <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center shadow-lg backdrop-blur-sm">
          <Star className="mb-2 h-8 w-8 text-yellow-400" />
          <span className="text-3xl font-bold text-slate-100">{repoDetails.stargazers_count}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Stars</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center shadow-lg backdrop-blur-sm">
          <GitFork className="mb-2 h-8 w-8 text-emerald-400" />
          <span className="text-3xl font-bold text-slate-100">{repoDetails.forks_count}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Forks</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center shadow-lg backdrop-blur-sm">
          <Eye className="mb-2 h-8 w-8 text-blue-400" />
          <span className="text-3xl font-bold text-slate-100">{repoDetails.watchers_count}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Watchers</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center shadow-lg backdrop-blur-sm">
          <CircleDot className="mb-2 h-8 w-8 text-red-400" />
          <span className="text-3xl font-bold text-slate-100">{repoDetails.open_issues_count}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Open Issues</span>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="rounded-lg bg-slate-800 p-3"><Code2 className="h-6 w-6 text-purple-400" /></div>
          <div>
            <p className="text-sm text-slate-500">Primary Language</p>
            <p className="text-lg font-semibold text-slate-200">{repoDetails.language || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="rounded-lg bg-slate-800 p-3"><Calendar className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-sm text-slate-500">Created At</p>
            <p className="text-lg font-semibold text-slate-200">{createdAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="rounded-lg bg-slate-800 p-3"><Calendar className="h-6 w-6 text-blue-400" /></div>
          <div>
            <p className="text-sm text-slate-500">Last Updated</p>
            <p className="text-lg font-semibold text-slate-200">{updatedAt}</p>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default RepositoryItemDetails;