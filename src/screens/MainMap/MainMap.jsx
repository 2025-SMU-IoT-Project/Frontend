import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Map from "../../components/Map";
import { Button } from "../../components/ui/button.jsx";

export const MainMap = () => {

    // 선택된 마커 상태 저장
    const [selectedBinId, setSelectedBinId] = useState(null);
    // 쓰레기통 정보 모두 저장
    const [binData, setBinData] = useState(null);
    // 대시보드 등으로 redirection
    const navigate = useNavigate();
    // URL에서 role 파라미터 가져오기 (user 또는 worker)
    const { role } = useParams();

    // 서버에 GET 요청(쓰레기통 정보-이름, 무게, 과적율)
    useEffect(() => {
        if (!selectedBinId) return;

        // 새 마커 선택 위해 클릭마다 초기화
        setBinData(null);

        axios.get(`http://localhost:8080/api/bin/detail/${selectedBinId}`)
            .then((response) => {
                // 성공 핸들링
                console.log(response.data);
                setBinData(response.data.result);
                console.log("selectedBinId:", selectedBinId);
                console.log("응답 원본:", response);
            })
            .catch((error) => {
                // 에러 핸들링
                console.log(error);
            })
    }, [selectedBinId]);

    return (
        <div
            className="bg-white w-full min-w-[1440px] min-h-[1024px] flex flex-col"
            data-model-id="9:147"
        >
            <Header />

            <main className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-[83px]">
                    <section className="w-[822px] h-[615px] relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                        <div className="w-full h-full flex">
                            <Map onMarkerSelect={setSelectedBinId} />
                        </div>
                    </section>

                    <section className="w-[400px] h-[615px] bg-[#fff4b0]/25 flex flex-col items-center justify-center px-[55px] py-8 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">

                        {!selectedBinId && (
                            /* 마커 미선택 시*/
                            <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                                지도에서 쓰레기통을 선택해주세요.
                            </h1>
                        )}

                        {/* 디버깅용 (binData 전달 확인)*/}
                        {selectedBinId && !binData && (
                            <p className="[font - family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                                쓰레기통 정보를 불러오는 중...
                            </p>
                        )}

                        {selectedBinId && binData && (
                            /* 마커 선택 시*/
                            <div id="marker-selected" className="flex flex-col items-center justify-center">
                                <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-md text-center tracking-[0.20px] leading-[normal]">
                                    쓰레기통 정보 요약<br /><br />
                                </h1>

                                <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-md text-center tracking-[0.20px] leading-[normal]">
                                    쓰레기통 이름: {binData.binName} <br /><br />

                                    컵통 채워짐 정도: {binData.fillRate}%, {binData.cupWeight}kg <br />
                                    물통 채워짐 정도: {binData.liquidRate}%, {binData.liquidWeight}kg <br /><br />
                                </h1>

                                {/* 컵통 채워짐 정도: 80%, 4kg
                                    물통 채워짐 정도: 80%, 4kg */}

                                {(() => {
                                    const cupFull = binData.fillRate >= 80 || binData.cupWeight >= 4;
                                    const liquidFull = binData.liquidRate >= 80 || binData.liquidWeight >= 4;

                                    // role에 따라 다른 메시지 표시
                                    const isWorker = role === 'worker';

                                    if (cupFull && liquidFull) {
                                        return (
                                            <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                                                쓰레기통(컵통 및 물통)이 거의 다 찼습니다! <br />
                                                {isWorker ? '쓰레기통을 비워주세요.' : '다른 쓰레기통을 이용해주세요.'}
                                                <br />
                                                <br />
                                                <br />
                                            </h1>
                                        );
                                    } else if (cupFull) {
                                        return (
                                            <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                                                컵통이 거의 다 찼습니다! <br />
                                                {isWorker ? '컵통을 비워주세요.' : '다른 컵통을 이용해주세요.'}
                                                <br />
                                                <br />
                                                <br />
                                            </h1>
                                        );
                                    } else if (liquidFull) {
                                        return (
                                            <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                                                물통이 거의 다 찼습니다! <br />
                                                {isWorker ? '물통을 비워주세요.' : '다른 물통을 이용해주세요.'}
                                                <br />
                                                <br />
                                                <br />
                                            </h1>
                                        );
                                    } else {
                                        return null;
                                    }
                                })()}

                                <Button
                                    // onClick={() => navigate(`/dashboard`)}
                                    className="w-[200px] h-[50px] bg-[linear-gradient(0deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.45)_100%),linear-gradient(0deg,rgba(217,217,217,1)_0%,rgba(217,217,217,1)_100%)] hover:bg-[linear-gradient(0deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.6)_100%),linear-gradient(0deg,rgba(217,217,217,1)_0%,rgba(217,217,217,1)_100%)] [font-family:'Inter',Helvetica] font-bold text-white text-sm text-center tracking-[0.20px] leading-[normal] transition-colors"
                                >
                                    대시보드로 더 자세히 확인
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};