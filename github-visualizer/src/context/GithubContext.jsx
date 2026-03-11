import { createContext, useState, useContext } from 'react';

const GithubContext = createContext();

export const GithubProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  return (
    <GithubContext.Provider value={{ username, setUsername }}>
      {children}
    </GithubContext.Provider>
  );
};

export const useGithub = () => {
  return useContext(GithubContext);
};