import React from 'react';

const StatusBadge = ({ status, type = 'default', label }) => {
    // status can be boolean (true=success, false=error) or string
    // type: 'dot' (with dot indicator), 'pill' (solid background)

    let colorClass = 'bg-slate-100 text-slate-500 border-slate-200';
    let dotColor = 'bg-slate-500';

    if (status === true || status === 'success' || status === 'VALID' || status === 'ACCEPTED') {
        colorClass = 'bg-green-50 text-green-700 border-green-100';
        dotColor = 'bg-green-500';
    } else if (status === false || status === 'error' || status === 'INVALID' || status === 'REJECTED') {
        colorClass = 'bg-red-50 text-red-700 border-red-100';
        dotColor = 'bg-red-500';
    } else if (status === 'blue' || status === 'info') {
        colorClass = 'bg-blue-50 text-blue-600 border-blue-100';
        dotColor = 'bg-blue-500';
    }

    if (type === 'dot') {
        return (
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {label}
                </span>
            </div>
        );
    }

    return (
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass} uppercase tracking-wider`}>
            {label}
        </div>
    );
};

export default StatusBadge;
