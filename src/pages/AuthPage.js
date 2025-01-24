import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../services/APIService';
import { useAuth } from '../hooks/useAuth';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const processKakaoLogin = async () => {
            const code = new URL(window.location.href).searchParams.get('code');

            if (code) {
                try {
                    const response = await APIService.auth.verify(code);

                    if (response.exists) {
                        // 기존 사용자
                        login(response.user);
                        navigate('/main');
                    } else {
                        // 신규 사용자는 회원가입 페이지로 이동
                        navigate('/signup', {
                            state: {
                                uid: response.user.uid,
                                email: response.user.email,
                            },
                        });
                    }
                } catch (error) {
                    console.error('Login failed:', error.response?.data || error);
                    const errorMessage = error.response?.data?.error || '로그인에 실패했습니다.';
                    navigate('/', {
                        state: {
                            error: errorMessage,
                        },
                    });
                }
            } else {
                console.error('No authorization code found');
                navigate('/');
            }
        };

        processKakaoLogin();
    }, [navigate, login]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            로그인 처리 중...
        </div>
    );
};

export default AuthPage;
