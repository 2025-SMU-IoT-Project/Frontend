import TimeSeriesChart from "../../../../components/TimeSeriesChart.jsx";

export function CupCountGraph({ binId }) {
    return (
        <TimeSeriesChart
            binId={binId}
            apiEndpoint="cup"
            contentLabel="컵 투입 트렌드"
            chartTitle="시간대별 컵 투입 횟수"
        />
    );
}
