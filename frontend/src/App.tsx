import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Generator from './pages/Generator';
import Templates from './pages/Templates';
import DataModeling from './pages/DataModeling';
import Dashboard from './pages/Dashboard';

// Pages (to be implemented)
// import MLGenerator from './pages/MLGenerator';
// import GeneratedFiles from './pages/GeneratedFiles';
import MLGenerator from './pages/MLGenerator';
import AIGenerator from './pages/AIGenerator';
import Settings from './pages/Settings';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground">
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/modeling" element={<DataModeling />} />
          <Route path="/ml-generator" element={<MLGenerator />} />
          <Route path="/ai-generator" element={<AIGenerator />} />
          <Route path="/files" element={<Placeholder title="Generated Files" />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
