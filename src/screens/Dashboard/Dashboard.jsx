import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import Header from "../../components/Header";
import Map from "../../components/Map";
import { TotalStatistics } from "./sections/TotalStatistics/TotalStatistics";

export const Dashboard = () => {
    // 선택된 마커 상태 저장
    const [selectedBinId, setSelectedBinId] = useState(null);
    // 선택된 쓰레기통의 정보 저장
    const [binData, setBinData] = useState(null);
    // 대시보드 등으로 redirection
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/bin/detail/${selectedBinId}`)
            .then((response) => {
                console.log(response.data);
                setBinData(response.data.result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [selectedBinId])

    return (
        <div
            className="bg-white w-full min-w-[1440px] min-h-[1024px] flex flex-col"
            data-model-id="9:147"
        >
            <Header />

            <main className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-[83px]">
                    {/* 전체 쓰레기통 통계 */}
                    <TotalStatistics />

                    {/* 선택한 쓰레기통의 대시보드 */}
                    <section className="relative w-full px-36 mt-8">
                        <h2 className="[font-family:'Inter',Helvetica] font-semibold text-[#333b69] text-[25px] tracking-[0] leading-[normal] mb-[53px]">
                            선택한 쓰레기통의 대시보드
                        </h2>

                        <div className="flex gap-[52px]">
                            <div className="relative w-[750px]">
                                <h3 className="[font-family:'Inter',Helvetica] font-semibold text-[#333b69] text-lg tracking-[0] leading-[normal] mb-[17px]">
                                    {binData.binName} 통계
                                </h3>
                            </div>
                        </div>
                    </section>

                    {/* 지도 */}
                    <section className="w-[600px] h-[500px] relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                        <div className="w-full h-full flex">
                            <Map onMarkerSelect={setSelectedBinId} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};