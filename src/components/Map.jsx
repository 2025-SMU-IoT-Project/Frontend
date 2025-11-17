import { useEffect, useRef } from "react";

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

        // 이미 SDK가 로드되어 있으면 바로 실행
        if (window.kakao && window.kakao.maps) {
            initMap();
            return;
        }

        // SDK가 없으면 동적 로드
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(initMap);
        };
        document.head.appendChild(script);


        function initMap() {
            const { kakao } = window;
            const options = {
                center: new kakao.maps.LatLng(37.6027611, 126.9553047),
                level: 3,
            };

            const map = new kakao.maps.Map(mapRef.current, options);

            // 지도 내 Pin 생성 및 동작

            // 마커 사이즈 설정
            var MARKER_WIDTH = 33, // 기본, 클릭 마커의 너비
                MARKER_HEIGHT = 33, // 기본, 클릭 마커의 높이
                OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
                OFFSET_Y = MARKER_HEIGHT; // 기본, 클릭 마커의 기준 Y좌표

            // 기본 검정 마커 사이즈 설정
            var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
                markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y);

            // 호버용 검정 마커 사이즈 설정
            var hoverSize = new kakao.maps.Size(40, 40), 
                hoverOffset = new kakao.maps.Point(14, 40);

            // 마커 URL
            const DEFAULT_MARKER_URL = "markers/marker-black.png";
            const CLICK_MARKER_URL = "markers/marker-red.png";

            // 쓰레기통 위치
            var positions = [  // 마커의 위치 
                new kakao.maps.LatLng(37.6018240, 126.9547290), // 사슴상 앞
                new kakao.maps.LatLng(37.6013625, 126.9555766), // 메가커피 앞
                new kakao.maps.LatLng(37.6027596, 126.95485927) // 미래백년관 계단 앞
            ],
                selectedMarker = null; // 클릭한 마커를 담을 변수


            // 쓰레기통 위치마다 마커 추가(표시)
            for (var i = 0, len = positions.length; i < len; i++) {
                addMarker(positions[i]);
            }

            // 마커를 생성 및 지도에 표시 & 마커에 mouseover, mouseout, click 이벤트 등록
            function addMarker(position) {
                // 기본 마커 이미지
                const defaultImage = new kakao.maps.MarkerImage(
                    DEFAULT_MARKER_URL,
                    markerSize, // 마커의 크기 
                    { offset: markerOffset }
                );

                // 호버 마커 이미지
                const hoverImage = new kakao.maps.MarkerImage(
                    DEFAULT_MARKER_URL,
                    hoverSize, // 마커의 크기 
                    { offset: hoverOffset }
                );

                // 클릭 마커 이미지
                const clickImage = new kakao.maps.MarkerImage(
                    CLICK_MARKER_URL,
                    hoverSize, // 마커의 크기 
                    { offset: markerOffset }
                );

                // 마커 생성, 기본 마커 이미지
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: position,
                    image: defaultImage
                });

                // 마커 객체에 마커 기본 이미지 추가
                marker.normalImage = defaultImage;

                // 마커 이벤트
                // mouseover 이벤트
                kakao.maps.event.addListener(marker, 'mouseover', function () {

                    // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
                    // 마커의 이미지를 호버 이미지로 변경
                    if (!selectedMarker || selectedMarker !== marker) {
                        marker.setImage(hoverImage);
                    }
                });

                // mouseout 이벤트
                kakao.maps.event.addListener(marker, 'mouseout', function () {

                    // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
                    // 마커의 이미지를 기본 이미지로 변경
                    if (!selectedMarker || selectedMarker !== marker) {
                        marker.setImage(defaultImage);
                    }
                });

                // click 이벤트
                kakao.maps.event.addListener(marker, 'click', function () {

                    // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
                    // 마커의 이미지를 클릭 이미지로 변경
                    if (!selectedMarker || selectedMarker !== marker) {

                        // 클릭된 마커 객체가 null이 아니면
                        // 클릭된 마커의 이미지를 기본 이미지로 변경
                        !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

                        // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경
                        marker.setImage(clickImage);
                    }

                    // 클릭된 마커를 현재 클릭된 마커 객체로 설정
                    selectedMarker = marker;
                });
                
            }
        }
    }, []);

    return <div ref={mapRef} style={{ width: "822px", height: "615px" }} />;
};

export default Map;