import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, BookOpen, BarChart2, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Profile', path: '/', icon: Github },
    { name: 'Repositories', path: '/repositories', icon: BookOpen },
    { name: 'Analysis', path: '/analysis', icon: BarChart2 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 text-white transition-colors hover:text-blue-400">
            <Github className="h-8 w-8" />
            <span className="hidden text-xl font-bold tracking-tight sm:block">
              GitVisualizer
            </span>
          </Link>

          <div className="flex space-x-1 sm:space-x-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                               (link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="hidden sm:block">{link.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 -z-10 rounded-md bg-slate-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;