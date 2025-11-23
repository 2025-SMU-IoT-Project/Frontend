import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllEvents, getEventsByBin } from '../../api/eventApi';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasNext, setHasNext] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const onlyAbnormal = searchParams.get('abnormal') === 'true';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const binIdParam = searchParams.get('binId');
    const selectedBinId = binIdParam ? Number(binIdParam) : null;


    const navigate = useNavigate();

    const fetchEvents = useCallback(async (isLoadMore = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const cursorToUse = isLoadMore ? nextCursor : null;
            let data;

            if (selectedBinId) {
                data = await getEventsByBin(selectedBinId, cursorToUse, 20, onlyAbnormal, startDate, endDate);
            } else {
                data = await getAllEvents(cursorToUse, 20, onlyAbnormal, startDate, endDate);
            }

            if (data.isSuccess) {
                const newEvents = data.result.content || data.result.values || [];
                setEvents(prev => isLoadMore ? [...prev, ...newEvents] : newEvents);
                setNextCursor(data.result.nextCursor);
                setHasNext(data.result.hasNext);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    }, [selectedBinId, nextCursor, loading, onlyAbnormal, startDate, endDate]);

    useEffect(() => {
        setEvents([]);
        setNextCursor(null);
        setHasNext(true);
        fetchEvents(false);
    }, [selectedBinId, onlyAbnormal, startDate, endDate]);

    const handleLoadMore = () => {
        if (hasNext && !loading) {
            fetchEvents(true);
        }
    };

    const toggleAbnormal = (checked) => {
        setSearchParams(params => {
            if (checked) {
                params.set('abnormal', 'true');
            } else {
                params.delete('abnormal');
            }
            return params;
        });
    };

    const clearDateFilter = () => {
        setSearchParams(params => {
            params.delete('startDate');
            params.delete('endDate');
            return params;
        });
    };

    const filteredEvents = events.filter(event => {
        if (!startDate && !endDate) return true;

        const eventDate = new Date(event.timestamp);

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (eventDate < start) return false;
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (eventDate > end) return false;
        }

        return true;
    });

    const shouldShowLoadMore = () => {
        if (!hasNext) return false;
        if (!startDate) return true;
        if (events.length === 0) return true;

        const lastEventDate = new Date(events[events.length - 1].timestamp);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        return lastEventDate >= start;
    };

    const handleBinChange = (e) => {
        const value = e.target.value;
        setSearchParams(params => {
            if (value) {
                params.set('binId', value);
            } else {
                params.delete('binId');
            }
            return params;
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-['Inter']">
            <Header />
            <main className="flex-1 p-8 w-full">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">컵 투입 목록</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-slate-500">
                                    {onlyAbnormal ? '비정상 투입 컵을 모니터링합니다.' : '쓰레기통에 투입된 컵을 모니터링합니다.'}
                                </p>
                                {startDate && endDate && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                        {startDate} ~ {endDate}
                                        <button onClick={clearDateFilter} className="hover:text-blue-900">×</button>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={onlyAbnormal}
                                    onChange={(e) => toggleAbnormal(e.target.checked)}
                                />
                                <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                <span className="ms-3 text-sm font-medium text-slate-700">Only Abnormal</span>
                            </label>

                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 font-medium">쓰레기통:</label>
                                <select
                                    value={selectedBinId || ''}
                                    onChange={handleBinChange}
                                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                >
                                    <option value="">전체</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.uuid}
                                onClick={() => navigate(`/events/${event.uuid}`)}
                                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${event.isValidInput ? 'from-green-50 to-transparent' : 'from-red-50 to-transparent'
                                    } rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100`} />

                                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1 w-full md:w-auto">
                                        <div className="flex items-center gap-3 mb-2">
                                            <StatusBadge
                                                status={event.isValidInput}
                                                type="dot"
                                                label={event.isValidInput ? '정상' : '비정상'}
                                            />
                                            <span className="text-slate-300">|</span>
                                            <span className="text-sm text-slate-400 font-mono">
                                                Bin {event.binId}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            {new Date(event.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="hidden md:block w-px h-16 bg-slate-100 border-r border-dashed border-slate-200 mx-4" />
                                    <div className="block md:hidden w-full h-px bg-slate-100 border-b border-dashed border-slate-200 my-2" />

                                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2 w-full md:w-auto">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">분류</p>
                                            <p className="font-semibold text-slate-700 text-lg">
                                                {event.cupType || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">액체</p>
                                            <p className={`font-semibold text-lg ${event.hasLiquid ? 'text-red-500' : 'text-slate-700'}`}>
                                                {event.hasLiquid ? '감지됨' : '없음'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex justify-end">
                                        <StatusBadge
                                            status={event.cupAccepted ? 'blue' : 'default'}
                                            label={event.cupAccepted ? 'ACCEPTED' : 'REJECTED'}
                                        />
                                    </div>
                                </div>

                                {event.description && !event.isValidInput && (
                                    <div className="mt-4 pt-3 border-t border-slate-50">
                                        <p className="text-sm text-red-400 flex items-center gap-2">
                                            <span className="text-lg">⚠️</span> {event.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        {loading && (
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-4"></div>
                        )}
                        {!loading && shouldShowLoadMore() && (
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                            >
                                더보기
                            </button>
                        )}
                        {!loading && events.length === 0 && (
                            <p className="text-slate-500">투입 이력이 없습니다.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventList;
