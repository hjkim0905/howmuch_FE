import React, { useState, useEffect, useCallback } from 'react';
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

    const fetchBookmarks = useCallback(async () => {
        try {
            const response = await APIService.bookmarks.getAll(user.uid);
            setBookmarks(response);
            if (response.length > 0) {
                setSelectedRestaurant(response[0]);
            }
        } catch (error) {
            console.error('Failed to fetch bookmarks:', error);
            setBookmarks([]);
        }
    }, [user.uid]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const handleDeleteBookmark = async (restaurant) => {
        if (window.confirm('정말로 이 식당을 북마크에서 삭제하시겠습니까?')) {
            try {
                await APIService.bookmarks.delete(restaurant.id);
                setBookmarks((prevBookmarks) => prevBookmarks.filter((b) => b.id !== restaurant.id));
                alert('북마크가 성공적으로 삭제되었습니다.');

                if (selectedRestaurant?.id === restaurant.id) {
                    const remainingBookmarks = bookmarks.filter((b) => b.id !== restaurant.id);
                    if (remainingBookmarks.length > 0) {
                        setSelectedRestaurant(remainingBookmarks[0]);
                    } else {
                        setSelectedRestaurant(null);
                    }
                }
            } catch (error) {
                console.error('Failed to delete bookmark:', error);
                alert('북마크 삭제 중 오류가 발생했습니다.');
            }
        }
    };

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
                {bookmarks && bookmarks.length > 0 ? (
                    <SearchResults
                        results={bookmarks.map((b) => b.restaurant)}
                        selectedRestaurant={selectedRestaurant}
                        onSelectRestaurant={setSelectedRestaurant}
                        onBookmark={handleDeleteBookmark}
                        bookmarks={bookmarks}
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
