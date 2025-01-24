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

            // 기존 마커 제거
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }

            // 새 마커 생성
            markerRef.current = new window.naver.maps.Marker({
                position,
                map: mapRef.current,
                icon: {
                    content: `
                        <div style="
                            padding: 10px;
                            background: #ff6b1a;
                            color: white;
                            border-radius: 20px;
                            font-weight: bold;
                            font-size: 14px;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            transform: translate(-50%, -100%);
                            margin-top: -15px;
                        ">
                            ${selectedRestaurant.name}
                        </div>
                    `,
                    anchor: new window.naver.maps.Point(0, 0),
                },
                animation: window.naver.maps.Animation.DROP,
            });

            // 지도 중심 이동
            mapRef.current.setCenter(position);
            mapRef.current.setZoom(17); // 100m 반경을 보여주는 줌 레벨 유지
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
