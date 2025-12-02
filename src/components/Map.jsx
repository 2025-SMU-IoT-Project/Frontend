import { useEffect, useRef } from "react";
import blackMarkerImg from "../../public/markers/marker-black.png";
import redMarkerImg from "../../public/markers/marker-red.png";


const Map = ({ onMarkerSelect }) => {
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
            const DEFAULT_MARKER_URL = blackMarkerImg;
            const CLICK_MARKER_URL = redMarkerImg;

            // 쓰레기통 위치
            var bins = [  // 마커의 위치 
                {
                    binId: 1,
                    position: new kakao.maps.LatLng(37.6015699, 126.9544615), // 공학관 1층 정문
                },
                {
                    binId: 2,
                    position: new kakao.maps.LatLng(37.6028767, 126.9550561), // 미백관 앞
                },
                {
                    binId: 3,
                    position: new kakao.maps.LatLng(37.6021582, 126.9552101) // 학정관
                }
            ],
                selectedMarker = null; // 클릭한 마커를 담을 변수


            // 쓰레기통 위치마다 마커 추가(표시)
            for (var i = 0, len = bins.length; i < len; i++) {
                addMarker(bins[i].position, bins[i].binId);
            }

            // 마커를 생성 및 지도에 표시 & 마커에 mouseover, mouseout, click 이벤트 등록
            function addMarker(position, binId) {
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
                marker.binId = binId;

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
                    // 이미지 변경
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

                    // 부모 컴포넌트(MainMap)으로 콜백
                    if (onMarkerSelect) {
                        onMarkerSelect(marker.binId);
                    }
                });

            }
        }
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default Map;