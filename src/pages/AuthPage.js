import { useEffect, useRef } from 'react';
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
                const userInfo = await APIService.auth.getKakaoUserInfo(tokenData.access_token);
                const kakaoUid = `kakao_${userInfo.id}`;

                // 2. 서버에 verify 요청
                const response = await APIService.auth.verify(kakaoUid);

                if (response.exists && response.user) {
                    // 기존 사용자
                    await login(response.user);

                    // 상태 업데이트를 위한 짧은 지연
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    navigate('/main', { replace: true });
                } else {
                    // 신규 사용자
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
