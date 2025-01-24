// API Service
const BASE_URL = 'http://44.193.19.114:8080/api';

export const APIService = {
    // Search API
    search: async (keyword) => {
        const response = await fetch(`${BASE_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
            },
            body: JSON.stringify({ keyword }),
        });
        return response.json();
    },

    // Authentication APIs
    auth: {
        signup: async (userData) => {
            const response = await fetch(`${BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: '*/*',
                },
                body: JSON.stringify(userData),
            });
            return response.json();
        },

        verify: async (uid) => {
            const response = await fetch(`${BASE_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: '*/*',
                },
                body: JSON.stringify(uid),
            });
            return response.json();
        },
    },

    // Bookmark APIs
    bookmarks: {
        create: async (uid, restaurant) => {
            const response = await fetch(`${BASE_URL}/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: '*/*',
                },
                body: JSON.stringify({ uid, restaurant }),
            });
            return response.json();
        },

        getUserBookmarks: async (uid) => {
            const response = await fetch(`${BASE_URL}/bookmarks/user/${uid}`, {
                method: 'GET',
                headers: {
                    accept: '*/*',
                },
            });
            return response.json();
        },

        delete: async (bookmarkId) => {
            await fetch(`${BASE_URL}/bookmarks/${bookmarkId}`, {
                method: 'DELETE',
                headers: {
                    accept: '*/*',
                },
            });
        },
    },
};

export default APIService;
