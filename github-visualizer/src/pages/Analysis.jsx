import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, SearchX, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useGithub } from '../context/GithubContext';

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Analysis = () => {
  const { username } = useGithub();
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [languageData, setLanguageData] = useState([]);
  const [popularRepos, setPopularRepos] = useState([]);

  useEffect(() => {
    if (username) {
      fetchAnalysisData();
    }
  }, [username]);

  const fetchAnalysisData = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
      const repos = response.data;

      // 1. Calculate Language Distribution
      const langMap = {};
      repos.forEach(repo => {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      });
      const formattedLangData = Object.keys(langMap).map(key => ({
        name: key,
        value: langMap[key]
      })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 languages

      // 2. Calculate Most Starred Repos
      const formattedPopularRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5) // Top 5 starred repos
        .map(repo => ({
          name: repo.name.length > 15 ? repo.name.substring(0, 15) + '...' : repo.name, // Truncate long names
          stars: repo.stargazers_count
        }));

      setLanguageData(formattedLangData);
      setPopularRepos(formattedPopularRepos);
      setApiStatus(apiStatusConstants.success);

    } catch (error) {
      console.error("Error fetching analysis data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

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
        <p className="mt-4 font-medium text-slate-400 animate-pulse">Analyzing repository data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8"
    >
      <div className="mb-10 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-slate-100">Profile Analysis</h1>
        <p className="text-slate-400">Visualizing data for <span className="font-semibold text-blue-400">@{username}</span></p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* Languages Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-2">
            <PieChartIcon className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-slate-200">Top Languages</h2>
          </div>
          
          {languageData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {languageData.map((lang, idx) => (
                  <div key={lang.name} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="flex h-[300px] items-center justify-center text-slate-500">No language data available.</div>
          )}
        </motion.div>

        {/* Popular Repos Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-200">Most Starred Repositories</h2>
          </div>

          {popularRepos.length > 0 && popularRepos[0].stars > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularRepos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                  />
                  <Bar dataKey="stars" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {popularRepos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-slate-500">Not enough star data available.</div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Analysis;