import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardHorizontal, CardHorizontalContent } from "../../../../components/ui/cardHorizontal";
import recycleBinImg from "../../../../../public/dashboardImgs/recycle-bin.png";
import warningImg from "../../../../../public/dashboardImgs/warning.png";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";
import axios from "axios";

// 현재 날짜를 'YYYY-MM-DD' 형식으로 반환
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 현재 월을 'YYYY-MM' 형식으로 반환
const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

export const TotalStatistics = () => {
    const navigate = useNavigate();
    // 기간 선택 상태 (daily, monthly) (기본 daily)
    const [selectedPeriod, setSelectedPeriod] = useState("daily");
    // 오늘/해당 월 선택 상태 (기본 오늘)
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    // 쓰레기통 정보 모두 저장
    const [totalData, setTotalData] = useState(null);
    // 각 카드별 hover 상태 관리 (4개의 카드)
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    // 기간이 변경될 때 자동으로 날짜 설정
    useEffect(() => {
        if (selectedPeriod === "daily") {
            setSelectedDate(getTodayDate());
        } else if (selectedPeriod === "monthly") {
            setSelectedDate(getCurrentMonth());
        }
    }, [selectedPeriod]);

    // API 호출 - 기간과 날짜가 변경될 때마다 재호출
    useEffect(() => {
        const params = new URLSearchParams();
        params.append("period", selectedPeriod);

        axios.get(`http://localhost:8080/api/bin/stats?${params.toString()}`)
            .then((response) => {
                console.log(response.data);
                setTotalData(response.data.result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [selectedPeriod, selectedDate]);

    // 드롭다운에 표시할 날짜 - 선택과 무관하게 항상 올바른 형식
    const displayDateDaily = getTodayDate();
    const displayDateMonthly = getCurrentMonth();

    // totalData가 null이면 로딩 중 표시
    if (!totalData) {
        return (
            <section className="w-full">
                <header className="flex items-center justify-between mb-[27px]">
                    <h2 className="[font-family:'Inter',Helvetica] font-semibold text-[#333b69] text-[25px] tracking-[0] leading-[normal]">
                        전체 쓰레기통 통계
                    </h2>
                </header>
                <div className="flex gap-[30px] items-start">
                    <p className="[font-family:'Inter',Helvetica] text-black text-base">
                        통계 데이터를 불러오는 중...
                    </p>
                </div>
            </section>
        );
    }

    const statsCards = [
        {
            label: "투입량",
            value: totalData.totalCups, // 백 서버에서 데이터 가져오기
            bgColor: "bg-[#34c7597a]",
            iconSrc: "https://c.animaapp.com/mi7s9pt1n6xKon/img/cup.png",
            iconAlt: "Cup",
        },
        {
            label: "액체 포함",
            value: totalData.liquidRate,
            bgColor: "bg-[#0062ff70]",
            iconSrc: "https://c.animaapp.com/mi7s9pt1n6xKon/img/liquid.png",
            iconAlt: "Liquid",
        },
        {
            label: "비정상 투입",
            value: totalData.abnormalCount,
            bgColor: "bg-[#FFCDC0]",
            iconSrc: warningImg,
            iconAlt: "unaccepted",
            onClick: () => {
                let startDate, endDate;
                if (selectedPeriod === 'daily') {
                    startDate = getTodayDate();
                    endDate = getTodayDate();
                } else {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth();

                    const firstDay = new Date(year, month, 1);
                    const fYear = firstDay.getFullYear();
                    const fMonth = String(firstDay.getMonth() + 1).padStart(2, '0');
                    const fDay = String(firstDay.getDate()).padStart(2, '0');
                    startDate = `${fYear}-${fMonth}-${fDay}`;

                    const lastDay = new Date(year, month + 1, 0);
                    const lYear = lastDay.getFullYear();
                    const lMonth = String(lastDay.getMonth() + 1).padStart(2, '0');
                    const lDay = String(lastDay.getDate()).padStart(2, '0');
                    endDate = `${lYear}-${lMonth}-${lDay}`;
                }
                navigate(`/events?abnormal=true&startDate=${startDate}&endDate=${endDate}`);
            },
            isClickable: true
        },
        {
            label: "쓰레기통 채움률",
            value: totalData.averageFillRate,
            bgColor: "bg-[#FFF4B0]",
            iconSrc: recycleBinImg,
            iconAlt: "fillRate",
        },
    ];

    return (
        <section className="w-full">
            <header className="flex items-center gap-[20px] mb-[27px]">
                <h2 className="[font-family:'Inter',Helvetica] font-semibold text-[#333b69] text-[25px] tracking-[0] leading-[normal]">
                    전체 쓰레기통 통계
                </h2>

                {/* 기간 선택 드롭다운 */}
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[365px] h-[49px] rounded-[20px] border-0 bg-[url(https://c.animaapp.com/mi7s9pt1n6xKon/img/bounds-3.svg)] bg-[100%_100%]">
                        <SelectValue>
                            <span className="font-title-medium font-[number:var(--title-medium-font-weight)] text-black text-[length:var(--title-medium-font-size)] tracking-[var(--title-medium-letter-spacing)] leading-[var(--title-medium-line-height)]">
                                기간: {selectedPeriod === "daily" ? "오늘" : "한 달"}
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[365px] rounded-[20px] border-[1px] border-[#34C759]/30 bg-white p-4">
                        <SelectItem value="daily" className="h-[50px] text-sm px-4 mb-2 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#34C759] transition-colors">
                            하루 ({displayDateDaily})
                        </SelectItem>
                        <SelectItem value="monthly" className="h-[50px] text-sm px-4 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#34C759] transition-colors">
                            한 달 ({displayDateMonthly})
                        </SelectItem>
                    </SelectContent>
                </Select>
            </header>

            <div className="flex gap-[30px] items-start">
                {statsCards.map((stat, index) => (
                    <CardHorizontal
                        key={index}
                        className={`relative w-[255px] h-[120px] bg-[#fff4af40] rounded-[25px] border-0 shadow-none translate-y-[-1rem] animate-fade-in opacity-0 ${stat.isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                        style={{ "--animation-delay": `${index * 200}ms` }}
                        onClick={stat.onClick}
                        onMouseEnter={() => stat.isClickable && setHoveredCardIndex(index)}
                        onMouseLeave={() => stat.isClickable && setHoveredCardIndex(null)}
                    >
                        <CardHorizontalContent className="p-0 h-full flex items-center justify-center">
                            <div className="flex gap-[15px] items-center px-9">
                                <div
                                    className={`relative w-[70px] h-[70px] ${stat.bgColor} rounded-[35px] flex items-center justify-center`}
                                >
                                    <img
                                        className="w-[50px] h-[50px] object-cover"
                                        alt={stat.iconAlt}
                                        src={stat.iconSrc}
                                    />
                                </div>

                                <div className="flex flex-col gap-[7px]">
                                    <div className="font-normal text-black text-base leading-[normal] whitespace-nowrap [font-family:'Inter',Helvetica] tracking-[0]">
                                        {stat.label}
                                    </div>

                                    <div className="[font-family:'Inter',Helvetica] font-semibold text-[#232323] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
                                        {stat.value}
                                    </div>
                                </div>
                            </div>

                            {/* Hover 오버레이 */}
                            {stat.isClickable && hoveredCardIndex === index && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black/60 rounded-[25px] flex flex-col items-center justify-center px-4 transition-all">
                                    <div className="text-white text-[17px] font-semibold mb-2 [font-family:'Inter',Helvetica]">
                                        비정상 투입 자세히 보기
                                    </div>
                                    {selectedPeriod === "daily" ?
                                        <div className="font-normal text-white text-[13px] leading-[normal] text-center [font-family:'Inter',Helvetica] tracking-[0]">
                                            구체적인 오늘의 전체 비정상 투입 내역을 보려면 클릭해 주세요.
                                        </div>
                                        :
                                        <div className="font-normal text-white text-[13px] leading-[normal] text-center [font-family:'Inter',Helvetica] tracking-[0]">
                                            구체적인 이번 달의 전체 비정상 투입 내역을 보려면 클릭해 주세요.
                                        </div>
                                    }
                                </div>
                            )}
                        </CardHorizontalContent>
                    </CardHorizontal>
                ))}
            </div>
        </section>
    );
};
