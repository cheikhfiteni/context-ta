import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; // Your main page logic moved to Home.tsx
// import Dashboard from './Dashboard';
// import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;