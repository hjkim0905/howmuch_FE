import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import APIService from '../services/APIService';
import SearchResults from '../components/SearchResults';
import LoadingSpinner from '../components/LoadingSpinner';

const MainPage = () => {
    const [keyword, setKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            setIsSearching(true);
            try {
                const results = await APIService.search.searchRestaurants(keyword);
                setSearchResults(results);
                if (results.length > 0) {
                    setSelectedRestaurant(results[0]);
                }
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await APIService.bookmarks.getAll(user.uid);
            setBookmarks(response);
        } catch (error) {
            console.error('Failed to fetch bookmarks:', error);
            setBookmarks([]);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, [user.uid]);

    const handleBookmark = async (restaurant) => {
        try {
            const existingBookmark = bookmarks.find((b) => b.restaurant?.name === restaurant.name);
            console.log('Current bookmarks:', bookmarks);
            console.log('Existing bookmark:', existingBookmark);
            console.log('Restaurant to bookmark:', restaurant);

            if (existingBookmark) {
                console.log('Deleting bookmark with ID:', existingBookmark.id);
                await APIService.bookmarks.delete(existingBookmark.id);
                setBookmarks((prevBookmarks) => prevBookmarks.filter((b) => b.id !== existingBookmark.id));
                console.log('Bookmark deleted');
                return false;
            } else {
                console.log('Adding new bookmark');
                const response = await APIService.bookmarks.add(user.uid, {
                    id: null,
                    name: restaurant.name,
                    menus: restaurant.menus,
                    location: restaurant.location,
                    reviewCount: restaurant.reviewCount,
                    reviews: restaurant.reviews,
                });
                console.log('Bookmark added:', response);
                setBookmarks((prevBookmarks) => [...prevBookmarks, response]);
                return true;
            }
        } catch (error) {
            console.error('Bookmark operation failed:', error);
            return null;
        }
    };

    const resetSearch = () => {
        setSearchResults([]);
        setSelectedRestaurant(null);
        setKeyword('');
    };

    return (
        <Container>
            {isSearching && <LoadingSpinner />}
            <Navbar>
                <Logo onClick={resetSearch}>얼마냐면???</Logo>
                <NavItems>
                    <NavItem onClick={() => navigate('/bookmarks')}>
                        <BookmarkIcon>⭐</BookmarkIcon>
                        즐겨찾기
                    </NavItem>
                    <UserInfo>
                        <UserIcon>👤</UserIcon>
                        {user?.nickname}
                        <LogoutButton onClick={logout}>로그아웃</LogoutButton>
                    </UserInfo>
                </NavItems>
            </Navbar>

            <SearchContainer show={!searchResults.length}>
                <WelcomeText show={!searchResults.length}>
                    <span>맛있는 식사,</span>
                    <span>합리적인 가격으로</span>
                </WelcomeText>
                <SearchForm onSubmit={handleSearch}>
                    <SearchInput
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="메뉴를 검색해보세요"
                    />
                    <SearchButton type="submit">검색</SearchButton>
                </SearchForm>
            </SearchContainer>

            {searchResults.length > 0 && (
                <SearchResults
                    results={searchResults}
                    selectedRestaurant={selectedRestaurant}
                    onSelectRestaurant={setSelectedRestaurant}
                    onBookmark={handleBookmark}
                    bookmarks={bookmarks.map((b) => b.restaurant?.id)}
                    isBookmarkPage={false}
                />
            )}

            <FloatingFoodContainer show={!searchResults.length}>
                <FloatingFood emoji="🍕" delay="0s" top="20%" left="10%" />
                <FloatingFood emoji="🍜" delay="1s" top="15%" right="15%" />
                <FloatingFood emoji="🍣" delay="2s" bottom="20%" left="15%" />
                <FloatingFood emoji="🍔" delay="1.5s" bottom="25%" right="10%" />
            </FloatingFoodContainer>
        </Container>
    );
};

const fadeIn = keyframes`
    from { 
        opacity: 0;
        transform: translate(-50%, -40%);
    }
    to { 
        opacity: 1;
        transform: translate(-50%, -50%);
    }
`;

const float = keyframes`
    0% { transform: translate(0, 0); }
    50% { transform: translate(10px, -10px); }
    100% { transform: translate(0, 0); }
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

const NavItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
    }
`;

const BookmarkIcon = styled.span`
    font-size: 1.2rem;
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

const LogoutButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

const SearchContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 600px;
    padding: 0 2rem;
    opacity: ${(props) => (props.show ? 1 : 0)};
    visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
    transition: all 0.5s ease-out;
    z-index: ${(props) => (props.show ? 10 : -1)};
`;

const WelcomeText = styled.h1`
    color: white;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    opacity: ${(props) => (props.show ? 1 : 0)};
    transition: opacity 0.3s ease-out;

    span {
        display: block;
        line-height: 1.4;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const SearchForm = styled.form`
    display: flex;
    gap: 1rem;
    width: 100%;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 1.2rem;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
`;

const SearchButton = styled.button`
    padding: 0 2rem;
    border: none;
    border-radius: 12px;
    background: white;
    color: #ff6b1a;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
`;

const FloatingFoodContainer = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    opacity: ${(props) => (props.show ? 1 : 0)};
    transition: opacity 0.3s ease-out;
`;

const FloatingFood = styled.div`
    position: absolute;
    font-size: 2.5rem;
    animation: ${float} 3s ease-in-out infinite;
    animation-delay: ${(props) => props.delay};
    top: ${(props) => props.top};
    left: ${(props) => props.left};
    right: ${(props) => props.right};
    bottom: ${(props) => props.bottom};
`;

export default MainPage;
