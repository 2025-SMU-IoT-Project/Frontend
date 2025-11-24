import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import axios from "axios";

// 헬퍼 함수들
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

export default function TimeSeriesChart({
    binId,
    apiEndpoint,  // 예: "cup" 또는 "liquid"
    contentLabel, // 예: "컵 투입 트렌드" 또는 "액체 변화 트렌드"
    chartTitle    // 예: "시간대별 컵 투입 횟수"
}) {
    // 기간 선택 상태 (daily, monthly) (기본 daily)
    const [selectedPeriod, setSelectedPeriod] = useState("daily");
    // 기본값 (오늘/해당 월 선택 상태)
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    // 차트 데이터
    const [data, setData] = useState([]);

    // 드롭다운에 표시할 날짜
    const displayDateDaily = getTodayDate();
    const displayDateMonthly = getCurrentMonth();

    // 기간이 변경될 때 날짜 자동 설정
    useEffect(() => {
        if (selectedPeriod === "daily") {
            setSelectedDate(getTodayDate());
        } else {
            setSelectedDate(getCurrentMonth());
        }
    }, [selectedPeriod]);

    // 데이터 가져오기
    useEffect(() => {
        if (!binId || !apiEndpoint) return;

        // 컵 투입 트렌드 또는 액체 변화 트렌드
        axios
            .get(`http://localhost:8080/api/bin/${binId}/trend/${apiEndpoint}?period=${selectedPeriod}&date=${selectedDate}`)
            .then(response => {
                console.log(`${apiEndpoint} 차트 데이터:`, response.data);
                // API 응답에서 trends 배열 추출
                const trends = response.data.result?.trends || [];
                setData(trends);
            })
            .catch(error => {
                console.error(`${apiEndpoint} 차트 데이터 가져오기 오류:`, error);
            });
    }, [binId, selectedDate, selectedPeriod, apiEndpoint]);

    if (!binId) return null;

    return (
        <div className="w-full bg-[#FFF9E8] rounded-[25px] p-6 mt-6">
            {/* 필터 영역 */}
            <div className="flex items-center gap-4 mb-6">
                {/* 기간 선택 */}
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[200px] h-[49px] rounded-[20px] border-[1px] border-[#34C759]/30 bg-white">
                        <SelectValue>
                            <span className="text-sm [font-family:'Inter',Helvetica]">
                                기간: {selectedPeriod === "daily" ? "하루" : "한 달"}
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[200px] rounded-[20px] border-[1px] border-[#34C759]/30 bg-white p-4">
                        <SelectItem value="daily" className="h-[50px] text-sm px-4 mb-2 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#34C759] transition-colors">
                            하루 ({displayDateDaily})
                        </SelectItem>
                        <SelectItem value="monthly" className="h-[50px] text-sm px-4 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#34C759] transition-colors">
                            한 달 ({displayDateMonthly})
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* 날짜 선택 */}
                <div className="relative">
                    {selectedPeriod === "daily" ? (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[200px] h-[49px] px-4 rounded-[20px] border-[1px] border-[#34C759]/30 bg-white text-sm [font-family:'Inter',Helvetica] cursor-pointer"
                        />
                    ) : (
                        <input
                            type="month"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[200px] h-[49px] px-4 rounded-[20px] border-[1px] border-[#34C759]/30 bg-white text-sm [font-family:'Inter',Helvetica] cursor-pointer"
                        />
                    )}
                </div>

                {/* 내용 표시 */}
                <div className="flex items-center justify-center h-[49px] px-6 rounded-[20px] border-[1px] border-[#34C759]/30 bg-white">
                    <span className="text-sm [font-family:'Inter',Helvetica]">
                        내용: {contentLabel}
                    </span>
                </div>
            </div>

            {/* 차트 제목 */}
            <h3 className="text-lg font-semibold mb-4 [font-family:'Inter',Helvetica]">
                {chartTitle}
            </h3>

            {/* 그래프 */}
            <div className="w-full h-[300px] bg-white rounded-[15px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="label"
                            stroke="#666"
                            style={{ fontSize: '12px', fontFamily: 'Inter, Helvetica' }}
                        />
                        <YAxis
                            stroke="#666"
                            style={{ fontSize: '12px', fontFamily: 'Inter, Helvetica' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #34C759',
                                borderRadius: '8px',
                                fontFamily: 'Inter, Helvetica'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#34C759"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#34C759' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
