import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus, faCalendarMinus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import eventImage from '../assets/icons8-event-48.png';

const DayComponent = ({ date, handleClick }) => {
    const [event, setEvent] = useState(null);
    const [hovered, setHovered] = useState(false);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayOfMonth = date.getDate();
    const passedDays = (new Date(date) - new Date() <= 0);
    const isEventToday = event && new Date(date).toDateString() === new Date(event.date).toDateString();
    let strDayOfMonth = `${dayOfMonth}th`;
    if (dayOfMonth === 1) {
        strDayOfMonth = `${dayOfMonth}st`;
    } else if (dayOfMonth === 2) {
        strDayOfMonth = `${dayOfMonth}nd`;
    } else if (dayOfMonth === 3) {
        strDayOfMonth = `${dayOfMonth}rd`;
    }
    useEffect(() => {
        getEvent();
    }, [date])

    //${date.getDate()}${date.getMonth()}${date.getFullDate()}

    const getEvent = async () => {
        try {
            const isoDate = date.toISOString(); // ISO string format
            const response = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:3000/event/${encodeURIComponent(isoDate)}`);
            setEvent(response.data);
            console.log("Response", response.data);
        } catch (error) {
            console.error(error);
        }

    };

    // Define click handlers
    const handleClickEventToday = () => handleClick(date, event);
    const handleClickPastDate = () => { };
    const handleClickFutureDate = () => handleClick(date);

    // Determine onClick handler based on conditions
    const determineClickHandler = () => {
        if (isEventToday) return handleClickEventToday;
        if (passedDays) return handleClickPastDate;
        return handleClickFutureDate;
    };

    return (
        <button
            onClick={determineClickHandler()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-36 relative h-24 flex shadow-md rounded-lg hover:bg-blue-100 p-1 justify-between border-4 border-white">
            <div className="flex w-fit h-fit flex-col justify-start">
                <h1 className="font-bold">{`${strDayOfMonth}`}</h1>
                <p className="font-bold">{months[date.getMonth()]}</p>
            </div>
            {isEventToday &&
                <img src={eventImage} alt="Event" className="w-10 h-auto rounded-lg" />
            }
            {(new Date(date) - new Date() <= 0) &&
                <FontAwesomeIcon
                    icon={faCalendarMinus}
                    size="lg"
                    className="text-[#0b4dad]"
                />}
            {!isEventToday && !(new Date(date) - new Date() <= 0) &&
                <FontAwesomeIcon
                    icon={faCalendarPlus}
                    size="lg"
                    className="text-[#0b4dad]"
                />
            }
            {hovered && event && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-50">
                    <h2 className="font-bold text-sm">{event.name}</h2>
                    <p className="text-xs">{event.description}</p>
                </div>
            )}
        </button>
    )
}

export default DayComponent;