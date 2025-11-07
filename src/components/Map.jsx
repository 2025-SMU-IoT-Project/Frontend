import { useEffect, useRef } from "react";

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        // SDK가 autoload=false이므로 kakao.maps.load로 보장된 시점에 초기화
        const { kakao } = window;
        if (!kakao) return;

        kakao.maps.load(() => {
            const options = {
                center: new kakao.maps.LatLng(37.6027611, 126.9553047),
                level: 3,
            };
            new kakao.maps.Map(mapRef.current, options);
        });
    }, []);

    return <div ref={mapRef} style={{ width: "822px", height: "615px" }} />;
};

export default Map;