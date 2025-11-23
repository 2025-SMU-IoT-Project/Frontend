import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventDetail } from '../../api/eventApi';
import Header from '../../components/Header';
import SensorCard from '../../components/SensorCard';
import StatusBadge from '../../components/StatusBadge';

const DetailRow = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`font-semibold ${highlight ? 'text-slate-900' : 'text-slate-600'}`}>{value}</span>
    </div>
);

const EventDetail = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getEventDetail(uuid);
                if (data.isSuccess) {
                    setEvent(data.result);
                }
            } catch (error) {
                console.error("Failed to fetch event detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [uuid]);

    if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50">Loading...</div>;
    if (!event) return <div className="flex justify-center items-center h-screen bg-slate-50">Event not found</div>;

    const { summary, sensors } = event;

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-['Inter']">
            <Header />
            <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-slate-400 hover:text-slate-900 flex items-center gap-2 font-medium transition-colors"
                >
                    ← Back to List
                </button>

                {/* Big Ticket Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 relative">
                    <div className={`absolute top-0 left-0 w-2 h-full ${summary.cupAccepted ? 'bg-blue-500' : 'bg-slate-300'}`} />

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        Event Detail
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">{event.uuid.split('-')[0]}...</span>
                                </div>
                                <h1 className="text-4xl font-bold text-slate-900">
                                    {summary.cupAccepted ? 'Accepted' : 'Rejected'}
                                </h1>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <p className="text-2xl font-bold text-slate-900">
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-slate-400">
                                    {new Date(event.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-8 border-t border-slate-100 pt-8">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">처리 시간</p>
                                <p className="text-xl font-bold text-slate-900">{summary.processingTimeMs}ms</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">정상 투입 여부</p>
                                <p className={`text-xl font-bold ${summary.isValidInput ? 'text-green-600' : 'text-red-600'}`}>
                                    {summary.isValidInput ? '정상' : '비정상'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">액체 여부</p>
                                <p className={`text-xl font-bold ${summary.hasLiquid ? 'text-red-600' : 'text-green-600'}`}>
                                    {summary.hasLiquid ? '감지됨' : '없음'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensors Grid */}
                <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Sensor Telemetry</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* IR Sensor */}
                    <SensorCard title="IR Sensor" data={sensors.irSensor}>
                        <DetailRow label="Detection" value={sensors.irSensor?.detected ? 'Yes' : 'No'} highlight />
                        <DetailRow label="Beam Status" value={sensors.irSensor?.beamBlocked ? 'Blocked' : 'Clear'} />
                    </SensorCard>

                    {/* Laser Sensor */}
                    <SensorCard title="Laser Sensor" data={sensors.laserSensor}>
                        <DetailRow label="Pattern" value={sensors.laserSensor?.cupPattern} highlight />
                        <DetailRow label="Max Distance" value={`${sensors.laserSensor?.maxDistance?.toFixed(1)} mm`} />
                        <DetailRow label="Min Distance" value={`${sensors.laserSensor?.minDistance?.toFixed(1)} mm`} />
                        <DetailRow label="Avg Distance" value={`${sensors.laserSensor?.avgDistance?.toFixed(1)} mm`} />
                        <DetailRow label="Valid Shape" value={sensors.laserSensor?.isValidCup ? 'Yes' : 'No'} />
                    </SensorCard>

                    {/* LoadCell (Cup) */}
                    <SensorCard title="LoadCell (CUP)" data={sensors.loadCell}>
                        <DetailRow label="Weight" value={`${sensors.loadCell?.weight?.toFixed(1)} g`} highlight />
                        <DetailRow label="Liquid Suspected" value={sensors.loadCell?.isLiquid ? 'Yes' : 'No'} />
                        <DetailRow label="Liquid Level" value={sensors.loadCell?.cupType} />
                    </SensorCard>

                    {/* LoadCell (Liquid) */}
                    <SensorCard title="LoadCell (Liquid)" data={sensors.liquid}>
                        <DetailRow label="Added Weight" value={`${sensors.liquid?.addedWeight?.toFixed(1)} g`} highlight />
                    </SensorCard>

                    {/* Ultrasonic */}
                    <SensorCard title="Ultrasonic" data={sensors.ultrasonic}>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Fill Level</span>
                                <span className="font-bold text-slate-900">{sensors.ultrasonic?.fillRate?.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(sensors.ultrasonic?.fillRate || 0, 100)}%` }}
                                />
                            </div>
                        </div>
                        <DetailRow label="Distance" value={`${sensors.ultrasonic?.distanceCm?.toFixed(1)} cm`} />
                    </SensorCard>

                </div>
            </main>
        </div>
    );
};

export default EventDetail;
