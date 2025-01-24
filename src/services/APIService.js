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

const dummyRestaurants = [
    {
        id: 1,
        name: '맛있는 치킨',
        menus: [
            { name: '후라이드 치킨', price: 16000 },
            { name: '양념 치킨', price: 17000 },
            { name: '간장 치킨', price: 17000 },
            { name: '마늘 치킨', price: 18000 },
        ],
        location: { x: 129.3583895, y: 36.01415 },
        reviewCount: 253,
        reviews: [
            '치킨이 바삭바삭하고 정말 맛있어요! 특히 마늘치킨이 대박',
            '양이 많고 배달도 빨라요. 단골집으로 정했습니다.',
            '가성비 최고! 콜라도 서비스로 주셔서 감동이에요',
        ],
    },
    {
        id: 2,
        name: '프리미엄 치킨',
        menus: [
            { name: '후라이드 치킨', price: 18000 },
            { name: '양념 치킨', price: 19000 },
            { name: '스노윙 치킨', price: 19000 },
        ],
        location: { x: 129.3606895, y: 36.01515 },
        reviewCount: 421,
        reviews: [
            '치킨 크기가 엄청 크고 맛있어요!',
            '가격은 조금 있지만 그만한 가치가 있습니다.',
            '스노윙 치킨은 꼭 드셔보세요. 진짜 맛있어요',
        ],
    },
    {
        id: 3,
        name: '할매치킨',
        menus: [
            { name: '후라이드 치킨', price: 15000 },
            { name: '양념 치킨', price: 16000 },
            { name: '반반 치킨', price: 16000 },
        ],
        location: { x: 129.3553895, y: 36.01315 },
        reviewCount: 752,
        reviews: [
            '옛날 치킨 맛이 나서 너무 좋아요',
            '양념치킨 소스가 일품입니다. 다음에 또 시켜먹을게요!',
            '할매치킨 단골입니다. 언제나 변함없는 맛',
        ],
    },
    {
        id: 4,
        name: '신메뉴 치킨',
        menus: [
            { name: '후라이드 치킨', price: 17000 },
            { name: '허니 치킨', price: 19000 },
            { name: '블랙페퍼 치킨', price: 19000 },
        ],
        location: { x: 129.3593895, y: 36.01615 },
        reviewCount: 128,
        reviews: [
            '블랙페퍼 치킨이 진짜 맛있어요! 강추',
            '허니치킨도 달달하니 맛있네요',
            '새로 생긴 가게인데 맛있어서 자주 시켜먹어요',
        ],
    },
    {
        id: 5,
        name: '24시 치킨',
        menus: [
            { name: '후라이드 치킨', price: 16000 },
            { name: '양념 치킨', price: 17000 },
            { name: '치즈 치킨', price: 19000 },
        ],
        location: { x: 129.3573895, y: 36.01715 },
        reviewCount: 342,
        reviews: [
            '밤늦게도 배달해주셔서 너무 좋아요',
            '치즈치킨 완전 맛있습니다! 치즈 듬뿍',
            '24시간 영업하는데 맛까지 좋아요',
        ],
    },
];

const APIService = {
    // Search API
    search: async (keyword) => {
        // API 호출 대신 더미 데이터 반환
        await new Promise((resolve) => setTimeout(resolve, 1500)); // 로딩 테스트를 위한 지연
        return dummyRestaurants;
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
            return {
                id: Date.now(), // 임시 ID 생성
                uid,
                restaurant,
                createdAt: new Date().toISOString(),
            };
        },

        getUserBookmarks: async (uid) => {
            return []; // 빈 배열 반환
        },

        delete: async (id) => {
            return true;
        },
    },
};

export default APIService;
