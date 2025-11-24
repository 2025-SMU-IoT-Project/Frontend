import { CardHorizontal, CardHorizontalContent } from "../../../../components/ui/cardHorizontal";

export const SelectedInfo = ({ binData }) => {

    // binData가 없으면 로딩 또는 선택 안내 메시지
    if (!binData) {
        return (
            <div className="relative w-[356px]">
                <h3 className="[font-family:'Inter',Helvetica] font-semibold text-[#333b69] text-lg tracking-[0] leading-[normal] mb-[23px]">
                    현재 선택한 쓰레기통의 정보
                </h3>
                <p className="[font-family:'Inter',Helvetica] text-gray-400 text-sm">
                    지도에서 쓰레기통을 선택해주세요.
                </p>
            </div>
        );
    }

    // binData를 사용하여 statsCards 생성
    const statsCards = [
        {
            title: "투입 수",
            value: binData.totalCups || "0",
            subValue: null,
            position: "top-0 left-0",
        },
        {
            title: "비정상 물체 투입 건수",
            value: `${binData.abnormalCount || 0}`,
            subValue: `/ ${binData.totalCups}`,
            position: "top-0 left-[200px]", // 180px 카드 + 20px 간격
        },
        {
            title: "쓰레기통 관측, 무게",
            percentage: `${binData.fillRate || 0}%`,
            weight: `${binData.cupWeight || 0}kg`,
            hasGraph: true,
            position: "top-[165px] left-0", // 165px 카드 + 20px 간격
        },
        {
            title: "액체 과적, 무게",
            percentage: `${binData.liquidRate || 0}%`,
            weight: `${binData.liquidWeight || 0}kg`,
            hasGraph: true,
            position: "top-[165px] left-[200px]", // 165px 카드 + 20px 간격, 180px 카드 + 20px 간격
        },
    ];

    return (
        <div className="relative w-[400px] mt-[55px]">{/* h2 높이(25px + line-height) + mb-[20px] + h3 mb-[17px] 고려 */}
            <h3 className="[font-family:'Inter',Helvetica] font-semibold text-[#333b69] text-lg tracking-[0] leading-[normal] mb-[23px]">
                현재 {binData.binName || "쓰레기통"}의 정보
            </h3>

            <div className="relative w-full h-[350px]">
                {statsCards.map((card, index) => {
                    // 각 카드별로 배경색 결정
                    let bgColor = 'bg-[#FFF4B0]/25'; // 기본 배경색

                    if (card.title === "쓰레기통 관측, 무게") {
                        // 컵통 기준
                        if (binData.fillRate >= 80 || binData.cupWeight >= 4) {
                            bgColor = 'bg-[#FFCDC0]'; // 빨강 (위험)
                        } else if (binData.fillRate >= 50 || binData.cupWeight >= 2.5) {
                            bgColor = 'bg-[#FFF4B0]'; // 노랑 (경고)
                        }
                    } else if (card.title === "액체 과적, 무게") {
                        // 물통 기준
                        if (binData.liquidRate >= 80 || binData.liquidWeight >= 4) {
                            bgColor = 'bg-[#FFCDC0]'; // 빨강 (위험)
                        } else if (binData.liquidRate >= 50 || binData.liquidWeight >= 2.5) {
                            bgColor = 'bg-[#FFF4B0]'; // 노랑 (경고)
                        }
                    }

                    return (
                        <CardHorizontal
                            key={index}
                            className={`absolute ${card.position} w-[180px] ${card.hasGraph ? 'h-[180px]' : 'h-[150px]'} ${bgColor} rounded-[20px] border border-solid border-[#d7d7d7] shadow-none`}
                        >
                            <CardHorizontalContent className="p-[20px] flex flex-col">
                                {/* 타이틀 */}
                                <div className="[font-family:'Inter',Helvetica] font-semibold text-[#808080] text-md mb-4">
                                    {card.title}
                                </div>

                                {/* 투입 수 또는 비정상 투입 */}
                                {card.value && (
                                    <div className="[font-family:'Inter',Helvetica]">
                                        {card.subValue ? (
                                            <div className="text-3xl">
                                                <span className="font-bold text-black">
                                                    {card.value}
                                                </span>
                                                <span className="font-semibold text-[#808080] text-xl">
                                                    {card.subValue}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="font-bold text-black text-4xl">
                                                {card.value}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 퍼센트와 무게 (쓰레기통 관측, 액체 과적) */}
                                {card.percentage && (
                                    <div className="flex flex-col gap-1">
                                        <div className="[font-family:'Inter',Helvetica] font-bold text-black text-3xl">
                                            {card.percentage}
                                        </div>
                                        <div className="[font-family:'Inter',Helvetica] text-[#808080] text-base">
                                            {card.weight}
                                        </div>
                                        {card.hasGraph && (
                                            <img
                                                className="w-full mt-2"
                                                alt="Graph"
                                                src="https://c.animaapp.com/mi7s9pt1n6xKon/img/graph-1.png"
                                            />
                                        )}
                                    </div>
                                )}
                            </CardHorizontalContent>
                        </CardHorizontal>
                    );
                })}
            </div>
        </div>
    );
};