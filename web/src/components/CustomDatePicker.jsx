import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ startDate, handleChange }) => {
  return (
    <DatePicker
      className="w-11/12 font-serif text-slate-500 font-bold px-3 py-2  rounded-md border-slate-300 focus:outline-none  focus:ring-4 focus:ring-blue-300"
      selected={startDate}
      onChange={handleChange}
    />
  );
};

export default CustomDatePicker;
