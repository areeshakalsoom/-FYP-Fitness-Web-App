import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import NotificationBell from './components/NotificationBell';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Activities from './pages/Activities';
import Goals from './pages/Goals';
import WorkoutPlans from './pages/WorkoutPlans';
import TrainerDashboard from './pages/TrainerDashboard';
import WorkoutPlanDetails from './pages/WorkoutPlanDetails';
import HealthDashboard from './pages/HealthDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Support from './pages/Support';
import Progress from './pages/Progress';
import ClientProgress from './pages/ClientProgress';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/Register';
import Messages from './pages/Messages';

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const publicPaths = ['/', '/login', '/register'];
  const showSidebar = user && !publicPaths.includes(location.pathname);

  return (
    <div className="App flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-72' : 'ml-0'}`}>
        {showSidebar && (
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-black text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <NotificationBell />
            </div>
          </div>
        )}
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <Activities />
                </PrivateRoute>
              }
            />

            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Goals />
                </PrivateRoute>
              }
            />

            <Route
              path="/workout-plans"
              element={
                <PrivateRoute>
                  <WorkoutPlans />
                </PrivateRoute>
              }
            />

            <Route
              path="/workout-plans/:id"
              element={
                <PrivateRoute>
                  <WorkoutPlanDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/health"
              element={
                <PrivateRoute>
                  <HealthDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />

            <Route
              path="/support"
              element={
                <PrivateRoute>
                  <Support />
                </PrivateRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <Progress />
                </PrivateRoute>
              }
            />

            <Route
              path="/client/:userId"
              element={
                <PrivateRoute>
                  <ClientProgress />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            <Route
              path="/trainer/plans"
              element={
                <PrivateRoute requiredRole="trainer">
                  <TrainerDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/trainer/users"
              element={
                <PrivateRoute requiredRole="trainer">
                  <TrainerDashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/doctor"
              element={
                <PrivateRoute requiredRole="doctor">
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />

            {/* Doctor route removed - merged with dietitian */}

            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                  <p className="text-xl text-gray-600 mb-8">Unauthorized Access</p>
                  <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                    Go back home
                  </a>
                </div>
              </div>
            } />
            
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                  <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                    Go back home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
