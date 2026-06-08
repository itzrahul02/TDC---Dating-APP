import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import api from './api/axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientDetail from './pages/ClientDetail';
import Matches from './pages/Matches';

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        await api.get('/api/auth/me');
        if (mounted) setStatus('ok');
      } catch (error) {
        if (mounted) setStatus('unauthorized');
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'checking') {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Checking session...</div>;
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/client/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
        <Route path="/client/:id/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
