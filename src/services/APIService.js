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
            try {
                const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;
                const response = await axios.post(KAKAO_TOKEN_URL, null, {
                    params: {
                        grant_type: 'authorization_code',
                        client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
                        redirect_uri: redirectUri,
                        code: code,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                });

                return response.data;
            } catch (error) {
                console.error('Error getting Kakao token:', error.response?.data || error);
                throw error;
            }
        },

        getKakaoUserInfo: async (accessToken) => {
            const response = await axios.get(KAKAO_USER_INFO_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        },

        verify: async (kakaoUid) => {
            try {
                const response = await api.post('/auth/verify', JSON.stringify(kakaoUid), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return response.data;
            } catch (error) {
                console.error('Verify API error:', error);
                throw error;
            }
        },

        signup: async (userData) => {
            try {
                const response = await api.post('/auth/signup', userData);
                return {
                    exists: true,
                    user: response.data,
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
