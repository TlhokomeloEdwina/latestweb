import { useState } from "react";
import DayComponent from "./DayComponent";

const CalendarGrid = ({handleClick}) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dates = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    // Create a new date object for each day
    for (let i = 0; i < 35; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i); // Adjust the date
        dates.push(date);
    }

    return (  

            <div className="grid w-full grid-cols-7 gap-y-2">
               {daysOfWeek.map((day) => (<h1 className="font-bold">{day}</h1>))} 
            {             
                dates.map((dat) => (
                    <DayComponent key={dat.getTime()} date={dat} handleClick={handleClick} />
                ))}
            </div>

    );
};

export default CalendarGrid;