
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BuildingPage from './pages/BuildingPage';
import ZonePage from './pages/ZonePage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ClaimBusinessPage from './pages/ClaimBusinessPage';
import CreateBusinessPage from './pages/CreateBusinessPage';
import AdminDashboard from './pages/AdminDashboard';
import BuildingsList from './pages/BuildingsList';
import ZonesList from './pages/ZonesList';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/buildings" element={<BuildingsList />} />
          <Route path="/zones" element={<ZonesList />} />
          <Route path="/building/:slug" element={<BuildingPage />} />
          <Route path="/zone/:slug" element={<ZonePage />} />
          <Route path="/business/:id" element={<BusinessDetailPage />} />
          <Route path="/business/:id/claim" element={<ClaimBusinessPage />} />
          <Route path="/business/new" element={<CreateBusinessPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
