import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const NaverMap = ({ selectedRestaurant }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!window.naver) return;

        // 지도 초기화
        if (!mapRef.current) {
            mapRef.current = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(36.01415, 129.3583895), // 포항 중심
                zoom: 17,
            });
        }

        // 선택된 식당이 있고 위치 정보가 있을 때만 마커 표시 및 지도 이동
        if (selectedRestaurant?.location?.y && selectedRestaurant?.location?.x) {
            const position = new window.naver.maps.LatLng(selectedRestaurant.location.y, selectedRestaurant.location.x);

            // 기존 마커 제거 (페이드 아웃 효과 추가)
            if (markerRef.current) {
                const oldMarker = markerRef.current;
                const oldIcon = oldMarker.getIcon();
                if (typeof oldIcon === 'object' && oldIcon.content) {
                    const div = document.createElement('div');
                    div.innerHTML = oldIcon.content;
                    const markerElement = div.firstChild;
                    markerElement.style.transition = 'all 0.3s ease-out';
                    markerElement.style.opacity = '0';
                    markerElement.style.transform = 'translate(-50%, -150%) scale(0.8)';
                    oldIcon.content = div.innerHTML;
                    oldMarker.setIcon(oldIcon);
                    setTimeout(() => {
                        oldMarker.setMap(null);
                    }, 300);
                } else {
                    oldMarker.setMap(null);
                }
            }

            // 새 마커 생성 (페이드 인 및 바운스 효과 추가)
            const markerContent = `
                <div style="
                    padding: 10px;
                    background: #ff6b1a;
                    color: white;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    transform: translate(-50%, -150%) scale(0.8);
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                ">
                    ${selectedRestaurant.name}
                </div>
            `;

            markerRef.current = new window.naver.maps.Marker({
                position,
                map: mapRef.current,
                icon: {
                    content: markerContent,
                    anchor: new window.naver.maps.Point(0, 0),
                },
                animation: null, // 기본 애니메이션 제거
            });

            // 마커 애니메이션 적용
            setTimeout(() => {
                const icon = markerRef.current.getIcon();
                const div = document.createElement('div');
                div.innerHTML = icon.content;
                const markerElement = div.firstChild;
                markerElement.style.opacity = '1';
                markerElement.style.transform = 'translate(-50%, -100%) scale(1)';
                icon.content = div.innerHTML;
                markerRef.current.setIcon(icon);
            }, 100);

            // 지도 중심 이동 (부드러운 이동 효과)
            mapRef.current.panTo(position, {
                duration: 500,
                easing: 'easeOutCubic',
            });
            setTimeout(() => {
                mapRef.current.setZoom(17); // 100m 반경을 보여주는 줌 레벨 유지
            }, 500);
        }
    }, [selectedRestaurant]);

    return <MapContainer id="map" />;
};

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 12px;
`;

export default NaverMap;
