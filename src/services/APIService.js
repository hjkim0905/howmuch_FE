import axios from 'axios';

// API Service
const BASE_URL = 'http://44.193.19.114:8080/api';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
    },
});

export const APIService = {
    // Search API
    search: async (keyword) => {
        const response = await api.post('/search', { keyword });
        return response.data;
    },

    // Authentication APIs
    auth: {
        getKakaoToken: async (code) => {
            const response = await axios.post(KAKAO_TOKEN_URL, null, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
                    redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
                    code,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        },

        getKakaoUserInfo: async (accessToken) => {
            const response = await axios.get(KAKAO_USER_INFO_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        },

        verify: async (code) => {
            try {
                // 1. 카카오 토큰 받기
                const tokenData = await APIService.auth.getKakaoToken(code);

                // 2. 카카오 사용자 정보 받기
                const userInfo = await APIService.auth.getKakaoUserInfo(tokenData.access_token);

                // 3. 서버에 사용자 정보 전달하여 검증
                const kakaoUid = `kakao_${userInfo.id}`;
                const response = await api.post('/auth/verify', kakaoUid);

                // 4. 응답이 없거나 형식이 맞지 않으면 에러
                if (!response.data || typeof response.data.exists !== 'boolean') {
                    throw new Error('Invalid server response');
                }

                return response.data; // { exists: boolean, user: { uid, email, nickname } }
            } catch (error) {
                console.error('Verify API error:', error);
                throw error;
            }
        },

        signup: async (userData) => {
            try {
                const response = await api.post('/auth/signup', userData);
                // 회원가입 성공 시 verify와 동일한 형식으로 반환
                return {
                    exists: true,
                    user: response.data, // { uid, email, nickname }
                };
            } catch (error) {
                console.error('Signup API error:', error);
                throw error;
            }
        },
    },

    // Bookmark APIs
    bookmarks: {
        create: async (uid, restaurant) => {
            const response = await api.post('/bookmarks', { uid, restaurant });
            return response.data;
        },

        getUserBookmarks: async (uid) => {
            const response = await api.get(`/bookmarks/user/${uid}`);
            return response.data;
        },

        delete: async (bookmarkId) => {
            await api.delete(`/bookmarks/${bookmarkId}`);
        },
    },
};

export default APIService;
