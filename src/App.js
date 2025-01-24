import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import BookmarksPage from './pages/BookmarksPage';

function App() {
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path="/" element={<OnboardingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                        path="/main"
                        element={
                            <PrivateRoute>
                                <MainPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/bookmarks"
                        element={
                            <PrivateRoute>
                                <BookmarksPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

export default App;
