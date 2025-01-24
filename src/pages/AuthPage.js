import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../services/APIService';
import { useAuth } from '../hooks/useAuth';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const isProcessing = useRef(false);

    useEffect(() => {
        const processKakaoLogin = async () => {
            if (isProcessing.current) {
                return;
            }

            const code = new URL(window.location.href).searchParams.get('code');

            if (!code) {
                console.error('No authorization code found');
                navigate('/', { replace: true });
                return;
            }

            isProcessing.current = true;

            try {
                // 1. 카카오 토큰 받기
                const tokenData = await APIService.auth.getKakaoToken(code);
                console.log('Kakao token received:', tokenData);

                const userInfo = await APIService.auth.getKakaoUserInfo(tokenData.access_token);
                console.log('Kakao user info:', userInfo);

                const kakaoUid = `kakao_${userInfo.id}`;
                console.log('Generated kakaoUid:', kakaoUid);

                // 2. 서버에 verify 요청
                const response = await APIService.auth.verify(kakaoUid);
                console.log('Server verify response:', response);

                if (response.exists && response.user) {
                    // 기존 사용자
                    console.log('Existing user found:', response.user);
                    await login(response.user);
                    console.log('Login successful, user state updated');

                    // 상태 업데이트를 위한 짧은 지연
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    console.log('Attempting to navigate to main page...');
                    navigate('/main', { replace: true });
                } else {
                    // 신규 사용자
                    console.log('New user, redirecting to signup');
                    navigate('/signup', {
                        replace: true,
                        state: {
                            uid: kakaoUid,
                            email: userInfo.kakao_account?.email || '',
                        },
                    });
                }
            } catch (error) {
                console.error('Login process error:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                }
                navigate('/', {
                    replace: true,
                    state: {
                        error: '로그인에 실패했습니다. 다시 시도해주세요.',
                    },
                });
            } finally {
                isProcessing.current = false;
            }
        };

        processKakaoLogin();
    }, [login, navigate]);

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
