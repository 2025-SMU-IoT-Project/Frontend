import { useEffect, useState, useRef } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";

const MAX_POINTS = 40; // 한 화면에 보여줄 포인트 수
const INTERVAL_MS = 5000; // 5초마다 센서 값 가져오기

// API 만들 때까지 Mock 데이터 사용 (true: Mock 사용, false: 실제 API 사용)
const USE_MOCK_DATA = true;

// Mock 데이터 생성 함수
const generateMockData = (sensorType, count = MAX_POINTS) => {
    const now = new Date();
    const baseValue = sensorType === "cup" ? 300 : sensorType === "liquid" ? 400 : 500;

    return Array.from({ length: count }, (_, i) => {
        const timestamp = new Date(now.getTime() - (count - i - 1) * INTERVAL_MS);
        const randomVariation = Math.sin(i / 3) * 100 + Math.random() * 80;

        return {
            label: timestamp.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            value: Math.max(0, Math.round(baseValue + randomVariation)),
        };
    });
};

const generateMockRealtimeData = (sensorType) => {
    const baseValue = sensorType === "cup" ? 300 : sensorType === "liquid" ? 400 : 500;
    const randomVariation = Math.random() * 150 - 75;

    return {
        timestamp: new Date().toISOString(),
        value: Math.max(0, Math.round(baseValue + randomVariation)),
    };
};

export const LiveSensorGraph = ({ binId }) => {
    const [data, setData] = useState([]);
    const intervalRef = useRef(null);

    const [selectedSensor, setSelectedSensor] = useState("cup"); // 기본값 cup
    const [apiEndpoint, setApiEndpoint] = useState("cup"); // 기본값 cup
    const [displaySensor, setDisplaySensor] = useState("로드셀 (컵통 내 컵 무게)"); // 기본값 cup

    // 센서 선택이 변경될 때 apiEndpoint와 displaySensor 설정
    useEffect(() => {
        if (selectedSensor === "cup") {
            setApiEndpoint("cup");
            setDisplaySensor("로드셀 (컵통 내 컵 무게)");
        } else if (selectedSensor === "liquid") {
            setApiEndpoint("liquid");
            setDisplaySensor("로드셀 (물통 내 액체 무게)");
        } else {
            setApiEndpoint("ultrasonic");
            setDisplaySensor("초음파 센서 (쓰레기통 부피)");
        }
    }, [selectedSensor]);

    // 초기 데이터 로드
    useEffect(() => {
        // if (!binId || !apiEndpoint) return;
        if (!apiEndpoint) return;

        const fetchInitial = async () => {
            if (USE_MOCK_DATA) {
                // Mock 데이터 사용
                console.log("📊 Mock 데이터 로드 중...");
                const mockHistory = generateMockData(apiEndpoint, MAX_POINTS);
                setData(mockHistory);
            } else {
                // 실제 API 호출
                if (!binId) return;

                try {
                    const response = await axios.get(`/bin/${binId}/sensor/${apiEndpoint}/history/live`, {
                        params: { limit: MAX_POINTS },
                    });
                    // 최신이 뒤에 오도록 정렬 가정
                    const history = response.data.map((d) => ({
                        label: new Date(d.timestamp).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                        value: d.value,
                    }));
                    setData(history);
                } catch (e) {
                    console.error("initial sensor history error", e);
                }
            }
        };

        fetchInitial();
    }, [binId, apiEndpoint]);

    // 실시간 폴링 (슬라이딩 윈도우)
    useEffect(() => {
        // if (!binId || !apiEndpoint) return;
        if (!apiEndpoint) return;

        const startPolling = () => {
            intervalRef.current = setInterval(async () => {
                if (USE_MOCK_DATA) {
                    // Mock 실시간 데이터 생성
                    const mockData = generateMockRealtimeData(apiEndpoint);
                    const { timestamp, value } = mockData;

                    const label = new Date(timestamp).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });

                    console.log("📈 Mock 실시간 데이터:", { label, value });

                    setData((prev) => {
                        const next = [...prev, { label, value }];
                        // 슬라이딩 윈도우: MAX_POINTS를 초과하면 왼쪽 데이터 제거
                        if (next.length > MAX_POINTS) {
                            return next.slice(next.length - MAX_POINTS);
                        }
                        return next;
                    });
                } else {
                    // 실제 API 호출
                    if (!binId) return;

                    try {
                        const response = await axios.get(`/bin/${binId}/sensor/${apiEndpoint}/history/live`);
                        const { timestamp, value } = response.data;

                        const label = new Date(timestamp).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        });

                        setData((prev) => {
                            const next = [...prev, { label, value }];
                            // 슬라이딩 윈도우: MAX_POINTS를 초과하면 왼쪽 데이터 제거
                            if (next.length > MAX_POINTS) {
                                return next.slice(next.length - MAX_POINTS);
                            }
                            return next;
                        });
                    } catch (e) {
                        console.error("sensor latest error", e);
                    }
                }
            }, INTERVAL_MS);
        };

        startPolling();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [binId, apiEndpoint]);

    return (
        <div className="bg-[#FFF9E8] rounded-[25px] p-6 mt-6 shadow-sm border border-gray-100">
            {/* 제목과 센서 선택을 같은 줄에 배치 */}
            <header className="flex items-center gap-[20px] mb-[27px]">
                <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                    <SelectTrigger className="w-[280px] h-[45px] rounded-[25px] border-[1.5px] border-[#34C759]/30 bg-white hover:border-[#34C759]/50 transition-colors">
                        <SelectValue>
                            <span className="text-sm font-medium text-[#2C3E50]">
                                센서: {displaySensor}
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[280px] rounded-[20px] border-[1.5px] border-[#34C759]/30 bg-white p-2">
                        <SelectItem
                            value="cup"
                            className="h-[48px] text-sm px-4 mb-1 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#E8F5E9] transition-colors cursor-pointer"
                        >
                            센서: 로드셀 (컵통 내 컵 무게)
                        </SelectItem>
                        <SelectItem
                            value="liquid"
                            className="h-[48px] text-sm px-4 mb-1 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#E8F5E9] transition-colors cursor-pointer"
                        >
                            센서: 로드셀 (물통 내 액체 무게)
                        </SelectItem>
                        <SelectItem
                            value="ultrasonic"
                            className="h-[48px] text-sm px-4 rounded-[15px] data-[state=checked]:bg-[#C8E6C9] hover:bg-[#E8F5E9] transition-colors cursor-pointer"
                        >
                            센서: 초음파 센서 (쓰레기통 부피)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </header>

            {/* 그래프 영역 */}
            <div className="w-full h-80 bg-white rounded-[15px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="sensorColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.4} />
                                <stop offset="50%" stopColor="#4CAF50" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E0E0E0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12, fill: '#757575' }}
                            axisLine={{ stroke: '#E0E0E0' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#757575' }}
                            axisLine={{ stroke: '#E0E0E0' }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #4CAF50',
                                borderRadius: '8px',
                                fontSize: '13px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4CAF50"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#sensorColor)"
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
