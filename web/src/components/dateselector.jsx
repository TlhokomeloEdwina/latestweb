import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SelectDate = ({ dateRange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (startDate && endDate) {
            dateRange(startDate, endDate);
        }
    }, [startDate, endDate, dateRange]);

    return (
        <div className="p-4 max-w-md mx-auto bg-white">
            <div className="flex justify-between mb-4">
                <div className="w-1/2 pr-2">
                    <label className="block mb-2 text-lg font-medium text-gray-700 font-serif">Start Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="w-1/2 pl-2">
                    <label className="block mb-2 text-lg font-medium text-gray-700 font-serif">End Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectDate;
