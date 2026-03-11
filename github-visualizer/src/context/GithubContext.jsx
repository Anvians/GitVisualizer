import { createContext, useState, useContext } from 'react';

const GithubContext = createContext();

export const GithubProvider = ({ children }) => {
  // We'll default to an empty string, or you could put your own GitHub username here to test!
  const [username, setUsername] = useState('');

  return (
    <GithubContext.Provider value={{ username, setUsername }}>
      {children}
    </GithubContext.Provider>
  );
};

// A custom hook to make using the context super easy in our components
export const useGithub = () => {
  return useContext(GithubContext);
};