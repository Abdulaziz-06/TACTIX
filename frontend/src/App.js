import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeatureDetails from './pages/FeatureDetails';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pillers/:slug" element={<FeatureDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
