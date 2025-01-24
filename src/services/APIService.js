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
                console.log('Using redirect URI:', redirectUri);

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
                console.log('Sending verify request for uid:', kakaoUid);
                const response = await api.post('/auth/verify', JSON.stringify(kakaoUid), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Raw verify response:', response);
                console.log('Verify response data:', response.data);
                return response.data;
            } catch (error) {
                console.error('Verify API error:', error);
                if (error.response) {
                    console.error('Verify error response:', error.response.data);
                    console.error('Verify error status:', error.response.status);
                }
                throw error;
            }
        },

        signup: async (userData) => {
            try {
                console.log('Sending signup request with data:', userData);
                const response = await api.post('/auth/signup', userData);
                console.log('Raw signup response:', response);
                console.log('Signup response data:', response.data);

                return {
                    exists: true,
                    user: response.data,
                };
            } catch (error) {
                console.error('Signup API error:', error);
                if (error.response) {
                    console.error('Signup error response:', error.response.data);
                    console.error('Signup error status:', error.response.status);
                }
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
