import TimeSeriesChart from "../../../../components/TimeSeriesChart.jsx";

export function LiquidChangingGraph({ binId }) {
    return (
        <TimeSeriesChart
            binId={binId}
            apiEndpoint="liquid"
            contentLabel="물통 내 액체 변화량 트렌드"
            chartTitle="시간대별 물통 내 액체 변화량"
        />
    );
}
