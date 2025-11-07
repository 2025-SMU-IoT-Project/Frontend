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
            new kakao.maps.Map(mapRef.current, options);
        }
    }, []);

    return <div ref={mapRef} style={{ width: "822px", height: "615px" }} />;
};

export default Map;