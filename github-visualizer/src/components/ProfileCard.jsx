import { motion } from 'framer-motion';
import { MapPin, Building2, Link as LinkIcon, Users, BookOpen } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl sm:p-10"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        
        {/* Avatar with Glow Effect */}
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 opacity-50 blur"></div>
          <img
            src={profile.avatar_url}
            alt={profile.name || profile.login}
            className="relative h-32 w-32 rounded-full border-2 border-slate-800 object-cover sm:h-40 sm:w-40"
          />
        </div>

        {/* User Info */}
        <div className="flex w-full flex-col text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-100">{profile.name || profile.login}</h2>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-blue-400 hover:underline"
          >
            @{profile.login}
          </a>

          {profile.bio && (
            <p className="mt-4 text-slate-300 leading-relaxed">{profile.bio}</p>
          )}

          {/* Stats Grid */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start sm:gap-6">
            <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <span className="block font-bold text-slate-200">{profile.followers}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Followers</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="block font-bold text-slate-200">{profile.following}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Following</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <div>
                <span className="block font-bold text-slate-200">{profile.public_repos}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Repos</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400 sm:justify-start">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {profile.location}
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {profile.company}
              </div>
            )}
            {profile.blog && (
              <a
                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <LinkIcon className="h-4 w-4" /> {profile.blog}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;