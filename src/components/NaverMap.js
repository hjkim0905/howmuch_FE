import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const NaverMap = ({ selectedRestaurant }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!selectedRestaurant) return;

        const { naver } = window;
        if (!naver) return;

        const location = new naver.maps.LatLng(selectedRestaurant.location.y, selectedRestaurant.location.x);

        // 지도가 없으면 새로 생성
        if (!mapRef.current) {
            mapRef.current = new naver.maps.Map('map', {
                center: location,
                zoom: 15,
                zoomControl: true,
                zoomControlOptions: {
                    position: naver.maps.Position.TOP_RIGHT,
                },
            });
        } else {
            // 지도가 있으면 중심점만 이동
            mapRef.current.setCenter(location);
        }

        // 기존 마커 제거
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        // 새 마커 생성
        markerRef.current = new naver.maps.Marker({
            position: location,
            map: mapRef.current,
            animation: naver.maps.Animation.DROP,
            icon: {
                content: `
                    <div class="marker">
                        <div class="marker-content">
                            <span style="
                                padding: 8px 16px;
                                background: #ff6b1a;
                                color: white;
                                border-radius: 20px;
                                font-weight: bold;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                                font-size: 14px;
                            ">
                                ${selectedRestaurant.name}
                            </span>
                        </div>
                    </div>
                `,
                anchor: new naver.maps.Point(60, 15),
            },
        });

        // 정보창 생성
        const infoWindow = new naver.maps.InfoWindow({
            content: `
                <div style="
                    padding: 10px;
                    min-width: 200px;
                    text-align: center;
                    border-radius: 8px;
                ">
                    <h3 style="margin: 0 0 5px 0; color: #ff6b1a;">${selectedRestaurant.name}</h3>
                    <p style="margin: 5px 0; color: #666;">리뷰 ${selectedRestaurant.reviewCount}개</p>
                </div>
            `,
            borderWidth: 0,
            backgroundColor: 'white',
            borderRadius: '8px',
            anchorSize: new naver.maps.Size(0, 0),
        });

        // 마커 클릭 시 정보창 토글
        naver.maps.Event.addListener(markerRef.current, 'click', () => {
            if (infoWindow.getMap()) {
                infoWindow.close();
            } else {
                infoWindow.open(mapRef.current, markerRef.current);
            }
        });
    }, [selectedRestaurant]);

    return <MapContainer id="map" />;
};

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
`;

export default NaverMap;
