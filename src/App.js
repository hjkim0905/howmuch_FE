import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import SignupPage from './pages/SignupPage';
import BookmarksPage from './pages/BookmarksPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <RecoilRoot>
            {/* used to set the base URL for the deployment */}
            <Router basename="/eax9952">
                <Routes>
                    <Route path="/" element={<OnboardingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                        path="/main"
                        element={
                            <ProtectedRoute>
                                <MainPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bookmarks"
                        element={
                            <ProtectedRoute>
                                <BookmarksPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

export default App;
