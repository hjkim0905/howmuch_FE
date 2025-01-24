import axios from 'axios';

// API Service
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
    },
});

const APIService = {
    search: {
        searchRestaurants: async (keyword) => {
            try {
                const response = await api.post('/search', { keyword });
                return response.data;
            } catch (error) {
                console.error('Error searching restaurants:', error);
                throw error;
            }
        },
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
                console.log('Starting verification with code:', code);

                // 1. 카카오 토큰 받기
                const tokenData = await APIService.auth.getKakaoToken(code);
                console.log('Received Kakao token:', tokenData);

                // 2. 카카오 사용자 정보 받기
                const userInfo = await APIService.auth.getKakaoUserInfo(tokenData.access_token);
                console.log('Received Kakao user info:', userInfo);

                // 3. 서버에 사용자 정보 전달하여 검증
                const kakaoUid = `kakao_${userInfo.id}`;
                console.log('Sending verification request with kakaoUid:', kakaoUid);

                // 데이터를 객체로 감싸서 전송
                const response = await api.post('/auth/verify', { uid: kakaoUid });
                console.log('Server verification response:', response.data);

                if (!response.data || typeof response.data.exists !== 'boolean') {
                    throw new Error('Invalid server response');
                }

                return response.data;
            } catch (error) {
                console.error('Verify API error:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                }
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
        getAll: async (uid) => {
            try {
                const response = await api.get(`/bookmarks/user/${uid}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
                return []; // 에러 시 빈 배열 반환
            }
        },

        add: async (userId, restaurant) => {
            try {
                const response = await api.post('/bookmarks', {
                    uid: userId,
                    restaurant: restaurant,
                });
                return response.data;
            } catch (error) {
                console.error('Error adding bookmark:', error);
                throw error;
            }
        },

        delete: async (bookmarkId) => {
            try {
                await api.delete(`/bookmarks/${bookmarkId}`);
            } catch (error) {
                console.error('Error deleting bookmark:', error);
                throw error;
            }
        },
    },
};

export default APIService;
