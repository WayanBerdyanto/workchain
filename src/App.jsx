import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/Index.jsx';
import LoginPage from './pages/Login/Index.jsx';
import UserDashboard from './pages/User/Dashboard.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import ProjectsPage from './pages/Projects/Index.jsx';
import ProjectDetail from './pages/ProjectDetail/Index.jsx';
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;