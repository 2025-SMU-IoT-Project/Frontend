import React from 'react';

const SensorCard = ({ title, data, children }) => {
    if (!data) return null;

    const isNormal = data.isNormal;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
                <div className={`w-2 h-2 rounded-full ${isNormal ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div className="space-y-3">
                {children}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400 font-mono">
                {new Date(data.timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
};

export default SensorCard;
