import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { GithubProvider } from './context/GithubContext';

import Home from './pages/Home'; 

import Repository from './pages/Repository';
import RepositoryItemDetails from './pages/RepositoryItemDetails';
import Analysis from './pages/Analysis';
const NotFound = () => <div className="text-2xl font-bold text-red-500">404 - Not Found</div>;

function App() {
  return (
    <GithubProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repositories" element={<Repository />} />
            <Route path="/repositories/:repoName" element={<RepositoryItemDetails />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </GithubProvider>
  );
}

export default App;