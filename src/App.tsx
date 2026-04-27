import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Speaking from './pages/Speaking';
import Resume from './pages/Resume';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import EditProfile from './pages/admin/EditProfile';
import ManageSpeaking from './pages/admin/ManageSpeaking';
import ManageProfessional from './pages/admin/ManageProfessional';
import ManageCertifications from './pages/admin/ManageCertifications';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/speaking"
              element={
                <ProtectedRoute>
                  <ManageSpeaking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/professional"
              element={
                <ProtectedRoute>
                  <ManageProfessional />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certifications"
              element={
                <ProtectedRoute>
                  <ManageCertifications />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
