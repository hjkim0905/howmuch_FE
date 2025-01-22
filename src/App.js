import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';

function App() {
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path="/" element={<OnboardingPage />} />
                    <Route path="/main" element={<MainPage />} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

export default App;
