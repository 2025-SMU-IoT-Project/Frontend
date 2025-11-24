import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FF", "#34C759"]; // 액체 포함 / 빈 컵

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
                <p className="text-sm font-medium">{data.name}</p>
                <p className="text-sm text-gray-600">{data.payload.percentage}%</p>
            </div>
        );
    }
    return null;
};

// 커스텀 레전드
const renderLegend = (props) => {
    const { payload } = props;
    return (
        <div className="flex justify-center gap-6 mt-4">
            {payload.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm [font-family:'Inter',Helvetica]">
                        {entry.value} {entry.payload.percentage}%
                    </span>
                </div>
            ))}
        </div>
    );
};

export const DonutChart = ({ binId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!binId) return;

        axios
            .get(`http://localhost:8080/api/sensor/cup/stats?binId=${binId}`)
            .then((response) => {
                console.log("API 응답:", response.data);

                // result 객체 안에 실제 데이터가 있음
                const { emptyCups, totalCups } = response.data.result;
                const withLiquid = totalCups - emptyCups;

                // totalCups가 0이면 차트를 그릴 수 없음
                if (!totalCups || totalCups === 0) {
                    console.warn("totalCups가 0입니다");
                    setData([]);
                    return;
                }

                const chartData = [
                    {
                        name: "액체 포함 컵",
                        value: withLiquid,
                        percentage: Math.round((withLiquid / totalCups) * 100)
                    },
                    {
                        name: "빈 컵",
                        value: emptyCups,
                        percentage: Math.round((emptyCups / totalCups) * 100)
                    },
                ];

                console.log("차트 데이터:", chartData);
                setData(chartData);
            })
            .catch((err) => {
                console.error("cup ratio error", err);
            });
    }, [binId]);

    console.log("현재 data 상태:", data);
    console.log("현재 binId:", binId);

    if (!binId) return null;
    if (!data) return <div className="text-sm text-gray-400 text-center mt-4">로딩 중...</div>;
    if (data.length === 0) return <div className="text-sm text-gray-400 text-center mt-4">데이터가 없습니다</div>;

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                >
                    {data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
            </PieChart>
        </ResponsiveContainer>
    );
}
