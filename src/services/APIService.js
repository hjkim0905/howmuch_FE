import axios from 'axios';

// API Service
const BASE_URL = 'http://44.193.19.114:8080/api';

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
        signup: async (userData) => {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        },

        verify: async (uid) => {
            const response = await api.post('/auth/verify', uid);
            return response.data;
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
