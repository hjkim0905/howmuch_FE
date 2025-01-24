import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import APIService from '../services/APIService';
import SearchResults from '../components/SearchResults';

// slideUp 애니메이션 정의
const slideUp = keyframes`
    from {
        transform: translateY(30%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const slideDown = keyframes`
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

// float 애니메이션 추가 (상단에 추가)
const float = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
`;

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // 더미 데이터 추가
        const dummyData = [
            {
                id: 1,
                name: '식당 A',
                menus: [
                    { name: '메뉴 A1', price: 10000 },
                    { name: '메뉴 A2', price: 12000 },
                ],
                reviews: ['맛있어요!', '서비스가 좋아요!'],
                reviewCount: 10,
                location: { x: 129.3583895, y: 36.01415 }, // 포항 위치로 수정
            },
            {
                id: 2,
                name: '식당 B',
                menus: [
                    { name: '메뉴 B1', price: 15000 },
                    { name: '메뉴 B2', price: 18000 },
                ],
                reviews: ['괜찮아요.', '재방문 의사 있어요!'],
                reviewCount: 5,
                location: { x: 129.3606895, y: 36.01515 }, // 포항 위치로 수정
            },
            {
                id: 3,
                name: '식당 C',
                menus: [
                    { name: '메뉴 C1', price: 20000 },
                    { name: '메뉴 C2', price: 22000 },
                ],
                reviews: ['별로였어요.', '다시는 안 갈 것 같아요.'],
                reviewCount: 2,
                location: { x: 129.3553895, y: 36.01315 }, // 포항 위치로 수정
            },
        ];
        setBookmarks(dummyData);
        // 첫 번째 요소를 자동으로 선택
        if (dummyData.length > 0) {
            setSelectedRestaurant(dummyData[0]);
        }
    }, []);

    const handleDeleteBookmark = async (restaurant) => {
        try {
            await APIService.bookmarks.delete(restaurant.bookmarkId);
            setBookmarks(bookmarks.filter((b) => b.bookmarkId !== restaurant.bookmarkId));
        } catch (error) {
            console.error('Failed to delete bookmark:', error);
        }
    };

    const bookmarkedRestaurants = bookmarks.map((restaurant) => {
        return {
            id: restaurant.id,
            name: restaurant.name,
            menus: restaurant.menus,
            reviews: restaurant.reviews,
            reviewCount: restaurant.reviewCount,
            location: restaurant.location,
        };
    });

    return (
        <Container>
            <Navbar>
                <Logo onClick={() => navigate('/main')}>얼마냐면???</Logo>
                <NavItems>
                    <UserInfo>
                        <UserIcon>👤</UserIcon>
                        {user?.nickname}
                    </UserInfo>
                </NavItems>
            </Navbar>

            <Content>
                {bookmarks.length > 0 ? (
                    <SearchResults
                        results={bookmarkedRestaurants}
                        selectedRestaurant={selectedRestaurant}
                        onSelectRestaurant={setSelectedRestaurant}
                        onBookmark={handleDeleteBookmark}
                        bookmarks={bookmarks.map((b) => b.id)}
                        isBookmarkPage={true}
                    />
                ) : (
                    <EmptyState>
                        <EmptyIcon>⭐</EmptyIcon>
                        <EmptyText>즐겨찾기한 식당이 없습니다.</EmptyText>
                        <SearchButton onClick={() => navigate('/main')}>식당 검색하러 가기</SearchButton>
                    </EmptyState>
                )}
            </Content>
        </Container>
    );
};

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #ff8c37 0%, #ff6b1a 100%);
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
`;

const Navbar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    animation: ${slideDown} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    transform-origin: top;
`;

const Content = styled.div`
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    padding: 1rem;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    padding: 4rem;
    opacity: 0;
    animation: ${slideUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: 0.2s;
    backdrop-filter: blur(8px);
    max-width: 500px;
    margin: 0 auto;
`;

const EmptyIcon = styled.div`
    font-size: 5rem;
    margin-bottom: 1.5rem;
    animation: ${float} 3s ease-in-out infinite;
    color: #ff6b1a;
    text-shadow: 0 4px 12px rgba(255, 107, 26, 0.3);
`;

const EmptyText = styled.p`
    font-size: 1.4rem;
    margin-bottom: 2.5rem;
    color: #333;
    text-align: center;
    font-weight: 500;
    line-height: 1.5;
`;

const SearchButton = styled.button`
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #ff8c37 0%, #ff6b1a 100%);
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 107, 26, 0.2);
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(255, 107, 26, 0.3);
    }

    &:active {
        transform: translateY(-1px);
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: translateX(-100%);
        transition: transform 0.5s ease;
    }

    &:hover::after {
        transform: translateX(100%);
    }
`;

const Logo = styled.div`
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const NavItems = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
`;

const UserIcon = styled.span`
    font-size: 1.2rem;
`;

export default BookmarksPage;
