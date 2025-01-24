import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import NaverMap from './NaverMap';

const SearchResults = ({
    results,
    selectedRestaurant,
    onSelectRestaurant,
    onBookmark,
    bookmarks,
    isBookmarkPage = false,
}) => {
    const [toast, setToast] = useState({ show: false, message: '' });

    // 가격순으로 정렬
    const sortedResults = [...results].sort((a, b) => {
        const minPriceA = Math.min(...a.menus.map((menu) => menu.price));
        const minPriceB = Math.min(...b.menus.map((menu) => menu.price));
        return minPriceA - minPriceB;
    });

    const handleBookmark = async (restaurant) => {
        const isBookmarked = bookmarks.includes(restaurant.id);
        await onBookmark(restaurant);

        // 토스트 메시지 표시
        setToast({
            show: true,
            message: isBookmarked ? '즐겨찾기가 해제되었습니다.' : '즐겨찾기에 추가되었습니다.',
        });

        // 3초 후 토스트 메시지 숨기기
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    return (
        <Container>
            {toast.show && <ToastMessage>{toast.message}</ToastMessage>}
            <RestaurantList>
                {sortedResults.map((restaurant, index) => (
                    <RestaurantItem key={index} selected={selectedRestaurant?.name === restaurant.name} index={index}>
                        <RestaurantInfo>
                            <Header>
                                <RestaurantName>{restaurant.name}</RestaurantName>
                                <BookmarkButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBookmark(restaurant);
                                    }}
                                    $isBookmarked={isBookmarkPage || bookmarks.includes(restaurant.id)}
                                >
                                    {isBookmarkPage ? '🗑️' : bookmarks.includes(restaurant.id) ? '★' : '☆'}
                                </BookmarkButton>
                            </Header>
                            <MenuList>
                                {restaurant.menus.map((menu, idx) => (
                                    <MenuItem key={idx}>
                                        <MenuName>{menu.name}</MenuName>
                                        <MenuPrice>{menu.price.toLocaleString()}원</MenuPrice>
                                    </MenuItem>
                                ))}
                            </MenuList>
                            <ReviewTags>
                                {restaurant.reviews.slice(0, 3).map((review, idx) => (
                                    <ReviewTag key={idx}>
                                        {review.length > 30 ? review.slice(0, 30) + '...' : review}
                                    </ReviewTag>
                                ))}
                            </ReviewTags>
                            <Footer>
                                <ReviewCount>리뷰 {restaurant.reviewCount}개</ReviewCount>
                                <MapViewButton onClick={() => onSelectRestaurant(restaurant)}>
                                    <MapIcon>📍</MapIcon>
                                    지도에서 위치 보기
                                </MapViewButton>
                            </Footer>
                        </RestaurantInfo>
                    </RestaurantItem>
                ))}
            </RestaurantList>
            <MapContainer>
                <NaverMap selectedRestaurant={selectedRestaurant} />
            </MapContainer>
        </Container>
    );
};

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

const Container = styled.div`
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    display: flex;
    gap: 1rem;
    padding: 1rem;
    animation: ${slideUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
`;

const RestaurantList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 1rem;
    height: 100%;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 107, 26, 0.3);
        border-radius: 4px;

        &:hover {
            background: rgba(255, 107, 26, 0.5);
        }
    }
`;

const RestaurantItem = styled.div`
    margin-bottom: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    opacity: 0;
    animation: ${slideUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: ${(props) => props.index * 0.1}s;

    ${(props) =>
        props.selected &&
        `
        transform: translateX(10px);
        background: #fff3e0;
        border-left: 4px solid #ff6b1a;
    `}

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const RestaurantInfo = styled.div`
    margin-bottom: 10px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const RestaurantName = styled.h3`
    font-size: 1.2rem;
    color: #333;
    margin: 0;
`;

const MenuList = styled.div`
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f8f8;
    border-radius: 8px;
`;

const MenuItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
`;

const MenuName = styled.span`
    color: #444;
`;

const MenuPrice = styled.span`
    color: #ff6b1a;
    font-weight: bold;
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
`;

const ReviewCount = styled.span`
    color: #666;
    font-size: 0.9rem;
`;

const BookmarkButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${(props) => (props.$isBookmarked ? '#ff6b1a' : '#ddd')};
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.2);
        color: ${(props) => (props.$isBookmarked ? '#ff8c37' : '#ff6b1a')};
    }
`;

const MapContainer = styled.div`
    flex: 1.2;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    height: 100%;
`;

const MapPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
`;

const ReviewTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
`;

const ReviewTag = styled.div`
    background: #f0f0f0;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #666;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.2s ease;

    &:hover {
        background: #e0e0e0;
        transform: translateY(-2px);
    }
`;

const MapViewButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #ff6b1a;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 107, 26, 0.1);
    }
`;

const MapIcon = styled.span`
    font-size: 1.1rem;
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translate(-50%, -100%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
`;

const ToastMessage = styled.div`
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem 2rem;
    border-radius: 30px;
    font-size: 0.9rem;
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease-out;
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

export default SearchResults;
